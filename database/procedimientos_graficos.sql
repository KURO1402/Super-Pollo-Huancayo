USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_resumen_ventas_egresos_mensual;
DROP PROCEDURE IF EXISTS sp_ventas_hoy_comparacion;

DELIMITER //

CREATE PROCEDURE sp_resumen_ventas_egresos_mensual(
    IN p_cantidad_meses INT
)
BEGIN
    DECLARE v_fecha_inicio DATE;
    SET v_fecha_inicio = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (p_cantidad_meses - 1) MONTH), '%Y-%m-01');
    SET lc_time_names = 'es_PE';

    SELECT 
        DATE_FORMAT(cal.periodo, '%b %Y') AS mes,
        COALESCE(SUM(v.total_venta), 0) + COALESCE(SUM(CASE WHEN mc.tipo_movimiento = 'ingreso' THEN mc.monto_movimiento ELSE 0 END), 0) AS ingresos,
        COALESCE(SUM(CASE WHEN mc.tipo_movimiento = 'egreso' THEN mc.monto_movimiento ELSE 0 END), 0) AS egresos
    FROM (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m-01') AS periodo
        FROM (
            SELECT 0 AS seq UNION SELECT 1 UNION SELECT 2 UNION SELECT 3
            UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7
            UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11
            UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15
            UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19
            UNION SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23
        ) AS nums
        WHERE seq < p_cantidad_meses
    ) AS cal
    LEFT JOIN ventas v 
        ON DATE_FORMAT(v.fecha_registro, '%Y-%m-01') = cal.periodo
    LEFT JOIN movimientos_caja mc 
        ON DATE_FORMAT(mc.fecha_movimiento, '%Y-%m-01') = cal.periodo
    GROUP BY cal.periodo
    ORDER BY cal.periodo ASC;
END //

CREATE PROCEDURE sp_ventas_hoy_comparacion()
BEGIN
    DECLARE v_hoy INT;
    DECLARE v_ayer INT;
    DECLARE v_porcentaje DECIMAL(10,2);

    -- Cantidad de ventas hoy
    SELECT COUNT(*) INTO v_hoy
    FROM ventas
    WHERE DATE(fecha_registro) = CURDATE();

    -- Cantidad de ventas ayer
    SELECT COUNT(*) INTO v_ayer
    FROM ventas
    WHERE DATE(fecha_registro) = DATE_SUB(CURDATE(), INTERVAL 1 DAY);

    -- Porcentaje de comparación
    SET v_porcentaje = CASE
        WHEN v_ayer = 0 AND v_hoy = 0 THEN 0
        WHEN v_ayer = 0 THEN 100
        ELSE ROUND(((v_hoy - v_ayer) / v_ayer) * 100, 2)
    END;

    SELECT 
        v_hoy AS total_ventas_hoy,
        v_ayer AS total_ventas_ayer,
        v_porcentaje AS porcentaje_comparacion;
END //

DELIMITER ;