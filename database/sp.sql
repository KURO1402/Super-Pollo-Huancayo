USE super_pollo_hyo;

-- Procedimientos de categorias de productos
DROP PROCEDURE IF EXISTS sp_insertar_categoria_producto;
DROP PROCEDURE IF EXISTS sp_contar_categoria_por_nombre;
DROP PROCEDURE IF EXISTS sp_actualizar_categoria_producto;
DROP PROCEDURE IF EXISTS sp_contar_categoria_por_nombre_excluyendo_id;
DROP PROCEDURE IF EXISTS sp_contar_categoria_por_id;
DROP PROCEDURE IF EXISTS sp_eliminar_categoria_producto;
DROP PROCEDURE IF EXISTS sp_contar_productos_por_categoria;
DROP PROCEDURE IF EXISTS sp_listar_categorias_producto;
DROP PROCEDURE IF EXISTS sp_obtener_categoria_producto_por_id;

-- Procedimientos para tipo de documento
DROP PROCEDURE IF EXISTS sp_insertar_tipo_documento;
DROP PROCEDURE IF EXISTS sp_contar_tipo_documento_por_nombre;
DROP PROCEDURE IF EXISTS sp_contar_tipo_documento_por_id;
DROP PROCEDURE IF EXISTS sp_contar_tipo_documento_nombre_excluyendo_id;
DROP PROCEDURE IF EXISTS sp_actualizar_tipo_documento;
DROP PROCEDURE IF EXISTS sp_eliminar_tipo_documento;
DROP PROCEDURE IF EXISTS sp_listar_tipos_documento;
DROP PROCEDURE IF EXISTS sp_obtener_tipo_documento_por_id;
-- Procedimientos para medios de pago
DROP PROCEDURE IF EXISTS sp_insertar_medio_pago;
DROP PROCEDURE IF EXISTS sp_contar_medio_pago_por_nombre;
DROP PROCEDURE IF EXISTS sp_actualizar_medio_pago;
DROP PROCEDURE IF EXISTS sp_contar_medio_pago_por_id;
DROP PROCEDURE IF EXISTS sp_contar_medio_pago_nombre_excluyendo_id;
DROP PROCEDURE IF EXISTS sp_eliminar_medio_pago;
DROP PROCEDURE IF EXISTS sp_listar_medios_pago;
DROP PROCEDURE IF EXISTS sp_obtener_medio_pago_por_id;
-- Procedimientos para tipo de comprobante
DROP PROCEDURE IF EXISTS sp_contar_tipo_comprobante_por_id;
DROP PROCEDURE IF EXISTS sp_obtener_tipo_comprobante_por_id;
DROP PROCEDURE IF EXISTS sp_actualizar_correlativo_tipo_comprobante;
DROP PROCEDURE IF EXISTS sp_insertar_tipo_comprobante;
DROP PROCEDURE IF EXISTS sp_contar_tipo_comprobante_por_nombre_serie;
DROP PROCEDURE IF EXISTS sp_actualizar_tipo_comprobante;
DROP PROCEDURE IF EXISTS sp_contar_tipo_comprobante_nombre_serie_excluyendo_id;
DROP PROCEDURE IF EXISTS sp_eliminar_tipo_comprobante;
DROP PROCEDURE IF EXISTS sp_listar_tipos_comprobante;
DROP PROCEDURE IF EXISTS sp_crear_caja_con_evento;
DROP PROCEDURE IF EXISTS sp_cerrar_caja_registrar_evento;
DROP PROCEDURE IF EXISTS sp_consultar_caja_abierta;
DROP PROCEDURE IF EXISTS sp_registrar_ingreso_caja;
DROP PROCEDURE IF EXISTS sp_registrar_egreso_caja;
DROP PROCEDURE IF EXISTS sp_registrar_arqueo_caja;
DROP PROCEDURE IF EXISTS sp_obtener_movimientos_por_caja;
DROP PROCEDURE IF EXISTS sp_contar_movimientos_por_caja;
DROP PROCEDURE IF EXISTS sp_contar_cajas;
DROP PROCEDURE IF EXISTS sp_listar_cajas;
DROP PROCEDURE IF EXISTS sp_obtener_arqueos_por_caja;
DROP PROCEDURE IF EXISTS sp_obtener_caja_actual;
DROP PROCEDURE IF EXISTS sp_resumen_ventas_egresos_mensual;
DROP PROCEDURE IF EXISTS sp_ventas_hoy_comparacion;
DROP PROCEDURE IF EXISTS sp_reservas_mes_comparacion;
DROP PROCEDURE IF EXISTS sp_balance_general_anual;
DROP PROCEDURE IF EXISTS sp_porcentaje_medios_pago;
DROP PROCEDURE IF EXISTS sp_ventas_por_mes;
DROP PROCEDURE IF EXISTS sp_top_productos_mas_vendidos;
DROP PROCEDURE IF EXISTS sp_insertar_insumo;
DROP PROCEDURE IF EXISTS sp_contar_insumos_por_nombre;
DROP PROCEDURE IF EXISTS sp_recuperar_insumo;
DROP PROCEDURE IF EXISTS sp_actualizar_insumo_datos;
DROP PROCEDURE IF EXISTS sp_actualizar_estado_insumo;
DROP PROCEDURE IF EXISTS sp_contar_insumo_por_id;
DROP PROCEDURE IF EXISTS sp_contar_insumos_por_nombre_2;
DROP PROCEDURE IF EXISTS sp_obtener_insumos;
DROP PROCEDURE IF EXISTS sp_contar_insumos;
DROP PROCEDURE IF EXISTS sp_obtener_insumo_por_id;
DROP PROCEDURE IF EXISTS sp_optener_stock_actual_insumo;
DROP PROCEDURE IF EXISTS sp_eliminar_insumo;
DROP PROCEDURE IF EXISTS sp_registrar_movimiento_stock;
DROP PROCEDURE IF EXISTS sp_contar_movimientos_stock_filtros;
DROP PROCEDURE IF EXISTS sp_obtener_movimientos_stock_filtros;
DROP PROCEDURE IF EXISTS sp_obtener_mesas_pedido;
DROP PROCEDURE IF EXISTS sp_listar_pedidos;
DROP PROCEDURE IF EXISTS sp_listar_mesas_por_pedido;
DROP PROCEDURE IF EXISTS sp_listar_detalle_por_pedido;
DROP PROCEDURE IF EXISTS sp_insertar_pedido;
DROP PROCEDURE IF EXISTS sp_insertar_mesa_pedido;
DROP PROCEDURE IF EXISTS sp_insertar_detalle_pedido;
DROP PROCEDURE IF EXISTS sp_validar_mesa_disponible;
DROP PROCEDURE IF EXISTS sp_obtener_estado_pedido;
DROP PROCEDURE IF EXISTS sp_obtener_detalle_pedido;
DROP PROCEDURE IF EXISTS sp_obtener_mesas_de_un_pedido;
DROP PROCEDURE IF EXISTS sp_contar_productos_nombre_act_ina;
DROP PROCEDURE IF EXISTS sp_contar_categoria_por_id_2;
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
DROP PROCEDURE IF EXISTS sp_verificar_mesa_disponible;
DROP PROCEDURE IF EXISTS sp_bloquear_mesa;
DROP PROCEDURE IF EXISTS sp_obtener_estado_mesa;
DROP PROCEDURE IF EXISTS sp_obtener_mesa_por_id;
DROP PROCEDURE IF EXISTS sp_insertar_reservacion;
DROP PROCEDURE IF EXISTS sp_insertar_mesas_reservacion;
DROP PROCEDURE IF EXISTS sp_insertar_pago_reservacion;
DROP PROCEDURE IF EXISTS sp_obtener_reservacion_por_codigo;
DROP PROCEDURE IF EXISTS sp_confirmar_reservacion;
DROP PROCEDURE IF EXISTS sp_cancelar_reservacion;
DROP PROCEDURE IF EXISTS sp_obtener_estado_reservacion;
DROP PROCEDURE IF EXISTS sp_contar_reservacion_por_id;
DROP PROCEDURE IF EXISTS sp_obtener_mesas_por_id_reservacion;
DROP PROCEDURE IF EXISTS sp_listar_mesas_disponibilidad;
DROP PROCEDURE IF EXISTS sp_listar_reservaciones_por_rango;
DROP PROCEDURE IF EXISTS sp_listar_reservaciones_por_usuario;
DROP PROCEDURE IF EXISTS sp_obtener_reservacion_por_id;
DROP PROCEDURE IF EXISTS sp_obtener_pago_por_reservacion;
DROP PROCEDURE IF EXISTS sp_listar_roles;
DROP PROCEDURE IF EXISTS sp_registrar_usuario;
DROP PROCEDURE IF EXISTS sp_seleccionar_total_usuario_correo;
DROP PROCEDURE IF EXISTS sp_registrar_codigo_verificacion;
DROP PROCEDURE IF EXISTS sp_obtener_verificacion_correo;
DROP PROCEDURE IF EXISTS sp_verificar_codigo_correo;
DROP PROCEDURE IF EXISTS sp_verificar_validacion_correo;
DROP PROCEDURE IF EXISTS sp_seleccionar_usuario_correo;
DROP PROCEDURE IF EXISTS sp_contar_usuarios;
DROP PROCEDURE IF EXISTS sp_listar_usuarios;
DROP PROCEDURE IF EXISTS sp_contar_usuario_id;
DROP PROCEDURE IF EXISTS sp_obtener_usuario_por_id;
DROP PROCEDURE IF EXISTS sp_obtener_historial_roles_usuario;
DROP PROCEDURE IF EXISTS sp_obtener_clave_usuario_por_id;
DROP PROCEDURE IF EXISTS sp_actualizar_datos_usuario;
DROP PROCEDURE IF EXISTS sp_actualizar_correo_usuario;
DROP PROCEDURE IF EXISTS sp_actualizar_clave_usuario;
DROP PROCEDURE IF EXISTS sp_actualizar_estado_usuario;
DROP PROCEDURE IF EXISTS sp_actualizar_rol_usuario;
DROP PROCEDURE IF EXISTS sp_obtener_rol_por_id_rol;
DROP PROCEDURE IF EXISTS sp_generar_venta;
DROP PROCEDURE IF EXISTS sp_obtener_detalle_venta_por_id_venta;
DROP PROCEDURE IF EXISTS sp_obtener_comprobante_por_id_venta;
DROP PROCEDURE IF EXISTS sp_obtener_venta_por_id;
DROP PROCEDURE IF EXISTS sp_obtener_ventas;
DROP PROCEDURE IF EXISTS sp_contar_ventas;
DROP PROCEDURE IF EXISTS sp_contar_venta_por_id;
DROP PROCEDURE IF EXISTS sp_obtener_comprobantes_pendientes_vencidos;
DROP PROCEDURE IF EXISTS sp_obtener_comprobante_pendiente_por_id;
DROP PROCEDURE IF EXISTS sp_actualizar_estado_sunat;
DROP PROCEDURE IF EXISTS sp_anular_venta;
DROP PROCEDURE IF EXISTS sp_obtener_venta_para_anular;
DROP PROCEDURE IF EXISTS sp_reenviar_comprobante;

DELIMITER //

CREATE PROCEDURE sp_insertar_categoria_producto (
    IN p_nombre_categoria VARCHAR(100)
)
BEGIN
    DECLARE v_id_categoria INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    INSERT INTO categorias_producto (nombre_categoria)
    VALUES (p_nombre_categoria);

    SET v_id_categoria = LAST_INSERT_ID();

    COMMIT;

    SELECT 
        id_categoria,
        nombre_categoria
    FROM categorias_producto
    WHERE id_categoria = v_id_categoria;

END //

CREATE PROCEDURE sp_contar_categoria_por_nombre (
    IN p_nombre_categoria VARCHAR(100)
)
BEGIN
    SELECT 
        COUNT(*) AS total
    FROM categorias_producto
    WHERE nombre_categoria = p_nombre_categoria;
END //

CREATE PROCEDURE sp_actualizar_categoria_producto (
    IN p_id_categoria INT,
    IN p_nombre_categoria VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE categorias_producto
    SET nombre_categoria = p_nombre_categoria
    WHERE id_categoria = p_id_categoria;

    COMMIT;

    SELECT 
        id_categoria,
        nombre_categoria
    FROM categorias_producto
    WHERE id_categoria = p_id_categoria;

END //

CREATE PROCEDURE sp_contar_categoria_por_nombre_excluyendo_id (
    IN p_id_categoria INT,
    IN p_nombre_categoria VARCHAR(100)
)
BEGIN
    SELECT 
        COUNT(*) AS total
    FROM categorias_producto
    WHERE nombre_categoria = p_nombre_categoria
      AND id_categoria <> p_id_categoria;
END //

CREATE PROCEDURE sp_contar_categoria_por_id (
    IN p_id_categoria INT
)
BEGIN
    SELECT 
        COUNT(*) AS total
    FROM categorias_producto
    WHERE id_categoria = p_id_categoria;
END //

CREATE PROCEDURE sp_eliminar_categoria_producto (
    IN p_id_categoria INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    DELETE FROM categorias_producto
    WHERE id_categoria = p_id_categoria;

    COMMIT;

    SELECT 'Categoria eliminada exitosamente' AS mensaje;
END //

CREATE PROCEDURE sp_contar_productos_por_categoria (
    IN p_id_categoria INT
)
BEGIN
    SELECT 
        COUNT(*) AS total
    FROM productos
    WHERE id_categoria = p_id_categoria;
END //

CREATE PROCEDURE sp_listar_categorias_producto ()
BEGIN
    SELECT 
        id_categoria,
        nombre_categoria
    FROM categorias_producto
    ORDER BY id_categoria ASC;
END //

CREATE PROCEDURE sp_obtener_categoria_producto_por_id (
    IN p_id_categoria INT
)
BEGIN
    SELECT 
        id_categoria,
        nombre_categoria
    FROM categorias_producto
    WHERE id_categoria = p_id_categoria;
END //

-- Procedimientos para tipo de documento
CREATE PROCEDURE sp_insertar_tipo_documento (
    IN p_nombre_tipo_documento VARCHAR(50)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_estado TINYINT(1);

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

        SELECT id_tipo_documento, estado_documento
        INTO v_id, v_estado
        FROM tipo_documento
        WHERE nombre_tipo_documento = p_nombre_tipo_documento
        LIMIT 1;

        IF v_id IS NULL THEN
            INSERT INTO tipo_documento (nombre_tipo_documento, estado_documento)
            VALUES (p_nombre_tipo_documento, 1);

            SET v_id = LAST_INSERT_ID();

        ELSEIF v_estado = 0 THEN
            UPDATE tipo_documento
            SET estado_documento = 1
            WHERE id_tipo_documento = v_id;
        END IF;

    COMMIT;

    SELECT 
        id_tipo_documento,
        nombre_tipo_documento
    FROM tipo_documento
    WHERE id_tipo_documento = v_id;

END //

CREATE PROCEDURE sp_contar_tipo_documento_por_nombre (
    IN p_nombre VARCHAR(50)
)
BEGIN
    SELECT
        COUNT(*) as total
    FROM tipo_documento
    WHERE nombre_tipo_documento = p_nombre
    AND estado_documento = 1;
END //

CREATE PROCEDURE sp_actualizar_tipo_documento (
    IN p_id_tipo_documento INT,
    IN p_nombre_tipo_documento VARCHAR(50)
)
BEGIN

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

        UPDATE tipo_documento
        SET
            nombre_tipo_documento = p_nombre_tipo_documento
        WHERE id_tipo_documento = p_id_tipo_documento;

    COMMIT;


    SELECT 
    id_tipo_documento,
    nombre_tipo_documento
    FROM tipo_documento
    WHERE id_tipo_documento = p_id_tipo_documento;

END //

CREATE PROCEDURE sp_contar_tipo_documento_por_id (
    IN p_id_tipo_documento INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM tipo_documento
    WHERE id_tipo_documento = p_id_tipo_documento
    AND estado_documento = 1;
END //

CREATE PROCEDURE sp_contar_tipo_documento_nombre_excluyendo_id (
    IN p_nombre_tipo_documento VARCHAR(50),
    IN p_id_tipo_documento INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM tipo_documento
    WHERE nombre_tipo_documento = p_nombre_tipo_documento
      AND id_tipo_documento <> p_id_tipo_documento;
END //

CREATE PROCEDURE sp_eliminar_tipo_documento (
    IN p_id_tipo_documento INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE tipo_documento
    SET estado_documento = 0
    WHERE id_tipo_documento = p_id_tipo_documento;

    COMMIT;

    SELECT 'Tipo de documento eliminado correctamente' AS mensaje;
END //

CREATE PROCEDURE sp_listar_tipos_documento()
BEGIN
    SELECT 
        id_tipo_documento,
        nombre_tipo_documento
    FROM tipo_documento
    WHERE estado_documento = 1
    ORDER BY nombre_tipo_documento;
END //

CREATE PROCEDURE sp_obtener_tipo_documento_por_id(
    IN p_id_tipo_documento INT
)
BEGIN
    SELECT 
        id_tipo_documento,
        nombre_tipo_documento
    FROM tipo_documento
    WHERE id_tipo_documento = p_id_tipo_documento
      AND estado_documento = 1;
END  //

-- Procedimientos para medios de pago 
CREATE PROCEDURE sp_insertar_medio_pago (
    IN p_nombre_medio_pago VARCHAR(50)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_estado TINYINT(1);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

        SELECT id_medio_pago, estado_medio_pago
        INTO v_id, v_estado
        FROM medio_pago
        WHERE nombre_medio_pago = p_nombre_medio_pago
        LIMIT 1;

        IF v_id IS NULL THEN
            INSERT INTO medio_pago (nombre_medio_pago, estado_medio_pago)
            VALUES (p_nombre_medio_pago, 1);

            SET v_id = LAST_INSERT_ID();

        ELSEIF v_estado = 0 THEN
            UPDATE medio_pago
            SET estado_medio_pago = 1
            WHERE id_medio_pago = v_id;
        END IF;

    COMMIT;

    SELECT 
        id_medio_pago,
        nombre_medio_pago
    FROM medio_pago
    WHERE id_medio_pago = v_id;

END //

CREATE PROCEDURE sp_contar_medio_pago_por_nombre (
    IN p_nombre VARCHAR(50)
)
BEGIN
    SELECT
        COUNT(*) AS total
    FROM medio_pago
    WHERE nombre_medio_pago = p_nombre
      AND estado_medio_pago = 1;
END //

CREATE PROCEDURE sp_actualizar_medio_pago (
    IN p_id_medio_pago INT,
    IN p_nombre_medio_pago VARCHAR(50)
)
BEGIN

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

        UPDATE medio_pago
        SET nombre_medio_pago = p_nombre_medio_pago
        WHERE id_medio_pago = p_id_medio_pago;

    COMMIT;

    SELECT 
        id_medio_pago,
        nombre_medio_pago
    FROM medio_pago
    WHERE id_medio_pago = p_id_medio_pago;

END //

CREATE PROCEDURE sp_contar_medio_pago_por_id (
    IN p_id_medio_pago INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM medio_pago
    WHERE id_medio_pago = p_id_medio_pago
      AND estado_medio_pago = 1;
END //

CREATE PROCEDURE sp_contar_medio_pago_nombre_excluyendo_id (
    IN p_nombre_medio_pago VARCHAR(50),
    IN p_id_medio_pago INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM medio_pago
    WHERE nombre_medio_pago = p_nombre_medio_pago
      AND id_medio_pago <> p_id_medio_pago;
END //


CREATE PROCEDURE sp_eliminar_medio_pago (
    IN p_id_medio_pago INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

        UPDATE medio_pago
        SET estado_medio_pago = 0
        WHERE id_medio_pago = p_id_medio_pago;

    COMMIT;

    SELECT 'Medio de pago eliminado correctamente' AS mensaje;
END //

CREATE PROCEDURE sp_listar_medios_pago()
BEGIN
    SELECT 
        id_medio_pago,
        nombre_medio_pago
    FROM medio_pago
    WHERE estado_medio_pago = 1
    ORDER BY nombre_medio_pago;
END //

CREATE PROCEDURE sp_obtener_medio_pago_por_id(
    IN p_id_medio_pago INT
)
BEGIN
    SELECT 
        id_medio_pago,
        nombre_medio_pago
    FROM medio_pago
    WHERE id_medio_pago = p_id_medio_pago
      AND estado_medio_pago = 1;
END //

-- Procedimientos para tipos_comprobante
CREATE PROCEDURE sp_obtener_tipo_comprobante_por_id(
    IN p_id_tipo_comprobante INT
)
BEGIN
    SELECT 
        id_tipo_comprobante,
        nombre_tipo_comprobante,
        serie,
        correlativo
    FROM tipo_comprobante
    WHERE id_tipo_comprobante = p_id_tipo_comprobante
    AND estado_comprobante = 1;
END //

CREATE PROCEDURE sp_actualizar_correlativo_tipo_comprobante(
    IN p_id_tipo_comprobante INT,
    IN p_nuevo_correlativo INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE tipo_comprobante
    SET correlativo = p_nuevo_correlativo
    WHERE id_tipo_comprobante = p_id_tipo_comprobante;

    COMMIT;
END //

CREATE PROCEDURE sp_insertar_tipo_comprobante (
    IN p_nombre_tipo_comprobante VARCHAR(50),
    IN p_serie VARCHAR(5)
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_estado TINYINT(1);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

        SELECT id_tipo_comprobante, estado_comprobante
        INTO v_id, v_estado
        FROM tipo_comprobante
        WHERE nombre_tipo_comprobante = p_nombre_tipo_comprobante
          AND serie = p_serie
        LIMIT 1;

        IF v_id IS NULL THEN
            INSERT INTO tipo_comprobante (nombre_tipo_comprobante, serie, correlativo, estado_comprobante)
            VALUES (p_nombre_tipo_comprobante, p_serie, 0, 1);

            SET v_id = LAST_INSERT_ID();

        ELSEIF v_estado = 0 THEN
            UPDATE tipo_comprobante
            SET estado_comprobante = 1
            WHERE id_tipo_comprobante = v_id;
        END IF;

    COMMIT;

    SELECT 
        id_tipo_comprobante,
        nombre_tipo_comprobante,
        serie,
        correlativo
    FROM tipo_comprobante
    WHERE id_tipo_comprobante = v_id;

END //


CREATE PROCEDURE sp_contar_tipo_comprobante_por_nombre_serie (
    IN p_nombre VARCHAR(50),
    IN p_serie VARCHAR(5)
)
BEGIN
    SELECT COUNT(*) AS total
    FROM tipo_comprobante
    WHERE (nombre_tipo_comprobante = p_nombre OR serie = p_serie)
      AND estado_comprobante = 1;
END //


CREATE PROCEDURE sp_actualizar_tipo_comprobante (
    IN p_id_tipo_comprobante INT,
    IN p_nombre_tipo_comprobante VARCHAR(50),
    IN p_serie VARCHAR(5)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

        UPDATE tipo_comprobante
        SET nombre_tipo_comprobante = p_nombre_tipo_comprobante,
            serie = p_serie
        WHERE id_tipo_comprobante = p_id_tipo_comprobante;

    COMMIT;

    SELECT 
        id_tipo_comprobante,
        nombre_tipo_comprobante,
        serie,
        correlativo
    FROM tipo_comprobante
    WHERE id_tipo_comprobante = p_id_tipo_comprobante;

END //

CREATE PROCEDURE sp_contar_tipo_comprobante_por_id (
    IN p_id_tipo_comprobante INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM tipo_comprobante
    WHERE id_tipo_comprobante = p_id_tipo_comprobante
      AND estado_comprobante = 1;
END //


CREATE PROCEDURE sp_contar_tipo_comprobante_nombre_serie_excluyendo_id (
    IN p_nombre_tipo_comprobante VARCHAR(50),
    IN p_serie VARCHAR(5),
    IN p_id_tipo_comprobante INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM tipo_comprobante
    WHERE (nombre_tipo_comprobante = p_nombre_tipo_comprobante
      OR serie = p_serie)
      AND id_tipo_comprobante <> p_id_tipo_comprobante
      AND estado_comprobante = 1;
END //


CREATE PROCEDURE sp_eliminar_tipo_comprobante (
    IN p_id_tipo_comprobante INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

        UPDATE tipo_comprobante
        SET estado_comprobante = 0
        WHERE id_tipo_comprobante = p_id_tipo_comprobante;

    COMMIT;

    SELECT 'Tipo de comprobante eliminado correctamente' AS mensaje;

END //


CREATE PROCEDURE sp_listar_tipos_comprobante ()
BEGIN
    SELECT 
        id_tipo_comprobante,
        nombre_tipo_comprobante,
        serie,
        correlativo
    FROM tipo_comprobante
    WHERE estado_comprobante = 1
    ORDER BY nombre_tipo_comprobante;
END //

-- Procedimiento de apertura de caja con evento de apertura
CREATE PROCEDURE sp_crear_caja_con_evento(
    IN p_saldo_inicial DECIMAL(10,2),
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_id_caja INT;
    -- v_fecha_actual ahora solo se usa para eventos y movimientos (que suelen ser DATETIME)
    DECLARE v_fecha_actual DATETIME DEFAULT NOW();

    -- Manejo de errores
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    -- Validar que no exista una caja abierta
    IF EXISTS (SELECT 1 FROM caja WHERE estado_caja = 'abierta') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Ya existe una caja abierta. No se puede crear otra.';
    END IF;

    START TRANSACTION;

    INSERT INTO caja (saldo_inicial, monto_actual, saldo_final, estado_caja)
    VALUES (p_saldo_inicial, p_saldo_inicial, NULL, 'abierta');

    SET v_id_caja = LAST_INSERT_ID();

    INSERT INTO eventos_caja (tipo_evento, fecha_evento, id_caja, id_usuario)
    VALUES ('apertura', v_fecha_actual, v_id_caja, p_id_usuario);

    INSERT INTO movimientos_caja (
        tipo_movimiento,
        fecha_movimiento,
        monto_movimiento,
        descripcion_mov_caja,
        id_caja,
        id_usuario
    )
    VALUES (
        'ingreso',
        v_fecha_actual,
        p_saldo_inicial,
        'Saldo inicial de apertura',
        v_id_caja,
        p_id_usuario
    );

    COMMIT;

    SELECT
        c.id_caja,
        c.saldo_inicial,
        c.monto_actual,
        IFNULL(c.saldo_final, '---') AS saldo_final,
        DATE_FORMAT(c.fecha_caja, '%d-%m-%Y') AS fecha_caja,
        IFNULL(TIME_FORMAT(c.hora_cierre, '%H:%i:%s'), '--') AS hora_cierre,
        c.estado_caja
    FROM caja c
    WHERE c.id_caja = v_id_caja;
END //

-- Procedimiento de cierre de caja con evento de cierre
CREATE PROCEDURE sp_cerrar_caja_registrar_evento(
    IN p_id_caja INT,
    IN p_id_usuario INT,
    IN p_saldo_final DECIMAL(10,2)
)
BEGIN
    DECLARE v_fecha_actual DATETIME;

    -- Manejo de errores: rollback automático si algo falla
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET v_fecha_actual = NOW();

    -- Iniciar transacción
    START TRANSACTION;
    
    -- Cerrar la caja (actualizar saldo_final, hora_cierre y estado)
    UPDATE caja
    SET saldo_final = p_saldo_final, 
        hora_cierre = CURTIME(),
        estado_caja = 'cerrada'
    WHERE id_caja = p_id_caja;
    
    -- Registrar el evento de cierre
    INSERT INTO eventos_caja (tipo_evento, fecha_evento, id_caja, id_usuario)
    VALUES ('cierre', v_fecha_actual, p_id_caja, p_id_usuario);
    
    -- Confirmar transacción
    COMMIT;

    SELECT 'Caja cerrada correctamente' AS mensaje;
END //

-- Procedimiento de consultar caja abierta
CREATE PROCEDURE sp_consultar_caja_abierta()
BEGIN
    -- Buscar caja con estado "abierta"
    SELECT 
        id_caja,
        monto_actual
    FROM caja
    WHERE estado_caja = 'abierta'
    ORDER BY fecha_caja DESC
    LIMIT 1;
END //

-- Procedimiento para registrar un ingreso en caja
CREATE PROCEDURE sp_registrar_ingreso_caja(
    IN p_monto DECIMAL(10,2),
    IN p_descripcion TEXT,
    IN p_id_usuario INT,
    IN p_id_venta INT
)
BEGIN
    DECLARE v_id_caja INT;
    DECLARE v_monto_actual DECIMAL(10,2);
    DECLARE v_fecha_actual DATETIME;
    DECLARE v_id_movimiento INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET v_fecha_actual = NOW();

    START TRANSACTION;

    SELECT id_caja, monto_actual
    INTO v_id_caja, v_monto_actual
    FROM caja
    WHERE estado_caja = 'abierta'
    ORDER BY fecha_caja DESC
    LIMIT 1
    FOR UPDATE;

    IF v_id_caja IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No hay ninguna caja abierta para registrar el ingreso';
    END IF;

    INSERT INTO movimientos_caja (
        tipo_movimiento,
        fecha_movimiento,
        monto_movimiento,
        descripcion_mov_caja,
        id_caja,
        id_usuario,
        id_venta
    )
    VALUES (
        'ingreso',
        v_fecha_actual,
        p_monto,
        p_descripcion,
        v_id_caja,
        p_id_usuario,
        p_id_venta
    );

    SET v_id_movimiento = LAST_INSERT_ID();

    UPDATE caja
    SET monto_actual = v_monto_actual + p_monto
    WHERE id_caja = v_id_caja;

    COMMIT;

    SELECT 
        mc.id_movimiento_caja,
        mc.tipo_movimiento,
        mc.descripcion_mov_caja,
        mc.monto_movimiento,
        DATE_FORMAT(mc.fecha_movimiento, '%d-%m-%Y') AS fecha,
        DATE_FORMAT(mc.fecha_movimiento, '%H:%i:%s') AS hora,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS nombre_usuario
    FROM movimientos_caja mc
    INNER JOIN usuarios u ON mc.id_usuario = u.id_usuario
    WHERE mc.id_movimiento_caja = v_id_movimiento;
END //

-- Procedimiento para registrar un egreso en caja
CREATE PROCEDURE sp_registrar_egreso_caja(
    IN p_monto DECIMAL(10,2),
    IN p_descripcion TEXT,
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_id_caja INT;
    DECLARE v_monto_actual DECIMAL(10,2);
    DECLARE v_fecha_actual DATETIME;
    DECLARE v_id_movimiento INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    SET v_fecha_actual = NOW();

    START TRANSACTION;

    SELECT id_caja, monto_actual
    INTO v_id_caja, v_monto_actual
    FROM caja
    WHERE estado_caja = 'abierta'
    ORDER BY fecha_caja DESC
    LIMIT 1
    FOR UPDATE;

    IF v_id_caja IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No hay ninguna caja abierta para registrar el egreso';
    END IF;

    IF v_monto_actual < p_monto THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Saldo insuficiente en caja para realizar el egreso';
    END IF;

    INSERT INTO movimientos_caja (
        tipo_movimiento,
        fecha_movimiento,
        monto_movimiento,
        descripcion_mov_caja,
        id_caja,
        id_usuario
    )
    VALUES (
        'egreso',
        v_fecha_actual,
        p_monto,
        p_descripcion,
        v_id_caja,
        p_id_usuario
    );

    SET v_id_movimiento = LAST_INSERT_ID();

    UPDATE caja
    SET monto_actual = v_monto_actual - p_monto
    WHERE id_caja = v_id_caja;

    COMMIT;

    SELECT 
        mc.id_movimiento_caja,
        mc.tipo_movimiento,
        mc.descripcion_mov_caja,
        mc.monto_movimiento,
        DATE_FORMAT(mc.fecha_movimiento, '%d-%m-%Y') AS fecha,
        DATE_FORMAT(mc.fecha_movimiento, '%H:%i:%s') AS hora,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS nombre_usuario
    FROM movimientos_caja mc
    INNER JOIN usuarios u ON mc.id_usuario = u.id_usuario
    WHERE mc.id_movimiento_caja = v_id_movimiento;
END //

-- Procedimiento para registrar un arqueo de caja
CREATE PROCEDURE sp_registrar_arqueo_caja(
    IN p_id_usuario INT,
    IN p_id_caja INT,
    IN p_monto_fisico DECIMAL(10,2),
    IN p_monto_tarjeta DECIMAL(10,2),
    IN p_monto_billetera DECIMAL(10,2),
    IN p_monto_otros DECIMAL(10,2),
    IN p_diferencia DECIMAL(10,2),
    IN p_estado_arqueo ENUM('cuadra', 'sobra', 'falta'),
    IN p_descripcion_arqueo TEXT
)
BEGIN

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    INSERT INTO arqueos_caja (
        fecha_arqueo,
        monto_fisico,
        monto_tarjeta,
        monto_billetera_digital,
        otros,
        diferencia,
        estado_caja,
        descripcion_arqueo,
        id_caja,
        id_usuario
    )
    VALUES (
        NOW(),
        p_monto_fisico,
        p_monto_tarjeta,
        p_monto_billetera,
        p_monto_otros,
        p_diferencia,
        p_estado_arqueo,
        p_descripcion_arqueo,
        p_id_caja,
        p_id_usuario
    );

    COMMIT;
    SELECT 'Arqueo registrado exitosamente' AS mensaje;
END //

-- Procedimiento para obtener los movimientos de una caja específica
CREATE PROCEDURE sp_obtener_movimientos_por_caja(
    IN p_id_caja INT,
    IN p_tipo_movimiento VARCHAR(50),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        mc.id_movimiento_caja,
        mc.tipo_movimiento,
        mc.descripcion_mov_caja,
        mc.monto_movimiento,
        DATE_FORMAT(mc.fecha_movimiento, '%d-%m-%Y') AS fecha,
        DATE_FORMAT(mc.fecha_movimiento, '%H:%i:%s') AS hora,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS nombre_usuario
    FROM movimientos_caja mc
    INNER JOIN usuarios u 
        ON mc.id_usuario = u.id_usuario
    WHERE mc.id_caja = p_id_caja
      AND (p_tipo_movimiento IS NULL 
           OR mc.tipo_movimiento = p_tipo_movimiento)
    ORDER BY mc.fecha_movimiento DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE sp_contar_movimientos_por_caja(
    IN p_id_caja INT,
    IN p_tipo_movimiento VARCHAR(50)
)
BEGIN
    SELECT 
        COUNT(*) AS total_registros
    FROM movimientos_caja mc
    WHERE mc.id_caja = p_id_caja
      AND (p_tipo_movimiento IS NULL 
           OR mc.tipo_movimiento = p_tipo_movimiento);
END //

-- Procedimiento para obtener detalles de las cajas cerradas por partes
CREATE PROCEDURE sp_contar_cajas (
    IN p_fechaInicio DATE,
    IN p_fechaFin DATE
)
BEGIN
    SELECT COUNT(*) AS total_registros
    FROM caja c
    WHERE
        (p_fechaInicio IS NULL OR DATE(c.fecha_caja) >= p_fechaInicio)
        AND (p_fechaFin IS NULL OR DATE(c.fecha_caja) <= p_fechaFin)
        AND c.estado_caja <> 'abierta';
END //

CREATE PROCEDURE sp_listar_cajas (
    IN p_limit INT,
    IN p_offset INT,
    IN p_fechaInicio DATE,
    IN p_fechaFin DATE
)
BEGIN
    SELECT
        c.id_caja,
        c.saldo_inicial,
        c.monto_actual,
        IFNULL(c.saldo_final, '---') AS saldo_final,
        DATE_FORMAT(c.fecha_caja, '%d-%m-%Y') AS fecha_caja,
        IFNULL(TIME_FORMAT(c.hora_cierre, '%H:%i:%s'), '--') AS hora_cierre,
        c.estado_caja
    FROM caja c
    WHERE
        (p_fechaInicio IS NULL OR c.fecha_caja >= p_fechaInicio)
        AND (p_fechaFin IS NULL OR c.fecha_caja <= p_fechaFin)
        AND c.estado_caja <> 'abierta'
    ORDER BY c.fecha_caja DESC, c.id_caja DESC
    LIMIT p_limit OFFSET p_offset;
END //

-- Procedimiento para obtener los arqueos de la caja abierta
CREATE PROCEDURE sp_obtener_arqueos_por_caja(
    IN p_id_caja INT
)
BEGIN
    SELECT 
        ac.id_arqueo,
        DATE_FORMAT(ac.fecha_arqueo, '%H:%i:%s') AS hora_arqueo,
        DATE_FORMAT(ac.fecha_arqueo, '%d-%m-%Y') AS fecha_arqueo,
        ac.monto_fisico,
        ac.monto_tarjeta,
        ac.monto_billetera_digital,
        ac.otros,
        ac.diferencia,
        ac.estado_caja,
        IFNULL(ac.descripcion_arqueo, '---') AS descripcion_arqueo,
        DATE_FORMAT(c.fecha_caja, '%d/%m/%Y') AS fecha_caja,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS nombre_usuario
    FROM arqueos_caja ac
    INNER JOIN caja c ON ac.id_caja = c.id_caja
    INNER JOIN usuarios u ON ac.id_usuario = u.id_usuario
    WHERE ac.id_caja = p_id_caja
    ORDER BY ac.fecha_arqueo DESC;
END //

CREATE PROCEDURE sp_obtener_caja_actual()
BEGIN
    SELECT
        c.id_caja,
        c.saldo_inicial,
        c.estado_caja,
        c.monto_actual                                    AS saldo_actual,
        COALESCE(SUM(CASE WHEN m.tipo_movimiento = 'ingreso' 
                     THEN m.monto_movimiento ELSE 0 END), 0) AS total_ingresos,
        COALESCE(SUM(CASE WHEN m.tipo_movimiento = 'egreso'  
                     THEN m.monto_movimiento ELSE 0 END), 0) AS total_egresos
    FROM caja c
    LEFT JOIN movimientos_caja m ON m.id_caja = c.id_caja
    WHERE c.estado_caja = 'abierta'
    GROUP BY c.id_caja, c.saldo_inicial, c.monto_actual
    LIMIT 1;
END //

CREATE PROCEDURE sp_resumen_ventas_egresos_mensual(
    IN p_cantidad_meses INT
)
BEGIN
    SET lc_time_names = 'es_PE';

    SELECT 
        DATE_FORMAT(cal.periodo, '%b %Y') AS mes,
        COALESCE(mc.total_ingresos_caja, 0) + COALESCE(pr.total_reservaciones, 0) AS ingresos,
        COALESCE(mc.total_egresos_caja, 0) AS egresos
    FROM (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m-01') AS periodo
        FROM (
            SELECT 0 AS seq UNION SELECT 1 UNION SELECT 2 UNION SELECT 3
            UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7
            UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11
            UNION SELECT 12 UNION SELECT 13 UNION SELECT 14 UNION SELECT 15
            UNION SELECT 16 UNION SELECT 17 UNION SELECT 18 UNION SELECT 19
            UNION SELECT 20 UNION SELECT 21 UNION SELECT 22 UNION SELECT 23
        ) AS nums
        WHERE seq < p_cantidad_meses
    ) AS cal

    -- Solo movimientos de caja (sin ventas)
    LEFT JOIN (
        SELECT 
            DATE_FORMAT(fecha_movimiento, '%Y-%m-01') AS periodo,
            SUM(CASE WHEN tipo_movimiento = 'ingreso' THEN monto_movimiento ELSE 0 END) AS total_ingresos_caja,
            SUM(CASE WHEN tipo_movimiento = 'egreso'  THEN monto_movimiento ELSE 0 END) AS total_egresos_caja
        FROM movimientos_caja
        GROUP BY DATE_FORMAT(fecha_movimiento, '%Y-%m-01')
    ) AS mc ON mc.periodo = cal.periodo

    -- Pagos de reservación solo confirmados
    LEFT JOIN (
        SELECT 
            DATE_FORMAT(fecha_pago, '%Y-%m-01') AS periodo,
            SUM(monto_pagado) AS total_reservaciones
        FROM pago_reservacion
        WHERE estado_pago = 'confirmado'
        GROUP BY DATE_FORMAT(fecha_pago, '%Y-%m-01')
    ) AS pr ON pr.periodo = cal.periodo

    ORDER BY cal.periodo ASC;
END //

CREATE PROCEDURE sp_ventas_hoy_comparacion()
BEGIN
    DECLARE v_hoy INT;
    DECLARE v_ayer INT;
    DECLARE v_porcentaje DECIMAL(10,2);

    -- Cantidad de ventas hoy
    SELECT COUNT(*) INTO v_hoy
    FROM ventas
    WHERE DATE(fecha_registro) = CURDATE();

    -- Cantidad de ventas ayer
    SELECT COUNT(*) INTO v_ayer
    FROM ventas
    WHERE DATE(fecha_registro) = DATE_SUB(CURDATE(), INTERVAL 1 DAY);

    -- Porcentaje de comparación
    SET v_porcentaje = CASE
        WHEN v_ayer = 0 AND v_hoy = 0 THEN 0
        WHEN v_ayer = 0 THEN 100
        ELSE ROUND(((v_hoy - v_ayer) / v_ayer) * 100, 2)
    END;

    SELECT 
        v_hoy AS total_ventas_hoy,
        v_ayer AS total_ventas_ayer,
        v_porcentaje AS porcentaje_comparacion;
END //

CREATE PROCEDURE sp_reservas_mes_comparacion()
BEGIN
    DECLARE v_mes_actual INT;
    DECLARE v_mes_anterior INT;
    DECLARE v_porcentaje DECIMAL(10,2);

    -- Reservas completadas del mes actual
    SELECT COUNT(*) INTO v_mes_actual
    FROM reservaciones
    WHERE MONTH(fecha_creacion) = MONTH(CURDATE())
      AND YEAR(fecha_creacion) = YEAR(CURDATE())
      AND estado_reservacion = 'completado';

    -- Reservas completadas del mes anterior
    SELECT COUNT(*) INTO v_mes_anterior
    FROM reservaciones
    WHERE MONTH(fecha_creacion) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      AND YEAR(fecha_creacion) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
      AND estado_reservacion = 'completado';

    -- Porcentaje de comparación
    SET v_porcentaje = CASE
        WHEN v_mes_anterior = 0 AND v_mes_actual = 0 THEN 0
        WHEN v_mes_anterior = 0 THEN 100
        ELSE ROUND(((v_mes_actual - v_mes_anterior) / v_mes_anterior) * 100, 2)
    END;

    SELECT
        v_mes_actual    AS total_reservas_mes,
        v_mes_anterior  AS total_reservas_mes_anterior,
        v_porcentaje    AS porcentaje_comparacion;
END //

CREATE PROCEDURE sp_balance_general_anual()
BEGIN
    DECLARE v_ingresos_ventas      DECIMAL(10,2) DEFAULT 0;
    DECLARE v_ingresos_movimientos DECIMAL(10,2) DEFAULT 0;
    DECLARE v_ingresos_reservas    DECIMAL(10,2) DEFAULT 0;
    DECLARE v_egresos              DECIMAL(10,2) DEFAULT 0;
    DECLARE v_ingresos_totales     DECIMAL(10,2);
    DECLARE v_egresos_totales      DECIMAL(10,2);
    DECLARE v_ganancia_neta        DECIMAL(10,2);

    -- Ingresos por ventas del año actual
    SELECT COALESCE(SUM(total_venta), 0) INTO v_ingresos_ventas
    FROM ventas
    WHERE YEAR(fecha_registro) = YEAR(CURDATE());

    -- Ingresos por movimientos de caja del año actual
    SELECT COALESCE(SUM(monto_movimiento), 0) INTO v_ingresos_movimientos
    FROM movimientos_caja
    WHERE tipo_movimiento = 'ingreso'
      AND YEAR(fecha_movimiento) = YEAR(CURDATE());

    -- Ingresos por pagos de reservaciones confirmados del año actual
    SELECT COALESCE(SUM(pr.monto_pagado), 0) INTO v_ingresos_reservas
    FROM pago_reservacion pr
    WHERE pr.estado_pago = 'confirmado'
      AND YEAR(pr.fecha_pago) = YEAR(CURDATE());

    -- Egresos por movimientos de caja del año actual
    SELECT COALESCE(SUM(monto_movimiento), 0) INTO v_egresos
    FROM movimientos_caja
    WHERE tipo_movimiento = 'egreso'
      AND YEAR(fecha_movimiento) = YEAR(CURDATE());

    SET v_ingresos_totales = v_ingresos_ventas + v_ingresos_movimientos + v_ingresos_reservas;
    SET v_egresos_totales  = v_egresos;
    SET v_ganancia_neta    = v_ingresos_totales - v_egresos_totales;

    SELECT
        YEAR(CURDATE()) AS anio,
        ROUND(v_ingresos_totales, 2) AS ingresos_totales,
        ROUND(v_egresos_totales,  2) AS egresos_totales,
        ROUND(v_ganancia_neta,    2) AS ganancia_neta;
END //

CREATE PROCEDURE sp_porcentaje_medios_pago()
BEGIN
    DECLARE v_total DECIMAL(10,2);

    SELECT SUM(total_venta) INTO v_total
    FROM ventas
    WHERE YEAR(fecha_registro) = YEAR(CURDATE());

    SELECT
        YEAR(CURDATE()) AS anio,
        mp.nombre_medio_pago AS nombre_medio_pago,
        ROUND(SUM(v.total_venta), 2) AS total,
        ROUND((SUM(v.total_venta) / v_total) * 100, 2) AS porcentaje
    FROM ventas v
    INNER JOIN medio_pago mp ON v.id_medio_pago = mp.id_medio_pago
    WHERE YEAR(v.fecha_registro) = YEAR(CURDATE())
    GROUP BY mp.id_medio_pago, mp.nombre_medio_pago
    ORDER BY porcentaje DESC;
END //

CREATE PROCEDURE sp_ventas_por_mes(IN p_cantidad_meses INT)
BEGIN
    DECLARE v_fecha_inicio DATE;
    SET v_fecha_inicio = DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL (p_cantidad_meses - 1) MONTH), '%Y-%m-01');
    SET lc_time_names = 'es_PE';

    SELECT
        DATE_FORMAT(cal.periodo, '%b %Y') AS mes,
        COALESCE(COUNT(v.id_venta), 0) AS total_ventas
    FROM (
        SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL seq MONTH), '%Y-%m-01') AS periodo
        FROM (
            SELECT 0 AS seq UNION SELECT 1 UNION SELECT 2 UNION SELECT 3
            UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7
            UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11
        ) AS nums
        WHERE seq < p_cantidad_meses
    ) AS cal
    LEFT JOIN ventas v
        ON DATE_FORMAT(v.fecha_registro, '%Y-%m-01') = cal.periodo
    GROUP BY cal.periodo
    ORDER BY cal.periodo ASC;
END //

CREATE PROCEDURE sp_top_productos_mas_vendidos(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT
        p.nombre_producto       AS nombre_producto,
        SUM(dv.cantidad_producto) AS total_vendido
    FROM detalle_ventas dv
    INNER JOIN productos p ON dv.id_producto = p.id_producto
    INNER JOIN ventas v ON dv.id_venta = v.id_venta
    WHERE DATE(v.fecha_registro) BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY p.id_producto, p.nombre_producto
    ORDER BY total_vendido DESC
    LIMIT 10;
END //

-- INSUMOS
CREATE PROCEDURE sp_insertar_insumo(
    IN p_nombre_insumo VARCHAR(100),
    IN p_stock_insumo DECIMAL(5,2),
    IN p_unidad_medida VARCHAR(30),
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_id_insumo INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Insertar insumo
    INSERT INTO insumos (
        nombre_insumo,
        stock_insumo,
        unidad_medida
    ) VALUES (
        p_nombre_insumo,
        p_stock_insumo,
        p_unidad_medida
    );

    SET v_id_insumo = LAST_INSERT_ID();

    IF p_stock_insumo > 0 THEN
        INSERT INTO movimientos_stock (
            cantidad_movimiento,
            tipo_movimiento,
            detalle_movimiento,
            id_insumo,
            id_usuario
        ) VALUES (
            p_stock_insumo,
            'entrada',
            'Cantidad inicial de insumo',
            v_id_insumo,
            p_id_usuario
        );
    END IF;

    COMMIT;

    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE id_insumo = v_id_insumo;
END //

CREATE PROCEDURE sp_contar_insumos_por_nombre (
    IN p_nombre_insumo VARCHAR(100)
)
BEGIN
    SELECT
        SUM(CASE WHEN estado_insumo = 1 THEN 1 ELSE 0 END) AS total_activos,
        SUM(CASE WHEN estado_insumo = 0 THEN 1 ELSE 0 END) AS total_inactivos,
        MAX(CASE WHEN estado_insumo = 0 THEN id_insumo ELSE NULL END) AS id_insumo_inactivo
    FROM insumos
    WHERE nombre_insumo = p_nombre_insumo;
END //

CREATE PROCEDURE sp_recuperar_insumo (
    IN p_id_insumo INT,
    IN p_unidad_medida VARCHAR(30),
    IN p_estado_insumo TINYINT,
    IN p_stock_insumo DECIMAL(5,2),
    IN p_id_usuario INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE insumos
    SET 
        unidad_medida = p_unidad_medida,
        estado_insumo = p_estado_insumo,
        stock_insumo = CASE 
            WHEN p_stock_insumo > 0 THEN stock_insumo + p_stock_insumo
            ELSE stock_insumo
        END
    WHERE id_insumo = p_id_insumo;

    IF p_stock_insumo > 0 THEN
        INSERT INTO movimientos_stock (
            cantidad_movimiento,
            tipo_movimiento,
            detalle_movimiento,
            id_insumo,
            id_usuario
        ) VALUES (
            p_stock_insumo,
            'entrada',
            'Recuperación de insumo',
            p_id_insumo,
            p_id_usuario
        );
    END IF;

    COMMIT;

    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE id_insumo = p_id_insumo;
END //

CREATE PROCEDURE sp_actualizar_insumo_datos (
    IN p_id_insumo INT,
    IN p_nombre_insumo VARCHAR(100),
    IN p_unidad_medida VARCHAR(30)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE insumos
    SET 
        nombre_insumo = p_nombre_insumo,
        unidad_medida = p_unidad_medida
    WHERE id_insumo = p_id_insumo;

    COMMIT;

    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE id_insumo = p_id_insumo;
END //

CREATE PROCEDURE sp_actualizar_estado_insumo (
    IN p_id_insumo INT,
    IN p_estado_insumo TINYINT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE insumos
    SET estado_insumo = p_estado_insumo
    WHERE id_insumo = p_id_insumo;

    COMMIT;

    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE id_insumo = p_id_insumo;
END //

CREATE PROCEDURE sp_contar_insumo_por_id (
    IN p_id_insumo INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM insumos
    WHERE id_insumo = p_id_insumo
    AND estado_insumo = 1;
END //

CREATE PROCEDURE sp_contar_insumos_por_nombre_2 (
    IN p_nombre_insumo VARCHAR(100),
    IN p_id_insumo INT
)
BEGIN
    SELECT
        COUNT(*) AS total
    FROM insumos
    WHERE nombre_insumo = p_nombre_insumo
      AND estado_insumo = 1
      AND id_insumo <> p_id_insumo;
END //

CREATE PROCEDURE sp_obtener_insumos(
    IN p_limit INT,
    IN p_offset INT,
    IN p_nombre_insumo VARCHAR(100),
    IN p_nivel_stock VARCHAR(20)
)
BEGIN
    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE estado_insumo = 1
      AND (
            p_nombre_insumo IS NULL
            OR nombre_insumo LIKE CONCAT('%', p_nombre_insumo, '%')
          )
      AND (
            p_nivel_stock IS NULL
            OR (
                (p_nivel_stock = 'critico' AND stock_insumo <= 5)
                OR (p_nivel_stock = 'bajo' AND stock_insumo > 5 AND stock_insumo <= 10)
                OR (p_nivel_stock = 'normal' AND stock_insumo > 10)
            )
          )
    ORDER BY id_insumo DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE sp_contar_insumos(
    IN p_nombre_insumo VARCHAR(100),
    IN p_nivel_stock VARCHAR(20)
)
BEGIN
    SELECT
        COUNT(*) AS total_registros
    FROM insumos
    WHERE estado_insumo = 1
      AND (
            p_nombre_insumo IS NULL
            OR nombre_insumo LIKE CONCAT('%', p_nombre_insumo, '%')
          )
      AND (
            p_nivel_stock IS NULL
            OR (
                (p_nivel_stock = 'critico' AND stock_insumo <= 5)
                OR (p_nivel_stock = 'bajo' AND stock_insumo > 5 AND stock_insumo <= 10)
                OR (p_nivel_stock = 'normal' AND stock_insumo > 10)
            )
          );
END //


CREATE PROCEDURE sp_obtener_insumo_por_id(
    IN p_id_insumo INT
)
BEGIN
    SELECT
        id_insumo,
        nombre_insumo,
        stock_insumo,
        unidad_medida
    FROM insumos
    WHERE id_insumo = p_id_insumo
      AND estado_insumo = 1;
END //

CREATE PROCEDURE sp_optener_stock_actual_insumo (
    IN p_id_insumo INT
)
BEGIN 
    SELECT 
        stock_insumo
    FROM insumos
    WHERE id_insumo = p_id_insumo;
END //

CREATE PROCEDURE sp_eliminar_insumo(
    IN p_id_insumo INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE insumos
    SET estado_insumo = 0
    WHERE id_insumo = p_id_insumo;

    COMMIT;
END //

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

CREATE PROCEDURE sp_obtener_estado_pedido(IN p_id_pedido INT)
BEGIN
    SELECT 
        id_pedido,
        estado_pedido
    FROM pedido_mesa
    WHERE id_pedido = p_id_pedido;
END //

CREATE PROCEDURE sp_obtener_detalle_pedido(IN p_id_pedido INT)
BEGIN
    SELECT 
        dp.id_detalle_pedido,
        dp.id_producto,
        p.nombre_producto,
        dp.cantidad_pedido
    FROM detalle_pedido dp
    INNER JOIN productos p ON dp.id_producto = p.id_producto
    WHERE dp.id_pedido = p_id_pedido;
END //

CREATE PROCEDURE sp_obtener_mesas_de_un_pedido(IN p_id_pedido INT)
BEGIN
    SELECT 
        mp.id_mesa,
        m.numero_mesa
    FROM mesas_pedido mp
    INNER JOIN mesas m ON mp.id_mesa = m.id_mesa
    WHERE mp.id_pedido = p_id_pedido;
END //

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

CREATE PROCEDURE sp_contar_categoria_por_id_2(
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
            WHEN p.usa_insumos = 1 THEN 'Si'
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

CREATE PROCEDURE sp_verificar_mesa_disponible(
    IN p_id_mesa INT,
    IN p_fecha_hora DATETIME,
    IN p_id_usuario INT
)
BEGIN
    DECLARE v_conflictos INT DEFAULT 0;

    -- Limpiar bloqueos expirados
    DELETE FROM bloqueos_temporales_mesa
    WHERE expira_en < NOW();

    -- Verificar conflictos en reservaciones confirmadas
    SELECT COUNT(*) INTO v_conflictos
    FROM mesas_reservacion mr
    JOIN reservaciones r 
        ON mr.id_reservacion = r.id_reservacion
    WHERE mr.id_mesa = p_id_mesa
      AND p_fecha_hora BETWEEN mr.reserva_desde AND mr.reserva_hasta
      AND r.estado_reservacion <> 'cancelado';

    -- Verificar bloqueos temporales de CUALQUIER usuario incluido el mismo
    IF v_conflictos = 0 THEN
        SELECT COUNT(*) INTO v_conflictos
        FROM bloqueos_temporales_mesa
        WHERE id_mesa = p_id_mesa
          AND p_fecha_hora BETWEEN bloqueado_desde AND bloqueado_hasta
          AND expira_en > NOW();
          -- ← quitamos AND id_usuario <> p_id_usuario
    END IF;

    SELECT v_conflictos AS conflictos;
END //

CREATE PROCEDURE sp_bloquear_mesa(
    IN p_id_mesa INT,
    IN p_id_usuario INT,
    IN p_fecha_hora DATETIME
)
BEGIN
    DECLARE v_desde DATETIME;
    DECLARE v_hasta DATETIME;

    SET v_desde = DATE_SUB(p_fecha_hora, INTERVAL 89 MINUTE);
    SET v_hasta = DATE_ADD(p_fecha_hora, INTERVAL 89 MINUTE);

    INSERT INTO bloqueos_temporales_mesa(
        id_mesa,
        id_usuario,
        bloqueado_desde,
        bloqueado_hasta,
        expira_en
    )
    VALUES (
        p_id_mesa,
        p_id_usuario,
        v_desde,
        v_hasta,
        DATE_ADD(NOW(), INTERVAL 5 MINUTE)
    );
END //


CREATE PROCEDURE sp_obtener_mesa_por_id(
    IN p_id_mesa INT
)
BEGIN
    SELECT 
        id_mesa,
        numero_mesa,
        capacidad
    FROM mesas
    WHERE id_mesa = p_id_mesa;
END //

CREATE PROCEDURE sp_insertar_reservacion(
    IN p_fecha DATE,
    IN p_hora TIME,
    IN p_cantidad_personas INT,
    IN p_id_usuario INT,
    IN p_codigo_reservacion CHAR(6)  
)
BEGIN
    DECLARE v_codigo_existe INT DEFAULT 0;
    DECLARE v_id_reservacion INT;
    
    SELECT COUNT(*) INTO v_codigo_existe 
    FROM reservaciones 
    WHERE codigo_reservacion = p_codigo_reservacion;
    
    IF v_codigo_existe > 0 THEN
        SELECT id_reservacion 
        FROM reservaciones 
        WHERE codigo_reservacion = p_codigo_reservacion 
        LIMIT 1;
    ELSE
        DELETE FROM bloqueos_temporales_mesa
        WHERE id_usuario = p_id_usuario;

        INSERT INTO reservaciones(
            fecha_reservacion,
            hora_reservacion,
            cantidad_personas,
            id_usuario,
            codigo_reservacion 
        )
        VALUES (
            p_fecha,
            p_hora,
            p_cantidad_personas,
            p_id_usuario,
            p_codigo_reservacion
        );

        SELECT LAST_INSERT_ID() AS id_reservacion;
    END IF;
END //

CREATE PROCEDURE sp_insertar_mesas_reservacion(
    IN p_id_reservacion INT,
    IN p_id_mesa INT,
    IN p_fecha_hora DATETIME
)
BEGIN
    DECLARE v_desde DATETIME;
    DECLARE v_hasta DATETIME;

    SET v_desde = DATE_SUB(p_fecha_hora, INTERVAL 89 MINUTE);
    SET v_hasta = DATE_ADD(p_fecha_hora, INTERVAL 89 MINUTE);

    INSERT INTO mesas_reservacion(
        id_mesa,
        id_reservacion,
        reserva_desde,
        reserva_hasta
    )
    VALUES (
        p_id_mesa,
        p_id_reservacion,
        v_desde,
        v_hasta
    );

END //

CREATE PROCEDURE sp_insertar_pago_reservacion(
    IN p_monto_pagado DECIMAL(5,2),
    IN p_id_transaccion VARCHAR(100),
    IN p_id_reservacion INT
)
BEGIN
    INSERT INTO pago_reservacion(
        monto_pagado,
        id_transaccion,
        fecha_pago,
        estado_pago,
        id_reservacion
    )
    VALUES (
        p_monto_pagado,
        p_id_transaccion,
        NOW(),
        'confirmado',
        p_id_reservacion
    );
END //

CREATE PROCEDURE sp_obtener_reservacion_por_codigo(
    IN p_codigo CHAR(6)
)
BEGIN
    SELECT 
        r.id_reservacion,
        DATE_FORMAT(r.fecha_reservacion, '%d-%m-%Y') AS fecha_reservacion,
        DATE_FORMAT(r.hora_reservacion, '%H:%i') AS hora_reservacion,
        r.cantidad_personas,
        r.estado_reservacion,
        COALESCE(CONCAT(u.nombre_usuario, ' ', u.apellido_usuario), '----') AS usuario
    FROM reservaciones r
    LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
    WHERE r.codigo_reservacion = p_codigo;
END //

CREATE PROCEDURE sp_confirmar_reservacion(
    IN p_id_reservacion INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE reservaciones
    SET estado_reservacion = 'completado'
    WHERE id_reservacion = p_id_reservacion;

    COMMIT;

    SELECT 'Reservación confirmada exitosamente' AS mensaje;
END //

CREATE PROCEDURE sp_cancelar_reservacion(
    IN p_id_reservacion INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE reservaciones
    SET estado_reservacion = 'cancelado'
    WHERE id_reservacion = p_id_reservacion;

    COMMIT;

    SELECT 'Reservación cancelada exitosamente' AS mensaje;
END //

CREATE PROCEDURE sp_obtener_estado_reservacion(
    IN p_id_reservacion INT
)
BEGIN
    SELECT estado_reservacion
    FROM reservaciones
    WHERE id_reservacion = p_id_reservacion;
END //

CREATE PROCEDURE sp_contar_reservacion_por_id(
    IN p_id_reservacion INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM reservaciones
    WHERE id_reservacion = p_id_reservacion;
END //

CREATE PROCEDURE sp_obtener_mesas_por_id_reservacion(
    IN p_id_reservacion INT
)
BEGIN
    SELECT m.numero_mesa
    FROM mesas_reservacion mr
    INNER JOIN mesas m ON mr.id_mesa = m.id_mesa
    WHERE mr.id_reservacion = p_id_reservacion;
END //

CREATE PROCEDURE sp_listar_mesas_disponibilidad(
    IN p_fecha_hora DATETIME
)
BEGIN
    DELETE FROM bloqueos_temporales_mesa
    WHERE expira_en < NOW();

    SELECT 
        m.id_mesa,
        m.numero_mesa,
        m.capacidad,
        CASE
            WHEN EXISTS (
                SELECT 1 FROM mesas_reservacion mr
                INNER JOIN reservaciones r ON mr.id_reservacion = r.id_reservacion
                WHERE mr.id_mesa = m.id_mesa
                  AND p_fecha_hora BETWEEN mr.reserva_desde AND mr.reserva_hasta
                  AND r.estado_reservacion <> 'cancelado'
            ) THEN 'no disponible'
            WHEN EXISTS (
                SELECT 1 FROM bloqueos_temporales_mesa b
                WHERE b.id_mesa = m.id_mesa
                  AND p_fecha_hora BETWEEN b.bloqueado_desde AND b.bloqueado_hasta
                  AND b.expira_en > NOW()
            ) THEN 'no disponible'
            ELSE 'disponible'
        END AS estado
    FROM mesas m
    ORDER BY m.numero_mesa;
END //

CREATE PROCEDURE sp_listar_reservaciones_por_rango(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT
        r.id_reservacion,
        DATE_FORMAT(r.fecha_reservacion, '%d-%m-%Y') AS fecha_reservacion,
        DATE_FORMAT(r.hora_reservacion, '%H:%i') AS hora_reservacion,
        r.estado_reservacion
    FROM reservaciones r
    WHERE r.fecha_reservacion BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY r.fecha_reservacion ASC, r.hora_reservacion ASC;
END //

CREATE PROCEDURE sp_listar_reservaciones_por_usuario(
    IN p_id_usuario INT
)
BEGIN
    SELECT
        r.id_reservacion,
        DATE_FORMAT(r.fecha_reservacion, '%d-%m-%Y') AS fecha_reservacion,
        DATE_FORMAT(r.hora_reservacion, '%H:%i') AS hora_reservacion,
        IF(r.estado_reservacion = 'pendiente', r.codigo_reservacion, '******') AS codigo_reservacion,
        r.cantidad_personas,
        r.estado_reservacion
    FROM reservaciones r
    WHERE r.id_usuario = p_id_usuario
    ORDER BY r.fecha_reservacion DESC, r.hora_reservacion DESC; 
END //


CREATE PROCEDURE sp_obtener_reservacion_por_id(
    IN p_id_reservacion INT
)
BEGIN
    SELECT
        r.id_reservacion,
        DATE_FORMAT(r.fecha_reservacion, '%d-%m-%Y') AS fecha_reservacion,
        DATE_FORMAT(r.hora_reservacion, '%H:%i') AS hora_reservacion,
        r.cantidad_personas,
        r.estado_reservacion,
        r.codigo_reservacion,
        r.fecha_creacion,
        r.id_usuario,
        COALESCE(CONCAT(u.nombre_usuario, ' ', u.apellido_usuario), '----') AS nombre_completo
    FROM reservaciones r
    LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
    WHERE r.id_reservacion = p_id_reservacion;
END //

CREATE PROCEDURE sp_obtener_pago_por_reservacion(
    IN p_id_reservacion INT
)
BEGIN
    SELECT
        id_pago,
        monto_pagado,
        DATE_FORMAT(fecha_pago, '%d-%m-%Y %H:%i:%s') AS fecha_hora_pago,
        estado_pago
    FROM pago_reservacion
    WHERE id_reservacion = p_id_reservacion;
END //

CREATE PROCEDURE sp_listar_roles()
BEGIN
    SELECT 
        id_rol, 
        nombre_rol 
    FROM rol_usuario;
END //

-- Procedimiento para registrar un usuario
CREATE PROCEDURE sp_registrar_usuario(
    IN p_nombre_usuario VARCHAR(100),
    IN p_apellido_usuario VARCHAR(100),
    IN p_correo_usuario VARCHAR(100),
    IN p_clave_usuario CHAR(60),
    IN p_telefono_usuario VARCHAR(15)
)
BEGIN
    DECLARE v_id_usuario INT;
    DECLARE v_id_rol INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    INSERT INTO usuarios (
        nombre_usuario,
        apellido_usuario,
        correo_usuario,
        clave_usuario,
        telefono_usuario
    ) VALUES (
        p_nombre_usuario,
        p_apellido_usuario,
        p_correo_usuario,
        p_clave_usuario,
        p_telefono_usuario
    );

    SET v_id_usuario = LAST_INSERT_ID();

    SELECT id_rol INTO v_id_rol
    FROM rol_usuario
    WHERE nombre_rol = 'usuario'
    LIMIT 1;

    INSERT INTO usuario_rol (
        id_usuario,
        id_rol
    ) VALUES (
        v_id_usuario,
        v_id_rol
    );

    COMMIT;
    SELECT 
        u.id_usuario,
        u.nombre_usuario,
        u.apellido_usuario,
        ru.id_rol,
        ru.nombre_rol
    FROM usuarios u
    LEFT JOIN usuario_rol ur
        ON u.id_usuario = ur.id_usuario
        AND ur.rol_activo = 1
    LEFT JOIN rol_usuario ru
        ON ur.id_rol = ru.id_rol
    WHERE u.id_usuario = v_id_usuario;
END //

-- Procedimiento para seleccionar un total de conteos de usuarios por correo
CREATE PROCEDURE sp_seleccionar_total_usuario_correo (
    IN p_correo_usuario VARCHAR(100)
)
BEGIN
    SELECT COUNT(*) AS total
    FROM usuarios
    WHERE correo_usuario = p_correo_usuario;
END //

-- Procedimiento para registrar un codigo de verificación de un correo
CREATE PROCEDURE sp_registrar_codigo_verificacion (
    IN p_correo VARCHAR(100),
    IN p_codigo CHAR(6)
)
BEGIN
    DECLARE v_existente INT DEFAULT 0;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION 
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT COUNT(*) INTO v_existente
    FROM verificacion_correos
    WHERE correo_verificacion = p_correo AND estado_verificacion = 0;

    IF v_existente > 0 THEN
        UPDATE verificacion_correos
        SET 
            codigo_verificacion = p_codigo,
            expiracion_verificacion = DATE_ADD(NOW(), INTERVAL 5 MINUTE),
            registro_verificacion = NOW()
        WHERE correo_verificacion = p_correo AND estado_verificacion = 0;
    ELSE
        INSERT INTO verificacion_correos (
            correo_verificacion,
            codigo_verificacion,
            expiracion_verificacion
        )
        VALUES (
            p_correo,
            p_codigo,
            DATE_ADD(NOW(), INTERVAL 5 MINUTE)
        );
    END IF;

    COMMIT;
END //

CREATE PROCEDURE sp_verificar_codigo_correo(
    IN p_correo VARCHAR(100),
    IN p_codigo CHAR(6),
    IN p_fecha_actual DATETIME
)
BEGIN
    DECLARE v_id INT;
    DECLARE v_estado TINYINT(1);
    DECLARE v_expiracion DATETIME;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT 
        id_verificacion,
        estado_verificacion,
        expiracion_verificacion
    INTO 
        v_id,
        v_estado,
        v_expiracion
    FROM verificacion_correos
    WHERE correo_verificacion = p_correo
      AND codigo_verificacion = p_codigo
    LIMIT 1;

    IF v_id IS NULL THEN
        SELECT 2 AS status, 'El código es incorrecto o no existe' AS mensaje;
        ROLLBACK;

    ELSEIF v_estado = 1 THEN
        SELECT 3 AS status,'Este código ya fue utilizado' AS mensaje;
        ROLLBACK;

    ELSEIF v_expiracion < p_fecha_actual THEN
        SELECT 4 AS status, 'El código ha expirado' AS mensaje;
        ROLLBACK;

    ELSE
        UPDATE verificacion_correos
        SET estado_verificacion = 1
        WHERE id_verificacion = v_id;

        COMMIT;
        SELECT 1 AS status, 'Correo verificado correctamente' AS mensaje;
    END IF;
END //


-- Procedimiento para iniciar sesion 
CREATE PROCEDURE sp_verificar_validacion_correo(
    IN p_correo VARCHAR(100)
)
BEGIN
    SELECT estado_verificacion
    FROM verificacion_correos
    WHERE correo_verificacion = p_correo
    ORDER BY registro_verificacion DESC
    LIMIT 1;
END //

CREATE PROCEDURE sp_seleccionar_usuario_correo(
    IN p_correoUsuario VARCHAR(100)
)
BEGIN
    SELECT 
        u.id_usuario,
        u.nombre_usuario,
        u.apellido_usuario,
        u.correo_usuario,
        u.clave_usuario,
        r.id_rol,
        r.nombre_rol
    FROM usuarios u
    INNER JOIN usuario_rol ur 
        ON u.id_usuario = ur.id_usuario
    INNER JOIN rol_usuario r 
        ON ur.id_rol = r.id_rol
    WHERE u.correo_usuario = p_correoUsuario
      AND u.estado_usuario = 1
      AND ur.rol_activo = 1;
END //

CREATE PROCEDURE sp_contar_usuarios(
    IN p_id_usuario INT,
    IN p_id_rol INT,
    IN p_valor VARCHAR(100)
)
BEGIN
    SELECT 
        COUNT(DISTINCT u.id_usuario) AS total_usuarios
    FROM usuarios u
    LEFT JOIN usuario_rol ur
        ON u.id_usuario = ur.id_usuario
        AND ur.rol_activo = 1
    LEFT JOIN rol_usuario ru
        ON ur.id_rol = ru.id_rol
    WHERE u.estado_usuario = 1
      AND u.id_usuario <> p_id_usuario
      AND (p_id_rol IS NULL OR ru.id_rol = p_id_rol)
      AND (
            p_valor IS NULL OR
            u.nombre_usuario   LIKE CONCAT('%', p_valor, '%') OR
            u.apellido_usuario LIKE CONCAT('%', p_valor, '%') OR
            u.correo_usuario   LIKE CONCAT('%', p_valor, '%') OR
            u.telefono_usuario LIKE CONCAT('%', p_valor, '%')
          );
END // 

CREATE PROCEDURE sp_listar_usuarios(
    IN p_limite INT,
    IN p_desplazamiento INT,
    IN p_id_usuario INT,
    IN p_id_rol INT,
    IN p_valor VARCHAR(100)
)
BEGIN
    SELECT 
        u.id_usuario,
        u.nombre_usuario,
        u.apellido_usuario,
        u.correo_usuario,
        u.telefono_usuario,
        ru.id_rol,
        ru.nombre_rol
    FROM usuarios u
    LEFT JOIN usuario_rol ur
        ON u.id_usuario = ur.id_usuario
        AND ur.rol_activo = 1
    LEFT JOIN rol_usuario ru
        ON ur.id_rol = ru.id_rol
    WHERE u.estado_usuario = 1
      AND u.id_usuario <> p_id_usuario
      AND (p_id_rol IS NULL OR ru.id_rol = p_id_rol)
      AND (
            p_valor IS NULL OR
            u.nombre_usuario   LIKE CONCAT('%', p_valor, '%') OR
            u.apellido_usuario LIKE CONCAT('%', p_valor, '%') OR
            u.correo_usuario   LIKE CONCAT('%', p_valor, '%') OR
            u.telefono_usuario LIKE CONCAT('%', p_valor, '%')
          )
    ORDER BY u.id_usuario DESC
    LIMIT p_limite OFFSET p_desplazamiento;
END //

CREATE PROCEDURE sp_contar_usuario_id(
    IN p_id_usuario INT
)
BEGIN
    SELECT COUNT(*) AS total_usuarios FROM usuarios WHERE id_usuario = p_id_usuario;
END //

CREATE PROCEDURE sp_obtener_usuario_por_id(
    IN p_id_usuario INT
)
BEGIN
    SELECT 
        u.id_usuario,
        u.nombre_usuario,
        u.apellido_usuario,
        u.correo_usuario,
        u.telefono_usuario,
        ru.id_rol,
        ru.nombre_rol
    FROM usuarios u
    INNER JOIN usuario_rol ur
        ON u.id_usuario = ur.id_usuario
        AND ur.rol_activo = 1
    INNER JOIN rol_usuario ru
        ON ur.id_rol = ru.id_rol
    WHERE u.estado_usuario = 1
      AND u.id_usuario = p_id_usuario;
END //

CREATE PROCEDURE sp_obtener_historial_roles_usuario(
    IN p_id_usuario INT
)
BEGIN
    SELECT 
        ru.nombre_rol,
        DATE_FORMAT(ur.fecha_inicio, '%d-%m-%Y') AS fecha_inicio,
        IFNULL(
            DATE_FORMAT(ur.fecha_fin, '%d-%m-%Y'),
            '--'
        ) AS fecha_fin
    FROM usuario_rol ur
    INNER JOIN rol_usuario ru
        ON ur.id_rol = ru.id_rol
    WHERE ur.id_usuario = p_id_usuario
    ORDER BY ur.fecha_inicio DESC;
END //

CREATE PROCEDURE sp_obtener_clave_usuario_por_id(
    IN p_id_usuario INT
)
BEGIN
    SELECT
        CONCAT(nombre_usuario, ', ', apellido_usuario) as usuario,
        clave_usuario
    FROM usuarios 
    WHERE estado_usuario = 1
      AND id_usuario = p_id_usuario;
END//

CREATE PROCEDURE sp_actualizar_datos_usuario(
    IN p_id_usuario INT,
    IN p_nombre_usuario VARCHAR(100),
    IN p_apellido_usuario VARCHAR(50),
    IN p_telefono_usuario VARCHAR(15)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE usuarios
    SET 
        nombre_usuario = p_nombre_usuario,
        apellido_usuario = p_apellido_usuario,
        telefono_usuario = p_telefono_usuario
    WHERE id_usuario = p_id_Usuario;

    COMMIT;

    SELECT 'Datos de usuario actualizado correctamente' AS mensaje;
END //

CREATE PROCEDURE sp_actualizar_correo_usuario(
    IN p_id_usuario INT,
    IN p_correo_usuario VARCHAR(100)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE usuarios
    SET correo_usuario = p_correo_usuario
    WHERE id_usuario = p_id_usuario;

    COMMIT;

    SELECT 'Correo actualizado correctamente' AS mensaje;
END //

CREATE PROCEDURE sp_actualizar_clave_usuario(
    IN p_id_usuario INT,
    IN p_clave CHAR(60)
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE usuarios
    SET clave_usuario = p_clave
    WHERE id_usuario = p_id_usuario;

    COMMIT;

    SELECT 'Contraseña actualizada correctamente' AS mensaje;
END //

CREATE PROCEDURE sp_actualizar_estado_usuario(
    IN p_id_usuario INT,
    IN p_nuevo_estado TINYINT(1)
)
BEGIN
    DECLARE v_mensaje VARCHAR(100);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE usuarios
    SET estado_usuario = p_nuevo_estado
    WHERE id_usuario = p_id_usuario;

    IF p_nuevo_estado = 0 THEN
        SET v_mensaje = 'Usuario eliminado correctamente.';
    ELSEIF p_nuevo_estado = 1 THEN
        SET v_mensaje = 'Usuario recuperado correctamente.';
    ELSE
        SET v_mensaje = 'Estado del usuario actualizado correctamente.';
    END IF;

    COMMIT;
    SELECT v_mensaje AS mensaje;
END //

CREATE PROCEDURE sp_obtener_rol_por_id_rol(
    IN p_id_rol INT
)
BEGIN
    SELECT 
        id_rol,
        nombre_rol
    FROM rol_usuario
    WHERE id_rol = p_id_rol;
END //

CREATE PROCEDURE sp_actualizar_rol_usuario(
    IN p_id_usuario INT,
    IN p_id_rol_nuevo INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    UPDATE usuario_rol
    SET 
        rol_activo = 0,
        fecha_fin = CURRENT_DATE
    WHERE id_usuario = p_id_usuario
      AND rol_activo = 1;

    INSERT INTO usuario_rol (
        id_usuario,
        id_rol,
        fecha_inicio,
        rol_activo
    )
    VALUES (
        p_id_usuario,
        p_id_rol_nuevo,
        CURRENT_DATE,
        1
    );

    COMMIT;

    SELECT 
        u.id_usuario,
        u.nombre_usuario,
        u.apellido_usuario,
        u.correo_usuario,
        u.telefono_usuario,
        ru.id_rol,
        ru.nombre_rol
    FROM usuarios u
    INNER JOIN usuario_rol ur
        ON u.id_usuario = ur.id_usuario
        AND ur.rol_activo = 1
    INNER JOIN rol_usuario ru
        ON ur.id_rol = ru.id_rol
    WHERE u.id_usuario = p_id_usuario;
END //

-- ─── SP: Insertar Venta ───────────────────────────────────────────────────────
CREATE PROCEDURE sp_generar_venta(
    -- Venta
    IN p_numero_documento_cliente VARCHAR(12),
    IN p_id_tipo_documento INT,
    IN p_porcentaje_igv DECIMAL(5,2),
    IN p_total_gravada DECIMAL(10,2),
    IN p_total_igv DECIMAL(10,2),
    IN p_total_venta DECIMAL(10,2),
    IN p_id_medio_pago INT,
    -- Comprobante
    IN p_id_tipo_comprobante INT,
    IN p_serie VARCHAR(5),
    IN p_numero_correlativo INT,
    IN p_fecha_emision DATE,
    IN p_fecha_vencimiento DATE,
    IN p_sunat_transaccion TINYINT(4),
    IN p_url_comprobante_pdf VARCHAR(150),
    IN p_public_id_pdf VARCHAR(150),
    IN p_estado_sunat ENUM('pendiente','enviado_sunat','aceptado','rechazado', 'interno'),
    IN p_fecha_limite_correccion DATETIME,
    -- Caja y usuario
    IN p_id_usuario INT,
    -- Detalle en JSON
    IN p_detalles JSON
)
BEGIN
    DECLARE v_id_venta INT;
    DECLARE v_id_caja INT;
    DECLARE v_monto_actual DECIMAL(10,2);
    DECLARE v_i INT DEFAULT 0;
    DECLARE v_total_detalles INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- 1. Verificar caja abierta
    SELECT id_caja, monto_actual
    INTO v_id_caja, v_monto_actual
    FROM caja
    WHERE estado_caja = 'abierta'
    ORDER BY fecha_caja DESC
    LIMIT 1
    FOR UPDATE;

    IF v_id_caja IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No hay ninguna caja abierta para registrar la venta';
    END IF;

    -- 2. Insertar venta
    INSERT INTO ventas (
        numero_documento_cliente, id_tipo_documento, porcentaje_igv,
        total_gravada, total_igv, total_venta, id_medio_pago
    ) VALUES (
        p_numero_documento_cliente, p_id_tipo_documento, p_porcentaje_igv,
        p_total_gravada, p_total_igv, p_total_venta, p_id_medio_pago
    );
    SET v_id_venta = LAST_INSERT_ID();

    -- 3. Insertar comprobante
    INSERT INTO comprobantes (
        id_venta, id_tipo_comprobante, serie, numero_correlativo,
        fecha_emision, fecha_vencimiento, sunat_transaccion,
        url_comprobante_pdf, public_id_pdf, estado_sunat, fecha_limite_correccion
    ) VALUES (
        v_id_venta, p_id_tipo_comprobante, p_serie, p_numero_correlativo,
        p_fecha_emision, p_fecha_vencimiento, p_sunat_transaccion,
        p_url_comprobante_pdf, p_public_id_pdf, p_estado_sunat, p_fecha_limite_correccion
    );

    -- 4. Insertar detalles desde JSON
    SET v_total_detalles = JSON_LENGTH(p_detalles);
    WHILE v_i < v_total_detalles DO
        INSERT INTO detalle_ventas (
            cantidad_producto, valor_unitario, precio_unitario,
            subtotal, igv, total_producto, id_venta, id_producto
        ) VALUES (
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', v_i, '].cantidad'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', v_i, '].valorUnitario'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', v_i, '].precioUnitario'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', v_i, '].subtotal'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', v_i, '].igv'))),
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', v_i, '].totalProducto'))),
            v_id_venta,
            JSON_UNQUOTE(JSON_EXTRACT(p_detalles, CONCAT('$[', v_i, '].idProducto')))
        );
        SET v_i = v_i + 1;
    END WHILE;

    -- 5. Actualizar correlativo del tipo de comprobante
    UPDATE tipo_comprobante
    SET correlativo = p_numero_correlativo
    WHERE id_tipo_comprobante = p_id_tipo_comprobante;

    -- 6. Registrar ingreso en caja vinculado a la venta
    INSERT INTO movimientos_caja (
        tipo_movimiento, fecha_movimiento, monto_movimiento,
        descripcion_mov_caja, id_caja, id_usuario, id_venta
    ) VALUES (
        'ingreso', NOW(), p_total_venta,
        'Venta realizada', v_id_caja, p_id_usuario, v_id_venta
    );

    -- 7. Actualizar monto actual de caja
    UPDATE caja
    SET monto_actual = v_monto_actual + p_total_venta
    WHERE id_caja = v_id_caja;

    COMMIT;

    SELECT v_id_venta AS id_venta;
END //

-- ─── SP: Obtener Venta por ID ─────────────────────────────────────────────────
CREATE PROCEDURE sp_obtener_venta_por_id (IN p_id_venta INT) BEGIN
SELECT
    v.id_venta,
    v.porcentaje_igv,
    v.total_gravada,
    v.total_igv,
    v.total_venta,
    mp.nombre_medio_pago,
    c.estado_sunat,
    c.fecha_limite_correccion
FROM
    ventas v
    INNER JOIN medio_pago mp ON v.id_medio_pago = mp.id_medio_pago
    LEFT JOIN comprobantes c ON c.id_venta = v.id_venta
WHERE
    v.id_venta = p_id_venta;

END //

-- ─── SP: Obtener Comprobante por ID Venta ─────────────────────────────────────
CREATE PROCEDURE sp_obtener_comprobante_por_id_venta (IN p_id_venta INT) BEGIN
SELECT
    c.id_comprobante,
    c.id_tipo_comprobante,
    tc.nombre_tipo_comprobante,
    c.serie,
    c.numero_correlativo,
    DATE_FORMAT(c.fecha_emision, '%d-%m-%Y') AS fecha_emision,
    DATE_FORMAT(c.fecha_vencimiento, '%d-%m-%Y') AS fecha_vencimiento,
    c.sunat_transaccion,
    c.estado_sunat,
    c.url_comprobante_pdf,
    c.url_comprobante_xml,
    c.url_cdr,
    c.hash_comprobante,
    c.fecha_envio,
    c.fecha_limite_correccion
FROM
    comprobantes c
    LEFT JOIN tipo_comprobante tc ON c.id_tipo_comprobante = tc.id_tipo_comprobante
WHERE
    c.id_venta = p_id_venta;
END //

-- ─── SP: Obtener Detalle Venta por ID Venta ───────────────────────────────────
CREATE PROCEDURE sp_obtener_detalle_venta_por_id_venta (IN p_id_venta INT) BEGIN
SELECT
    dv.id_detalle_venta,
    dv.cantidad_producto,
    dv.valor_unitario,
    dv.precio_unitario,
    dv.subtotal,
    dv.igv,
    dv.total_producto,
    p.nombre_producto,
    dv.id_producto
FROM
    detalle_ventas dv
    INNER JOIN productos p ON dv.id_producto = p.id_producto
WHERE
    dv.id_venta = p_id_venta;

END //
-- ─── SP: Obtener Ventas (paginado + filtro fechas) ────────────────────────────
CREATE PROCEDURE sp_obtener_ventas (
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_limit INT,
    IN p_offset INT
) BEGIN
SELECT
    v.id_venta,
    v.total_gravada,
    v.total_igv,
    v.total_venta,
    mp.nombre_medio_pago,
    DATE_FORMAT(v.fecha_registro, '%d-%m-%Y') AS fecha,
    DATE_FORMAT(v.fecha_registro, '%H:%i:%s') AS hora,
    c.estado_sunat,
    c.fecha_limite_correccion,
    c.serie,
    c.numero_correlativo,
    tc.nombre_tipo_comprobante
FROM
    ventas v
    LEFT JOIN medio_pago mp ON v.id_medio_pago = mp.id_medio_pago
    LEFT JOIN comprobantes c ON c.id_venta = v.id_venta
    LEFT JOIN tipo_comprobante tc ON c.id_tipo_comprobante = tc.id_tipo_comprobante
WHERE
    (p_fecha_inicio IS NULL OR DATE(v.fecha_registro) >= p_fecha_inicio)
    AND (p_fecha_fin IS NULL OR DATE(v.fecha_registro) <= p_fecha_fin)
ORDER BY
    v.fecha_registro DESC
LIMIT p_limit
OFFSET p_offset;
END //

-- ─── SP: Contar Ventas ────────────────────────────────────────────────────────
CREATE PROCEDURE sp_contar_ventas (IN p_fecha_inicio DATE, IN p_fecha_fin DATE) BEGIN
SELECT
    COUNT(*) AS total_registros
FROM
    ventas v
WHERE
    (
        p_fecha_inicio IS NULL
        OR DATE (v.fecha_registro) >= p_fecha_inicio
    )
    AND (
        p_fecha_fin IS NULL
        OR DATE (v.fecha_registro) <= p_fecha_fin
    );

END //
-- ─── SP: Contar Venta por ID ──────────────────────────────────────────────────
CREATE PROCEDURE sp_contar_venta_por_id (IN p_id_venta INT) BEGIN
SELECT
    COUNT(*) AS total
FROM
    ventas
WHERE
    id_venta = p_id_venta;

END //
-- ─── SP: Obtener Comprobantes Pendientes Vencidos (para el job) ───────────────
CREATE PROCEDURE sp_obtener_comprobantes_pendientes_vencidos () BEGIN
SELECT
    c.id_comprobante
FROM
    comprobantes c
WHERE
    c.estado_sunat = 'pendiente'
    AND c.fecha_limite_correccion IS NOT NULL
    AND c.fecha_limite_correccion <= NOW();

END //

-- ─── SP: Obtener Comprobante Pendiente por ID (para reconstruir payload) ──────
CREATE PROCEDURE sp_obtener_comprobante_pendiente_por_id (IN p_id_comprobante INT) BEGIN
-- 1. Datos del comprobante y venta
SELECT
    c.id_comprobante,
    c.id_venta,
    c.id_tipo_comprobante,
    tc.nombre_tipo_comprobante,
    c.serie,
    c.numero_correlativo,
    c.fecha_emision,
    c.fecha_vencimiento,
    c.sunat_transaccion,
    v.numero_documento_cliente,
    v.id_tipo_documento,
    td.nombre_tipo_documento, 
    v.total_gravada,
    v.total_igv,
    v.total_venta
FROM comprobantes c
INNER JOIN ventas v ON v.id_venta = c.id_venta
INNER JOIN tipo_comprobante tc ON tc.id_tipo_comprobante = c.id_tipo_comprobante
INNER JOIN tipo_documento td ON td.id_tipo_documento = v.id_tipo_documento  -- ← agregar
WHERE c.id_comprobante = p_id_comprobante;

-- 2. Detalles para reconstruir el payload de ApisPeru
SELECT
    dv.cantidad_producto,
    dv.valor_unitario,
    dv.precio_unitario,
    dv.subtotal,
    dv.igv,
    dv.total_producto,
    p.nombre_producto,
    p.id_producto
FROM
    detalle_ventas dv
    INNER JOIN productos p ON p.id_producto = dv.id_producto
WHERE
    dv.id_venta = (
        SELECT
            id_venta
        FROM
            comprobantes
        WHERE
            id_comprobante = p_id_comprobante
    );

END //

-- ─── SP: Actualizar Estado SUNAT (usado por el job) ──────────────────────────
CREATE PROCEDURE sp_actualizar_estado_sunat (
    IN p_id_comprobante INT,
    IN p_estado ENUM ('pendiente', 'enviado_sunat', 'aceptado', 'rechazado'),
    IN p_url_comprobante_xml VARCHAR(150),
    IN p_public_id_xml VARCHAR(150),
    IN p_fecha_envio DATETIME,
    IN p_url_cdr VARCHAR(150),
    IN p_public_id_cdr VARCHAR(150),
    IN p_hash_comprobante VARCHAR(100)
)
BEGIN
    UPDATE comprobantes
    SET
        estado_sunat = p_estado,
        url_comprobante_xml = p_url_comprobante_xml,
        public_id_xml = p_public_id_xml,
        fecha_envio = p_fecha_envio,
        url_cdr = p_url_cdr,
        public_id_cdr = p_public_id_cdr,
        hash_comprobante = p_hash_comprobante,
        intentos_reenvio = intentos_reenvio + 1,
        fecha_ultimo_reintento = NOW()
    WHERE id_comprobante = p_id_comprobante;
END //

-- ─── SP: Obtener datos completos de venta para anular ────────────────────────
CREATE PROCEDURE sp_obtener_venta_para_anular (IN p_id_venta INT) BEGIN
-- 1. Datos de la venta y comprobante
SELECT
    v.id_venta,
    v.total_venta,
    c.id_comprobante,
    c.estado_sunat,
    c.fecha_limite_correccion,
    c.url_comprobante_pdf,
    c.public_id_pdf,
    c.url_comprobante_xml,
    c.public_id_xml
FROM
    ventas v
    INNER JOIN comprobantes c ON c.id_venta = v.id_venta
WHERE
    v.id_venta = p_id_venta;

-- 2. Detalle de productos (para revertir insumos)
SELECT
    dv.id_producto,
    dv.cantidad_producto,
    p.usa_insumos
FROM
    detalle_ventas dv
    INNER JOIN productos p ON p.id_producto = dv.id_producto
WHERE
    dv.id_venta = p_id_venta;

-- 3. Movimiento de caja asociado (para revertirlo)
SELECT
    mc.id_movimiento_caja
FROM
    movimientos_caja mc
WHERE
    mc.id_venta = p_id_venta;

END //
-- ─── SP: Anular Venta ─────────────────────────────────────────────────────────
CREATE PROCEDURE sp_anular_venta (
    IN p_id_venta INT,
    IN p_id_movimiento_caja INT,
    IN p_monto_revertir DECIMAL(10, 2),
    IN p_id_usuario INT
) BEGIN DECLARE EXIT HANDLER FOR SQLEXCEPTION BEGIN ROLLBACK;

RESIGNAL;

END;

START TRANSACTION;

DELETE FROM movimientos_caja
WHERE
    id_movimiento_caja = p_id_movimiento_caja;

UPDATE caja
SET
    monto_actual = monto_actual - p_monto_revertir
WHERE
    estado_caja = 'abierta';

INSERT INTO
    movimientos_caja (
        tipo_movimiento,
        fecha_movimiento,
        monto_movimiento,
        descripcion_mov_caja,
        id_caja,
        id_usuario
    )
SELECT
    'egreso',
    NOW(),
    p_monto_revertir,
    'Anulación de venta',
    id_caja,
    p_id_usuario
FROM
    caja
WHERE
    estado_caja = 'abierta';

DELETE FROM detalle_ventas
WHERE
    id_venta = p_id_venta;

DELETE FROM comprobantes
WHERE
    id_venta = p_id_venta;

DELETE FROM ventas
WHERE
    id_venta = p_id_venta;

COMMIT;
END // 

CREATE PROCEDURE sp_reenviar_comprobante(
    IN p_id_comprobante INT
)
BEGIN
    UPDATE comprobantes
    SET estado_sunat = 'enviado_sunat'
    WHERE id_comprobante = p_id_comprobante
    AND estado_sunat = 'rechazado';
    
    SELECT ROW_COUNT() AS filas_actualizadas;
END //

DELIMITER ;