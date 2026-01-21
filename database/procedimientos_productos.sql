USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_crear_producto;

DELIMITER //

CREATE PROCEDURE sp_crear_producto(
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
END //

DELIMITER;