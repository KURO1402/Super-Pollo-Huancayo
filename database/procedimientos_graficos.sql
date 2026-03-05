USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_resumen_ventas_egresos_mensual;

DELIMITER //

CREATE PROCEDURE sp_resumen_ventas_egresos_mensual(
    IN p_cantidad_meses INT
)
BEGIN
    SELECT 
        DATE_FORMAT(periodo, '%b %Y') AS mes,
        COALESCE(ingresos, 0) AS ingresos,
        COALESCE(egresos, 0) AS egresos
    FROM (
        SELECT 
            DATE_FORMAT(v.fecha_registro, '%Y-%m-01') AS periodo,
            SUM(v.total_venta) AS ingresos,
            0 AS egresos
        FROM ventas v
        WHERE v.fecha_registro >= DATE_FORMAT(
            DATE_SUB(CURDATE(), INTERVAL (p_cantidad_meses - 1) MONTH), '%Y-%m-01'
        )
        GROUP BY DATE_FORMAT(v.fecha_registro, '%Y-%m-01')

        UNION ALL

        SELECT 
            DATE_FORMAT(mc.fecha_movimiento, '%Y-%m-01') AS periodo,
            0 AS ingresos,
            SUM(mc.monto_movimiento) AS egresos
        FROM movimientos_caja mc
        WHERE mc.tipo_movimiento = 'egreso'
          AND mc.fecha_movimiento >= DATE_FORMAT(
            DATE_SUB(CURDATE(), INTERVAL (p_cantidad_meses - 1) MONTH), '%Y-%m-01'
        )
        GROUP BY DATE_FORMAT(mc.fecha_movimiento, '%Y-%m-01')
    ) AS combinado
    GROUP BY periodo
    ORDER BY periodo ASC;
END //

DELIMITER ;