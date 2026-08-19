const pool = require('../../../config/conexion_DB');

async function buildChart({ tipo_grafico, fecha_inicio, fecha_fin, limite }) {
    switch (tipo_grafico) {

        case 'ventas_diarias': {
            const [rows] = await pool.query(
                'CALL sp_reporte_ventas_resumen(?, ?)',
                [fecha_inicio, fecha_fin]
            );
            return {
                __tipo: 'grafico',
                chart: {
                    type: 'bar',
                    titulo: `Monto por Medio de Pago del ${fecha_inicio} al ${fecha_fin}`,
                    data: rows[0]
                }
            };
        }

        case 'top_productos': {
            const [rows] = await pool.query(
                'CALL sp_ia_top_productos_vendidos(?, ?)',
                [fecha_inicio, fecha_fin]
            );
            return {
                __tipo: 'grafico',
                chart: {
                    type: 'bar',
                    titulo: `Top Productos más vendidos (${fecha_inicio} al ${fecha_fin})`,
                    data: rows[0]
                }
            };
        }

        case 'medios_pago': {
            const [rows] = await pool.query(
                'CALL sp_reporte_ventas_resumen(?, ?)',
                [fecha_inicio, fecha_fin]
            );
            return {
                __tipo: 'grafico',
                chart: {
                    type: 'pie',
                    titulo: `Distribución por Medios de Pago`,
                    data: rows[0] 
                }
            };
        }

        case 'stock_insumos': {
            const [rows] = await pool.query('CALL sp_ia_inventario_estado(?)', [null]);
            
            const dataFormateada = rows[0].map(r => ({
                name: `${r.nombre_insumo} (${r.unidad_medida})`,
                stock: r.stock_insumo,
                nivel: r.nivel_stock
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
            const [rows] = await pool.query(
                'CALL sp_ia_reservas_resumen(?, ?)',
                [fecha_inicio, fecha_fin]
            );
            
            return {
                __tipo: 'grafico',
                chart: {
                    type: 'summary-bar',
                    titulo: `Resumen de Reservas del ${fecha_inicio} al ${fecha_fin}`,
                    data: rows[0] 
                }
            };
        }

        default:
            return { error: 'Tipo de gráfico no reconocido por el sistema de IA.' };
    }
}

module.exports = { buildChart };