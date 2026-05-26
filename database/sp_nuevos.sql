USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_limpiar_pedido_para_edicion;
DROP PROCEDURE IF EXISTS sp_actualizar_precio_pedido;
DROP PROCEDURE IF EXISTS sp_cancelar_pedido;
DROP PROCEDURE IF EXISTS sp_completar_pedido;
DROP PROCEDURE IF EXISTS sp_obtener_cabecera_pedido;
DROP PROCEDURE IF EXISTS sp_obtener_productos_pedido;
DROP PROCEDURE IF EXISTS sp_reporte_ventas_resumen;
DROP PROCEDURE IF EXISTS sp_reporte_ventas_detalle;
DROP PROCEDURE IF EXISTS sp_reporte_clientes_resumen;
DROP PROCEDURE IF EXISTS sp_reporte_clientes_detalle;
DROP PROCEDURE IF EXISTS sp_reporte_inventario_resumen;
DROP PROCEDURE IF EXISTS sp_reporte_inventario_detalle;
DROP PROCEDURE IF EXISTS sp_reporte_caja_resumen;
DROP PROCEDURE IF EXISTS sp_reporte_caja_detalle;


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

-- Resumen: KPIs del período
CREATE PROCEDURE sp_reporte_ventas_resumen(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT
        COUNT(v.id_venta)                          AS total_ventas,
        COALESCE(SUM(v.total_venta), 0)            AS monto_total,
        COALESCE(AVG(v.total_venta), 0)            AS ticket_promedio,
        COALESCE(SUM(v.total_igv), 0)              AS total_igv,
        COALESCE(SUM(v.total_gravada), 0)          AS total_gravada,
        mp.nombre_medio_pago                        AS medio_pago_frecuente,
        COUNT(mp.id_medio_pago)                     AS cantidad_medio_pago
    FROM ventas v
    LEFT JOIN medio_pago mp ON v.id_medio_pago = mp.id_medio_pago
    WHERE DATE(v.fecha_registro) BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY mp.nombre_medio_pago, mp.id_medio_pago
    ORDER BY cantidad_medio_pago DESC;
END //

-- Detalle: fila por fila
CREATE PROCEDURE sp_reporte_ventas_detalle(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT
        v.id_venta,
        v.fecha_registro,
        v.numero_documento_cliente,
        td.nombre_tipo_documento,
        COALESCE(v.nombre_cliente, 'Sin nombre')   AS nombre_cliente,
        mp.nombre_medio_pago,
        tc.nombre_tipo_comprobante,
        CONCAT(c.serie, '-', LPAD(c.numero_correlativo, 8, '0')) AS numero_comprobante,
        v.total_gravada,
        v.total_igv,
        v.total_venta
    FROM ventas v
    LEFT JOIN tipo_documento td      ON v.id_tipo_documento = td.id_tipo_documento
    LEFT JOIN medio_pago mp          ON v.id_medio_pago = mp.id_medio_pago
    LEFT JOIN comprobantes c         ON c.id_venta = v.id_venta
    LEFT JOIN tipo_comprobante tc    ON c.id_tipo_comprobante = tc.id_tipo_comprobante
    WHERE DATE(v.fecha_registro) BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY v.fecha_registro DESC;
END //

-- Resumen: métricas generales de clientes
CREATE PROCEDURE sp_reporte_clientes_resumen(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT
        COUNT(DISTINCT v.numero_documento_cliente)  AS total_clientes_unicos,
        COUNT(v.id_venta)                           AS total_compras,
        COALESCE(SUM(v.total_venta), 0)             AS monto_total,
        COALESCE(AVG(v.total_venta), 0)             AS ticket_promedio,
        MAX(v.total_venta)                          AS compra_maxima,
        MIN(v.total_venta)                          AS compra_minima
    FROM ventas v
    WHERE DATE(v.fecha_registro) BETWEEN p_fecha_inicio AND p_fecha_fin;
END //

-- Detalle: un registro por cliente con su historial del período
CREATE PROCEDURE sp_reporte_clientes_detalle(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT
        v.numero_documento_cliente,
        td.nombre_tipo_documento,
        COALESCE(v.nombre_cliente, 'Sin nombre')        AS nombre_cliente,
        COUNT(v.id_venta)                               AS cantidad_compras,
        COALESCE(SUM(v.total_venta), 0)                 AS total_gastado,
        COALESCE(AVG(v.total_venta), 0)                 AS ticket_promedio,
        MAX(v.fecha_registro)                           AS ultima_compra,
        -- Producto más pedido por este cliente
        (
            SELECT p.nombre_producto
            FROM detalle_ventas dv2
            JOIN ventas v2        ON dv2.id_venta = v2.id_venta
            JOIN productos p      ON dv2.id_producto = p.id_producto
            WHERE v2.numero_documento_cliente = v.numero_documento_cliente
              AND DATE(v2.fecha_registro) BETWEEN p_fecha_inicio AND p_fecha_fin
            GROUP BY p.id_producto
            ORDER BY SUM(dv2.cantidad_producto) DESC
            LIMIT 1
        ) AS producto_favorito
    FROM ventas v
    LEFT JOIN tipo_documento td ON v.id_tipo_documento = td.id_tipo_documento
    WHERE DATE(v.fecha_registro) BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY v.numero_documento_cliente, td.nombre_tipo_documento, v.nombre_cliente
    ORDER BY total_gastado DESC;
END //

-- Resumen: estado actual del stock + movimientos del período
CREATE PROCEDURE sp_reporte_inventario_resumen(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT
        COUNT(i.id_insumo)                                          AS total_insumos,
        SUM(CASE WHEN i.stock_insumo <= 5 THEN 1 ELSE 0 END)       AS insumos_stock_bajo,
        SUM(CASE WHEN i.estado_insumo = 0 THEN 1 ELSE 0 END)       AS insumos_inactivos,
        COALESCE(SUM(
            CASE WHEN ms.tipo_movimiento = 'entrada'
                 AND DATE(ms.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN ms.cantidad_movimiento ELSE 0 END
        ), 0)                                                        AS total_entradas_periodo,
        COALESCE(SUM(
            CASE WHEN ms.tipo_movimiento = 'salida'
                 AND DATE(ms.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN ms.cantidad_movimiento ELSE 0 END
        ), 0)                                                        AS total_salidas_periodo
    FROM insumos i
    LEFT JOIN movimientos_stock ms ON i.id_insumo = ms.id_insumo;
END //

-- Detalle: por insumo, su stock actual + movimientos del período
CREATE PROCEDURE sp_reporte_inventario_detalle(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT
        i.id_insumo,
        i.nombre_insumo,
        i.unidad_medida,
        i.stock_insumo                                              AS stock_actual,
        CASE WHEN i.stock_insumo <= 5 THEN 'BAJO' ELSE 'OK' END    AS estado_stock,
        CASE WHEN i.estado_insumo = 1 THEN 'Activo' ELSE 'Inactivo' END AS estado_insumo,
        COALESCE(SUM(
            CASE WHEN ms.tipo_movimiento = 'entrada'
                 AND DATE(ms.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN ms.cantidad_movimiento ELSE 0 END
        ), 0)                                                        AS entradas_periodo,
        COALESCE(SUM(
            CASE WHEN ms.tipo_movimiento = 'salida'
                 AND DATE(ms.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN ms.cantidad_movimiento ELSE 0 END
        ), 0)                                                        AS salidas_periodo
    FROM insumos i
    LEFT JOIN movimientos_stock ms ON i.id_insumo = ms.id_insumo
    GROUP BY i.id_insumo, i.nombre_insumo, i.unidad_medida, i.stock_insumo, i.estado_insumo
    ORDER BY i.nombre_insumo ASC;
END //

-- Resumen: ingresos, egresos y diferencias del período
CREATE PROCEDURE sp_reporte_caja_resumen(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT
        COUNT(DISTINCT c.id_caja)                                   AS total_cajas,
        COALESCE(SUM(
            CASE WHEN mc.tipo_movimiento = 'ingreso'
                 AND DATE(mc.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN mc.monto_movimiento ELSE 0 END
        ), 0)                                                        AS total_ingresos,
        COALESCE(SUM(
            CASE WHEN mc.tipo_movimiento = 'egreso'
                 AND DATE(mc.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN mc.monto_movimiento ELSE 0 END
        ), 0)                                                        AS total_egresos,
        COALESCE(SUM(
            CASE WHEN ac.estado_caja = 'sobra'
                 AND DATE(ac.fecha_arqueo) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN ac.diferencia ELSE 0 END
        ), 0)                                                        AS total_sobrante_arqueos,
        COALESCE(SUM(
            CASE WHEN ac.estado_caja = 'falta'
                 AND DATE(ac.fecha_arqueo) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN ac.diferencia ELSE 0 END
        ), 0)                                                        AS total_faltante_arqueos
    FROM caja c
    LEFT JOIN movimientos_caja mc   ON c.id_caja = mc.id_caja
    LEFT JOIN arqueos_caja ac       ON c.id_caja = ac.id_caja
    WHERE DATE(c.fecha_caja) BETWEEN p_fecha_inicio AND p_fecha_fin;
END //

-- Detalle: movimiento por movimiento del período
CREATE PROCEDURE sp_reporte_caja_detalle(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT
        mc.id_movimiento_caja,
        mc.fecha_movimiento,
        mc.tipo_movimiento,
        mc.monto_movimiento,
        mc.descripcion_mov_caja,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario)           AS usuario_responsable,
        mc.id_venta
    FROM movimientos_caja mc
    JOIN caja c     ON mc.id_caja = c.id_caja
    JOIN usuarios u ON mc.id_usuario = u.id_usuario
    WHERE DATE(mc.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY mc.fecha_movimiento DESC;
END //

DELIMITER ;