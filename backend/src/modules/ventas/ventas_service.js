const axios = require('axios');
const crearError = require('../../utilidades/crear_error');
const subirArchivoCloudinary = require('../../utilidades/helpers/subir_archivo_cludinary');

const { validarDatosVenta } = require('./ventas_validacion');
const { generarDatosComprobante, generarPdfNotaVenta, validarYDescontarInsumos } = require('./venta_helpers');
const { contarMedioPagoPorIdModel } = require('../configuracion/medios_pago/medios_pago_model');
const { registrarIngresoCajaModel } = require('../caja/caja_model');
const { actualizarCorrelativoComprobanteModel } = require('../configuracion/tipos_comprobante/tipos_comprobante_model');
const { consultarCajaAbiertaModel } = require('../caja/caja_model');
const { registrarSalidaStockService } = require('../inventario/insumos/insumo_service');

const { insertarVentaModel,
    obtenerVentaPorIdModel,
    obtenerDetalleVentaPorIdVentaModel,
    obtenerComprobantePorIdVentaModel,
    obtenerVentasModel,
    contarVentasModel,
    contarVentaPorIdModel 
} = require('./ventas_model');

const generarVentaService = async (datos, idUsuario) => {
    validarDatosVenta(datos);
    const { tipoComprobante, medioPago, cliente, productos } = datos;

    const medioPagoExiste = await contarMedioPagoPorIdModel(medioPago);
    if (medioPagoExiste === 0) {
        throw crearError('Medio de pago no valido', 400);
    }

    const datosParaComprobante = await generarDatosComprobante(tipoComprobante, cliente, productos);

    const caja = await consultarCajaAbiertaModel();
    if (!caja) {
        throw crearError('No se puede registrar una venta si no hay una caja abierta.', 400);
    }

    // ─── Validar stock de insumos antes de registrar la venta ────────────────
    await validarYDescontarInsumos(
        datosParaComprobante.productosConData,
        registrarSalidaStockService,
        idUsuario
    );

    const esNotaVenta = datosParaComprobante.nombreComprobante === 'nota de venta';

    const nombreArchivo = `${datosParaComprobante.serie}-${datosParaComprobante.correlativo}-${Date.now()}`;

    let urlPdf, urlXml = null;
    let aceptadoPorSunat = null;
    let codigoSunat = null;
    let mensajeSunat = null;

    if (esNotaVenta) {
        // ─── Flujo nota de venta: PDF interno, sin SUNAT ──────────────────────

        // 1. Generar PDF con pdfkit
        const pdfBuffer = await generarPdfNotaVenta(
            datosParaComprobante,
            cliente,
            datosParaComprobante.nombreDoc
        );

        // 2. Subir solo PDF a Cloudinary
        urlPdf = await subirArchivoCloudinary(pdfBuffer, nombreArchivo, 'pdf');

    } else {
        // ─── Flujo normal: boleta / factura → ApisPeru + SUNAT ────────────────
        const token = process.env.TOKEN_APIS_PERU;

        // 1. Obtener PDF
        let respuestaPdf;
        try {
            respuestaPdf = await axios.post(
                `${process.env.APISPERU_URL}/invoice/pdf`,
                datosParaComprobante,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    responseType: 'arraybuffer',
                }
            );
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                console.error("❌ Error API PDF:", { status, data: data?.toString?.() || data });
                throw crearError(`ApisPeru PDF respondió con estado ${status}. ${data?.message || 'Error en generación de PDF'}`, 502);
            }
            if (error.request) {
                console.error("❌ No hubo respuesta del servidor ApisPeru (PDF)");
                throw crearError("No hubo respuesta del servidor ApisPeru al generar el PDF", 504);
            }
            console.error("❌ Error interno PDF:", error.message);
            throw crearError("Error interno al generar el PDF", 500);
        }

        // 2. Obtener XML y respuesta SUNAT
        let respuestaXml;
        try {
            respuestaXml = await axios.post(
                `${process.env.APISPERU_URL}/invoice/send`,
                datosParaComprobante,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                console.error("❌ Error API SEND:", { status, data });
                throw crearError(`Error al enviar comprobante a SUNAT (ApisPeru ${status}). ${data?.message || 'Error desconocido'}`, 502);
            }
            if (error.request) {
                console.error("❌ No hubo respuesta del servidor ApisPeru (SEND)");
                throw crearError("No hubo respuesta del servidor ApisPeru al enviar el comprobante", 504);
            }
            console.error("❌ Error interno SEND:", error.message);
            throw crearError("Error interno al enviar el comprobante", 500);
        }

        const { xml, sunatResponse } = respuestaXml.data;
        aceptadoPorSunat = sunatResponse?.cdrResponse?.code === '0' ? 1 : 0;
        codigoSunat = sunatResponse?.cdrResponse?.code;
        mensajeSunat = sunatResponse?.cdrResponse?.description;

        // 3. Subir PDF y XML a Cloudinary
        [urlPdf, urlXml] = await Promise.all([
            subirArchivoCloudinary(Buffer.from(respuestaPdf.data), nombreArchivo, 'pdf'),
            subirArchivoCloudinary(Buffer.from(xml), `${nombreArchivo}-xml`, 'xml'),
        ]);
    }

    // ─── Registrar en base de datos (común para ambos flujos) ────────────────
    const { idVenta } = await insertarVentaModel({
        // datos venta
        numeroDocumentoCliente: cliente.numDoc,
        idTipoDocumento: cliente.idTipoDoc,
        fechaEmision: datosParaComprobante.fechaEmision,
        fechaVencimiento: datosParaComprobante.fecVencimiento,
        porcentajeIgv: 18,
        totalGravada: datosParaComprobante.mtoOperGravadas,
        totalIgv: datosParaComprobante.totalIgv,
        totalVenta: datosParaComprobante.mtoImpVenta,
        idMedioPago: medioPago,
        // datos comprobante
        idTipoComprobante: tipoComprobante,
        serie: datosParaComprobante.serie,
        numeroCorrelativo: datosParaComprobante.correlativo,
        sunatTransaccion: esNotaVenta ? 0 : datosParaComprobante.tipoOperacion,
        aceptadoPorSunat,
        urlComprobantePdf: urlPdf,
        urlComprobanteXml: urlXml,
        fechaEnvio: esNotaVenta ? null : new Date(),
        // detalles
        detalles: datosParaComprobante.details.map(d => ({
            cantidad: d.cantidad,
            valorUnitario: d.mtoValorUnitario,
            precioUnitario: d.mtoPrecioUnitario,
            subtotal: d.mtoValorVenta,
            igv: d.igv,
            totalProducto: d.mtoValorVenta + d.igv,
            idProducto: d.idProducto,
        })),
    });

    await actualizarCorrelativoComprobanteModel(tipoComprobante, datosParaComprobante.correlativo);
    await registrarIngresoCajaModel(datosParaComprobante.mtoImpVenta, 'Venta realizada', idUsuario);

    const venta = await obtenerVentaPorIdModel(idVenta);
    const detallesVenta = await obtenerDetalleVentaPorIdVentaModel(idVenta);
    venta.detalles = detallesVenta;

    return {
        ok: true,
        mensaje: 'Venta y comprobante realizados exitosamente',
        ...(esNotaVenta ? {} : {
            aceptadoPorSunat: aceptadoPorSunat === 1,
            codigoSunat,
            mensajeSunat,
        }),
        venta,
        urlPdf,
        ...(urlXml && { urlXml }),
    };
};

const obtenerVentasService = async (querys) => {
    const allowedQuerys = ['limit', 'offset', 'fechaInicio', 'fechaFin'];

    const keysInvalidas = Object.keys(querys).filter(
        key => !allowedQuerys.includes(key)
    );

    if (keysInvalidas.length > 0) {
        throw crearError('Filtro no valido', 400);
    }

    const { fechaInicio, fechaFin, limit, offset } = querys;

    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    const cacheKey = `ventas:count:${fechaInicio || 'null'}:${fechaFin || 'null'}`;
    const cachedTotal = cache.get(cacheKey);

    if (cachedTotal !== undefined) {
        console.log('Cache hit');

        const ventas = await obtenerVentasModel(fechaInicio ?? null, fechaFin ?? null, limite, desplazamiento);

        if (!ventas || ventas.length === 0) {
            throw crearError('No se encontraron ventas', 404);
        }

        return {
            ok: true,
            cantidad_filas: cachedTotal,
            ventas
        };
    }

    console.log('Cache miss');

    const totalVentas = await contarVentasModel(fechaInicio ?? null, fechaFin ?? null);

    cache.set(cacheKey, totalVentas);

    const ventas = await obtenerVentasModel(fechaInicio ?? null, fechaFin ?? null, limite, desplazamiento);

    if (!ventas || ventas.length === 0) {
        throw crearError('No se encontraron ventas', 404);
    }

    return {
        ok: true,
        cantidad_filas: totalVentas,
        ventas
    };
};

const obtenerDetalleVentaPorIdVentaService = async (idVenta) => {
    if (!idVenta || isNaN(Number(idVenta))) {
        throw crearError('Se necesita especificar la venta', 400);
    }

    const ventaID = Number(idVenta);

    const ventaExiste = await contarVentaPorIdModel(ventaID);

    if (ventaExiste === 0) {
        throw crearError('Venta especificada no existente', 404);
    }

    const detalles_venta = await obtenerDetalleVentaPorIdVentaModel(ventaID);

    return {
        ok: true,
        detalles_venta
    };
};

const obtenerComprobantePorIdVentaService = async (idVenta) => {
    if (!idVenta || isNaN(Number(idVenta))) {
        throw crearError('Se necesita especificar la venta', 400);
    }

    const ventaID = Number(idVenta);

    const ventaExiste = await contarVentaPorIdModel(ventaID);

    if (ventaExiste === 0) {
        throw crearError('Venta especificada no existente', 404);
    }

    const comprobante = await obtenerComprobantePorIdVentaModel(ventaID);

    return {
        ok: true,
        comprobante
    };
};

module.exports = {
    generarVentaService,
    obtenerVentasService,
    obtenerDetalleVentaPorIdVentaService,
    obtenerComprobantePorIdVentaService
};