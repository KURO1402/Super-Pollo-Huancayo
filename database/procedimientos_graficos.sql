USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_resumen_ventas_egresos_mensual;
DROP PROCEDURE IF EXISTS sp_ventas_hoy_comparacion;
DROP PROCEDURE IF EXISTS sp_reservas_mes_comparacion;
DROP PROCEDURE IF EXISTS sp_balance_general_anual;
DROP PROCEDURE IF EXISTS sp_porcentaje_medios_pago;
DROP PROCEDURE IF EXISTS sp_ventas_por_mes;
DROP PROCEDURE IF EXISTS sp_top_productos_mas_vendidos;

DELIMITER //

CREATE PROCEDURE sp_resumen_ventas_egresos_mensual(
    IN p_cantidad_meses INT
)
BEGIN
    SET lc_time_names = 'es_PE';

    SELECT 
        DATE_FORMAT(cal.periodo, '%b %Y') AS mes,
        COALESCE(mc.total_ingresos_caja, 0) + COALESCE(pr.total_reservaciones, 0) AS ingresos,
        COALESCE(mc.total_egresos_caja, 0) AS egresos
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

    -- Solo movimientos de caja (sin ventas)
    LEFT JOIN (
        SELECT 
            DATE_FORMAT(fecha_movimiento, '%Y-%m-01') AS periodo,
            SUM(CASE WHEN tipo_movimiento = 'ingreso' THEN monto_movimiento ELSE 0 END) AS total_ingresos_caja,
            SUM(CASE WHEN tipo_movimiento = 'egreso'  THEN monto_movimiento ELSE 0 END) AS total_egresos_caja
        FROM movimientos_caja
        GROUP BY DATE_FORMAT(fecha_movimiento, '%Y-%m-01')
    ) AS mc ON mc.periodo = cal.periodo

    -- Pagos de reservación solo confirmados
    LEFT JOIN (
        SELECT 
            DATE_FORMAT(fecha_pago, '%Y-%m-01') AS periodo,
            SUM(monto_pagado) AS total_reservaciones
        FROM pago_reservacion
        WHERE estado_pago = 'confirmado'
        GROUP BY DATE_FORMAT(fecha_pago, '%Y-%m-01')
    ) AS pr ON pr.periodo = cal.periodo

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

CREATE PROCEDURE sp_reservas_mes_comparacion()
BEGIN
    DECLARE v_mes_actual INT;
    DECLARE v_mes_anterior INT;
    DECLARE v_porcentaje DECIMAL(10,2);

    -- Reservas completadas del mes actual
    SELECT COUNT(*) INTO v_mes_actual
    FROM reservaciones
    WHERE MONTH(fecha_creacion) = MONTH(CURDATE())
      AND YEAR(fecha_creacion) = YEAR(CURDATE())
      AND estado_reservacion = 'completado';

    -- Reservas completadas del mes anterior
    SELECT COUNT(*) INTO v_mes_anterior
    FROM reservaciones
    WHERE MONTH(fecha_creacion) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      AND YEAR(fecha_creacion) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      AND estado_reservacion = 'completado';

    -- Porcentaje de comparación
    SET v_porcentaje = CASE
        WHEN v_mes_anterior = 0 AND v_mes_actual = 0 THEN 0
        WHEN v_mes_anterior = 0 THEN 100
        ELSE ROUND(((v_mes_actual - v_mes_anterior) / v_mes_anterior) * 100, 2)
    END;

    SELECT
        v_mes_actual    AS total_reservas_mes,
        v_mes_anterior  AS total_reservas_mes_anterior,
        v_porcentaje    AS porcentaje_comparacion;
END //

CREATE PROCEDURE sp_balance_general_anual()
BEGIN
    DECLARE v_ingresos_ventas      DECIMAL(10,2) DEFAULT 0;
    DECLARE v_ingresos_movimientos DECIMAL(10,2) DEFAULT 0;
    DECLARE v_ingresos_reservas    DECIMAL(10,2) DEFAULT 0;
    DECLARE v_egresos              DECIMAL(10,2) DEFAULT 0;
    DECLARE v_ingresos_totales     DECIMAL(10,2);
    DECLARE v_egresos_totales      DECIMAL(10,2);
    DECLARE v_ganancia_neta        DECIMAL(10,2);

    -- Ingresos por ventas del año actual
    SELECT COALESCE(SUM(total_venta), 0) INTO v_ingresos_ventas
    FROM ventas
    WHERE YEAR(fecha_registro) = YEAR(CURDATE());

    -- Ingresos por movimientos de caja del año actual
    SELECT COALESCE(SUM(monto_movimiento), 0) INTO v_ingresos_movimientos
    FROM movimientos_caja
    WHERE tipo_movimiento = 'ingreso'
      AND YEAR(fecha_movimiento) = YEAR(CURDATE());

    -- Ingresos por pagos de reservaciones confirmados del año actual
    SELECT COALESCE(SUM(pr.monto_pagado), 0) INTO v_ingresos_reservas
    FROM pago_reservacion pr
    WHERE pr.estado_pago = 'confirmado'
      AND YEAR(pr.fecha_pago) = YEAR(CURDATE());

    -- Egresos por movimientos de caja del año actual
    SELECT COALESCE(SUM(monto_movimiento), 0) INTO v_egresos
    FROM movimientos_caja
    WHERE tipo_movimiento = 'egreso'
      AND YEAR(fecha_movimiento) = YEAR(CURDATE());

    SET v_ingresos_totales = v_ingresos_ventas + v_ingresos_movimientos + v_ingresos_reservas;
    SET v_egresos_totales  = v_egresos;
    SET v_ganancia_neta    = v_ingresos_totales - v_egresos_totales;

    SELECT
        YEAR(CURDATE()) AS anio,
        ROUND(v_ingresos_totales, 2) AS ingresos_totales,
        ROUND(v_egresos_totales,  2) AS egresos_totales,
        ROUND(v_ganancia_neta,    2) AS ganancia_neta;
END //

CREATE PROCEDURE sp_porcentaje_medios_pago()
BEGIN
    DECLARE v_total DECIMAL(10,2);

    SELECT SUM(total_venta) INTO v_total
    FROM ventas
    WHERE YEAR(fecha_registro) = YEAR(CURDATE());

    SELECT
        YEAR(CURDATE()) AS anio,
        mp.nombre_medio_pago AS nombre_medio_pago,
        ROUND(SUM(v.total_venta), 2) AS total,
        ROUND((SUM(v.total_venta) / v_total) * 100, 2) AS porcentaje
    FROM ventas v
    INNER JOIN medio_pago mp ON v.id_medio_pago = mp.id_medio_pago
    WHERE YEAR(v.fecha_registro) = YEAR(CURDATE())
    GROUP BY mp.id_medio_pago, mp.nombre_medio_pago
    ORDER BY porcentaje DESC;
END //

CREATE PROCEDURE sp_ventas_por_mes(IN p_cantidad_meses INT)
BEGIN
    DECLARE v_fecha_inicio DATE;
    SET v_fecha_inicio = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (p_cantidad_meses - 1) MONTH), '%Y-%m-01');
    SET lc_time_names = 'es_PE';

    SELECT
        DATE_FORMAT(cal.periodo, '%b %Y') AS mes,
        COALESCE(COUNT(v.id_venta), 0) AS total_ventas
    FROM (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m-01') AS periodo
        FROM (
            SELECT 0 AS seq UNION SELECT 1 UNION SELECT 2 UNION SELECT 3
            UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7
            UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11
        ) AS nums
        WHERE seq < p_cantidad_meses
    ) AS cal
    LEFT JOIN ventas v
        ON DATE_FORMAT(v.fecha_registro, '%Y-%m-01') = cal.periodo
    GROUP BY cal.periodo
    ORDER BY cal.periodo ASC;
END //

CREATE PROCEDURE sp_top_productos_mas_vendidos(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT
        p.nombre_producto       AS nombre_producto,
        SUM(dv.cantidad_producto) AS total_vendido
    FROM detalle_ventas dv
    INNER JOIN productos p ON dv.id_producto = p.id_producto
    INNER JOIN ventas v ON dv.id_venta = v.id_venta
    WHERE DATE(v.fecha_registro) BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY p.id_producto, p.nombre_producto
    ORDER BY total_vendido DESC
    LIMIT 10;
END //

DELIMITER ;