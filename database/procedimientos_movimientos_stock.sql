USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_registrar_movimiento_stock;

DROP PROCEDURE IF EXISTS sp_contar_movimientos_stock_filtros;
DROP PROCEDURE IF EXISTS sp_obtener_movimientos_stock_filtros;

DELIMITER //


CREATE PROCEDURE sp_registrar_movimiento_stock(
    IN p_id_insumo INT,
    IN p_cantidad DECIMAL(5,2),
    IN p_tipo_movimiento ENUM('entrada','salida'),
    IN p_detalle_movimiento TEXT,
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_id_movimiento INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
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

    SET v_id_movimiento = LAST_INSERT_ID();

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

    SELECT
        m.id_movimiento_stock,
        m.tipo_movimiento,
        i.nombre_insumo,
        m.cantidad_movimiento,
        DATE_FORMAT(m.fecha_movimiento,'%d-%m-%Y') AS fecha_movimiento,
        DATE_FORMAT(m.fecha_movimiento,'%H:%i:%s') AS hora_movimiento,
        m.detalle_movimiento,
        CONCAT(u.apellido_usuario, ' ', u.nombre_usuario) AS encargado_movimiento
    FROM movimientos_stock m
    INNER JOIN insumos i ON m.id_insumo = i.id_insumo
    INNER JOIN usuarios u ON m.id_usuario = u.id_usuario
    WHERE m.id_movimiento_stock = v_id_movimiento;

END //


CREATE PROCEDURE sp_contar_movimientos_stock_filtros(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_tipo_movimiento ENUM('entrada','salida'),
    IN p_id_insumo INT
)
BEGIN
    SELECT COUNT(*) AS total_registros
    FROM movimientos_stock m
    WHERE
        (p_fecha_inicio IS NULL 
            OR m.fecha_movimiento >= CONCAT(p_fecha_inicio, ' 00:00:00'))
    AND (p_fecha_fin IS NULL 
            OR m.fecha_movimiento <= CONCAT(p_fecha_fin, ' 23:59:59'))
    AND (p_tipo_movimiento IS NULL 
            OR m.tipo_movimiento = p_tipo_movimiento)
    AND (p_id_insumo IS NULL 
            OR m.id_insumo = p_id_insumo);
END //

CREATE PROCEDURE sp_obtener_movimientos_stock_filtros(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_tipo_movimiento ENUM('entrada','salida'),
    IN p_id_insumo INT,
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT
        m.id_movimiento_stock,
        m.tipo_movimiento,
        i.nombre_insumo,
        m.cantidad_movimiento,
        DATE_FORMAT(m.fecha_movimiento,'%d-%m-%Y') AS fecha_movimiento,
        DATE_FORMAT(m.fecha_movimiento,'%H:%i:%s') AS hora_movimiento,
        m.detalle_movimiento,
        CONCAT(u.apellido_usuario, ' ', u.nombre_usuario) AS encargado_movimiento
    FROM movimientos_stock m
    INNER JOIN insumos i ON m.id_insumo = i.id_insumo
    INNER JOIN usuarios u ON m.id_usuario = u.id_usuario
    WHERE
        (p_fecha_inicio IS NULL 
            OR m.fecha_movimiento >= CONCAT(p_fecha_inicio, ' 00:00:00'))
    AND (p_fecha_fin IS NULL 
            OR m.fecha_movimiento <= CONCAT(p_fecha_fin, ' 23:59:59'))
    AND (p_tipo_movimiento IS NULL 
            OR m.tipo_movimiento = p_tipo_movimiento)
    AND (p_id_insumo IS NULL 
            OR m.id_insumo = p_id_insumo)
    ORDER BY m.fecha_movimiento DESC
    LIMIT p_limit OFFSET p_offset;
END //


DELIMITER ;
