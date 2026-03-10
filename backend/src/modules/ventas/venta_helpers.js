const PDFDocument = require('pdfkit');
const path = require('path');
const axios = require('axios');
const cloudinaryPdf = require('../../config/cloudinary_pdf_config');

const { obtenerTipoComprobantePorIdModel } = require('../configuracion/tipos_comprobante/tipos_comprobante_model');
const { obtenerTipoDocumentoPorIdModel } = require('../configuracion/tipos_documento/tipos_documento_model');
const { obtenerProductoIdModel, obtenerInsumosPorProductoModel } = require('../inventario/productos/producto_model');
const { obtenerStockActualModel } = require('../inventario/insumos/insumos_model');
const crearError = require('../../utilidades/crear_error');
const obtenerFechaActual = require('../../utilidades/obtener_fecha_actual');
const { company, IGV, TIPO_COMPROBANTE_CODIGO, TIPO_DOCUMENTO_CODIGO } = require('../../utilidades/helpers/constantes_venta');
const numeroALetras = require('../../utilidades/numero_letras');

// ─── Configuración impresora térmica 80mm ─────────────────────────────────────
const ANCHO_PAGINA = 226.77;
const MARGEN = 8;
const ANCHO_UTIL = ANCHO_PAGINA - MARGEN * 2;

// ─── Subir archivo a Cloudinary retornando { url, publicId } ─────────────────
const subirArchivoCloudinary = (buffer, nombreArchivo, formato) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinaryPdf.uploader.upload_stream(
            {
                resource_type: 'raw',
                folder: 'comprobantes',
                public_id: nombreArchivo,
                format: formato,
            },
            (error, result) => {
                if (error) reject(error);
                else resolve({ url: result.secure_url, publicId: result.public_id });
            }
        );
        stream.end(buffer);
    });
};

// ─── Eliminar archivo de Cloudinary por publicId ──────────────────────────────
const eliminarArchivoCloudinary = async (publicId) => {
    if (!publicId) return;
    try {
        await cloudinaryPdf.uploader.destroy(publicId, { resource_type: 'raw' });
    } catch (err) {
        console.error(`❌ Error eliminando archivo Cloudinary (${publicId}):`, err.message);
    }
};

// ─── Validar documento por tipo ───────────────────────────────────────────────
const validarDocumentoPorTipo = (nombreDoc, nroDoc) => {
    if (nombreDoc === 'ruc') {
        if (!/^\d{11}$/.test(nroDoc))
            throw crearError('El RUC debe tener exactamente 11 dígitos numéricos', 400);
    } else if (nombreDoc === 'dni') {
        if (!/^\d{8}$/.test(nroDoc))
            throw crearError('El DNI debe tener exactamente 8 dígitos numéricos', 400);
    } else if (nombreDoc === 'pasaporte') {
        if (!nroDoc || nroDoc.length < 6 || nroDoc.length > 12)
            throw crearError('El pasaporte debe tener entre 6 y 12 caracteres', 400);
    } else if (nombreDoc === 'carnet de extranjeria' || nombreDoc === 'carnet de extranjería') {
        if (!/^\d{9}$/.test(nroDoc))
            throw crearError('El carnet de extranjería debe tener exactamente 9 dígitos', 400);
    }
};

// ─── Calcular producto ────────────────────────────────────────────────────────
const calcularProducto = (productoExiste, cantidad) => {
    const precioConIgv = parseFloat(productoExiste.precio_producto);
    const precioSinIgv = parseFloat((precioConIgv / (1 + IGV)).toFixed(2));
    const igvUnitario = parseFloat((precioConIgv - precioSinIgv).toFixed(2));
    const totalLinea = parseFloat((precioSinIgv * cantidad).toFixed(2));
    const igvLinea = parseFloat((igvUnitario * cantidad).toFixed(2));

    return {
        idProducto: productoExiste.id_producto,
        codProducto: `P${String(productoExiste.id_producto).padStart(3, '0')}`,
        unidad: 'NIU',
        descripcion: productoExiste.nombre_producto,
        cantidad,
        mtoValorUnitario: precioSinIgv,
        mtoPrecioUnitario: precioConIgv,
        igv: igvLinea,
        mtoValorVenta: totalLinea,
        totalImpuestos: igvLinea,
    };
};

// ─── Generar datos del comprobante ────────────────────────────────────────────
const generarDatosComprobante = async (tipoComprobante, cliente, productos) => {
    const tipoComprobanteExiste = await obtenerTipoComprobantePorIdModel(tipoComprobante);
    if (!tipoComprobanteExiste) throw crearError('Tipo de comprobante no valido', 400);

    const tipoDocumentoExiste = await obtenerTipoDocumentoPorIdModel(cliente.idTipoDoc);
    if (!tipoDocumentoExiste) throw crearError('Tipo de documento no valido', 400);

    const nombreComprobante = tipoComprobanteExiste.nombre_tipo_comprobante.toLowerCase();
    const nombreDoc = tipoDocumentoExiste.nombre_tipo_documento.toLowerCase();
    const nroDoc = cliente.numDoc.toString().trim();

    if (nombreComprobante === 'factura') {
        if (nombreDoc !== 'ruc')
            throw crearError('Para factura el tipo de documento debe ser RUC', 400);
        if (!cliente.direccionCliente || cliente.direccionCliente.trim() === '')
            throw crearError('Para factura se requiere la dirección del cliente', 400);
    }

    validarDocumentoPorTipo(nombreDoc, nroDoc);

    const productosConData = await Promise.all(
        productos.map(async ({ idProducto, cantidad }) => {
            const productoExiste = await obtenerProductoIdModel(idProducto);
            if (!productoExiste) throw crearError(`Producto con id ${idProducto} no encontrado`, 400);
            return { productoExiste, cantidad };
        })
    );

    const productosDetalle = productosConData.map(({ productoExiste, cantidad }) =>
        calcularProducto(productoExiste, cantidad)
    );

    const mtoOperGravadas = parseFloat(productosDetalle.reduce((acc, p) => acc + p.mtoValorVenta, 0).toFixed(2));
    const totalIgv = parseFloat(productosDetalle.reduce((acc, p) => acc + p.igv, 0).toFixed(2));
    const mtoImpVenta = parseFloat((mtoOperGravadas + totalIgv).toFixed(2));
    const fecha = obtenerFechaActual();

    return {
        ublVersion: '2.1',
        fecVencimiento: fecha,
        tipoOperacion: '0101',
        tipoDoc: TIPO_COMPROBANTE_CODIGO[nombreComprobante],
        serie: tipoComprobanteExiste.serie,
        correlativo: tipoComprobanteExiste.correlativo + 1,
        fechaEmision: fecha,
        formaPago: { moneda: 'PEN', tipo: 'Contado' },
        tipoMoneda: 'PEN',
        client: {
            tipoDoc: TIPO_DOCUMENTO_CODIGO[nombreDoc],
            numDoc: cliente.numDoc,
            rznSocial: cliente.denominacionCliente,
            address: { direccion: cliente.direccionCliente?.trim() || 'Direccion cliente' },
        },
        company,
        mtoOperGravadas,
        totalIgv,
        mtoImpVenta,
        details: productosDetalle,
        legends: [{ value: numeroALetras(mtoImpVenta) }],
        // expuestos para el service
        nombreComprobante,
        nombreDoc,
        productosConData,
    };
};

// ─── Reconstruir payload ApisPeru desde datos de BD (usado por el job) ────────
const reconstruirPayloadApisPeru = (comprobante, detalles) => {
    const { TIPO_COMPROBANTE_CODIGO, TIPO_DOCUMENTO_CODIGO } = require('../../utilidades/helpers/constantes_venta');

    const formatearFecha = (fecha) => {
        const d = new Date(fecha);
        const yyyy = d.getUTCFullYear();
        const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
        const dd = String(d.getUTCDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}T00:00:00-05:00`;
    };

    const details = detalles.map((d, i) => ({
        id: String(i + 1),
        codProducto: `P${String(d.id_producto).padStart(3, '0')}`,
        unidad: 'NIU',
        descripcion: d.nombre_producto,
        cantidad: d.cantidad_producto,
        mtoValorUnitario: parseFloat(d.valor_unitario),
        mtoPrecioUnitario: parseFloat(d.precio_unitario),
        igv: parseFloat(d.igv),
        mtoValorVenta: parseFloat(d.subtotal),
        totalImpuestos: parseFloat(d.igv),
    }));

    return {
        ublVersion: '2.1',
        tipoOperacion: String(comprobante.sunat_transaccion).padStart(4, '0'),
        tipoDoc: TIPO_COMPROBANTE_CODIGO[comprobante.nombre_tipo_comprobante?.toLowerCase()],
        serie: comprobante.serie,
        correlativo: String(comprobante.numero_correlativo),  // ← string
        fechaEmision: formatearFecha(comprobante.fecha_emision),
        fecVencimiento: formatearFecha(comprobante.fecha_vencimiento),
        formaPago: { moneda: 'PEN', tipo: 'Contado' },
        tipoMoneda: 'PEN',
        client: {
            tipoDoc: TIPO_DOCUMENTO_CODIGO[comprobante.nombre_tipo_documento?.toLowerCase()],
            numDoc: comprobante.numero_documento_cliente,
            rznSocial: comprobante.numero_documento_cliente,
            address: { direccion: 'Direccion cliente' },
        },
        company,
        mtoOperGravadas: parseFloat(comprobante.total_gravada),
        totalIgv: parseFloat(comprobante.total_igv),
        mtoImpVenta: parseFloat(comprobante.total_venta),
        details,
        legends: [{
            code: "1000",
            value: numeroALetras(parseFloat(comprobante.total_venta))
        }],
    };
};

// ─── Llamar a ApisPeru /invoice/send ─────────────────────────────────────────
const enviarComprobanteApisPeru = async (payload) => {
    const token = process.env.TOKEN_APIS_PERU;
    try {
        const respuesta = await axios.post(
            `${process.env.APISPERU_URL}/invoice/send`,
            payload,
            { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        return respuesta.data; // { xml, hash, sunatResponse }
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            console.error('❌ Error ApisPeru /invoice/send:', { status, data });
            throw crearError(`ApisPeru respondió con estado ${status}. ${data?.message || 'Error desconocido'}`, 502);
        }
        if (error.request) {
            console.error('❌ Sin respuesta de ApisPeru (send)');
            throw crearError('No hubo respuesta del servidor ApisPeru al enviar el comprobante', 504);
        }
        throw crearError('Error interno al enviar el comprobante', 500);
    }
};

// ─── Llamar a ApisPeru /invoice/pdf ──────────────────────────────────────────
const obtenerPdfApisPeru = async (payload) => {
    const token = process.env.TOKEN_APIS_PERU;
    try {
        const respuesta = await axios.post(
            `${process.env.APISPERU_URL}/invoice/pdf`,
            payload,
            {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
                responseType: 'arraybuffer',
            }
        );
        return Buffer.from(respuesta.data);
    } catch (error) {
        if (error.response) {
            const { status, data } = error.response;
            console.error('❌ Error ApisPeru /invoice/pdf:', { status, data: data?.toString?.() || data });
            throw crearError(`ApisPeru PDF respondió con estado ${status}. ${data?.message || 'Error en generación de PDF'}`, 502);
        }
        if (error.request) {
            console.error('❌ Sin respuesta de ApisPeru (pdf)');
            throw crearError('No hubo respuesta del servidor ApisPeru al generar el PDF', 504);
        }
        throw crearError('Error interno al generar el PDF', 500);
    }
};

// ─── Generar PDF térmico 80mm ─────────────────────────────────────────────────
const generarPdfTermico = (datosComprobante, cliente, nombreTipoDoc, tituloComprobante) => {
    return new Promise((resolve, reject) => {
        try {
            const {
                serie, correlativo, fechaEmision, fecVencimiento,
                mtoOperGravadas, totalIgv, mtoImpVenta, details,
            } = datosComprobante;

            const ALTO_BASE = 420;
            const ALTO_POR_PRODUCTO = 16;
            const altoEstimado = ALTO_BASE + (details.length * ALTO_POR_PRODUCTO);

            const doc = new PDFDocument({
                size: [ANCHO_PAGINA, altoEstimado],
                margins: { top: MARGEN, bottom: MARGEN, left: MARGEN, right: MARGEN },
                autoFirstPage: true,
                bufferPages: false,
            });

            const chunks = [];
            doc.on('data', chunk => chunks.push(chunk));
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);

            const x = MARGEN;
            const xDer = ANCHO_PAGINA - MARGEN;
            const centrar = (texto, y, opts = {}) =>
                doc.text(texto, x, y, { width: ANCHO_UTIL, align: 'center', ...opts });
            const linea = (y) =>
                doc.moveTo(x, y).lineTo(xDer, y).lineWidth(0.5).stroke();

            const formatearFecha = (iso) => {
                const d = new Date(iso);
                return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
            };
            const formatearFechaHora = (iso) => {
                const d = new Date(iso);
                return `${formatearFecha(iso)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
            };

            let y = MARGEN;

            // Logo
            const logoPath = path.join(__dirname, '../../../public/super_pollo_logo.png');
            doc.image(logoPath, (ANCHO_PAGINA - 60) / 2, y, { width: 60, height: 60 });
            y += 64;

            // Cabecera empresa
            doc.fontSize(9).font('Helvetica-Bold');
            centrar(company.nombreComercial, y); y += 12;
            doc.fontSize(7).font('Helvetica');
            centrar(`RUC: ${company.ruc.toString()}`, y); y += 10;
            centrar(company.address?.direccion || '', y); y += 10;
            if (company.address?.provincia) {
                centrar(`${company.address.provincia} - ${company.address.departamento || ''}`, y); y += 10;
            }
            if (company.telephone) {
                centrar(`Tel: ${company.telephone}`, y); y += 10;
            }
            y += 3; linea(y); y += 5;

            // Título comprobante
            doc.fontSize(8).font('Helvetica-Bold');
            centrar(tituloComprobante.toUpperCase(), y); y += 11;
            centrar(`${serie}-${String(correlativo).padStart(8, '0')}`, y); y += 11;
            linea(y); y += 5;

            // Datos cliente
            doc.fontSize(7);
            const filaCliente = (label, valor) => {
                const labelWidth = 90;
                const valorWidth = ANCHO_UTIL - labelWidth;

                const alturaLabel = doc.heightOfString(label, { width: labelWidth });
                const alturaValor = doc.heightOfString(valor, { width: valorWidth });
                const altura = Math.max(alturaLabel, alturaValor);

                doc.font('Helvetica-Bold').text(label, x, y, { width: labelWidth, lineBreak: false });
                doc.font('Helvetica').text(valor, x + labelWidth, y, { width: valorWidth });
                y += altura + 2;
            };

            filaCliente('Fecha emisión :', formatearFechaHora(fechaEmision));
            filaCliente('Fecha venc.   :', formatearFecha(fecVencimiento));
            filaCliente(`${nombreTipoDoc.toUpperCase().padEnd(14, ' ')}:`, cliente.numDoc);
            filaCliente('Cliente       :', cliente.denominacionCliente);
            if (cliente.direccionCliente) filaCliente('Dirección     :', cliente.direccionCliente);
            y += 2; linea(y); y += 5;

            // Encabezado tabla
            const COL = {
                desc: { x: x, w: 80 },
                cant: { x: x + 80, w: 22 },
                pu: { x: x + 102, w: 36 },
                total: { x: x + 138, w: 64 },
            };
            doc.fontSize(6.5).font('Helvetica-Bold');
            doc.text('Descripción', COL.desc.x, y, { width: COL.desc.w });
            doc.text('Cant.', COL.cant.x, y, { width: COL.cant.w, align: 'center' });
            doc.text('P.Unit', COL.pu.x, y, { width: COL.pu.w, align: 'right' });
            doc.text('Total', COL.total.x, y, { width: COL.total.w, align: 'right' });
            y += 10; linea(y); y += 4;

            // Filas productos
            doc.fontSize(6.5).font('Helvetica');
            for (const d of details) {
                const alturaFila = Math.max(doc.heightOfString(d.descripcion, { width: COL.desc.w }), 9);
                doc.text(d.descripcion, COL.desc.x, y, { width: COL.desc.w });
                doc.text(String(d.cantidad), COL.cant.x, y, { width: COL.cant.w, align: 'center' });
                doc.text(`S/ ${d.mtoPrecioUnitario.toFixed(2)}`, COL.pu.x, y, { width: COL.pu.w, align: 'right' });
                doc.text(`S/ ${(d.mtoValorVenta + d.igv).toFixed(2)}`, COL.total.x, y, { width: COL.total.w, align: 'right' });
                y += alturaFila + 3;
            }
            y += 2; linea(y); y += 5;

            // Totales
            const filaTotales = (label, valor, negrita = false) => {
                doc.fontSize(7).font(negrita ? 'Helvetica-Bold' : 'Helvetica')
                    .text(label, x, y, { width: ANCHO_UTIL - 60 })
                    .font(negrita ? 'Helvetica-Bold' : 'Helvetica')
                    .text(`S/ ${valor}`, x, y, { width: ANCHO_UTIL, align: 'right' });
                y += 10;
            };
            filaTotales('Op. Gravadas:', mtoOperGravadas.toFixed(2));
            filaTotales(`IGV (${(IGV * 100).toFixed(0)}%):`, totalIgv.toFixed(2));
            filaTotales('TOTAL:', mtoImpVenta.toFixed(2), true);
            y += 3; linea(y); y += 6;

            // Importe en letras
            const enLetras = `SON: ${numeroALetras(mtoImpVenta)}`;
            doc.fontSize(6.5).font('Helvetica-BoldOblique');
            centrar(enLetras, y, { lineBreak: true });
            y += doc.heightOfString(enLetras, { width: ANCHO_UTIL }) + 4;
            linea(y); y += 8;

            // Pie
            doc.fontSize(6).font('Helvetica');
            if (tituloComprobante.toLowerCase() === 'nota de venta') {
                centrar('Documento no válido para crédito fiscal', y); y += 9;
            }
            centrar('¡Gracias por su preferencia!', y);

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};

// Alias para compatibilidad
const generarPdfNotaVenta = (datosComprobante, cliente, nombreTipoDoc) =>
    generarPdfTermico(datosComprobante, cliente, nombreTipoDoc, 'Nota de Venta');

// ─── Solo validar stock ───────────────────────────────────────────────────────
const validarStockInsumos = async (productosConData) => {
    const insumosNecesarios = new Map();

    for (const { productoExiste, cantidad } of productosConData) {
        if (!productoExiste.usa_insumos) continue;
        const insumos = await obtenerInsumosPorProductoModel(productoExiste.id_producto);
        for (const insumo of insumos) {
            const cantidadExacta = insumo.cantidad_uso * cantidad;
            const cantidadValidacion = Math.ceil(cantidadExacta);
            const idInsumo = insumo.id_insumo;
            if (insumosNecesarios.has(idInsumo)) {
                insumosNecesarios.get(idInsumo).cantidadExacta += cantidadExacta;
                insumosNecesarios.get(idInsumo).cantidadValidacion += cantidadValidacion;
            } else {
                insumosNecesarios.set(idInsumo, {
                    nombreInsumo: insumo.nombre_insumo,
                    cantidadExacta,
                    cantidadValidacion
                });
            }
        }
    }

    // Retorna el Map para reutilizarlo en el descuento
    for (const [idInsumo, { nombreInsumo, cantidadValidacion }] of insumosNecesarios) {
        const stockActual = await obtenerStockActualModel(idInsumo);
        if (cantidadValidacion > stockActual) {
            throw crearError(
                `Stock insuficiente del insumo: ${nombreInsumo}. Necesario: ${cantidadValidacion}, disponible: ${stockActual}`,
                409
            );
        }
    }

    return insumosNecesarios;
};

// ─── Solo descontar stock (llamar después de confirmar la venta en BD) ────────
const descontarStockInsumos = async (insumosNecesarios, registrarSalidaStockService, idUsuario) => {
    for (const [idInsumo, { cantidadExacta }] of insumosNecesarios) {
        await registrarSalidaStockService(
            { idInsumo, cantidadMovimiento: cantidadExacta, detalleMovimiento: 'Venta de producto' },
            idUsuario
        );
    }
};


// ─── Revertir insumos al anular una venta ─────────────────────────────────────
const revertirInsumosVenta = async (detalles, registrarEntradaStockService, idUsuario) => {
    const insumosARevertir = new Map();

    for (const { id_producto, cantidad_producto, usa_insumos } of detalles) {
        if (!usa_insumos) continue;
        const insumos = await obtenerInsumosPorProductoModel(id_producto);
        for (const insumo of insumos) {
            const cantidad = insumo.cantidad_uso * cantidad_producto;
            const idInsumo = insumo.id_insumo;
            if (insumosARevertir.has(idInsumo)) {
                insumosARevertir.get(idInsumo).cantidad += cantidad;
            } else {
                insumosARevertir.set(idInsumo, { cantidad });
            }
        }
    }

    for (const [idInsumo, { cantidad }] of insumosARevertir) {
        await registrarEntradaStockService(
            { idInsumo, cantidadMovimiento: cantidad, detalleMovimiento: 'Anulación de venta' },
            idUsuario
        );
    }
};

module.exports = {
    subirArchivoCloudinary,
    eliminarArchivoCloudinary,
    generarDatosComprobante,
    generarPdfTermico,
    generarPdfNotaVenta,
    reconstruirPayloadApisPeru,
    enviarComprobanteApisPeru,
    obtenerPdfApisPeru,
    validarStockInsumos,
    descontarStockInsumos,
    revertirInsumosVenta,
};