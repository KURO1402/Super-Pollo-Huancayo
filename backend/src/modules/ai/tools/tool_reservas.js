const toolReservas = {
    name: 'consultarReservas',
    description: `Consulta las reservaciones del restaurante.
Úsala cuando pregunten por: reservas del día, reservas pendientes,
cuántas personas vienen, reservas canceladas, historial de reservas,
qué mesas están reservadas, pagos de reservas, clientes con reserva.
Tipos disponibles:
- detalle: cada reserva con mesas asignadas, cliente y estado de pago
- resumen: totales del período (cuántas pendientes, completadas, canceladas)`,
    parameters: {
        type: 'OBJECT',
        properties: {
            fecha_inicio: {
                type: 'STRING',
                description: 'Fecha inicio en formato YYYY-MM-DD. "hoy" = fecha actual, "mañana" = fecha actual + 1.'
            },
            fecha_fin: {
                type: 'STRING',
                description: 'Fecha fin en formato YYYY-MM-DD.'
            },
            tipo: {
                type: 'STRING',
                enum: ['detalle', 'resumen'],
                description: 'detalle para ver cada reserva. resumen para totales y estadísticas del período.'
            },
            estado: {
                type: 'STRING',
                enum: ['pendiente', 'completado', 'cancelado'],
                description: 'Solo para tipo=detalle. Filtra por estado. Omitir para ver todas.'
            }
        },
        required: ['fecha_inicio', 'fecha_fin', 'tipo']
    }
};

module.exports = { toolReservas };
