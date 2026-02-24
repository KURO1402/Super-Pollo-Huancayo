const axios = require('axios');
const crearError = require('../../utilidades/crear_error');
const subirArchivoCloudinary = require('../../utilidades/helpers/subir_archivo_cludinary');

const { obtenerTokenApisPeru } = require('../../config/auth_ApisPeru');
const { validarDatosVenta } = require('./ventas_validacion');
const { generarDatosComprobante } = require('./venta_helpers');
const { contarMedioPagoPorIdModel } = require('../configuracion/medios_pago/medios_pago_model');

const { insertarVentaModel } = require('./ventas_model');

const generarVentaService = async (datos) => {
    validarDatosVenta(datos);
    const { tipoComprobante, medioPago, cliente, productos } = datos;

    const medioPagoExiste = await contarMedioPagoPorIdModel(medioPago);
    if (medioPagoExiste === 0) {
        throw crearError('Medio de pago no valido', 400);
    }

    const datosParaComprobante = await generarDatosComprobante(tipoComprobante, cliente, productos);
    const token = await obtenerTokenApisPeru();

    // ─── 1. Obtener PDF ───────────────────────────────────────────────────────
    const respuestaPdf = await axios.post(
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

    // ─── 2. Obtener XML y respuesta SUNAT ─────────────────────────────────────
    const respuestaXml = await axios.post(
        `${process.env.APISPERU_URL}/invoice/send`,
        datosParaComprobante,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        }
    );

    const { xml, sunatResponse } = respuestaXml.data;
    const aceptadoPorSunat = sunatResponse?.cdrResponse?.code === '0' ? 1 : 0;

    // ─── 3. Subir PDF y XML a Cloudinary ──────────────────────────────────────
    const nombreArchivo = `${datosParaComprobante.tipoDoc}-${datosParaComprobante.serie}-${datosParaComprobante.correlativo}-${Date.now()}`;

    const [urlPdf, urlXml] = await Promise.all([
        subirArchivoCloudinary(Buffer.from(respuestaPdf.data), `${nombreArchivo}`, 'pdf'),
        subirArchivoCloudinary(Buffer.from(xml), `${nombreArchivo}-xml`, 'xml'),
    ]);

    // ─── 4. Registrar en base de datos ────────────────────────────────────────
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
        sunatTransaccion: datosParaComprobante.tipoOperacion,
        aceptadoPorSunat,
        urlComprobantePdf: urlPdf,
        urlComprobanteXml: urlXml,
        fechaEnvio: new Date(),
        // detalles
        detalles: datosParaComprobante.details.map(d => ({
            cantidad: d.cantidad,
            valorUnitario: d.mtoValorUnitario,
            precioUnitario: d.mtoPrecioUnitario,
            subtotal: d.mtoValorVenta,
            igv: d.igv,
            totalProducto: d.mtoValorVenta + d.igv,
            idProducto: d.idProducto, // ojo aquí abajo
        })),
    });

    return {
        ok: true,
        mensaje: "Venta registrada exitosamente",
        aceptadoPorSunat: aceptadoPorSunat === 1,
        mensajeSunat: sunatResponse?.cdrResponse?.description,
        idVenta,
        urlPdf,
        urlXml,
    };
};

module.exports = {
    generarVentaService
}