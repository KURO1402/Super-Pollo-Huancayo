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


DELIMITER ;