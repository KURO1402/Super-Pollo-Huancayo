USE super_pollo_hyo;
DROP PROCEDURE IF EXISTS sp_verificar_mesa_disponible;
DROP PROCEDURE IF EXISTS sp_bloquear_mesa;
DROP PROCEDURE IF EXISTS sp_obtener_estado_mesa;
DROP PROCEDURE IF EXISTS sp_obtener_mesa_por_id;
DROP PROCEDURE IF EXISTS sp_insertar_reservacion;
DROP PROCEDURE IF EXISTS sp_insertar_mesas_reservacion;
DROP PROCEDURE IF EXISTS sp_insertar_pago_reservacion;
DROP PROCEDURE IF EXISTS sp_obtener_reservacion_por_codigo;
DROP PROCEDURE IF EXISTS sp_confirmar_reservacion;
DROP PROCEDURE IF EXISTS sp_cancelar_reservacion;
DROP PROCEDURE IF EXISTS sp_obtener_estado_reservacion;
DROP PROCEDURE IF EXISTS sp_contar_reservacion_por_id;
DROP PROCEDURE IF EXISTS sp_obtener_mesas_por_id_reservacion;
DROP PROCEDURE IF EXISTS sp_listar_mesas_disponibilidad;
DROP PROCEDURE IF EXISTS sp_listar_reservaciones_por_rango;
DROP PROCEDURE IF EXISTS sp_listar_reservaciones_por_usuario;
DROP PROCEDURE IF EXISTS sp_obtener_reservacion_por_id;
DROP PROCEDURE IF EXISTS sp_obtener_pago_por_reservacion;


DELIMITER //

CREATE PROCEDURE sp_verificar_mesa_disponible(
    IN p_id_mesa INT,
    IN p_fecha_hora DATETIME,
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_conflictos INT DEFAULT 0;

    -- Limpiar bloqueos expirados
    DELETE FROM bloqueos_temporales_mesa
    WHERE expira_en < NOW();

    -- Verificar conflictos en reservaciones confirmadas
    SELECT COUNT(*) INTO v_conflictos
    FROM mesas_reservacion mr
    JOIN reservaciones r 
        ON mr.id_reservacion = r.id_reservacion
    WHERE mr.id_mesa = p_id_mesa
      AND p_fecha_hora BETWEEN mr.reserva_desde AND mr.reserva_hasta
      AND r.estado_reservacion <> 'cancelado';

    -- Verificar bloqueos temporales de CUALQUIER usuario incluido el mismo
    IF v_conflictos = 0 THEN
        SELECT COUNT(*) INTO v_conflictos
        FROM bloqueos_temporales_mesa
        WHERE id_mesa = p_id_mesa
          AND p_fecha_hora BETWEEN bloqueado_desde AND bloqueado_hasta
          AND expira_en > NOW();
          -- ← quitamos AND id_usuario <> p_id_usuario
    END IF;

    SELECT v_conflictos AS conflictos;
END //

CREATE PROCEDURE sp_bloquear_mesa(
    IN p_id_mesa INT,
    IN p_id_usuario INT,
    IN p_fecha_hora DATETIME
)
BEGIN
    DECLARE v_desde DATETIME;
    DECLARE v_hasta DATETIME;

    SET v_desde = DATE_SUB(p_fecha_hora, INTERVAL 89 MINUTE);
    SET v_hasta = DATE_ADD(p_fecha_hora, INTERVAL 89 MINUTE);

    INSERT INTO bloqueos_temporales_mesa(
        id_mesa,
        id_usuario,
        bloqueado_desde,
        bloqueado_hasta,
        expira_en
    )
    VALUES (
        p_id_mesa,
        p_id_usuario,
        v_desde,
        v_hasta,
        DATE_ADD(NOW(), INTERVAL 5 MINUTE)
    );
END //


CREATE PROCEDURE sp_obtener_mesa_por_id(
    IN p_id_mesa INT
)
BEGIN
    SELECT 
        id_mesa,
        numero_mesa,
        capacidad
    FROM mesas
    WHERE id_mesa = p_id_mesa;
END //

CREATE PROCEDURE sp_insertar_reservacion(
    IN p_fecha DATE,
    IN p_hora TIME,
    IN p_cantidad_personas INT,
    IN p_id_usuario INT,
    IN p_codigo_reservacion CHAR(6)  
)
BEGIN
    DELETE FROM bloqueos_temporales_mesa
    WHERE id_usuario = p_id_usuario;

    INSERT INTO reservaciones(
        fecha_reservacion,
        hora_reservacion,
        cantidad_personas,
        id_usuario,
        codigo_reservacion 
    )
    VALUES (
        p_fecha,
        p_hora,
        p_cantidad_personas,
        p_id_usuario,
        p_codigo_reservacion
    );

    SELECT LAST_INSERT_ID() AS id_reservacion;
END //

CREATE PROCEDURE sp_insertar_mesas_reservacion(
    IN p_id_reservacion INT,
    IN p_id_mesa INT,
    IN p_fecha_hora DATETIME
)
BEGIN
    DECLARE v_desde DATETIME;
    DECLARE v_hasta DATETIME;

    SET v_desde = DATE_SUB(p_fecha_hora, INTERVAL 89 MINUTE);
    SET v_hasta = DATE_ADD(p_fecha_hora, INTERVAL 89 MINUTE);

    INSERT INTO mesas_reservacion(
        id_mesa,
        id_reservacion,
        reserva_desde,
        reserva_hasta
    )
    VALUES (
        p_id_mesa,
        p_id_reservacion,
        v_desde,
        v_hasta
    );

END //

CREATE PROCEDURE sp_insertar_pago_reservacion(
    IN p_monto_pagado DECIMAL(5,2),
    IN p_id_transaccion VARCHAR(100),
    IN p_id_reservacion INT
)
BEGIN
    INSERT INTO pago_reservacion(
        monto_pagado,
        id_transaccion,
        fecha_pago,
        estado_pago,
        id_reservacion
    )
    VALUES (
        p_monto_pagado,
        p_id_transaccion,
        NOW(),
        'confirmado',
        p_id_reservacion
    );
END //

CREATE PROCEDURE sp_obtener_reservacion_por_codigo(
    IN p_codigo CHAR(6)
)
BEGIN
    SELECT 
        r.id_reservacion,
        DATE_FORMAT(r.fecha_reservacion, '%d-%m-%Y') AS fecha_reservacion,
        DATE_FORMAT(r.hora_reservacion, '%H:%i') AS hora_reservacion,
        r.cantidad_personas,
        r.estado_reservacion,
        COALESCE(CONCAT(u.nombre_usuario, ' ', u.apellido_usuario), '----') AS usuario
    FROM reservaciones r
    LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
    WHERE r.codigo_reservacion = p_codigo;
END //

CREATE PROCEDURE sp_confirmar_reservacion(
    IN p_id_reservacion INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE reservaciones
    SET estado_reservacion = 'completado'
    WHERE id_reservacion = p_id_reservacion;

    COMMIT;

    SELECT 'Reservación confirmada exitosamente' AS mensaje;
END //

CREATE PROCEDURE sp_cancelar_reservacion(
    IN p_id_reservacion INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE reservaciones
    SET estado_reservacion = 'cancelado'
    WHERE id_reservacion = p_id_reservacion;

    COMMIT;

    SELECT 'Reservación cancelada exitosamente' AS mensaje;
END //

CREATE PROCEDURE sp_obtener_estado_reservacion(
    IN p_id_reservacion INT
)
BEGIN
    SELECT estado_reservacion
    FROM reservaciones
    WHERE id_reservacion = p_id_reservacion;
END //

CREATE PROCEDURE sp_contar_reservacion_por_id(
    IN p_id_reservacion INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM reservaciones
    WHERE id_reservacion = p_id_reservacion;
END //

CREATE PROCEDURE sp_obtener_mesas_por_id_reservacion(
    IN p_id_reservacion INT
)
BEGIN
    SELECT m.numero_mesa
    FROM mesas_reservacion mr
    INNER JOIN mesas m ON mr.id_mesa = m.id_mesa
    WHERE mr.id_reservacion = p_id_reservacion;
END //

CREATE PROCEDURE sp_listar_mesas_disponibilidad(
    IN p_fecha_hora DATETIME
)
BEGIN
    DELETE FROM bloqueos_temporales_mesa
    WHERE expira_en < NOW();

    SELECT 
        m.id_mesa,
        m.numero_mesa,
        m.capacidad,
        CASE
            WHEN EXISTS (
                SELECT 1 FROM mesas_reservacion mr
                INNER JOIN reservaciones r ON mr.id_reservacion = r.id_reservacion
                WHERE mr.id_mesa = m.id_mesa
                  AND p_fecha_hora BETWEEN mr.reserva_desde AND mr.reserva_hasta
                  AND r.estado_reservacion <> 'cancelado'
            ) THEN 'no disponible'
            WHEN EXISTS (
                SELECT 1 FROM bloqueos_temporales_mesa b
                WHERE b.id_mesa = m.id_mesa
                  AND p_fecha_hora BETWEEN b.bloqueado_desde AND b.bloqueado_hasta
                  AND b.expira_en > NOW()
            ) THEN 'no disponible'
            ELSE 'disponible'
        END AS estado
    FROM mesas m
    ORDER BY m.numero_mesa;
END //

CREATE PROCEDURE sp_listar_reservaciones_por_rango(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT
        r.id_reservacion,
        DATE_FORMAT(r.fecha_reservacion, '%d-%m-%Y') AS fecha_reservacion,
        DATE_FORMAT(r.hora_reservacion, '%H:%i') AS hora_reservacion,
        r.estado_reservacion
    FROM reservaciones r
    WHERE r.fecha_reservacion BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY r.fecha_reservacion ASC, r.hora_reservacion ASC;
END //

CREATE PROCEDURE sp_listar_reservaciones_por_usuario(
    IN p_id_usuario INT
)
BEGIN
    SELECT
        r.id_reservacion,
        r.codigo_reservacion,
        DATE_FORMAT(r.fecha_reservacion, '%d-%m-%Y') AS fecha_reservacion,
        DATE_FORMAT(r.hora_reservacion, '%H:%i') AS hora_reservacion,
        r.cantidad_personas,
        r.estado_reservacion,
        DATE_FORMAT(r.fecha_creacion, '%d-%m-%Y %H:%i') AS fecha_creacion,
        GROUP_CONCAT(
            CONCAT(m.numero_mesa, ':', m.capacidad)
            ORDER BY m.numero_mesa SEPARATOR ','
        ) AS mesas_reservadas,
        pr.estado_pago,
        pr.monto_pagado,
        pr.id_transaccion,
        DATE_FORMAT(pr.fecha_pago, '%d-%m-%Y %H:%i') AS fecha_pago
    FROM reservaciones r
    LEFT JOIN mesas_reservacion mr ON r.id_reservacion = mr.id_reservacion
    LEFT JOIN mesas m ON mr.id_mesa = m.id_mesa
    LEFT JOIN pago_reservacion pr ON pr.id_pago = (
        SELECT id_pago FROM pago_reservacion
        WHERE id_reservacion = r.id_reservacion
        ORDER BY fecha_pago DESC
        LIMIT 1
    )
    WHERE r.id_usuario = p_id_usuario
    GROUP BY
        r.id_reservacion,
        r.codigo_reservacion,
        r.fecha_reservacion,
        r.hora_reservacion,
        r.cantidad_personas,
        r.estado_reservacion,
        r.fecha_creacion,
        pr.estado_pago,
        pr.monto_pagado,
        pr.id_transaccion,
        pr.fecha_pago
    ORDER BY r.fecha_reservacion ASC, r.hora_reservacion ASC;
END //


CREATE PROCEDURE sp_obtener_reservacion_por_id(
    IN p_id_reservacion INT
)
BEGIN
    SELECT
        r.id_reservacion,
        DATE_FORMAT(r.fecha_reservacion, '%d-%m-%Y') AS fecha_reservacion,
        DATE_FORMAT(r.hora_reservacion, '%H:%i') AS hora_reservacion,
        r.cantidad_personas,
        r.estado_reservacion,
        r.codigo_reservacion,
        r.fecha_creacion,
        r.id_usuario,
        COALESCE(CONCAT(u.nombre_usuario, ' ', u.apellido_usuario), '----') AS nombre_completo
    FROM reservaciones r
    LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
    WHERE r.id_reservacion = p_id_reservacion;
END //

CREATE PROCEDURE sp_obtener_pago_por_reservacion(
    IN p_id_reservacion INT
)
BEGIN
    SELECT
        id_pago,
        monto_pagado,
        DATE_FORMAT(fecha_pago, '%d-%m-%Y %H:%i:%s') AS fecha_hora_pago,
        estado_pago
    FROM pago_reservacion
    WHERE id_reservacion = p_id_reservacion;
END //

DELIMITER ;