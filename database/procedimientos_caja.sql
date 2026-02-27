USE super_pollo_hyo;

/* ELIMINAR PROCEDIMIENTOS ALMACENADOS DEL MODULO DE CAJA SI YA EXISTEN */
DROP PROCEDURE IF EXISTS sp_crear_caja_con_evento;
DROP PROCEDURE IF EXISTS sp_cerrar_caja_registrar_evento;
DROP PROCEDURE IF EXISTS sp_consultar_caja_abierta;
DROP PROCEDURE IF EXISTS sp_registrar_ingreso_caja;
DROP PROCEDURE IF EXISTS sp_registrar_egreso_caja;
DROP PROCEDURE IF EXISTS sp_registrar_arqueo_caja;
DROP PROCEDURE IF EXISTS sp_obtener_movimientos_por_caja;
DROP PROCEDURE IF EXISTS sp_contar_movimientos_por_caja;
DROP PROCEDURE IF EXISTS sp_contar_cajas;
DROP PROCEDURE IF EXISTS sp_listar_cajas;
DROP PROCEDURE IF EXISTS sp_obtener_arqueos_por_caja;

/* CREAR PROCEDIMIENTOS ALMACENADOS DEL MODULO DE CAJA */
DELIMITER //

-- Procedimiento de apertura de caja con evento de apertura
CREATE PROCEDURE sp_crear_caja_con_evento(
    IN p_saldo_inicial DECIMAL(10,2),
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_id_caja INT;
    DECLARE v_fecha_actual DATETIME;

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Validar que no exista una caja abierta
    IF EXISTS (SELECT 1 FROM caja WHERE estado_caja = 'abierta') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ya existe una caja abierta. No se puede crear otra.';
    END IF;

    SET v_fecha_actual = NOW();

    START TRANSACTION;

    -- Crear caja
    INSERT INTO caja (saldo_inicial, monto_actual, saldo_final, fecha_caja, estado_caja)
    VALUES (p_saldo_inicial, p_saldo_inicial, NULL, v_fecha_actual, 'abierta');

    SET v_id_caja = LAST_INSERT_ID();

    -- Evento apertura
    INSERT INTO eventos_caja (tipo_evento, fecha_evento, id_caja, id_usuario)
    VALUES ('apertura', v_fecha_actual, v_id_caja, p_id_usuario);

    -- Movimiento inicial
    INSERT INTO movimientos_caja (
        tipo_movimiento,
        fecha_movimiento,
        monto_movimiento,
        descripcion_mov_caja,
        id_caja,
        id_usuario
    )
    VALUES (
        'ingreso',
        v_fecha_actual,
        p_saldo_inicial,
        'Saldo inicial de apertura',
        v_id_caja,
        p_id_usuario
    );

    COMMIT;

    SELECT
        c.id_caja,
        c.saldo_inicial,
        c.monto_actual,
        IFNULL(c.saldo_final, '--') AS saldo_final,
        DATE_FORMAT(c.fecha_caja, '%d-%m-%Y') AS fecha_caja,
        DATE_FORMAT(c.fecha_caja, '%H:%i:%s') AS hora_caja,
        c.estado_caja
    FROM caja c
    WHERE c.id_caja = v_id_caja;
END //

-- Procedimiento de cierre de caja con evento de cierre
CREATE PROCEDURE sp_cerrar_caja_registrar_evento(
    IN p_id_caja INT,
    IN p_id_usuario INT,
    IN p_saldo_final DECIMAL(10,2)
)
BEGIN
    DECLARE v_fecha_actual DATETIME;
    -- Manejo de errores: rollback automático si algo falla
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET v_fecha_actual = NOW();

    -- Iniciar transacción
    START TRANSACTION;
    
    -- Cerrar la caja (actualizar saldo_final y estado)
    UPDATE caja
    SET saldo_final = p_saldo_final, 
        estado_caja = 'cerrada'
    WHERE id_caja = p_id_caja;
    
    -- Registrar el evento de cierre
    INSERT INTO eventos_caja (tipo_evento, fecha_evento, id_caja, id_usuario)
    VALUES ('cierre', v_fecha_actual, p_id_caja, p_id_usuario);
    
    -- Confirmar transacción
    COMMIT;

    SELECT 'Caja cerrada correctamente' AS mensaje;
END //

-- Procedimiento de consultar caja abierta
CREATE PROCEDURE sp_consultar_caja_abierta()
BEGIN
    -- Buscar caja con estado "abierta"
    SELECT 
        id_caja,
        monto_actual
    FROM caja
    WHERE estado_caja = 'abierta'
    ORDER BY fecha_caja DESC
    LIMIT 1;
END //

-- Procedimiento para registrar un ingreso en caja
CREATE PROCEDURE sp_registrar_ingreso_caja(
    IN p_monto DECIMAL(10,2),
    IN p_descripcion TEXT,
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_id_caja INT;
    DECLARE v_monto_actual DECIMAL(10,2);
    DECLARE v_fecha_actual DATETIME;
    DECLARE v_id_movimiento INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET v_fecha_actual = NOW();

    START TRANSACTION;

    SELECT id_caja, monto_actual
    INTO v_id_caja, v_monto_actual
    FROM caja
    WHERE estado_caja = 'abierta'
    ORDER BY fecha_caja DESC
    LIMIT 1
    FOR UPDATE;

    IF v_id_caja IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No hay ninguna caja abierta para registrar el ingreso';
    END IF;

    INSERT INTO movimientos_caja (
        tipo_movimiento,
        fecha_movimiento,
        monto_movimiento,
        descripcion_mov_caja,
        id_caja,
        id_usuario
    )
    VALUES (
        'ingreso',
        v_fecha_actual,
        p_monto,
        p_descripcion,
        v_id_caja,
        p_id_usuario
    );

    SET v_id_movimiento = LAST_INSERT_ID();

    UPDATE caja
    SET monto_actual = v_monto_actual + p_monto
    WHERE id_caja = v_id_caja;

    COMMIT;

    SELECT 
        mc.id_movimiento_caja,
        mc.tipo_movimiento,
        mc.descripcion_mov_caja,
        mc.monto_movimiento,
        DATE_FORMAT(mc.fecha_movimiento, '%d-%m-%Y') AS fecha,
        DATE_FORMAT(mc.fecha_movimiento, '%H:%i:%s') AS hora,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS nombre_usuario
    FROM movimientos_caja mc
    INNER JOIN usuarios u ON mc.id_usuario = u.id_usuario
    WHERE mc.id_movimiento_caja = v_id_movimiento;
END //

-- Procedimiento para registrar un egreso en caja
CREATE PROCEDURE sp_registrar_egreso_caja(
    IN p_monto DECIMAL(10,2),
    IN p_descripcion TEXT,
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_id_caja INT;
    DECLARE v_monto_actual DECIMAL(10,2);
    DECLARE v_fecha_actual DATETIME;
    DECLARE v_id_movimiento INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET v_fecha_actual = NOW();

    START TRANSACTION;

    SELECT id_caja, monto_actual
    INTO v_id_caja, v_monto_actual
    FROM caja
    WHERE estado_caja = 'abierta'
    ORDER BY fecha_caja DESC
    LIMIT 1
    FOR UPDATE;

    IF v_id_caja IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No hay ninguna caja abierta para registrar el egreso';
    END IF;

    IF v_monto_actual < p_monto THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Saldo insuficiente en caja para realizar el egreso';
    END IF;

    INSERT INTO movimientos_caja (
        tipo_movimiento,
        fecha_movimiento,
        monto_movimiento,
        descripcion_mov_caja,
        id_caja,
        id_usuario
    )
    VALUES (
        'egreso',
        v_fecha_actual,
        p_monto,
        p_descripcion,
        v_id_caja,
        p_id_usuario
    );

    SET v_id_movimiento = LAST_INSERT_ID();

    UPDATE caja
    SET monto_actual = v_monto_actual - p_monto
    WHERE id_caja = v_id_caja;

    COMMIT;

    SELECT 
        mc.id_movimiento_caja,
        mc.tipo_movimiento,
        mc.descripcion_mov_caja,
        mc.monto_movimiento,
        DATE_FORMAT(mc.fecha_movimiento, '%d-%m-%Y') AS fecha,
        DATE_FORMAT(mc.fecha_movimiento, '%H:%i:%s') AS hora,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS nombre_usuario
    FROM movimientos_caja mc
    INNER JOIN usuarios u ON mc.id_usuario = u.id_usuario
    WHERE mc.id_movimiento_caja = v_id_movimiento;
END //

-- Procedimiento para registrar un arqueo de caja
CREATE PROCEDURE sp_registrar_arqueo_caja(
    IN p_id_usuario INT,
    IN p_id_caja INT,
    IN p_monto_fisico DECIMAL(10,2),
    IN p_monto_tarjeta DECIMAL(10,2),
    IN p_monto_billetera DECIMAL(10,2),
    IN p_monto_otros DECIMAL(10,2),
    IN p_diferencia DECIMAL(10,2),
    IN p_estado_arqueo ENUM('cuadra', 'sobra', 'falta')
)
BEGIN

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    INSERT INTO arqueos_caja (
        fecha_arqueo,
        monto_fisico,
        monto_tarjeta,
        monto_billetera_digital,
        otros,
        diferencia,
        estado_caja,
        id_caja,
        id_usuario
    )
    VALUES (
        NOW(),
        p_monto_fisico,
        p_monto_tarjeta,
        p_monto_billetera,
        p_monto_otros,
        p_diferencia,
        p_estado_arqueo,
        p_id_caja,
        p_id_usuario
    );

    COMMIT;
    SELECT 'Arqueo registrado exitosamente' AS mensaje;
END //

-- Procedimiento para obtener los movimientos de una caja específica
CREATE PROCEDURE sp_obtener_movimientos_por_caja(
    IN p_id_caja INT,
    IN p_tipo_movimiento VARCHAR(50),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        mc.id_movimiento_caja,
        mc.tipo_movimiento,
        mc.descripcion_mov_caja,
        mc.monto_movimiento,
        DATE_FORMAT(mc.fecha_movimiento, '%d-%m-%Y') AS fecha,
        DATE_FORMAT(mc.fecha_movimiento, '%H:%i:%s') AS hora,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS nombre_usuario
    FROM movimientos_caja mc
    INNER JOIN usuarios u 
        ON mc.id_usuario = u.id_usuario
    WHERE mc.id_caja = p_id_caja
      AND (p_tipo_movimiento IS NULL 
           OR mc.tipo_movimiento = p_tipo_movimiento)
    ORDER BY mc.fecha_movimiento DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE sp_contar_movimientos_por_caja(
    IN p_id_caja INT,
    IN p_tipo_movimiento VARCHAR(50)
)
BEGIN
    SELECT 
        COUNT(*) AS total_registros
    FROM movimientos_caja mc
    WHERE mc.id_caja = p_id_caja
      AND (p_tipo_movimiento IS NULL 
           OR mc.tipo_movimiento = p_tipo_movimiento);
END //

-- Procedimiento para obtener detalles de las cajas cerradas por partes
CREATE PROCEDURE sp_contar_cajas (
    IN p_fechaInicio DATE,
    IN p_fechaFin DATE
)
BEGIN
    SELECT COUNT(*) AS total_registros
    FROM caja c
    WHERE
        (p_fechaInicio IS NULL OR DATE(c.fecha_caja) >= p_fechaInicio)
        AND (p_fechaFin IS NULL OR DATE(c.fecha_caja) <= p_fechaFin);
END //

CREATE PROCEDURE sp_listar_cajas (
    IN p_limit INT,
    IN p_offset INT,
    IN p_fechaInicio DATE,
    IN p_fechaFin DATE
)
BEGIN
    SELECT
        c.id_caja,
        c.saldo_inicial,
        c.monto_actual,
        IFNULL(c.saldo_final, '--') AS saldo_final,
        DATE_FORMAT(c.fecha_caja, '%d-%m-%Y') AS fecha_apertura,
        DATE_FORMAT(c.fecha_caja, '%H:%i:%s') AS hora_apertura,
        c.estado_caja
    FROM caja c
    WHERE
        (p_fechaInicio IS NULL OR DATE(c.fecha_caja) >= p_fechaInicio)
        AND (p_fechaFin IS NULL OR DATE(c.fecha_caja) <= p_fechaFin)
    ORDER BY c.fecha_caja DESC
    LIMIT p_limit OFFSET p_offset;
END // 

-- Procedimiento para obtener los arqueos de la caja abierta
CREATE PROCEDURE sp_obtener_arqueos_por_caja(
    IN p_id_caja INT
)
BEGIN
    -- Retornar los arqueos asociados a esa caja
    SELECT 
        ac.id_arqueo,
        DATE_FORMAT(ac.fecha_arqueo, '%H:%i:%s') AS hora_arqueo,
        DATE_FORMAT(ac.fecha_arqueo, '%d-%m-%Y') AS fecha_arqueo,
        ac.monto_fisico,
        ac.monto_tarjeta,
        ac.monto_billetera_digital,
        ac.otros,
        ac.diferencia,
        ac.estado_caja,
        DATE_FORMAT(c.fecha_caja, '%d/%m/%Y') AS fecha_caja,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS nombre_usuario
    FROM arqueos_caja ac
    INNER JOIN caja c ON ac.id_caja = c.id_caja
    INNER JOIN usuarios u ON ac.id_usuario = u.id_usuario
    WHERE ac.id_caja = p_id_caja
    ORDER BY ac.fecha_arqueo DESC;
END //

DELIMITER ;