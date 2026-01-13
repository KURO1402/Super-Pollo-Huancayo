USE super_pollo;
-- ELIMINAR PROCEDIMIENTOS

DROP PROCEDURE IF EXISTS sp_insertar_insumo;
DROP PROCEDURE IF EXISTS sp_contar_insumos_por_nombre;
DROP PROCEDURE IF EXISTS sp_recuperar_insumo;
DROP PROCEDURE IF EXISTS sp_actualizar_insumo_datos;
DROP PROCEDURE IF EXISTS sp_actualizar_estado_insumo;
DROP PROCEDURE IF EXISTS sp_contar_insumo_por_id;
DROP PROCEDURE IF EXISTS sp_contar_insumos_por_nombre_2;
DROP PROCEDURE IF EXISTS sp_obtener_insumos;
DROP PROCEDURE IF EXISTS sp_obtener_insumos_paginacion;
DROP PROCEDURE IF EXISTS sp_obtener_insumo_por_id;
DROP PROCEDURE IF EXISTS sp_eliminar_insumo;
DROP PROCEDURE IF EXISTS sp_registrar_movimiento_stock;
DROP PROCEDURE IF EXISTS sp_obtener_movimientos;
DROP PROCEDURE IF EXISTS sp_buscar_movimientos_por_insumo;
DROP PROCEDURE IF EXISTS sp_buscar_movimientos_por_usuario;
DROP PROCEDURE IF EXISTS sp_buscar_movimientos_por_fecha;
DROP PROCEDURE IF EXISTS sp_buscar_movimientos_por_tipo;
DROP PROCEDURE IF EXISTS sp_obtener_movimientos_por_venta;

DELIMITER //

-- INSUMOS
CREATE PROCEDURE sp_insertar_insumo(
    IN p_nombre_insumo VARCHAR(100),
    IN p_stock_insumo DECIMAL(5,2),
    IN p_unidad_medida VARCHAR(30)
)
BEGIN
    DECLARE v_id_insumo INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    INSERT INTO insumos (
        nombre_insumo,
        stock_insumo,
        unidad_medida
    ) VALUES (
        p_nombre_insumo,
        p_stock_insumo,
        p_unidad_medida
    );

    SET v_id_insumo = LAST_INSERT_ID();

    COMMIT;

    SELECT 
        'Insumo insertado correctamente' AS mensaje,
        v_id_insumo AS id_insumo;
END //

CREATE PROCEDURE sp_contar_insumos_por_nombre (
    IN p_nombre_insumo VARCHAR(100)
)
BEGIN
    SELECT
        SUM(CASE WHEN estado_insumo = 1 THEN 1 ELSE 0 END) AS total_activos,
        SUM(CASE WHEN estado_insumo = 0 THEN 1 ELSE 0 END) AS total_inactivos,
        MAX(CASE WHEN estado_insumo = 0 THEN id_insumo ELSE NULL END) AS id_insumo_inactivo
    FROM insumos
    WHERE nombre_insumo = p_nombre_insumo;
END //

CREATE PROCEDURE sp_recuperar_insumo (
    IN p_id_insumo INT,
    IN p_unidad_medida VARCHAR(30),
    IN p_estado_insumo TINYINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

     START TRANSACTION;

    UPDATE insumos
    SET 
        unidad_medida = p_unidad_medida,
        estado_insumo = p_estado_insumo
    WHERE id_insumo = p_id_insumo;

    COMMIT;

    SELECT 'Insumo insertado correctamente' AS mensaje;
END //

CREATE PROCEDURE sp_actualizar_insumo_datos (
    IN p_id_insumo INT,
    IN p_nombre_insumo VARCHAR(100),
    IN p_unidad_medida VARCHAR(30)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE insumos
    SET 
        nombre_insumo = p_nombre_insumo,
        unidad_medida = p_unidad_medida
    WHERE id_insumo = p_id_insumo;

    COMMIT;

    SELECT 'Insumo actualizado correctamente' AS mensaje;
END //

CREATE PROCEDURE sp_actualizar_estado_insumo (
    IN p_id_insumo INT,
    IN p_estado_insumo TINYINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE insumos
    SET estado_insumo = p_estado_insumo
    WHERE id_insumo = p_id_insumo;

    COMMIT;

    SELECT 'Estado insumo actualizado correctamente' AS mensaje;
END //

CREATE PROCEDURE sp_contar_insumo_por_id (
    IN p_id_insumo INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM insumos
    WHERE id_insumo = p_id_insumo
    AND estado_insumo = 1;
END //

CREATE PROCEDURE sp_contar_insumos_por_nombre_2 (
    IN p_nombre_insumo VARCHAR(100),
    IN p_id_insumo INT
)
BEGIN
    SELECT
        COUNT(*) AS total
    FROM insumos
    WHERE nombre_insumo = p_nombre_insumo
      AND estado_insumo = 1
      AND id_insumo <> p_id_insumo;
END //

CREATE PROCEDURE sp_obtener_insumos()
BEGIN
    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE estado_insumo = 1
    ORDER BY id_insumo DESC;
END //

CREATE PROCEDURE sp_obtener_insumos_paginacion(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE estado_insumo = 1
    ORDER BY id_insumo DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE sp_obtener_insumo_por_id(
    IN p_id_insumo INT
)
BEGIN
    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE id_insumo = p_id_insumo
      AND estado_insumo = 1;
END //

CREATE PROCEDURE sp_eliminar_insumo(
    IN p_id_insumo INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al eliminar insumo';
    END;

    START TRANSACTION;

    UPDATE insumos
    SET estado_insumo = 0
    WHERE id_insumo = p_id_insumo;

    COMMIT;
END //

-- MOVIMIENTOS DE STOCK

CREATE PROCEDURE sp_registrar_movimiento_stock(
    IN p_id_insumo INT,
    IN p_cantidad DECIMAL(5,2),
    IN p_tipo_movimiento ENUM('entrada','salida'),
    IN p_detalle_movimiento TEXT,
    IN p_id_usuario INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error al registrar movimiento';
    END;

    START TRANSACTION;

    INSERT INTO movimientos_stock (
        id_insumo,
        cantidad_movimiento,
        tipo_movimiento,
        detalle_movimiento,
        id_usuario
    ) VALUES (
        p_id_insumo,
        p_cantidad,
        p_tipo_movimiento,
        p_detalle_movimiento,
        p_id_usuario
    );

    IF p_tipo_movimiento = 'entrada' THEN
        UPDATE insumos
        SET stock_insumo = stock_insumo + p_cantidad
        WHERE id_insumo = p_id_insumo;
    ELSE
        UPDATE insumos
        SET stock_insumo = stock_insumo - p_cantidad
        WHERE id_insumo = p_id_insumo;
    END IF;

    COMMIT;
END //

CREATE PROCEDURE sp_obtener_movimientos(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT
        m.tipo_movimiento,
        i.nombre_insumo,
        m.cantidad_movimiento,
        DATE_FORMAT(m.fecha_movimiento,'%d-%m-%Y') AS fecha_movimiento,
        DATE_FORMAT(m.fecha_movimiento,'%H:%i:%s') AS hora_movimiento
    FROM movimientos_stock m
    INNER JOIN insumos i ON m.id_insumo = i.id_insumo
    ORDER BY m.fecha_movimiento DESC
    LIMIT p_limit OFFSET p_offset;
END //

DELIMITER ;
