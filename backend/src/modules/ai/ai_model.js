const pool = require('../../config/conexion_DB');

const _ejecutar = async (sp, params) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const placeholders = params.map(() => '?').join(', ');
        const [rows] = await conexion.execute(`CALL ${sp}(${placeholders})`, params);
        return rows[0];
    } catch (err) {
        throw new Error(`Error en ${sp}: ${err.message}`);
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerResumenVentas = (fechaInicio, fechaFin) =>
    _ejecutar('sp_ia_ventas_resumen', [fechaInicio, fechaFin]);

const obtenerDetalleVentas = (fechaInicio, fechaFin) =>
    _ejecutar('sp_ia_ventas_detalle', [fechaInicio, fechaFin]);

const obtenerTopProductosVendidos = (fechaInicio, fechaFin) =>
    _ejecutar('sp_ia_top_productos_vendidos', [fechaInicio, fechaFin]);

const obtenerCatalogoProductos = (idCategoria = null, nombre = null) =>
    _ejecutar('sp_ia_productos_catalogo', [idCategoria, nombre]);

const obtenerProductosConInsumos = (idProducto = null) =>
    _ejecutar('sp_ia_productos_con_insumos', [idProducto]);

module.exports = {
    obtenerResumenVentas,
    obtenerDetalleVentas,
    obtenerTopProductosVendidos,
    obtenerCatalogoProductos,
    obtenerProductosConInsumos,
};