USE super_pollo_hyo;

SET GLOBAL event_scheduler = ON;

DELIMITER //

CREATE EVENT IF NOT EXISTS evt_liberar_mesas_expiradas
ON SCHEDULE EVERY 1 MINUTE
DO
BEGIN
    UPDATE mesas 
    SET estado_mesa = 'disponible',
        ocupado_desde = NULL,
        ocupado_hasta = NULL
    WHERE estado_mesa = 'ocupada' 
      AND ocupado_hasta <= NOW();
END //

DELIMITER ;