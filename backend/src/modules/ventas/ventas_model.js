const pool = require('../../config/conexion_DB');

const insertarVentaModel = async ({
    numeroDocumentoCliente, idTipoDocumento, porcentajeIgv, totalGravada, totalIgv, totalVenta, idMedioPago,
    idTipoComprobante, serie, numeroCorrelativo, fechaEmision, fechaVencimiento, sunatTransaccion,
    urlComprobantePdf, publicIdPdf, estadoSunat, fechaLimiteCorreccion,
    detalles, idUsuario
}) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute(
            'CALL sp_generar_venta(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [
                numeroDocumentoCliente, idTipoDocumento, porcentajeIgv,
                totalGravada, totalIgv, totalVenta, idMedioPago,
                idTipoComprobante, serie, numeroCorrelativo,
                fechaEmision, fechaVencimiento, sunatTransaccion,
                urlComprobantePdf, publicIdPdf, estadoSunat, fechaLimiteCorreccion,
                idUsuario,
                JSON.stringify(detalles)
            ]
        );
        return { idVenta: result[0][0].id_venta };
    } catch (error) {
        console.log(error.message);
        throw new Error('Error al insertar la venta en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerVentaPorIdModel = async (idVenta) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.query('CALL sp_obtener_venta_por_id(?)', [idVenta]);
        return result[0][0];
    } catch (error) {
        console.log(error.message);
        throw new Error('Error al obtener la venta por ID en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerComprobantePorIdVentaModel = async (idVenta) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.query('CALL sp_obtener_comprobante_por_id_venta(?)', [idVenta]);
        return result[0][0];
    } catch (error) {
        console.log(error.message);
        throw new Error('Error al obtener el comprobante en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerDetalleVentaPorIdVentaModel = async (idVenta) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.query('CALL sp_obtener_detalle_venta_por_id_venta(?)', [idVenta]);
        return result[0];
    } catch (error) {
        console.log(error.message);
        throw new Error('Error al obtener el detalle de la venta en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerVentasModel = async (fechaInicio = null, fechaFin = null, limit, offset) => {
    console.log(fechaInicio, fechaFin)
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute(
            'CALL sp_obtener_ventas(?, ?, ?, ?)',
            [fechaInicio, fechaFin, parseInt(limit), parseInt(offset)]
        );
        return rows[0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al listar las ventas en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarVentasModel = async (fechaInicio = null, fechaFin = null) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_contar_ventas(?, ?)', [fechaInicio, fechaFin]);
        return rows[0][0]?.total_registros;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al contar las ventas en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarVentaPorIdModel = async (idVenta) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_contar_venta_por_id(?)', [idVenta]);
        return rows[0][0]?.total;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al contar la venta por ID en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerComprobantesVencidosModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_obtener_comprobantes_pendientes_vencidos()');
        return rows[0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener comprobantes vencidos en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerComprobantePendientePorIdModel = async (idComprobante) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query('CALL sp_obtener_comprobante_pendiente_por_id(?)', [idComprobante]);
        return {
            comprobante: rows[0][0],
            detalles: rows[1],
        };
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener el comprobante pendiente en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarEstadoSunatModel = async (idComprobante, estado, urlComprobanteXml, publicIdXml, fechaEnvio) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        await conexion.execute(
            'CALL sp_actualizar_estado_sunat(?, ?, ?, ?, ?)',
            [idComprobante, estado, urlComprobanteXml, publicIdXml, fechaEnvio]
        );
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al actualizar el estado SUNAT en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerVentaParaAnularModel = async (idVenta) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query('CALL sp_obtener_venta_para_anular(?)', [idVenta]);
        return {
            venta: rows[0][0],
            detalles: rows[1],
            movimientoCaja: rows[2][0],
        };
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener la venta para anular en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const anularVentaModel = async (idVenta, idMovimientoCaja, montoRevertir, idUsuario) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        await conexion.execute(
            'CALL sp_anular_venta(?, ?, ?, ?)',
            [idVenta, idMovimientoCaja, montoRevertir, idUsuario]
        );
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al anular la venta en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = {
    insertarVentaModel,
    obtenerVentaPorIdModel,
    obtenerDetalleVentaPorIdVentaModel,
    obtenerComprobantePorIdVentaModel,
    obtenerVentasModel,
    contarVentasModel,
    contarVentaPorIdModel,
    obtenerComprobantesVencidosModel,
    obtenerComprobantePendientePorIdModel,
    actualizarEstadoSunatModel,
    obtenerVentaParaAnularModel,
    anularVentaModel
};