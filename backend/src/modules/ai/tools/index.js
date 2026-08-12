const { toolVentas, toolTopProductos, toolProductos, toolProductosInsumos } = require('./tools_ventas');
const { toolCaja } = require('./tool_caja');
const { toolInventario } = require('./tool_inventario');
const { toolReservas } = require('./tool_reservas');
const { toolGraficos } = require('./tool_graficos');
const aiRepository = require('../ai_repository');
const chartBuilder = require('../charts/chart_builder');

const ALL_TOOLS = [
    toolVentas,
    toolTopProductos,
    toolProductos,
    toolProductosInsumos,
    toolCaja,
    toolInventario,
    toolReservas,
    toolGraficos
];

const TOOL_HANDLERS = {
    consultarVentas: aiRepository.obtenerResumenVentas,
    consultarTopProductos: aiRepository.obtenerTopProductosVendidos,
    consultarProductos: aiRepository.obtenerCatalogoProductos,
    consultarProductosConInsumos: aiRepository.obtenerProductosConInsumos,
    consultarCaja: aiRepository.obtenerResumenCaja,
    consultarInventario: aiRepository.obtenerEstadoInventario,
    consultarReservas: aiRepository.obtenerDetalleReservas,
    generarGrafico: chartBuilder.buildChart,
};

module.exports = { ALL_TOOLS, TOOL_HANDLERS };
