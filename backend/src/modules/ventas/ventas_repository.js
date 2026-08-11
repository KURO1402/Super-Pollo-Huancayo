const { ejecutarSP } = require('../../utilidades/helpers/db_helper');

const insertarVentaRepository = async ({
    numeroDocumentoCliente, idTipoDocumento, cliente, correoCliente, porcentajeIgv, totalGravada, totalIgv, totalVenta, idMedioPago,
    idTipoComprobante, serie, numeroCorrelativo, fechaEmision, fechaVencimiento, sunatTransaccion,
    urlComprobantePdf, publicIdPdf, estadoSunat, fechaLimiteCorreccion,
    detalles, idUsuario
}) => {
    const rows = await ejecutarSP(
        'sp_generar_venta',
        [
            numeroDocumentoCliente, idTipoDocumento, cliente, correoCliente ?? null, porcentajeIgv,
            totalGravada, totalIgv, totalVenta, idMedioPago,
            idTipoComprobante, serie, numeroCorrelativo,
            fechaEmision, fechaVencimiento, sunatTransaccion,
            urlComprobantePdf, publicIdPdf, estadoSunat, fechaLimiteCorreccion,
            idUsuario,
            JSON.stringify(detalles)
        ],
        'Error al insertar la venta.'
    );
    return { idVenta: rows[0][0].id_venta };
};

const obtenerVentaPorIdRepository = async (idVenta) => {
    const rows = await ejecutarSP(
        'sp_obtener_venta_por_id',
        [idVenta],
        'Error al obtener la venta por id.'
    );
    return rows[0][0];
};

const obtenerComprobantePorIdVentaRepository = async (idVenta) => {
    const rows = await ejecutarSP(
        'sp_obtener_comprobante_por_id_venta',
        [idVenta],
        'Error al obtener el comprobante de la venta.'
    );
    return rows[0][0];
};

const obtenerDetalleVentaPorIdVentaRepository = async (idVenta) => {
    const rows = await ejecutarSP(
        'sp_obtener_detalle_venta_por_id_venta',
        [idVenta],
        'Error al obtener el detalle de la venta.'
    );
    return rows[0];
};

const obtenerVentasRepository = async (fechaInicio = null, fechaFin = null, limit, offset) => {
    const rows = await ejecutarSP(
        'sp_obtener_ventas',
        [fechaInicio, fechaFin, parseInt(limit), parseInt(offset)],
        'Error al listar las ventas.'
    );
    return rows[0];
};

const contarVentasRepository = async (fechaInicio = null, fechaFin = null) => {
    const rows = await ejecutarSP(
        'sp_contar_ventas',
        [fechaInicio, fechaFin],
        'Error al contar las ventas.'
    );
    return rows[0][0]?.total_registros;
};

const contarVentaPorIdRepository = async (idVenta) => {
    const rows = await ejecutarSP(
        'sp_contar_venta_por_id',
        [idVenta],
        'Error al contar la venta por id.'
    );
    return rows[0][0]?.total;
};

const obtenerComprobantesVencidosRepository = async () => {
    const rows = await ejecutarSP(
        'sp_obtener_comprobantes_pendientes_vencidos',
        [],
        'Error al obtener los comprobantes vencidos.'
    );
    return rows[0];
};

const obtenerComprobantePendientePorIdRepository = async (idComprobante) => {
    const rows = await ejecutarSP(
        'sp_obtener_comprobante_pendiente_por_id',
        [idComprobante],
        'Error al obtener el comprobante pendiente.'
    );
    return {
        comprobante: rows[0][0],
        detalles: rows[1],
    };
};

const actualizarEstadoSunatRepository = async (
    idComprobante,
    estado,
    urlComprobanteXml,
    publicIdXml,
    fechaEnvio,
    urlCdr,
    publicIdCdr,
    hashComprobante
) => {
    await ejecutarSP(
        'sp_actualizar_estado_sunat',
        [idComprobante, estado, urlComprobanteXml, publicIdXml, fechaEnvio, urlCdr, publicIdCdr, hashComprobante],
        'Error al actualizar el estado SUNAT.'
    );
};

const obtenerVentaParaAnularRepository = async (idVenta) => {
    const rows = await ejecutarSP(
        'sp_obtener_venta_para_anular',
        [idVenta],
        'Error al obtener la venta para anular.'
    );
    return {
        venta: rows[0][0],
        detalles: rows[1],
        movimientoCaja: rows[2][0],
    };
};

const anularVentaRepository = async (idVenta, idMovimientoCaja, montoRevertir, idUsuario) => {
    await ejecutarSP(
        'sp_anular_venta',
        [idVenta, idMovimientoCaja, montoRevertir, idUsuario],
        'Error al anular la venta.'
    );
};

const reenviarComprobanteRepository = async (idComprobante) => {
    await ejecutarSP(
        'sp_reenviar_comprobante',
        [idComprobante],
        'Error al reenviar el comprobante.'
    );
};

module.exports = {
    insertarVentaRepository,
    obtenerVentaPorIdRepository,
    obtenerDetalleVentaPorIdVentaRepository,
    obtenerComprobantePorIdVentaRepository,
    obtenerVentasRepository,
    contarVentasRepository,
    contarVentaPorIdRepository,
    obtenerComprobantesVencidosRepository,
    obtenerComprobantePendientePorIdRepository,
    actualizarEstadoSunatRepository,
    obtenerVentaParaAnularRepository,
    anularVentaRepository,
    reenviarComprobanteRepository
};