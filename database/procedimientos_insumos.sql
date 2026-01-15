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
DROP PROCEDURE IF EXISTS sp_obtener_insumos_paginacion;
DROP PROCEDURE IF EXISTS sp_obtener_insumo_por_id;
DROP PROCEDURE IF EXISTS sp_obtener_insumo_por_nombre;
DROP PROCEDURE IF EXISTS sp_optener_stock_actual_insumo;
DROP PROCEDURE IF EXISTS sp_eliminar_insumo;

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

CREATE PROCEDURE sp_obtener_insumo_por_nombre(
    IN p_nombre_insumo VARCHAR(100)
)
BEGIN
    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE nombre_insumo LIKE CONCAT('%', p_nombre_insumo, '%')
      AND estado_insumo = 1
    ORDER BY id_insumo DESC;
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
