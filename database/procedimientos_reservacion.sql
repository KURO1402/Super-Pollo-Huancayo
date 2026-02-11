USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_obtener_estado_mesa;
DROP PROCEDURE IF EXISTS sp_ocupar_mesa;
DROP PROCEDURE IF EXISTS sp_contar_mesas_por_numero;

DELIMITER //

CREATE PROCEDURE sp_obtener_estado_mesa (
    IN p_numero_mesa INT
)
BEGIN
    SELECT 
        estado_mesa
    FROM mesas
    WHERE numero_mesa = p_numero_mesa;
END //

CREATE PROCEDURE sp_contar_mesas_por_numero (
    IN p_numero_mesa INT
)
BEGIN
    SELECT COUNT(*) AS total_mesas
    FROM mesas
    WHERE numero_mesa = p_numero_mesa;
END //

CREATE PROCEDURE sp_ocupar_mesa(
    IN p_numero_mesa INT,
    IN p_minutos_ocupada INT,
    IN p_fecha_actual DATETIME 
)
BEGIN
    UPDATE mesas 
    SET estado_mesa = 'ocupada',
        ocupado_desde = p_fecha_actual, 
        ocupado_hasta = DATE_ADD(p_fecha_actual, INTERVAL p_minutos_ocupada MINUTE)
    WHERE numero_mesa = p_numero_mesa;
END //

DELIMITER ;