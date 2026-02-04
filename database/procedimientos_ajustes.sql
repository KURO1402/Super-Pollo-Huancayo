USE super_pollo_hyo;

-- Procedimientos de categorias de productos
DROP PROCEDURE IF EXISTS sp_insertar_categoria_producto;
DROP PROCEDURE IF EXISTS sp_contar_categoria_por_nombre;
DROP PROCEDURE IF EXISTS sp_actualizar_categoria_producto;
DROP PROCEDURE IF EXISTS sp_contar_categoria_por_nombre_excluyendo_id;
DROP PROCEDURE IF EXISTS sp_contar_categoria_por_id;
DROP PROCEDURE IF EXISTS sp_eliminar_categoria_producto;
DROP PROCEDURE IF EXISTS sp_contar_productos_por_categoria;
DROP PROCEDURE IF EXISTS sp_listar_categorias_producto;
DROP PROCEDURE IF EXISTS sp_obtener_categoria_producto_por_id;

-- Procedimientos para tipo de documento
DROP PROCEDURE IF EXISTS sp_insertar_tipo_documento;
DROP PROCEDURE IF EXISTS sp_contar_tipo_documento_por_nombre;
DROP PROCEDURE IF EXISTS sp_contar_tipo_documento_por_id;
DROP PROCEDURE IF EXISTS sp_contar_tipo_documento_nombre_excluyendo_id;
DROP PROCEDURE IF EXISTS sp_actualizar_tipo_documento;

-- Procedimientos de categorias de productos
DELIMITER //

CREATE PROCEDURE sp_insertar_categoria_producto (
    IN p_nombre_categoria VARCHAR(100)
)
BEGIN
    DECLARE v_id_categoria INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    INSERT INTO categorias_producto (nombre_categoria)
    VALUES (p_nombre_categoria);

    SET v_id_categoria = LAST_INSERT_ID();

    COMMIT;

    SELECT 
        id_categoria,
        nombre_categoria
    FROM categorias_producto
    WHERE id_categoria = v_id_categoria;

END //

CREATE PROCEDURE sp_contar_categoria_por_nombre (
    IN p_nombre_categoria VARCHAR(100)
)
BEGIN
    SELECT 
        COUNT(*) AS total
    FROM categorias_producto
    WHERE nombre_categoria = p_nombre_categoria;
END //

CREATE PROCEDURE sp_actualizar_categoria_producto (
    IN p_id_categoria INT,
    IN p_nombre_categoria VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE categorias_producto
    SET nombre_categoria = p_nombre_categoria
    WHERE id_categoria = p_id_categoria;

    COMMIT;

    SELECT 
        id_categoria,
        nombre_categoria
    FROM categorias_producto
    WHERE id_categoria = p_id_categoria;

END //

CREATE PROCEDURE sp_contar_categoria_por_nombre_excluyendo_id (
    IN p_id_categoria INT,
    IN p_nombre_categoria VARCHAR(100)
)
BEGIN
    SELECT 
        COUNT(*) AS total
    FROM categorias_producto
    WHERE nombre_categoria = p_nombre_categoria
      AND id_categoria <> p_id_categoria;
END //

CREATE PROCEDURE sp_contar_categoria_por_id (
    IN p_id_categoria INT
)
BEGIN
    SELECT 
        COUNT(*) AS total
    FROM categorias_producto
    WHERE id_categoria = p_id_categoria;
END //

CREATE PROCEDURE sp_eliminar_categoria_producto (
    IN p_id_categoria INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    DELETE FROM categorias_producto
    WHERE id_categoria = p_id_categoria;

    COMMIT;

    SELECT 'Categoria eliminada exitosamente' AS mensaje;
END //

CREATE PROCEDURE sp_contar_productos_por_categoria (
    IN p_id_categoria INT
)
BEGIN
    SELECT 
        COUNT(*) AS total
    FROM productos
    WHERE id_categoria = p_id_categoria;
END //

CREATE PROCEDURE sp_listar_categorias_producto ()
BEGIN
    SELECT 
        id_categoria,
        nombre_categoria
    FROM categorias_producto
    ORDER BY id_categoria ASC;
END //

CREATE PROCEDURE sp_obtener_categoria_producto_por_id (
    IN p_id_categoria INT
)
BEGIN
    SELECT 
        id_categoria,
        nombre_categoria
    FROM categorias_producto
    WHERE id_categoria = p_id_categoria;
END //

-- Procedimientos para tipo de documento

CREATE PROCEDURE sp_insertar_tipo_documento (
    IN p_nombre_tipo_documento VARCHAR(50)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_estado TINYINT(1);

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

        SELECT id_tipo_documento, estado_documento
        INTO v_id, v_estado
        FROM tipo_documento
        WHERE nombre_tipo_documento = p_nombre_tipo_documento
        LIMIT 1;

        IF v_id IS NULL THEN
            INSERT INTO tipo_documento (nombre_tipo_documento, estado_documento)
            VALUES (p_nombre_tipo_documento, 1);

            SET v_id = LAST_INSERT_ID();

        ELSEIF v_estado = 0 THEN
            UPDATE tipo_documento
            SET estado_documento = 1
            WHERE id_tipo_documento = v_id;
        END IF;

    COMMIT;

    SELECT 
        id_tipo_documento,
        nombre_tipo_documento
    FROM tipo_documento
    WHERE id_tipo_documento = v_id;

END //

CREATE PROCEDURE sp_contar_tipo_documento_por_nombre (
    IN p_nombre VARCHAR(50)
)
BEGIN
    SELECT
        COUNT(*) as total
    FROM tipo_documento
    WHERE nombre_tipo_documento = p_nombre
    AND estado_documento = 1;
END //

CREATE PROCEDURE sp_actualizar_tipo_documento (
    IN p_id_tipo_documento INT,
    IN p_nombre_tipo_documento VARCHAR(50)
)
BEGIN

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

        UPDATE tipo_documento
        SET
            nombre_tipo_documento = p_nombre_tipo_documento
        WHERE id_tipo_documento = p_id_tipo_documento;

    COMMIT;


    SELECT 
    id_tipo_documento,
    nombre_tipo_documento
    FROM tipo_documento
    WHERE id_tipo_documento = p_id_tipo_documento;

END //

CREATE PROCEDURE sp_contar_tipo_documento_por_id (
    IN p_id_tipo_documento INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM tipo_documento
    WHERE id_tipo_documento = p_id_tipo_documento;
END //

CREATE PROCEDURE sp_contar_tipo_documento_nombre_excluyendo_id (
    IN p_nombre_tipo_documento VARCHAR(50),
    IN p_id_tipo_documento INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM tipo_documento
    WHERE nombre_tipo_documento = p_nombre_tipo_documento
      AND id_tipo_documento <> p_id_tipo_documento;
END //

DELIMITER ;