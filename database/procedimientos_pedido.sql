USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_obtener_mesas_pedido;
DROP PROCEDURE IF EXISTS sp_listar_pedidos;
DROP PROCEDURE IF EXISTS sp_listar_mesas_por_pedido;
DROP PROCEDURE IF EXISTS sp_listar_detalle_por_pedido;
DROP PROCEDURE IF EXISTS sp_insertar_pedido;
DROP PROCEDURE IF EXISTS sp_insertar_mesa_pedido;
DROP PROCEDURE IF EXISTS sp_insertar_detalle_pedido;
DROP PROCEDURE IF EXISTS sp_validar_mesa_disponible;

DELIMITER //

CREATE PROCEDURE sp_obtener_mesas_pedido(
    IN p_fecha_hora DATETIME
)
BEGIN
    SELECT
        m.id_mesa,
        m.numero_mesa,
        CONCAT('Mesa ', m.numero_mesa) AS nombre,
        m.capacidad AS capacidad_mesa,
        m.estado_local,
        CASE
            WHEN bt.id_bloqueo IS NOT NULL THEN 'reservada'
            WHEN mr.id_mesa IS NOT NULL THEN 'reservada'
            ELSE m.estado_local
        END AS estado_mesa
    FROM mesas m
    -- Bloqueo temporal: la fecha/hora del param cae dentro de (bloqueado_desde - 1 hora) y bloqueado_hasta
    LEFT JOIN bloqueos_temporales_mesa bt
        ON bt.id_mesa = m.id_mesa
        AND p_fecha_hora >= DATE_SUB(bt.bloqueado_desde, INTERVAL 1 HOUR)
        AND p_fecha_hora <= bt.bloqueado_hasta
        AND bt.expira_en > NOW()
    -- Reserva activa: la fecha/hora del param cae dentro del rango reservado
    LEFT JOIN mesas_reservacion mr
      ON mr.id_mesa = m.id_mesa
      AND p_fecha_hora >= DATE_SUB(mr.reserva_desde, INTERVAL 89 MINUTE)
      AND p_fecha_hora <= mr.reserva_hasta
    LEFT JOIN reservaciones r
        ON r.id_reservacion = mr.id_reservacion
        AND r.estado_reservacion = 'pendiente';
END //

CREATE PROCEDURE sp_listar_pedidos(
    IN p_fecha_hora DATETIME
)
BEGIN
    SELECT
        p.id_pedido,
        p.estado_pedido,
        p.precio_precuenta,
        GROUP_CONCAT(m.numero_mesa ORDER BY m.numero_mesa SEPARATOR ', ') AS mesas,
        CASE
            WHEN TIMESTAMPDIFF(MINUTE, p.fecha_actualizacion_estado, p_fecha_hora) < 60
                THEN CONCAT(TIMESTAMPDIFF(MINUTE, p.fecha_actualizacion_estado, p_fecha_hora), ' min')
            ELSE
                CONCAT(TIMESTAMPDIFF(HOUR, p.fecha_actualizacion_estado, p_fecha_hora), ' hrs')
        END AS tiempo_desde_actualizacion
    FROM pedido_mesa p
    LEFT JOIN mesas_pedido mp ON mp.id_pedido = p.id_pedido
    LEFT JOIN mesas m ON m.id_mesa = mp.id_mesa
    WHERE DATE(p.fecha_pedido) = DATE(p_fecha_hora)
    GROUP BY p.id_pedido, p.fecha_pedido, p.estado_pedido, p.fecha_actualizacion_estado, p.precio_precuenta
    ORDER BY p.id_pedido DESC;
END //


CREATE PROCEDURE sp_listar_mesas_por_pedido(
    IN p_id_pedido INT
)
BEGIN
    SELECT
        m.id_mesa,
        m.numero_mesa,
        CONCAT('Mesa ', m.numero_mesa) AS nombre
    FROM mesas_pedido mp
    INNER JOIN mesas m ON m.id_mesa = mp.id_mesa
    WHERE mp.id_pedido = p_id_pedido;
END //

CREATE PROCEDURE sp_listar_detalle_por_pedido(
    IN p_id_pedido INT
)
BEGIN
    SELECT
        d.id_detalle_pedido,
        d.cantidad_pedido,
        pr.id_producto,
        pr.nombre_producto,
        pr.precio_producto,
        (d.cantidad_pedido * pr.precio_producto) AS subtotal
    FROM detalle_pedido d
    INNER JOIN productos pr ON pr.id_producto = d.id_producto
    WHERE d.id_pedido = p_id_pedido;
END //

CREATE PROCEDURE sp_insertar_pedido(
    IN p_precio_precuenta DECIMAL(6, 2)
)
BEGIN
    INSERT INTO pedido_mesa (precio_precuenta)
    VALUES (p_precio_precuenta);

    SELECT LAST_INSERT_ID() AS id_pedido;
END //

CREATE PROCEDURE sp_insertar_mesa_pedido(
    IN p_id_mesa INT,
    IN p_id_pedido INT
)
BEGIN
    INSERT INTO mesas_pedido (id_mesa, id_pedido)
    VALUES (p_id_mesa, p_id_pedido);

    UPDATE mesas SET estado_local = 'ocupado' WHERE id_mesa = p_id_mesa;
END //

CREATE PROCEDURE sp_insertar_detalle_pedido(
    IN p_id_pedido INT,
    IN p_id_producto INT,
    IN p_cantidad INT
)
BEGIN
    INSERT INTO detalle_pedido (cantidad_pedido, id_producto, id_pedido)
    VALUES (p_cantidad, p_id_producto, p_id_pedido);
END // 

CREATE PROCEDURE sp_validar_mesa_disponible(
    IN p_id_mesa INT,
    IN p_fecha_hora DATETIME
)
BEGIN
    SELECT
        (
            -- Ocupada por estado_local
            (SELECT COUNT(*) FROM mesas 
             WHERE id_mesa = p_id_mesa 
             AND estado_local = 'ocupado') +

            -- Ocupada por reserva
            (SELECT COUNT(*) FROM mesas_reservacion mr
             INNER JOIN reservaciones r ON r.id_reservacion = mr.id_reservacion
             WHERE mr.id_mesa = p_id_mesa
             AND r.estado_reservacion = 'pendiente'
             AND p_fecha_hora >= DATE_SUB(mr.reserva_desde, INTERVAL 89 MINUTE)
             AND p_fecha_hora <= mr.reserva_hasta) +

            -- Ocupada por bloqueo temporal
            (SELECT COUNT(*) FROM bloqueos_temporales_mesa
             WHERE id_mesa = p_id_mesa
             AND p_fecha_hora >= DATE_SUB(bloqueado_desde, INTERVAL 90 MINUTE)
             AND p_fecha_hora <= bloqueado_hasta
             AND expira_en > NOW())

        ) AS ocupada;
END //

DELIMITER ;