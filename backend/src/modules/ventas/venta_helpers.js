const PDFDocument = require('pdfkit');
const path = require('path');
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

// ─────────────────────────────────────────────────────────────────────────────

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

const calcularProducto = (productoExiste, cantidad) => {
    const precioConIgv = parseFloat(productoExiste.precio_producto);
    const precioSinIgv = parseFloat((precioConIgv / (1 + IGV)).toFixed(2));
    const igvUnitario = parseFloat((precioConIgv - precioSinIgv).toFixed(2));
    const totalLinea = parseFloat((precioSinIgv * cantidad).toFixed(2));
    const igvLinea = parseFloat((igvUnitario * cantidad).toFixed(2));

    return {
        idProducto: productoExiste.id_producto,
        codProducto: `P${String(productoExiste.id_producto).padStart(3, '0')}`,
        unidad: "NIU",
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
    if (!tipoComprobanteExiste)
        throw crearError('Tipo de comprobante no valido', 400);

    const tipoDocumentoExiste = await obtenerTipoDocumentoPorIdModel(cliente.idTipoDoc);
    if (!tipoDocumentoExiste)
        throw crearError('Tipo de documento no valido', 400);

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
            if (!productoExiste)
                throw crearError(`Producto con id ${idProducto} no encontrado`, 400);

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
        ublVersion: "2.1",
        fecVencimiento: fecha,
        tipoOperacion: "0101",
        tipoDoc: TIPO_COMPROBANTE_CODIGO[nombreComprobante],
        serie: tipoComprobanteExiste.serie,
        correlativo: tipoComprobanteExiste.correlativo + 1,
        fechaEmision: fecha,
        formaPago: { moneda: "PEN", tipo: "Contado" },
        tipoMoneda: "PEN",
        client: {
            tipoDoc: TIPO_DOCUMENTO_CODIGO[nombreDoc],
            numDoc: cliente.numDoc,
            rznSocial: cliente.denominacionCliente,
            address: {
                direccion: cliente.direccionCliente?.trim() || "Direccion cliente"
            }
        },
        company,
        mtoOperGravadas,
        totalIgv,
        mtoImpVenta,
        details: productosDetalle,
        legends: [{ value: numeroALetras(mtoImpVenta) }],
        // expuesto para el service
        nombreComprobante,
        nombreDoc,
        productosConData, // para validar y descontar insumos sin re-consultar BD
    };
};

// ─── Generar PDF nota de venta (impresora térmica 80mm) ───────────────────────

const generarPdfNotaVenta = (datosComprobante, cliente, nombreTipoDoc) => {
    return new Promise((resolve, reject) => {
        try {
            const {
                serie,
                correlativo,
                fechaEmision,
                fecVencimiento,
                mtoOperGravadas,
                totalIgv,
                mtoImpVenta,
                details,
            } = datosComprobante;

            // Alto estimado: base fija + filas de productos
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

            let y = MARGEN;

            // ─── Logo ──────────────────────────────────────────────────────────────────
            const logoPath = path.join(__dirname, '../../public/super_pollo_logo.png');
            const logoAncho = 60;
            const logoAlto = 60;
            const logoX = (ANCHO_PAGINA - logoAncho) / 2;
            doc.image(logoPath, logoX, y, { width: logoAncho, height: logoAlto });
            y += logoAlto + 4;

            // ─── Cabecera empresa ─────────────────────────────────────────────
            doc.fontSize(9).font('Helvetica-Bold');
            centrar(company.nombreComercial, y);
            y += 12;

            doc.fontSize(7).font('Helvetica');
            centrar(`RUC: ${company.ruc.toString()}`, y);
            y += 10;
            centrar(company.address?.direccion || '', y);
            y += 10;
            if (company.address?.provincia) {
                centrar(`${company.address.provincia} - ${company.address.departamento || ''}`, y);
                y += 10;
            }
            if (company.telephone) {
                centrar(`Tel: ${company.telephone}`, y);
                y += 10;
            }

            y += 3;
            linea(y);
            y += 5;

            // ─── Título comprobante ───────────────────────────────────────────
            doc.fontSize(8).font('Helvetica-Bold');
            centrar('NOTA DE VENTA', y);
            y += 11;
            centrar(`${serie}-${String(correlativo).padStart(8, '0')}`, y);
            y += 11;

            linea(y);
            y += 5;

            // ─── Datos cliente ────────────────────────────────────────────────
            doc.fontSize(7);

            const filaCliente = (label, valor) => {
                doc.font('Helvetica-Bold').text(label, x, y, { continued: true })
                   .font('Helvetica').text(` ${valor}`, { width: ANCHO_UTIL });
                y += 10;
            };

            const formatearFecha = (iso) => {
                const d = new Date(iso);
                const dd = String(d.getDate()).padStart(2, '0');
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const yyyy = d.getFullYear();
                return `${dd}/${mm}/${yyyy}`;
            };

            const formatearFechaHora = (iso) => {
                const d = new Date(iso);
                const dd = String(d.getDate()).padStart(2, '0');
                const mm = String(d.getMonth() + 1).padStart(2, '0');
                const yyyy = d.getFullYear();
                const hh = String(d.getHours()).padStart(2, '0');
                const min = String(d.getMinutes()).padStart(2, '0');
                const ss = String(d.getSeconds()).padStart(2, '0');
                return `${dd}/${mm}/${yyyy} ${hh}:${min}:${ss}`;
            };

            filaCliente('Fecha emisión :', formatearFechaHora(fechaEmision));
            filaCliente('Fecha venc.   :', formatearFecha(fecVencimiento));
            filaCliente(`${nombreTipoDoc.toUpperCase().padEnd(14, ' ')}:`, cliente.numDoc);
            filaCliente('Cliente       :', cliente.denominacionCliente);
            if (cliente.direccionCliente) {
                filaCliente('Dirección     :', cliente.direccionCliente);
            }

            y += 2;
            linea(y);
            y += 5;

            // ─── Encabezado tabla productos ───────────────────────────────────
            const COL = {
                desc:  { x: x,       w: 80 },
                cant:  { x: x + 80,  w: 22 },
                pu:    { x: x + 102, w: 36 },
                total: { x: x + 138, w: 64 },
            };

            doc.fontSize(6.5).font('Helvetica-Bold');
            doc.text('Descripción', COL.desc.x,  y, { width: COL.desc.w });
            doc.text('Cant.',       COL.cant.x,  y, { width: COL.cant.w,  align: 'center' });
            doc.text('P.Unit',      COL.pu.x,    y, { width: COL.pu.w,    align: 'right'  });
            doc.text('Total',       COL.total.x, y, { width: COL.total.w, align: 'right'  });
            y += 10;
            linea(y);
            y += 4;

            // ─── Filas de productos ───────────────────────────────────────────
            doc.fontSize(6.5).font('Helvetica');

            for (const d of details) {
                const alturaDesc = doc.heightOfString(d.descripcion, { width: COL.desc.w });
                const alturaFila = Math.max(alturaDesc, 9);

                doc.text(d.descripcion,                               COL.desc.x,  y, { width: COL.desc.w  });
                doc.text(String(d.cantidad),                          COL.cant.x,  y, { width: COL.cant.w,  align: 'center' });
                doc.text(`S/ ${d.mtoPrecioUnitario.toFixed(2)}`,      COL.pu.x,    y, { width: COL.pu.w,    align: 'right'  });
                doc.text(`S/ ${(d.mtoValorVenta + d.igv).toFixed(2)}`,COL.total.x, y, { width: COL.total.w, align: 'right'  });

                y += alturaFila + 3;
            }

            y += 2;
            linea(y);
            y += 5;

            // ─── Totales ──────────────────────────────────────────────────────
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

            y += 3;
            linea(y);
            y += 6;

            // ─── Importe en letras ────────────────────────────────────────────
            doc.fontSize(6.5).font('Helvetica-BoldOblique');
            centrar(`SON: ${numeroALetras(mtoImpVenta)}`, y, { lineBreak: true });
            y += doc.heightOfString(`SON: ${numeroALetras(mtoImpVenta)}`, { width: ANCHO_UTIL }) + 4;

            linea(y);
            y += 8;

            // ─── Pie ──────────────────────────────────────────────────────────
            doc.fontSize(6).font('Helvetica');
            centrar('Documento no válido para crédito fiscal', y);
            y += 9;
            centrar('¡Gracias por su preferencia!', y);

            doc.end();

        } catch (err) {
            reject(err);
        }
    });
};

// ─── Validar stock y descontar insumos por venta ─────────────────────────────
//
// Recibe:
//   productosConData: array de { productoExiste, cantidad }
//                     donde productoExiste es el objeto devuelto por obtenerProductoIdModel
//   registrarSalidaStockService: el service de salida ya existente
//   idUsuario: para registrar el movimiento
//
const validarYDescontarInsumos = async (productosConData, registrarSalidaStockService, idUsuario) => {

    // ─── 1. Construir mapa de insumos necesarios ──────────────────────────────
    // { idInsumo -> { nombre, cantidadNecesaria } }
    const insumosNecesarios = new Map();

    for (const { productoExiste, cantidad } of productosConData) {
        if (!productoExiste.usa_insumos) continue;

        const insumos = await obtenerInsumosPorProductoModel(productoExiste.id_producto);

        for (const insumo of insumos) {
            const cantidadNecesaria = Math.ceil(insumo.cantidad_uso * cantidad);
            const idInsumo = insumo.id_insumo;

            if (insumosNecesarios.has(idInsumo)) {
                insumosNecesarios.get(idInsumo).cantidadNecesaria += cantidadNecesaria;
            } else {
                insumosNecesarios.set(idInsumo, {
                    nombreInsumo: insumo.nombre_insumo,
                    cantidadNecesaria,
                });
            }
        }
    }

    if (insumosNecesarios.size === 0) return; // ningún producto usa insumos

    // ─── 2. Validar stock de todos antes de descontar ─────────────────────────
    for (const [idInsumo, { nombreInsumo, cantidadNecesaria }] of insumosNecesarios) {
        const stockActual = await obtenerStockActualModel(idInsumo);

        if (cantidadNecesaria > stockActual) {
            throw crearError(
                `Stock insuficiente del insumo: ${nombreInsumo}. Necesario: ${cantidadNecesaria}, disponible: ${stockActual}`,
                409
            );
        }
    }

    // ─── 3. Descontar insumos ─────────────────────────────────────────────────
    for (const [idInsumo, { cantidadNecesaria }] of insumosNecesarios) {
        await registrarSalidaStockService(
            {
                idInsumo,
                cantidadMovimiento: cantidadNecesaria,
                detalleMovimiento: 'Venta de producto',
            },
            idUsuario
        );
    }
};

module.exports = { generarDatosComprobante, generarPdfNotaVenta, validarYDescontarInsumos };