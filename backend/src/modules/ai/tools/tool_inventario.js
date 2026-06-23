const toolInventario = {
    name: 'consultarInventario',
    description: `Consulta el estado del inventario e insumos del restaurante.
Úsala cuando pregunten por: stock de insumos, ingredientes disponibles,
insumos con stock bajo o crítico, qué insumos se están acabando,
movimientos de inventario, entradas o salidas de insumos,
historial de stock de un insumo específico.
Tipos disponibles:
- estado: stock actual de todos los insumos con nivel de alerta
- movimientos: historial de entradas y salidas de insumos`,
    parameters: {
        type: 'OBJECT',
        properties: {
            tipo: {
                type: 'STRING',
                enum: ['estado', 'movimientos'],
                description: 'estado para ver stock actual. movimientos para ver historial de entradas/salidas.'
            },
            nivel_stock: {
                type: 'STRING',
                enum: ['critico', 'bajo', 'normal'],
                description: 'Solo para tipo=estado. Filtra por nivel de alerta. Omitir para ver todos.'
            },
            fecha_inicio: {
                type: 'STRING',
                description: 'Solo para tipo=movimientos. Fecha inicio YYYY-MM-DD.'
            },
            fecha_fin: {
                type: 'STRING',
                description: 'Solo para tipo=movimientos. Fecha fin YYYY-MM-DD.'
            },
            id_insumo: {
                type: 'NUMBER',
                description: 'Solo para tipo=movimientos. ID de insumo específico. Omitir para todos.'
            }
        },
        required: ['tipo']
    }
};

module.exports = { toolInventario };
