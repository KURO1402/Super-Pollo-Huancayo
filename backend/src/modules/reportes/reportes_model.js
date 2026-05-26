const pool = require('../../config/conexion_DB');

const reporteVentasResumenModel = async (fechaInicio, fechaFin) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute(
            'CALL sp_reporte_ventas_resumen(?, ?)',
            [fechaInicio, fechaFin]
        );
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener el resumen de ventas en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const reporteVentasDetalleModel = async (fechaInicio, fechaFin) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute(
            'CALL sp_reporte_ventas_detalle(?, ?)',
            [fechaInicio, fechaFin]
        );
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener el detalle de ventas en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const reporteClientesResumenModel = async (fechaInicio, fechaFin) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute(
            'CALL sp_reporte_clientes_resumen(?, ?)',
            [fechaInicio, fechaFin]
        );
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener el resumen de clientes en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const reporteClientesDetalleModel = async (fechaInicio, fechaFin) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute(
            'CALL sp_reporte_clientes_detalle(?, ?)',
            [fechaInicio, fechaFin]
        );
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener el detalle de clientes en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};


const reporteInventarioResumenModel = async (fechaInicio, fechaFin) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute(
            'CALL sp_reporte_inventario_resumen(?, ?)',
            [fechaInicio, fechaFin]
        );
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener el resumen de inventario en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const reporteInventarioDetalleModel = async (fechaInicio, fechaFin) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute(
            'CALL sp_reporte_inventario_detalle(?, ?)',
            [fechaInicio, fechaFin]
        );
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener el detalle de inventario en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};


const reporteCajaResumenModel = async (fechaInicio, fechaFin) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute(
            'CALL sp_reporte_caja_resumen(?, ?)',
            [fechaInicio, fechaFin]
        );
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener el resumen de caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const reporteCajaDetalleModel = async (fechaInicio, fechaFin) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute(
            'CALL sp_reporte_caja_detalle(?, ?)',
            [fechaInicio, fechaFin]
        );
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener el detalle de caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = {
    reporteVentasResumenModel,
    reporteVentasDetalleModel,
    reporteClientesResumenModel,
    reporteClientesDetalleModel,
    reporteInventarioResumenModel,
    reporteInventarioDetalleModel,
    reporteCajaResumenModel,
    reporteCajaDetalleModel
};