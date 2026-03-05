USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_contar_productos_nombre_act_ina;
DROP PROCEDURE IF EXISTS sp_contar_categoria_por_id;
DROP PROCEDURE IF EXISTS sp_contar_productos_por_id;
DROP PROCEDURE IF EXISTS sp_contar_productos_deshabilitados_por_id;
DROP PROCEDURE IF EXISTS sp_contar_nombre_producto_edit_v2;
DROP PROCEDURE IF EXISTS sp_contar_insumo_producto;
DROP PROCEDURE IF EXISTS sp_contar_imagen_producto_por_id;
DROP PROCEDURE IF EXISTS sp_obtener_public_id_por_id_imagen;
DROP PROCEDURE IF EXISTS sp_contar_imagenes_por_producto;

DROP PROCEDURE IF EXISTS sp_registrar_producto_con_imagen;
DROP PROCEDURE IF EXISTS sp_registrar_cantidad_insumo_producto;
DROP PROCEDURE IF EXISTS sp_actualizar_datos_producto;
DROP PROCEDURE IF EXISTS sp_agregar_cantidad_insumo_producto;
DROP PROCEDURE IF EXISTS sp_actualizar_cantidad_insumo_producto;
DROP PROCEDURE IF EXISTS sp_eliminar_cantidad_insumo_producto;
DROP PROCEDURE IF EXISTS sp_actualizar_estado_producto;
DROP PROCEDURE IF EXISTS sp_insertar_imagen_producto;
DROP PROCEDURE IF EXISTS sp_actualizar_imagen_producto;
DROP PROCEDURE IF EXISTS sp_eliminar_imagen_producto;

DROP PROCEDURE IF EXISTS sp_obtener_imagen_producto_por_id;
DROP PROCEDURE IF EXISTS sp_obtener_productos_catalogo;
DROP PROCEDURE IF EXISTS sp_obtener_imagenes_por_producto;
DROP PROCEDURE IF EXISTS sp_contar_productos_gestion;
DROP PROCEDURE IF EXISTS sp_obtener_productos_gestion;
DROP PROCEDURE IF EXISTS sp_contar_productos_gestion_deshabilitados;
DROP PROCEDURE IF EXISTS sp_obtener_productos_gestion_deshabilitados;
DROP PROCEDURE IF EXISTS sp_obtener_producto_por_id;
DROP PROCEDURE IF EXISTS sp_obtener_imagenes_productos;
DROP PROCEDURE IF EXISTS sp_contar_imagenes_productos;
DROP PROCEDURE IF EXISTS sp_obtener_insumos_por_producto;


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

CREATE PROCEDURE sp_contar_imagen_producto_por_id (
    IN p_id_imagen_producto INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM imagenes_producto
    WHERE id_imagen_producto = p_id_imagen_producto;
END //

CREATE PROCEDURE sp_obtener_public_id_por_id_imagen (
    IN p_id_imagen_producto INT
)
BEGIN
    SELECT public_id
    FROM imagenes_producto
    WHERE id_imagen_producto = p_id_imagen_producto;
END //

CREATE PROCEDURE sp_contar_imagenes_por_producto(
    IN p_id_producto INT
)
BEGIN
    SELECT 
        COUNT(*) AS total_imagenes
    FROM imagenes_producto
    WHERE id_producto = p_id_producto;
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
        p.precio_producto,
        CASE 
            WHEN p.usa_insumos = 1 THEN 'Sí'
            ELSE 'No'
        END AS usa_insumos,
        p.id_categoria,
        c.nombre_categoria
    FROM
        productos p
    INNER JOIN
        categorias_producto c ON p.id_categoria = c.id_categoria
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
        p.precio_producto,
        CASE 
            WHEN p.usa_insumos = 1 THEN 'Sí'
            ELSE 'No'
        END AS usa_insumos,
        p.id_categoria,
        c.nombre_categoria
    FROM
        productos p
    INNER JOIN
        categorias_producto c ON p.id_categoria = c.id_categoria
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
    FROM
        cantidad_insumo_producto cip
    INNER JOIN
        insumos i 
            ON cip.id_insumo = i.id_insumo
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
    FROM
        cantidad_insumo_producto cip
    INNER JOIN
        insumos i 
            ON cip.id_insumo = i.id_insumo
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
    DECLARE v_id_imagen INT;

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

    SET v_id_imagen = LAST_INSERT_ID();

    COMMIT;

    SELECT
        ip.id_imagen_producto,
        ip.url_imagen,
        p.id_producto,
        p.nombre_producto
    FROM
        imagenes_producto ip
    INNER JOIN productos p 
    ON ip.id_producto = p.id_producto
    WHERE 
        ip.id_imagen_producto = v_id_imagen;
END //

CREATE PROCEDURE sp_actualizar_imagen_producto (
    IN p_id_imagen_producto INT,
    IN p_url_imagen VARCHAR(300),
    IN p_public_id VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE imagenes_producto
    SET
        url_imagen = p_url_imagen,
        public_id  = p_public_id
    WHERE id_imagen_producto = p_id_imagen_producto;

    COMMIT;

    SELECT 
        ip.id_imagen_producto,
        ip.url_imagen,
        p.id_producto,
        p.nombre_producto
    FROM 
        imagenes_producto ip
    INNER JOIN productos p 
    ON ip.id_producto = p.id_producto
    WHERE id_imagen_producto = p_id_imagen_producto;
END //

CREATE PROCEDURE sp_eliminar_imagen_producto (
    IN p_id_imagen_producto INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    DELETE FROM imagenes_producto
    WHERE id_imagen_producto = p_id_imagen_producto;

    COMMIT;
    SELECT 'Imagen eliminada correctamente' AS mensaje;
END  //


-- Procedimientos para obtener datos
CREATE PROCEDURE sp_obtener_imagen_producto_por_id (
    IN p_id_imagen_producto INT
)
BEGIN
    SELECT 
        id_imagen_producto,
        url_imagen,
        public_id,
        id_producto
    FROM imagenes_producto
    WHERE id_imagen_producto = p_id_imagen_producto;
END //

CREATE PROCEDURE sp_obtener_productos_catalogo(
    IN p_id_categoria INT
)
BEGIN
    SELECT
        p.id_producto, 
        p.nombre_producto,
        p.descripcion_producto,
        p.precio_producto
    FROM
        productos p
    WHERE
        p.estado_producto = 1
        AND (p_id_categoria IS NULL OR p.id_categoria = p_id_categoria)
    ORDER BY
        p.id_categoria ASC,
        p.id_producto;
END //

CREATE PROCEDURE sp_obtener_imagenes_por_producto(
    IN p_id_producto INT
)
BEGIN
    SELECT 
        ip.id_imagen_producto,
        ip.url_imagen,
        p.id_producto,
        p.nombre_producto
    FROM 
        imagenes_producto ip
    INNER JOIN 
        productos p 
            ON ip.id_producto = p.id_producto
    WHERE 
        ip.id_producto = p_id_producto
        AND p.estado_producto = 1;
END //

CREATE PROCEDURE sp_contar_productos_gestion(
    IN p_nombre_producto VARCHAR(100),
    IN p_usa_insumos TINYINT,
    IN p_id_categoria INT
)
BEGIN
    SELECT
        COUNT(*) AS total
    FROM
        productos p
    INNER JOIN
        categorias_producto c ON p.id_categoria = c.id_categoria
    WHERE
        (p_nombre_producto IS NULL 
            OR p.nombre_producto LIKE CONCAT('%', p_nombre_producto, '%'))
        AND (p_usa_insumos IS NULL 
            OR p.usa_insumos = p_usa_insumos)
        AND (p_id_categoria IS NULL 
            OR p.id_categoria = p_id_categoria);
END //

CREATE PROCEDURE sp_obtener_productos_gestion(
    IN p_nombre_producto VARCHAR(100),
    IN p_usa_insumos TINYINT,
    IN p_id_categoria INT,
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT
        p.id_producto,
        p.nombre_producto,
        p.descripcion_producto,
        p.precio_producto,
        CASE 
            WHEN p.usa_insumos = 1 THEN 'Sí'
            ELSE 'No'
        END AS usa_insumos,
        p.id_categoria,
        c.nombre_categoria
    FROM
        productos p
    INNER JOIN
        categorias_producto c ON p.id_categoria = c.id_categoria
    WHERE
        p.estado_producto = 1 
        AND
        (p_nombre_producto IS NULL 
            OR p.nombre_producto LIKE CONCAT('%', p_nombre_producto, '%'))
        AND (p_usa_insumos IS NULL 
            OR p.usa_insumos = p_usa_insumos)
        AND (p_id_categoria IS NULL 
            OR p.id_categoria = p_id_categoria)
    ORDER BY
        p.id_producto DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE sp_contar_productos_gestion_deshabilitados(
    IN p_nombre_producto VARCHAR(100),
    IN p_id_categoria INT
)
BEGIN
    SELECT
        COUNT(*) AS total
    FROM
        productos p
    INNER JOIN
        categorias_producto c 
            ON p.id_categoria = c.id_categoria
    WHERE
        p.estado_producto = 0
        AND (p_nombre_producto IS NULL 
            OR p.nombre_producto LIKE CONCAT('%', p_nombre_producto, '%'))
        AND (p_id_categoria IS NULL 
            OR p.id_categoria = p_id_categoria);
END //

CREATE PROCEDURE sp_obtener_productos_gestion_deshabilitados(
    IN p_nombre_producto VARCHAR(100),
    IN p_id_categoria INT,
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT
        p.id_producto,
        p.nombre_producto,
        p.descripcion_producto,
        p.precio_producto,
        CASE 
            WHEN p.usa_insumos = 1 THEN 'Sí'
            ELSE 'No'
        END AS usa_insumos,
        p.id_categoria,
        c.nombre_categoria
    FROM
        productos p
    INNER JOIN
        categorias_producto c 
            ON p.id_categoria = c.id_categoria
    WHERE
        p.estado_producto = 0
        AND (p_nombre_producto IS NULL 
            OR p.nombre_producto LIKE CONCAT('%', p_nombre_producto, '%'))
        AND (p_id_categoria IS NULL 
            OR p.id_categoria = p_id_categoria)
    ORDER BY
        p.id_producto DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE sp_obtener_producto_por_id(
    IN p_id_producto INT
)
BEGIN
    SELECT
        p.id_producto,
        p.nombre_producto,
        p.descripcion_producto,
        p.precio_producto,
        CASE 
            WHEN p.usa_insumos = 1 THEN 'Si'
            ELSE 'No'
        END AS usa_insumos,
        p.id_categoria,
        c.nombre_categoria
    FROM
        productos p
    INNER JOIN
        categorias_producto c 
            ON p.id_categoria = c.id_categoria
    WHERE
        p.id_producto = p_id_producto AND p.estado_producto = 1;
END //

CREATE PROCEDURE sp_contar_imagenes_productos(
    IN p_nombre_producto VARCHAR(100)
)
BEGIN
    SELECT
        COUNT(*) AS total
    FROM
        imagenes_producto ip
    INNER JOIN
        productos p 
            ON ip.id_producto = p.id_producto
    WHERE
        p.estado_producto = 1
        AND (p_nombre_producto IS NULL 
            OR p.nombre_producto LIKE CONCAT('%', p_nombre_producto, '%'));
END //

CREATE PROCEDURE sp_obtener_imagenes_productos(
    IN p_nombre_producto VARCHAR(100),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT
        ip.id_imagen_producto,
        ip.url_imagen,
        p.id_producto,
        p.nombre_producto
    FROM
        imagenes_producto ip
    INNER JOIN
        productos p 
            ON ip.id_producto = p.id_producto
    WHERE
        p.estado_producto = 1
        AND (p_nombre_producto IS NULL 
            OR p.nombre_producto LIKE CONCAT('%', p_nombre_producto, '%'))
    ORDER BY
        ip.id_imagen_producto DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE sp_obtener_insumos_por_producto(
    IN p_id_producto INT
)
BEGIN
    SELECT
        i.id_insumo,
        i.nombre_insumo,
        cip.cantidad_uso
    FROM
        cantidad_insumo_producto cip
    INNER JOIN
        insumos i 
            ON cip.id_insumo = i.id_insumo
    WHERE
        cip.id_producto = p_id_producto;
END //

DELIMITER ;