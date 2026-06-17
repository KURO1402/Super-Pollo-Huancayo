const toolVentas = {
    name: 'consultarVentas',
    description: `Consulta información de ventas del restaurante.
Úsala cuando el usuario pregunte por: ventas, ingresos, montos, 
comprobantes, ticket promedio, IGV, medios de pago, o comparaciones 
de ventas en un período. Para resumen usa tipo 'resumen', 
para ver cada venta individual usa tipo 'detalle'.`,
    parameters: {
        type: 'OBJECT',
        properties: {
            fecha_inicio: {
                type: 'STRING',
                description: 'Fecha de inicio en formato YYYY-MM-DD. Si el usuario dice "hoy" usa la fecha actual, "esta semana" el lunes de la semana.'
            },
            fecha_fin: {
                type: 'STRING',
                description: 'Fecha de fin en formato YYYY-MM-DD. Si el usuario dice "hoy" usa la fecha actual.'
            },
            tipo: {
                type: 'STRING',
                enum: ['resumen', 'detalle'],
                description: 'resumen para KPIs y totales. detalle para ver cada venta con su comprobante.'
            }
        },
        required: ['fecha_inicio', 'fecha_fin', 'tipo']
    }
};

const toolTopProductos = {
    name: 'consultarTopProductos',
    description: `Consulta el ranking de productos más vendidos en un período.
Úsala cuando pregunten por: top productos, más vendidos, productos populares, 
qué se vende más, ranking de ventas por producto.`,
    parameters: {
        type: 'OBJECT',
        properties: {
            fecha_inicio: {
                type: 'STRING',
                description: 'Fecha de inicio en formato YYYY-MM-DD.'
            },
            fecha_fin: {
                type: 'STRING',
                description: 'Fecha de fin en formato YYYY-MM-DD.'
            }
        },
        required: ['fecha_inicio', 'fecha_fin']
    }
};

const toolProductos = {
    name: 'consultarProductos',
    description: `Consulta el catálogo de productos activos del restaurante.
Úsala cuando pregunten por: productos disponibles, carta, precios, 
categorías, qué se ofrece, buscar un producto específico.`,
    parameters: {
        type: 'OBJECT',
        properties: {
            id_categoria: {
                type: 'NUMBER',
                description: 'ID de categoría para filtrar. Omitir o enviar null para traer todos.'
            },
            nombre: {
                type: 'STRING',
                description: 'Nombre o parte del nombre a buscar. Omitir para traer todos.'
            }
        },
        required: []
    }
};

const toolProductosInsumos = {
    name: 'consultarProductosConInsumos',
    description: `Consulta los productos que usan insumos, con sus ingredientes, 
cantidades de uso y nivel de stock actual.
Úsala cuando pregunten por: insumos de un producto, ingredientes, 
qué productos tienen stock bajo, disponibilidad de insumos.`,
    parameters: {
        type: 'OBJECT',
        properties: {
            id_producto: {
                type: 'NUMBER',
                description: 'ID del producto específico. Omitir para consultar todos los productos con insumos.'
            }
        },
        required: []
    }
};

module.exports = { toolVentas, toolTopProductos, toolProductos, toolProductosInsumos };