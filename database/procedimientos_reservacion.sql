USE super_pollo_hyo;
DROP PROCEDURE IF EXISTS sp_verificar_mesa_disponible;
DROP PROCEDURE IF EXISTS sp_bloquear_mesa;
DROP PROCEDURE IF EXISTS sp_obtener_estado_mesa;
DROP PROCEDURE IF EXISTS sp_obtener_mesa_por_id;
DROP PROCEDURE IF EXISTS sp_insertar_reservacion;
DROP PROCEDURE IF EXISTS sp_insertar_mesas_reservacion;
DROP PROCEDURE IF EXISTS sp_insertar_pago_reservacion;
DROP PROCEDURE IF EXISTS sp_obtener_reservacion_por_codigo;

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
    IN p_monto_total DECIMAL(5,2),
    IN p_monto_pagado DECIMAL(5,2),
    IN p_porcentaje_pago INT,
    IN p_id_transaccion VARCHAR(100),
    IN p_id_reservacion INT
)
BEGIN
    INSERT INTO pago_reservacion(
        monto_total,
        monto_pagado,
        porcentaje_pago,
        id_transaccion,
        fecha_pago,
        estado_pago,
        id_reservacion
    )
    VALUES (
        p_monto_total,
        p_monto_pagado,
        p_porcentaje_pago,
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
    SELECT id_reservacion, estado_reservacion
    FROM reservaciones
    WHERE codigo_reservacion = p_codigo;
END //

DELIMITER ;