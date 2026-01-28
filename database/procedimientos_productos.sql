USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_contar_productos_nombre_act_ina;
DROP PROCEDURE IF EXISTS sp_contar_categoria_por_id;
DROP PROCEDURE IF EXISTS sp_contar_productos_por_id;
DROP PROCEDURE IF EXISTS sp_contar_productos_deshabilitados_por_id;
DROP PROCEDURE IF EXISTS sp_contar_nombre_producto_edit_v2;
DROP PROCEDURE IF EXISTS sp_contar_insumo_producto;

DROP PROCEDURE IF EXISTS sp_registrar_producto_con_imagen;
DROP PROCEDURE IF EXISTS sp_registrar_cantidad_insumo_producto;
DROP PROCEDURE IF EXISTS sp_actualizar_datos_producto;
DROP PROCEDURE IF EXISTS sp_agregar_cantidad_insumo_producto;
DROP PROCEDURE IF EXISTS sp_actualizar_cantidad_insumo_producto;
DROP PROCEDURE IF EXISTS sp_eliminar_cantidad_insumo_producto;
DROP PROCEDURE IF EXISTS sp_actualizar_estado_producto;
DROP PROCEDURE IF EXISTS sp_insertar_imagen_producto;


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

CREATE PROCEDURE sp_contar_productos_deshabilitados_por_id(
    IN p_id_producto INT
)
BEGIN
    SELECT COUNT(*) AS total_registros
    FROM productos
    WHERE id_producto = p_id_producto
        AND estado_producto = 0;
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

CREATE PROCEDURE sp_contar_insumo_producto (
    IN p_id_producto INT,
    IN p_id_insumo INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM cantidad_insumo_producto
    WHERE id_producto = p_id_producto
      AND id_insumo = p_id_insumo;
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

CREATE PROCEDURE sp_agregar_cantidad_insumo_producto (
    IN p_id_producto INT,
    IN p_id_insumo INT,
    IN p_cantidad_uso DECIMAL(5,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    INSERT INTO cantidad_insumo_producto (
        id_producto,
        id_insumo,
        cantidad_uso
    ) VALUES (
        p_id_producto,
        p_id_insumo,
        p_cantidad_uso
    );

    UPDATE productos
    SET usa_insumos = 1
    WHERE id_producto = p_id_producto
      AND usa_insumos = 0;

    COMMIT;

    SELECT 
        i.id_insumo,
        i.nombre_insumo,
        cip.cantidad_uso
    FROM cantidad_insumo_producto cip
    INNER JOIN insumos i 
        ON i.id_insumo = cip.id_insumo
    WHERE cip.id_producto = p_id_producto
      AND cip.id_insumo = p_id_insumo;

END //

CREATE PROCEDURE sp_actualizar_cantidad_insumo_producto (
    IN p_id_producto INT,
    IN p_id_insumo INT,
    IN p_cantidad_uso DECIMAL(5,2)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE cantidad_insumo_producto
    SET cantidad_uso = p_cantidad_uso
    WHERE id_producto = p_id_producto
      AND id_insumo = p_id_insumo;

    COMMIT;

    SELECT 
        i.id_insumo,
        i.nombre_insumo,
        cip.cantidad_uso
    FROM cantidad_insumo_producto cip
    INNER JOIN insumos i 
        ON i.id_insumo = cip.id_insumo
    WHERE cip.id_producto = p_id_producto
    AND cip.id_insumo = p_id_insumo;

END //

CREATE PROCEDURE sp_eliminar_cantidad_insumo_producto (
    IN p_id_producto INT,
    IN p_id_insumo INT
)
BEGIN
    DECLARE v_total_insumos INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    DELETE FROM cantidad_insumo_producto
    WHERE id_producto = p_id_producto
      AND id_insumo = p_id_insumo;

    SELECT COUNT(*)
    INTO v_total_insumos
    FROM cantidad_insumo_producto
    WHERE id_producto = p_id_producto;

    IF v_total_insumos = 0 THEN
        UPDATE productos
        SET usa_insumos = 0
        WHERE id_producto = p_id_producto;
    END IF;

    COMMIT;

    SELECT 'Insumo quitado correctamente' AS mensaje;

 END //

CREATE PROCEDURE sp_actualizar_estado_producto (
    IN p_id_producto INT,
    IN p_estado_producto TINYINT(1)
)
BEGIN
    DECLARE v_mensaje VARCHAR(100);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE productos
    SET estado_producto = p_estado_producto
    WHERE id_producto = p_id_producto;

    COMMIT;

    IF p_estado_producto = 1 THEN
        SET v_mensaje = 'Producto habilitado correctamente';
    ELSE
        SET v_mensaje = 'Producto deshabilitado correctamente';
    END IF;

    SELECT v_mensaje AS mensaje;

END //

CREATE PROCEDURE sp_insertar_imagen_producto (
    IN p_url_imagen VARCHAR(300),
    IN p_public_id VARCHAR(100),
    IN p_id_producto INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    INSERT INTO imagenes_producto (
        url_imagen,
        public_id,
        id_producto
    )
    VALUES (
        p_url_imagen,
        p_public_id,
        p_id_producto
    );

    COMMIT;

    SELECT
        id_imagen_producto,
        url_imagen
    FROM imagenes_producto
    WHERE id_producto = p_id_producto;
END //

DELIMITER ;