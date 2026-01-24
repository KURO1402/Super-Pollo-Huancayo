USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_contar_productos_nombre_act_ina;
DROP PROCEDURE IF EXISTS sp_contar_categoria_por_id;
DROP PROCEDURE IF EXISTS sp_contar_productos_por_id;
DROP PROCEDURE IF EXISTS sp_contar_nombre_producto_edit_v2;

DROP PROCEDURE IF EXISTS sp_registrar_producto_con_imagen;
DROP PROCEDURE IF EXISTS sp_registrar_cantidad_insumo_producto;
DROP PROCEDURE IF EXISTS sp_actualizar_datos_producto;


DELIMITER //

-- Procedimientos para validaciones 
CREATE PROCEDURE sp_contar_productos_nombre_act_ina(
    IN p_nombre_producto VARCHAR(100)
)
BEGIN
    SELECT
        SUM(CASE WHEN estado_producto = 1 THEN 1 ELSE 0 END) AS total_activos,
        SUM(CASE WHEN estado_producto = 0 THEN 1 ELSE 0 END) AS total_inactivos
    FROM productos
    WHERE nombre_producto = p_nombre_producto;
END //

CREATE PROCEDURE sp_contar_categoria_por_id(
    IN p_id_categoria INT
)
BEGIN
    SELECT
        COUNT(*) AS total_categorias
    FROM categorias_producto
    WHERE id_categoria = p_id_categoria;
END //

CREATE PROCEDURE sp_contar_productos_por_id(
    IN p_id_producto INT
)
BEGIN
    SELECT COUNT(*) AS total_registros
    FROM productos
    WHERE id_producto = p_id_producto
        AND estado_producto = 1;
END //

CREATE PROCEDURE sp_contar_nombre_producto_edit_v2(
    IN p_nombre_producto VARCHAR(100),
    IN p_id_producto INT
)
BEGIN
    SELECT
        SUM(CASE WHEN estado_producto = 1 THEN 1 ELSE 0 END) AS total_activos,
        SUM(CASE WHEN estado_producto = 0 THEN 1 ELSE 0 END) AS total_inactivos
    FROM productos
    WHERE nombre_producto = p_nombre_producto
      AND id_producto <> p_id_producto;
END //


-- Procedimientos de productos
CREATE PROCEDURE sp_registrar_producto_con_imagen (
    IN p_nombre_producto VARCHAR(100),
    IN p_descripcion_producto TEXT,
    IN p_precio_producto DECIMAL(5,2),
    IN p_usa_insumos TINYINT(1),
    IN p_id_categoria INT,
    IN p_url_imagen VARCHAR(300),
    IN p_public_id VARCHAR(100)
)
BEGIN
    DECLARE v_id_producto INT;

    INSERT INTO productos (
        nombre_producto,
        descripcion_producto,
        precio_producto,
        usa_insumos,
        id_categoria
    ) VALUES (
        p_nombre_producto,
        p_descripcion_producto,
        p_precio_producto,
        p_usa_insumos,
        p_id_categoria
    );

    SET v_id_producto = LAST_INSERT_ID();

    INSERT INTO imagenes_producto (
        url_imagen,
        public_id,
        id_producto
    ) VALUES (
        p_url_imagen,
        p_public_id,
        v_id_producto
    );

    SELECT 
        p.id_producto,
        p.nombre_producto,
        p.descripcion_producto,
        p.precio_producto
    FROM productos p
    WHERE p.id_producto = v_id_producto;
END //

CREATE PROCEDURE sp_registrar_cantidad_insumo_producto (
    IN p_id_producto INT,
    IN p_id_insumo INT,
    IN p_cantidad_uso DECIMAL(5,2)
)
BEGIN
    INSERT INTO cantidad_insumo_producto (
        id_producto,
        id_insumo,
        cantidad_uso
    ) VALUES (
        p_id_producto,
        p_id_insumo,
        p_cantidad_uso
    );
END //

CREATE PROCEDURE sp_actualizar_datos_producto(
    IN p_id_producto INT,
    IN p_nombre_producto VARCHAR(100),
    IN p_descripcion_producto TEXT,
    IN p_precio_producto DECIMAL(5,2),
    IN p_id_categoria INT
)
BEGIN

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE productos
    SET
        nombre_producto = p_nombre_producto,
        descripcion_producto = p_descripcion_producto,
        precio_producto = p_precio_producto,
        id_categoria = p_id_categoria
    WHERE id_producto = p_id_producto;

    COMMIT;

     SELECT 
        p.id_producto,
        p.nombre_producto,
        p.descripcion_producto,
        p.precio_producto
    FROM productos p
    WHERE p.id_producto = p_id_producto;
END //

DELIMITER ;