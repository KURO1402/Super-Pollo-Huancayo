const pool = require('../../config/conexion_DB');

const insertarVentaModel = async ({ numeroDocumentoCliente, idTipoDocumento, fechaEmision, fechaVencimiento, porcentajeIgv, totalGravada, totalIgv, totalVenta, idMedioPago, idTipoComprobante, serie, numeroCorrelativo, sunatTransaccion, aceptadoPorSunat, urlComprobantePdf, urlComprobanteXml, fechaEnvio, detalles }) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        await conexion.beginTransaction();

        // ─── 1. Insertar venta ───────────────────────────────────
        const [ventaResult] = await conexion.query('CALL sp_insertar_venta(?, ?, ?, ?, ?, ?, ?)',[numeroDocumentoCliente,idTipoDocumento,porcentajeIgv, totalGravada, totalIgv, totalVenta, idMedioPago]);

        const idVenta = ventaResult[0][0].id_venta;

        // ─── 2. Insertar comprobante  ───────────────────
        await conexion.query('CALL sp_insertar_comprobante(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [idVenta,idTipoComprobante,serie,numeroCorrelativo,fechaEmision, fechaVencimiento, sunatTransaccion,aceptadoPorSunat,urlComprobantePdf,urlComprobanteXml,fechaEnvio]);

        // ─── 3. Insertar detalles ─────────────────────────────────────────────
        for (const detalle of detalles) {
            await conexion.query('CALL sp_insertar_detalle_venta(?, ?, ?, ?, ?, ?, ?, ?)',[detalle.cantidad,detalle.valorUnitario,detalle.precioUnitario,detalle.subtotal,detalle.igv,detalle.totalProducto,idVenta,detalle.idProducto]);
        }

        await conexion.commit();
        return { idVenta };

    } catch (error) {
        await conexion.rollback();
        throw error;
    } finally {
        conexion.release();
    }
};

const obtenerVentaPorIdModel = async (idVenta) => {
    let conexion;

    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.query('CALL sp_obtener_venta_por_id(?)', [idVenta]);

        return result[0][0];

    } catch (error) {
        throw new Error('Error al obtener la venta');
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
        throw new Error('Error al obtener el comprobante');
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
        throw new Error('Error al obtener el detalle de la venta');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerVentasModel = async (fechaInicio = null, fechaFin = null, limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_obtener_ventas(?, ?, ?, ?)', [fechaInicio, fechaFin, limit, offset]);
        return rows[0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener las ventas en la base de datos');
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

module.exports = { 
    insertarVentaModel,
    obtenerVentaPorIdModel,
    obtenerDetalleVentaPorIdVentaModel,
    obtenerComprobantePorIdVentaModel,
    obtenerVentasModel,
    contarVentasModel 
};