const toolGraficos = {
    name: 'generarGrafico',
    description: `Genera datos estructurados para mostrar gráficos visuales.
Úsala cuando el usuario pida: gráfico, grafica, chart, visualizar,
mostrar en gráfico, tendencia visual, comparativa visual, diagrama.
Tipos de gráfico disponibles:
- ventas_diarias: línea de ventas día a día (monto y cantidad)
- top_productos: barras con los productos más vendidos
- medios_pago: pie/dona con distribución de medios de pago
- stock_insumos: barras horizontales con nivel de stock por insumo
- reservas_diarias: barras de reservas por día con estados`,
    parameters: {
        type: 'OBJECT',
        properties: {
            tipo_grafico: {
                type: 'STRING',
                enum: ['ventas_diarias', 'top_productos', 'medios_pago', 'stock_insumos', 'reservas_diarias'],
                description: 'Tipo de gráfico a generar según lo que pida el usuario.'
            },
            fecha_inicio: {
                type: 'STRING',
                description: 'Fecha inicio YYYY-MM-DD. No aplica para stock_insumos.'
            },
            fecha_fin: {
                type: 'STRING',
                description: 'Fecha fin YYYY-MM-DD. No aplica para stock_insumos.'
            },
            limite: {
                type: 'NUMBER',
                description: 'Solo para top_productos. Cuántos productos mostrar. Default 10.'
            }
        },
        required: ['tipo_grafico']
    }
};

module.exports = { toolGraficos };
