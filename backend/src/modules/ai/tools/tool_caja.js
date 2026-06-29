const toolCaja = {
    name: 'consultarCaja',
    description: `Consulta información de caja del restaurante.
Úsala cuando el usuario pregunte por: caja del día, saldo de caja, 
apertura o cierre de caja, ingresos y egresos, balance de caja, 
cuánto hay en caja, movimientos de dinero. 
Tipos disponibles:
- resumen: estado general de la(s) caja(s) con totales de ingresos/egresos
- movimientos: cada movimiento individual (ingresos o egresos)
- arqueos: revisiones físicas del dinero con diferencias`,
    parameters: {
        type: 'OBJECT',
        properties: {
            fecha_inicio: {
                type: 'STRING',
                description: 'Fecha inicio en formato YYYY-MM-DD. "hoy" = fecha actual.'
            },
            fecha_fin: {
                type: 'STRING',
                description: 'Fecha fin en formato YYYY-MM-DD. "hoy" = fecha actual.'
            },
            tipo: {
                type: 'STRING',
                enum: ['resumen', 'movimientos', 'arqueos'],
                description: 'resumen para balance general. movimientos para cada transacción. arqueos para revisiones físicas.'
            },
            tipo_movimiento: {
                type: 'STRING',
                enum: ['ingreso', 'egreso'],
                description: 'Solo para tipo=movimientos. Filtra por ingreso o egreso. Omitir para ver ambos.'
            }
        },
        required: ['fecha_inicio', 'fecha_fin', 'tipo']
    }
};

module.exports = { toolCaja };
