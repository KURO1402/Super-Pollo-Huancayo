const axios = require('axios');
const cloudinaryPdf = require('../../config/cloudinary_pdf_config');
const generarPdfTermico = require('../../utilidades/helpers/generar_pdf_termico');

const { obtenerTipoComprobantePorIdModel } = require('../configuracion/tipos_comprobante/tipos_comprobante_model');
const { obtenerTipoDocumentoPorIdModel } = require('../configuracion/tipos_documento/tipos_documento_model');
const { obtenerProductoIdModel, obtenerInsumosPorProductoModel } = require('../inventario/productos/producto_model');
const { obtenerStockActualModel } = require('../inventario/insumos/insumos_model');
const crearError = require('../../utilidades/crear_error');
const obtenerFechaActual = require('../../utilidades/obtener_fecha_actual');
const { company, IGV, TIPO_COMPROBANTE_CODIGO, TIPO_DOCUMENTO_CODIGO } = require('../../utilidades/helpers/constantes_venta');
const numeroALetras = require('../../utilidades/numero_letras');

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

    const details = detalles.map((d, i) => {
    const baseImponible = parseFloat(d.valor_unitario) * d.cantidad_producto;
    const igvTotal = parseFloat(d.igv);
    
    return {
        id: String(i + 1),
        codProducto: `P${String(d.id_producto).padStart(3, '0')}`,
        unidad: '03',
        descripcion: d.nombre_producto,
        cantidad: d.cantidad_producto,
        mtoValorUnitario: parseFloat(d.valor_unitario),
        mtoPrecioUnitario: parseFloat(d.precio_unitario),
        porcentajeIgv: 18,
        igv: igvTotal,
        mtoValorVenta: baseImponible,
        totalImpuestos: igvTotal,
        tributos: [
            {
                tipoTributo: '1000',
                codigoTributo: '1000',
                nombre: 'IGV',
                porcentaje: 18,
                baseImponible: baseImponible,
                monto: igvTotal,
                afectacionIGV: '10',
            }
        ],
    };
});

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