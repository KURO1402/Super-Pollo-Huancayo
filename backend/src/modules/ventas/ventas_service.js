const crearError = require('../../utilidades/crear_error');
const cache = require('../../config/node_cache');
const {
    subirArchivoCloudinary,
    eliminarArchivoCloudinary,
    generarDatosComprobante,
    validarStockInsumos,
    descontarStockInsumos,
    revertirInsumosVenta,
    reconstruirPayloadApisPeru,
    enviarComprobanteApisPeru,
} = require('./venta_helpers');

const generarPdfTermico = require('../../utilidades/helpers/generar_pdf_termico');

const { validarDatosVenta } = require('./ventas_validacion');
const { contarMedioPagoPorIdModel } = require('../configuracion/medios_pago/medios_pago_model');
const { registrarSalidaStockService, registrarEntradaStockService } = require('../inventario/insumos/insumo_service');

const {
    insertarVentaModel,
    obtenerVentaPorIdModel,
    obtenerDetalleVentaPorIdVentaModel,
    obtenerComprobantePorIdVentaModel,
    obtenerVentasModel,
    contarVentasModel,
    contarVentaPorIdModel,
    obtenerVentaParaAnularModel,
    anularVentaModel,
    obtenerComprobantePendientePorIdModel,
    actualizarEstadoSunatModel,
    reenviarComprobanteModel
} = require('./ventas_model');

const MINUTOS_VENTANA = 1;

// ─────────────────────────────────────────────────────────────────────────────

const generarVentaService = async (datos, idUsuario) => {
    validarDatosVenta(datos);
    const { tipoComprobante, medioPago, cliente, productos } = datos;

    const medioPagoExiste = await contarMedioPagoPorIdModel(medioPago);
    if (medioPagoExiste === 0) throw crearError('Medio de pago no valido', 400);

    const datosParaComprobante = await generarDatosComprobante(tipoComprobante, cliente, productos);

    // ─── Paso 1: Solo validar stock — si falla no hay nada que revertir ──────
    const insumosNecesarios = await validarStockInsumos(datosParaComprobante.productosConData);

    const esNotaVenta = datosParaComprobante.nombreComprobante === 'nota de venta';
    const nombreArchivo = `${datosParaComprobante.serie}-${datosParaComprobante.correlativo}-${Date.now()}`;

    // ─── Paso 2: Generar y subir PDF ──────────────────────────────────────────
    let urlPdf, publicIdPdf;
    try {
        const pdfBuffer = await generarPdfTermico(
            datosParaComprobante,
            cliente,
            datosParaComprobante.nombreDoc,
            datosParaComprobante.nombreComprobante
        );
        const resultado = await subirArchivoCloudinary(pdfBuffer, nombreArchivo, 'pdf');
        urlPdf = resultado.url;
        publicIdPdf = resultado.publicId;
    } catch (errorPdf) {
        console.log(errorPdf);
        throw crearError('Error al generar o subir el PDF del comprobante', 500);
    }

    // ─── Paso 3: Registrar en BD ──────────────────────────────────────────────
    const fechaLimiteCorreccion = esNotaVenta
        ? null
        : new Date(Date.now() + MINUTOS_VENTANA * 60 * 1000);

    let idVenta;
    try {
        const resultado = await insertarVentaModel({
            numeroDocumentoCliente: cliente.numDoc,
            idTipoDocumento: cliente.idTipoDoc,
            porcentajeIgv: 18,
            totalGravada: datosParaComprobante.mtoOperGravadas,
            totalIgv: datosParaComprobante.totalIgv,
            totalVenta: datosParaComprobante.mtoImpVenta,
            idMedioPago: medioPago,
            idTipoComprobante: tipoComprobante,
            serie: datosParaComprobante.serie,
            numeroCorrelativo: datosParaComprobante.correlativo,
            fechaEmision: datosParaComprobante.fechaEmision,
            fechaVencimiento: datosParaComprobante.fecVencimiento,
            sunatTransaccion: esNotaVenta ? 0 : datosParaComprobante.tipoOperacion,
            urlComprobantePdf: urlPdf,
            publicIdPdf,
            estadoSunat: esNotaVenta ? 'enviado' : 'pendiente',
            fechaLimiteCorreccion,
            idUsuario,
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
        idVenta = resultado.idVenta;
    } catch (errorBD) {
        // Insumos aún no descontados — solo limpiar el PDF
        await eliminarArchivoCloudinary(publicIdPdf);
        throw errorBD;
    }

    // ─── Paso 4: Venta confirmada — recién ahora descontar stock ─────────────
    await descontarStockInsumos(insumosNecesarios, registrarSalidaStockService, idUsuario);

    // ─── Paso 5: Retornar venta completa ──────────────────────────────────────
    const venta = await obtenerVentaPorIdModel(idVenta);
    venta.detalles = await obtenerDetalleVentaPorIdVentaModel(idVenta);

    return {
        ok: true,
        mensaje: esNotaVenta
            ? 'Nota de venta generada exitosamente'
            : `Venta registrada. Tienes ${MINUTOS_VENTANA} minuto para anular la venta antes de enviarse a SUNAT`,
        venta,
        urlPdf,
    };
};

// ─── Anular venta dentro de la ventana de corrección ─────────────────────────
const anularVentaService = async (idVenta, idUsuario) => {
    if (!idVenta || isNaN(Number(idVenta))) throw crearError('Se necesita especificar la venta', 400);

    const ventaID = Number(idVenta);
    const { venta, detalles, movimientoCaja } = await obtenerVentaParaAnularModel(ventaID);

    if (!venta) throw crearError('Venta no encontrada', 404);

    if (venta.estado_sunat === 'enviado') throw crearError('Esta venta ya fue enviada a SUNAT y no puede anularse', 400);
    if (venta.estado_sunat === 'rechazado') throw crearError('Esta venta fue rechazada por SUNAT, contacte al administrador', 400);

    const ahora = new Date();
    const limite = new Date(venta.fecha_limite_correccion);
    if (ahora > limite) throw crearError(`La ventana de corrección de ${MINUTOS_VENTANA} minutos ha expirado`, 400);

    if (!movimientoCaja) throw crearError('No se encontró el movimiento de caja asociado a esta venta', 500);

    // 1. Revertir insumos en inventario
    await revertirInsumosVenta(detalles, registrarEntradaStockService, idUsuario);

    // 2. Eliminar archivos de Cloudinary
    await eliminarArchivoCloudinary(venta.public_id_pdf);
    if (venta.public_id_xml) await eliminarArchivoCloudinary(venta.public_id_xml);

    // 3. Revertir caja y eliminar de BD en una transacción
    await anularVentaModel(ventaID, movimientoCaja.id_movimiento_caja, venta.total_venta, idUsuario);

    return {
        ok: true,
        mensaje: 'Venta anulada exitosamente. Caja e inventario revertidos.'
    };
};

// ─── Obtener ventas ───────────────────────────────────────────────────────────
const obtenerVentasService = async (querys) => {
    const allowedQuerys = ['limit', 'offset', 'fechaInicio', 'fechaFin'];
    const keysInvalidas = Object.keys({ ...querys }).filter(key => !allowedQuerys.includes(key));
    if (keysInvalidas.length > 0) throw crearError('Filtro no valido', 400);
    const { fechaInicio, fechaFin, limit, offset } = querys;
    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;


    const cacheKey = `ventas:count:${fechaInicio || 'null'}:${fechaFin || 'null'}`;
    const cachedTotal = cache.get(cacheKey);

    if (cachedTotal !== undefined) {
        const ventas = await obtenerVentasModel(fechaInicio ?? null, fechaFin ?? null, limite, desplazamiento);
        if (!ventas || ventas.length === 0) throw crearError('No se encontraron ventas', 404);
        return { ok: true, cantidad_filas: cachedTotal, ventas };
    }
    
    const totalVentas = await contarVentasModel(fechaInicio ?? null, fechaFin ?? null);
    
    cache.set(cacheKey, totalVentas);
    

    const ventas = await obtenerVentasModel(fechaInicio ?? null, fechaFin ?? null, limite, desplazamiento);
    if (!ventas || ventas.length === 0) throw crearError('No se encontraron ventas', 404);
    

    return { 
        ok: true, 
        cantidad_filas: totalVentas, 
        ventas 
    };
};

// ─── Obtener detalle de venta ─────────────────────────────────────────────────
const obtenerDetalleVentaPorIdVentaService = async (idVenta) => {
    if (!idVenta || isNaN(Number(idVenta))) throw crearError('Se necesita especificar la venta', 400);

    const ventaID = Number(idVenta);
    const ventaExiste = await contarVentaPorIdModel(ventaID);
    if (ventaExiste === 0) throw crearError('Venta especificada no existente', 404);

    const detalles_venta = await obtenerDetalleVentaPorIdVentaModel(ventaID);
    return { ok: true, detalles_venta };
};

// ─── Obtener comprobante de venta ─────────────────────────────────────────────
const obtenerComprobantePorIdVentaService = async (idVenta) => {
    if (!idVenta || isNaN(Number(idVenta))) throw crearError('Se necesita especificar la venta', 400);

    const ventaID = Number(idVenta);
    const ventaExiste = await contarVentaPorIdModel(ventaID);
    if (ventaExiste === 0) throw crearError('Venta especificada no existente', 404);

    const comprobante = await obtenerComprobantePorIdVentaModel(ventaID);
    return { ok: true, comprobante };
};

const reenviarComprobanteService = async (idComprobante) => {
    try {
        console.log(`Iniciando reenvío manual del comprobante ${idComprobante}...`);

        const { comprobante, detalles } = await obtenerComprobantePendientePorIdModel(idComprobante);

        if (!comprobante) {
            throw crearError('Comprobante no encontrado', 404);
        }

        if (comprobante.estado_sunat === 'aceptado') {
            throw crearError('Este comprobante ya fue aceptado por SUNAT, no se puede reenviar', 400);
        }

        if (comprobante.estado_sunat === 'pendiente') {
            throw crearError('Este comprobante aun no ha cumplido los 5 minutos, espere a que el job automatico lo procese', 400);
        }

        await actualizarEstadoSunatModel(
            idComprobante,
            'enviado_sunat',
            null,
            null,
            null
        );

        const payload = reconstruirPayloadApisPeru(comprobante, detalles);
        console.log('Enviando payload a ApisPeru...');
        const { xml, sunatResponse } = await enviarComprobanteApisPeru(payload);

        const aceptado = sunatResponse?.cdrResponse?.code === '0';
        const estado = aceptado ? 'aceptado' : 'rechazado';

        let urlXml = comprobante.url_comprobante_xml;
        let publicIdXml = comprobante.public_id_xml;

        if (!urlXml) {
            const nombreXml = `${comprobante.serie}-${comprobante.numero_correlativo}-xml`;
            const resultado = await subirArchivoCloudinary(Buffer.from(xml), nombreXml, 'xml');
            urlXml = resultado.url;
            publicIdXml = resultado.publicId;
            console.log('XML subido a Cloudinary');
        }

        await actualizarEstadoSunatModel(
            idComprobante,
            estado,
            urlXml,
            publicIdXml,
            new Date()
        );

        console.log(`Reenvio completado. Estado: ${estado}`);
        console.log(sunatResponse);
        return {
            ok: true,
            mensaje: aceptado 
                ? `Comprobante ${comprobante.serie}-${comprobante.numero_correlativo} ACEPTADO por SUNAT`
                : `Comprobante ${comprobante.serie}-${comprobante.numero_correlativo} RECHAZADO: ${sunatResponse?.error?.message}`,
            nuevoEstado: estado,
            respuestaSunat: sunatResponse?.cdrResponse,
        };

    } catch (error) {
        console.error(`Error en reenvio:`, error.message);
        throw error;
    }
};

module.exports = {
    generarVentaService,
    anularVentaService,
    obtenerVentasService,
    obtenerDetalleVentaPorIdVentaService,
    obtenerComprobantePorIdVentaService,
    reenviarComprobanteService
};