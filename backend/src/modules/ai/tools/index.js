const { toolVentas, toolTopProductos, toolProductos, toolProductosInsumos } = require('./tools_ventas');
const { toolCaja } = require('./tool_caja');
const { toolInventario } = require('./tool_inventario');
const { toolReservas } = require('./tool_reservas');
const { toolGraficos } = require('./tool_graficos');
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

module.exports = { ALL_TOOLS };
