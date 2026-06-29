const { toolVentas, toolTopProductos, toolProductos, toolProductosInsumos } = require('./tools_ventas');
const { toolCaja } = require('./tool_caja');
const { toolInventario } = require('./tool_inventario');
const { toolReservas } = require('./tool_reservas');
const { toolGraficos } = require('./tool_graficos');
const aiModel = require('../ai_model');
const chartBuilder = require('../charts/chart_builder');

// Array completo que se le pasa a Gemini en cada llamada
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
    consultarVentas: aiModel.obtenerResumenVentas,
    consultarTopProductos: aiModel.obtenerTopProductosVendidos,
    consultarProductos: aiModel.obtenerCatalogoProductos,
    consultarProductosConInsumos: aiModel.obtenerProductosConInsumos,
    consultarCaja: aiModel.obtenerResumenCaja,
    consultarInventario: aiModel.obtenerEstadoInventario,
    consultarReservas: aiModel.obtenerDetalleReservas,
    generarGrafico: chartBuilder.buildChart,
};

module.exports = { ALL_TOOLS, TOOL_HANDLERS };
