const { ejecutarSP } = require('../../utilidades/helpers/db_helper');

const obtenerResumenVentas = (fechaInicio, fechaFin) =>
    ejecutarSP('sp_ia_ventas_resumen', [fechaInicio, fechaFin]).then(rows => rows[0]);

const obtenerDetalleVentas = (fechaInicio, fechaFin) =>
    ejecutarSP('sp_ia_ventas_detalle', [fechaInicio, fechaFin]).then(rows => rows[0]);

const obtenerTopProductosVendidos = (fechaInicio, fechaFin) =>
    ejecutarSP('sp_ia_top_productos_vendidos', [fechaInicio, fechaFin]).then(rows => rows[0]);

const obtenerCatalogoProductos = (idCategoria = null, nombre = null) =>
    ejecutarSP('sp_ia_productos_catalogo', [idCategoria, nombre]).then(rows => rows[0]);

const obtenerProductosConInsumos = (idProducto = null) =>
    ejecutarSP('sp_ia_productos_con_insumos', [idProducto]).then(rows => rows[0]);

const obtenerVentasPorMedioPago = (fechaInicio, fechaFin) =>
    ejecutarSP('sp_ia_ventas_por_medio_pago', [fechaInicio, fechaFin]).then(rows => rows[0]);

const obtenerResumenCaja = (fechaInicio, fechaFin) =>
    ejecutarSP('sp_ia_caja_resumen', [fechaInicio, fechaFin]).then(rows => rows[0]);

const obtenerMovimientosCaja = (fechaInicio, fechaFin, tipoMovimiento = null) =>
    ejecutarSP('sp_ia_caja_movimientos', [fechaInicio, fechaFin, tipoMovimiento]).then(rows => rows[0]);

const obtenerArqueosCaja = (fechaInicio, fechaFin) =>
    ejecutarSP('sp_ia_caja_arqueos', [fechaInicio, fechaFin]).then(rows => rows[0]);

const obtenerEstadoInventario = (nivelStock = null) =>
    ejecutarSP('sp_ia_inventario_estado', [nivelStock]).then(rows => rows[0]);

const obtenerMovimientosInventario = (fechaInicio, fechaFin, idInsumo = null) =>
    ejecutarSP('sp_ia_inventario_movimientos', [fechaInicio, fechaFin, idInsumo]).then(rows => rows[0]);
 
const obtenerDetalleReservas = (fechaInicio, fechaFin, estado = null) =>
    ejecutarSP('sp_ia_reservas', [fechaInicio, fechaFin, estado]).then(rows => rows[0]);

const obtenerResumenReservas = (fechaInicio, fechaFin) =>
    ejecutarSP('sp_ia_reservas_resumen', [fechaInicio, fechaFin]).then(rows => rows[0]);

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
    obtenerVentasPorMedioPago,
};