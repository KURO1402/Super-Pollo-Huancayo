// ai/ai_model.js
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

// ── VENTAS 
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

// ── CAJA
const obtenerResumenCaja = (fechaInicio, fechaFin) =>
    _ejecutar('sp_ia_caja_resumen', [fechaInicio, fechaFin]);

const obtenerMovimientosCaja = (fechaInicio, fechaFin, tipoMovimiento = null) =>
    _ejecutar('sp_ia_caja_movimientos', [fechaInicio, fechaFin, tipoMovimiento]);

const obtenerArqueosCaja = (fechaInicio, fechaFin) =>
    _ejecutar('sp_ia_caja_arqueos', [fechaInicio, fechaFin]);

// ── INVENTARIO 
const obtenerEstadoInventario = (nivelStock = null) =>
    _ejecutar('sp_ia_inventario_estado', [nivelStock]);

const obtenerMovimientosInventario = (fechaInicio, fechaFin, idInsumo = null) =>
    _ejecutar('sp_ia_inventario_movimientos', [fechaInicio, fechaFin, idInsumo]);

// ── RESERVAS 
const obtenerDetalleReservas = (fechaInicio, fechaFin, estado = null) =>
    _ejecutar('sp_ia_reservas', [fechaInicio, fechaFin, estado]);

const obtenerResumenReservas = (fechaInicio, fechaFin) =>
    _ejecutar('sp_ia_reservas_resumen', [fechaInicio, fechaFin]);

module.exports = {
    obtenerResumenVentas,
    obtenerDetalleVentas,
    obtenerTopProductosVendidos,
    obtenerCatalogoProductos,
    obtenerProductosConInsumos,
    obtenerResumenCaja,
    obtenerMovimientosCaja,
    obtenerArqueosCaja,
    obtenerEstadoInventario,
    obtenerMovimientosInventario,
    obtenerDetalleReservas,
    obtenerResumenReservas,
};