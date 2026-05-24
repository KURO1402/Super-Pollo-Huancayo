USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_limpiar_pedido_para_edicion;
DROP PROCEDURE IF EXISTS sp_actualizar_precio_pedido;
DROP PROCEDURE IF EXISTS sp_cancelar_pedido
DROP PROCEDURE IF EXISTS sp_completar_pedido;
DROP PROCEDURE IF EXISTS sp_obtener_cabecera_pedido;
DROP PROCEDURE IF EXISTS sp_obtener_productos_pedido;

DELIMITER //

-- 1. sp_limpiar_pedido_para_edicion

CREATE PROCEDURE sp_limpiar_pedido_para_edicion(
    IN p_id_pedido INT
)
BEGIN
    -- Liberar mesas que actualmente pertenecen al pedido
    UPDATE mesas
    SET estado_local = 'disponible'
    WHERE id_mesa IN (
        SELECT id_mesa FROM mesas_pedido WHERE id_pedido = p_id_pedido
    );

    -- Eliminar relación mesas ↔ pedido
    DELETE FROM mesas_pedido
    WHERE id_pedido = p_id_pedido;

    -- Eliminar detalle actual
    DELETE FROM detalle_pedido
    WHERE id_pedido = p_id_pedido;
END //


-- 2. sp_actualizar_precio_pedido
CREATE PROCEDURE sp_actualizar_precio_pedido(
    IN p_id_pedido        INT,
    IN p_precio_precuenta DECIMAL(6,2)
)
BEGIN
    UPDATE pedido_mesa
    SET precio_precuenta = p_precio_precuenta
    WHERE id_pedido = p_id_pedido;
END //


-- 3. sp_cancelar_pedido

CREATE PROCEDURE sp_cancelar_pedido(
    IN p_id_pedido INT
)
BEGIN
    -- Actualizar estado del pedido
    UPDATE pedido_mesa
    SET estado_pedido = 'cancelado'
    WHERE id_pedido = p_id_pedido;

    -- Liberar mesas asociadas
    UPDATE mesas
    SET estado_local = 'disponible'
    WHERE id_mesa IN (
        SELECT id_mesa FROM mesas_pedido WHERE id_pedido = p_id_pedido
    );
END //

CREATE PROCEDURE sp_completar_pedido(
    IN p_id_pedido INT
)
BEGIN
    -- Actualizar estado del pedido
    UPDATE pedido_mesa
    SET estado_pedido = 'completado'
    WHERE id_pedido = p_id_pedido;

    -- Liberar mesas asociadas
    UPDATE mesas
    SET estado_local = 'disponible'
    WHERE id_mesa IN (
        SELECT id_mesa FROM mesas_pedido WHERE id_pedido = p_id_pedido
    );
END //

DELIMITER ;