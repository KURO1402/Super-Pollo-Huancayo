// ai/charts/chart_builder.js
// Llama al SP correspondiente y retorna un objeto JSON listo
// para que el frontend lo renderice nativamente con Recharts.
// Estructura de retorno: { __tipo: 'grafico', chart: { type, titulo, data } }

const pool = require('../../../config/conexion_DB');

async function buildChart({ tipo_grafico, fecha_inicio, fecha_fin, limite }) {
    switch (tipo_grafico) {

        case 'ventas_diarias': {
            // Usamos sp_reporte_ventas_resumen o el detalle diario según corresponda.
            // sp_reporte_ventas_resumen agrupa por medio de pago en el rango.
            const [rows] = await pool.query(
                'CALL sp_reporte_ventas_resumen(?, ?)',
                [fecha_inicio, fecha_fin]
            );
            // Retorna un array con: total_ventas, monto_total, ticket_promedio, medio_pago_frecuente
            return {
                __tipo: 'grafico',
                chart: {
                    type: 'bar',
                    titulo: `Monto por Medio de Pago del ${fecha_inicio} al ${fecha_fin}`,
                    data: rows[0] // Recharts mapeará en el eje X "medio_pago_frecuente" y en el Y "monto_total"
                }
            };
        }

        case 'top_productos': {
            // Usamos tu procedimiento de IA real para el top 10
            const [rows] = await pool.query(
                'CALL sp_ia_top_productos_vendidos(?, ?)',
                [fecha_inicio, fecha_fin]
            );
            // Retorna: nombre_producto, nombre_categoria, unidades_vendidas, monto_generado
            return {
                __tipo: 'grafico',
                chart: {
                    type: 'bar',
                    titulo: `Top Productos más vendidos (${fecha_inicio} al ${fecha_fin})`,
                    data: rows[0] // Recharts usará "nombre_producto" y "unidades_vendidas"
                }
            };
        }

        case 'medios_pago': {
            // Tu sp_ia_ventas_resumen calcula datos globales, pero sp_reporte_ventas_resumen 
            // nos da el desglose perfecto por medio de pago para un gráfico de dona/torta.
            const [rows] = await pool.query(
                'CALL sp_reporte_ventas_resumen(?, ?)',
                [fecha_inicio, fecha_fin]
            );
            return {
                __tipo: 'grafico',
                chart: {
                    type: 'pie',
                    titulo: `Distribución por Medios de Pago`,
                    data: rows[0] // Recharts usará "medio_pago_frecuente" y "cantidad_medio_pago"
                }
            };
        }

        case 'stock_insumos': {
            // Usamos tu SP real sp_ia_inventario_estado que clasifica por nivel_stock
            // Le pasamos NULL para que traiga TODOS los insumos activos
            const [rows] = await pool.query('CALL sp_ia_inventario_estado(?)', [null]);
            
            // Adaptamos ligeramente para que Recharts tenga nombres de llaves cómodos
            const dataFormateada = rows[0].map(r => ({
                name: `${r.nombre_insumo} (${r.unidad_medida})`,
                stock: r.stock_insumo,
                nivel: r.nivel_stock // 'critico', 'bajo', 'normal' -> Ideal para pintar la barra en el frontend
            }));

            return {
                __tipo: 'grafico',
                chart: {
                    type: 'horizontal-bar',
                    titulo: 'Stock Actual de Insumos en Cocina',
                    data: dataFormateada
                }
            };
        }

        case 'reservas_diarias': {
            // Usamos sp_ia_reservas para listar o sp_ia_reservas_resumen para los contadores
            // sp_ia_reservas_resumen devuelve los totales agregados del periodo
            const [rows] = await pool.query(
                'CALL sp_ia_reservas_resumen(?, ?)',
                [fecha_inicio, fecha_fin]
            );
            
            return {
                __tipo: 'grafico',
                chart: {
                    type: 'summary-bar',
                    titulo: `Resumen de Reservas del ${fecha_inicio} al ${fecha_fin}`,
                    data: rows[0] // Trae un único objeto con: pendientes, completadas, canceladas, total_personas
                }
            };
        }

        default:
            return { error: 'Tipo de gráfico no reconocido por el sistema de IA.' };
    }
}

module.exports = { buildChart };