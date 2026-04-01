CREATE INDEX idx_reservaciones_optimizacion 
ON reservaciones (estado_reservacion, fecha_reservacion, hora_reservacion);


SET GLOBAL event_scheduler = ON;

CREATE EVENT actualizar_reservas_expiradas
ON SCHEDULE EVERY 1 MINUTE
DO
  UPDATE reservaciones
  SET estado_reservacion = 'cancelado'
  WHERE estado_reservacion = 'pendiente'
  AND TIMESTAMP(fecha_reservacion, hora_reservacion) < NOW() - INTERVAL 30 MINUTE;