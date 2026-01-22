USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_contar_productos_nombre_act_ina;
DROP PROCEDURE IF EXISTS sp_contar_categoria_por_id;

DROP PROCEDURE IF EXISTS sp_crear_producto;


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


-- Procedimientos de productos
/*CREATE PROCEDURE sp_crear_producto(
    IN p_nombre_producto VARCHAR(100),
    IN p_descripcion_producto TEXT,
    IN p_precio_producto DECIMAL(5, 2),
    IN p_usa_insumos TINYINT(1),
    IN p_id_categoria INT,
    IN p_url_imagen VARCHAR(300),
    IN p_public_id VARCHAR(100)
)
BEGIN
    INSERT INTO productos()
END //*/

DELIMITER ;