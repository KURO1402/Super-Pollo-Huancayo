USE super_pollo_hyo;
-- ELIMINAR PROCEDIMIENTOS

DROP PROCEDURE IF EXISTS sp_insertar_insumo;
DROP PROCEDURE IF EXISTS sp_contar_insumos_por_nombre;
DROP PROCEDURE IF EXISTS sp_recuperar_insumo;
DROP PROCEDURE IF EXISTS sp_actualizar_insumo_datos;
DROP PROCEDURE IF EXISTS sp_actualizar_estado_insumo;
DROP PROCEDURE IF EXISTS sp_contar_insumo_por_id;
DROP PROCEDURE IF EXISTS sp_contar_insumos_por_nombre_2;
DROP PROCEDURE IF EXISTS sp_obtener_insumos;
DROP PROCEDURE IF EXISTS sp_contar_insumos;
DROP PROCEDURE IF EXISTS sp_obtener_insumo_por_id;
DROP PROCEDURE IF EXISTS sp_optener_stock_actual_insumo;
DROP PROCEDURE IF EXISTS sp_eliminar_insumo;

DELIMITER //

-- INSUMOS
CREATE PROCEDURE sp_insertar_insumo(
    IN p_nombre_insumo VARCHAR(100),
    IN p_stock_insumo DECIMAL(5,2),
    IN p_unidad_medida VARCHAR(30),
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_id_insumo INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Insertar insumo
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

    IF p_stock_insumo > 0 THEN
        INSERT INTO movimientos_stock (
            cantidad_movimiento,
            tipo_movimiento,
            detalle_movimiento,
            id_insumo,
            id_usuario
        ) VALUES (
            p_stock_insumo,
            'entrada',
            'Cantidad inicial de insumo',
            v_id_insumo,
            p_id_usuario
        );
    END IF;

    COMMIT;

    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE id_insumo = v_id_insumo;
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
    IN p_estado_insumo TINYINT,
    IN p_stock_insumo DECIMAL(5,2),
    IN p_id_usuario INT
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
        estado_insumo = p_estado_insumo,
        stock_insumo = CASE 
            WHEN p_stock_insumo > 0 THEN stock_insumo + p_stock_insumo
            ELSE stock_insumo
        END
    WHERE id_insumo = p_id_insumo;

    IF p_stock_insumo > 0 THEN
        INSERT INTO movimientos_stock (
            cantidad_movimiento,
            tipo_movimiento,
            detalle_movimiento,
            id_insumo,
            id_usuario
        ) VALUES (
            p_stock_insumo,
            'entrada',
            'Recuperación de insumo',
            p_id_insumo,
            p_id_usuario
        );
    END IF;

    COMMIT;

    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE id_insumo = p_id_insumo;
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

    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE id_insumo = p_id_insumo;
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

    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE id_insumo = p_id_insumo;
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

CREATE PROCEDURE sp_obtener_insumos(
    IN p_limit INT,
    IN p_offset INT,
    IN p_nombre_insumo VARCHAR(100),
    IN p_nivel_stock VARCHAR(20)
)
BEGIN
    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE estado_insumo = 1
      AND (
            p_nombre_insumo IS NULL
            OR nombre_insumo LIKE CONCAT('%', p_nombre_insumo, '%')
          )
      AND (
            p_nivel_stock IS NULL
            OR (
                (p_nivel_stock = 'critico' AND stock_insumo <= 5)
                OR (p_nivel_stock = 'bajo' AND stock_insumo > 5 AND stock_insumo <= 10)
                OR (p_nivel_stock = 'normal' AND stock_insumo > 10)
            )
          )
    ORDER BY id_insumo DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE sp_contar_insumos(
    IN p_nombre_insumo VARCHAR(100),
    IN p_nivel_stock VARCHAR(20)
)
BEGIN
    SELECT
        COUNT(*) AS total_registros
    FROM insumos
    WHERE estado_insumo = 1
      AND (
            p_nombre_insumo IS NULL
            OR nombre_insumo LIKE CONCAT('%', p_nombre_insumo, '%')
          )
      AND (
            p_nivel_stock IS NULL
            OR (
                (p_nivel_stock = 'critico' AND stock_insumo <= 5)
                OR (p_nivel_stock = 'bajo' AND stock_insumo > 5 AND stock_insumo <= 10)
                OR (p_nivel_stock = 'normal' AND stock_insumo > 10)
            )
          );
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

CREATE PROCEDURE sp_optener_stock_actual_insumo (
    IN p_id_insumo INT
)
BEGIN 
    SELECT 
        stock_insumo
    FROM insumos
    WHERE id_insumo = p_id_insumo;
END //

CREATE PROCEDURE sp_eliminar_insumo(
    IN p_id_insumo INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE insumos
    SET estado_insumo = 0
    WHERE id_insumo = p_id_insumo;

    COMMIT;
END //

DELIMITER ;
