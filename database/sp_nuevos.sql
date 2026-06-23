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
DROP PROCEDURE IF EXISTS sp_obtener_ultimo_pedido_mesa;
DROP PROCEDURE IF EXISTS sp_eliminar_verificacion;
DROP PROCEDURE IF EXISTS sp_ia_ventas_resumen;
DROP PROCEDURE IF EXISTS sp_ia_ventas_detalle;
DROP PROCEDURE IF EXISTS sp_ia_top_productos_vendidos;
DROP PROCEDURE IF EXISTS sp_ia_productos_catalogo;
DROP PROCEDURE IF EXISTS sp_ia_productos_con_insumos;
DROP PROCEDURE IF EXISTS sp_ia_caja_resumen;
DROP PROCEDURE IF EXISTS sp_ia_caja_movimientos;
DROP PROCEDURE IF EXISTS sp_ia_caja_arqueos;
DROP PROCEDURE IF EXISTS sp_ia_inventario_estado;
DROP PROCEDURE IF EXISTS sp_ia_inventario_movimientos;
DROP PROCEDURE IF EXISTS sp_ia_reservas;
DROP PROCEDURE IF EXISTS sp_ia_reservas_resumen;

DELIMITER //


CREATE PROCEDURE sp_limpiar_pedido_para_edicion(
    IN p_id_pedido INT
)
BEGIN
    UPDATE mesas
    SET estado_local = 'disponible'
    WHERE id_mesa IN (
        SELECT id_mesa FROM mesas_pedido WHERE id_pedido = p_id_pedido
    );
    DELETE FROM mesas_pedido  WHERE id_pedido = p_id_pedido;
    DELETE FROM detalle_pedido WHERE id_pedido = p_id_pedido;
END //

CREATE PROCEDURE sp_actualizar_precio_pedido(
    IN p_id_pedido        INT,
    IN p_precio_precuenta DECIMAL(6,2)
)
BEGIN
    UPDATE pedido_mesa
    SET precio_precuenta = p_precio_precuenta
    WHERE id_pedido = p_id_pedido;
END //

CREATE PROCEDURE sp_cancelar_pedido(
    IN p_id_pedido INT
)
BEGIN
    UPDATE pedido_mesa SET estado_pedido = 'cancelado'  WHERE id_pedido = p_id_pedido;
    UPDATE mesas SET estado_local = 'disponible'
    WHERE id_mesa IN (SELECT id_mesa FROM mesas_pedido WHERE id_pedido = p_id_pedido);
END //

CREATE PROCEDURE sp_completar_pedido(
    IN p_id_pedido INT
)
BEGIN
    UPDATE pedido_mesa SET estado_pedido = 'completado' WHERE id_pedido = p_id_pedido;
    UPDATE mesas SET estado_local = 'disponible'
    WHERE id_mesa IN (SELECT id_mesa FROM mesas_pedido WHERE id_pedido = p_id_pedido);
END //

CREATE PROCEDURE sp_obtener_ultimo_pedido_mesa(
    IN p_id_mesa INT
)
BEGIN
    SELECT pm.id_pedido, pm.fecha_pedido, pm.estado_pedido, pm.precio_precuenta
    FROM pedido_mesa pm
    INNER JOIN mesas_pedido mp ON mp.id_pedido = pm.id_pedido
    WHERE mp.id_mesa = p_id_mesa AND pm.estado_pedido = 'pendiente'
    ORDER BY pm.id_pedido DESC
    LIMIT 1;
END //

CREATE PROCEDURE sp_eliminar_verificacion(
    IN p_id_verificacion INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;
    START TRANSACTION;
    DELETE FROM verificaciones WHERE id_verificacion = p_id_verificacion;
    COMMIT;
END //

CREATE PROCEDURE sp_reporte_ventas_resumen(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
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

CREATE PROCEDURE sp_reporte_ventas_detalle(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
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
    LEFT JOIN tipo_documento   td ON v.id_tipo_documento   = td.id_tipo_documento
    LEFT JOIN medio_pago       mp ON v.id_medio_pago       = mp.id_medio_pago
    LEFT JOIN comprobantes      c ON c.id_venta            = v.id_venta
    LEFT JOIN tipo_comprobante tc ON c.id_tipo_comprobante = tc.id_tipo_comprobante
    WHERE DATE(v.fecha_registro) BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY v.fecha_registro DESC;
END //

CREATE PROCEDURE sp_reporte_clientes_resumen(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
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

CREATE PROCEDURE sp_reporte_clientes_detalle(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
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
        (
            SELECT p.nombre_producto
            FROM detalle_ventas dv2
            JOIN ventas    v2 ON dv2.id_venta    = v2.id_venta
            JOIN productos p  ON dv2.id_producto = p.id_producto
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

CREATE PROCEDURE sp_reporte_inventario_resumen(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
)
BEGIN
    SELECT
        COUNT(i.id_insumo)                                          AS total_insumos,
        SUM(CASE WHEN i.stock_insumo <= 5 THEN 1 ELSE 0 END)       AS insumos_stock_bajo,
        SUM(CASE WHEN i.estado_insumo = 0 THEN 1 ELSE 0 END)       AS insumos_inactivos,
        COALESCE(SUM(CASE WHEN ms.tipo_movimiento = 'entrada'
             AND DATE(ms.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN ms.cantidad_movimiento ELSE 0 END), 0)             AS total_entradas_periodo,
        COALESCE(SUM(CASE WHEN ms.tipo_movimiento = 'salida'
             AND DATE(ms.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN ms.cantidad_movimiento ELSE 0 END), 0)             AS total_salidas_periodo
    FROM insumos i
    LEFT JOIN movimientos_stock ms ON i.id_insumo = ms.id_insumo;
END //

CREATE PROCEDURE sp_reporte_inventario_detalle(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
)
BEGIN
    SELECT
        i.id_insumo,
        i.nombre_insumo,
        i.unidad_medida,
        i.stock_insumo                                              AS stock_actual,
        CASE WHEN i.stock_insumo <= 5 THEN 'BAJO' ELSE 'OK' END    AS estado_stock,
        CASE WHEN i.estado_insumo = 1 THEN 'Activo' ELSE 'Inactivo' END AS estado_insumo,
        COALESCE(SUM(CASE WHEN ms.tipo_movimiento = 'entrada'
             AND DATE(ms.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN ms.cantidad_movimiento ELSE 0 END), 0)             AS entradas_periodo,
        COALESCE(SUM(CASE WHEN ms.tipo_movimiento = 'salida'
             AND DATE(ms.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN ms.cantidad_movimiento ELSE 0 END), 0)             AS salidas_periodo
    FROM insumos i
    LEFT JOIN movimientos_stock ms ON i.id_insumo = ms.id_insumo
    GROUP BY i.id_insumo, i.nombre_insumo, i.unidad_medida, i.stock_insumo, i.estado_insumo
    ORDER BY i.nombre_insumo ASC;
END //

CREATE PROCEDURE sp_reporte_caja_resumen(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
)
BEGIN
    SELECT
        COUNT(DISTINCT c.id_caja)                                   AS total_cajas,
        COALESCE(SUM(CASE WHEN mc.tipo_movimiento = 'ingreso'
             AND DATE(mc.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN mc.monto_movimiento ELSE 0 END), 0)                AS total_ingresos,
        COALESCE(SUM(CASE WHEN mc.tipo_movimiento = 'egreso'
             AND DATE(mc.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN mc.monto_movimiento ELSE 0 END), 0)                AS total_egresos,
        COALESCE(SUM(CASE WHEN ac.estado_caja = 'sobra'
             AND DATE(ac.fecha_arqueo) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN ac.diferencia ELSE 0 END), 0)                      AS total_sobrante_arqueos,
        COALESCE(SUM(CASE WHEN ac.estado_caja = 'falta'
             AND DATE(ac.fecha_arqueo) BETWEEN p_fecha_inicio AND p_fecha_fin
            THEN ac.diferencia ELSE 0 END), 0)                      AS total_faltante_arqueos
    FROM caja c
    LEFT JOIN movimientos_caja mc ON c.id_caja = mc.id_caja
    LEFT JOIN arqueos_caja     ac ON c.id_caja = ac.id_caja
    WHERE DATE(c.fecha_caja) BETWEEN p_fecha_inicio AND p_fecha_fin;
END //

CREATE PROCEDURE sp_reporte_caja_detalle(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
)
BEGIN
    SELECT
        mc.id_movimiento_caja,
        mc.fecha_movimiento,
        mc.tipo_movimiento,
        mc.monto_movimiento,
        mc.descripcion_mov_caja,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS usuario_responsable,
        mc.id_venta
    FROM movimientos_caja mc
    JOIN caja     c ON mc.id_caja    = c.id_caja
    JOIN usuarios u ON mc.id_usuario = u.id_usuario
    WHERE DATE(mc.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY mc.fecha_movimiento DESC;
END //

CREATE PROCEDURE sp_ia_ventas_resumen(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
)
BEGIN
    SELECT
        COUNT(v.id_venta)                       AS total_ventas,
        COALESCE(SUM(v.total_venta),   0)       AS monto_total,
        COALESCE(AVG(v.total_venta),   0)       AS ticket_promedio,
        COALESCE(MAX(v.total_venta),   0)       AS venta_maxima,
        COALESCE(MIN(v.total_venta),   0)       AS venta_minima,
        COALESCE(SUM(v.total_igv),     0)       AS total_igv,
        COALESCE(SUM(v.total_gravada), 0)       AS total_gravada,
        (
            SELECT mp2.nombre_medio_pago
            FROM ventas v2
            JOIN medio_pago mp2 ON v2.id_medio_pago = mp2.id_medio_pago
            WHERE DATE(v2.fecha_registro) BETWEEN p_fecha_inicio AND p_fecha_fin
            GROUP BY mp2.id_medio_pago
            ORDER BY COUNT(*) DESC
            LIMIT 1
        )                                       AS medio_pago_mas_usado,
        (
            SELECT COUNT(*)
            FROM ventas v3
            WHERE DATE(v3.fecha_registro) = CURDATE()
        )                                       AS ventas_hoy,
        p_fecha_inicio                          AS periodo_desde,
        p_fecha_fin                             AS periodo_hasta
    FROM ventas v
    WHERE DATE(v.fecha_registro) BETWEEN p_fecha_inicio AND p_fecha_fin;
END //

CREATE PROCEDURE sp_ia_ventas_detalle(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
)
BEGIN
    SELECT
        v.id_venta,
        DATE_FORMAT(v.fecha_registro, '%d/%m/%Y %H:%i') AS fecha_hora,
        COALESCE(v.nombre_cliente, 'Sin nombre')        AS cliente,
        v.numero_documento_cliente                      AS documento,
        td.nombre_tipo_documento                        AS tipo_documento,
        mp.nombre_medio_pago                            AS medio_pago,
        CONCAT(c.serie, '-', LPAD(c.numero_correlativo, 8, '0')) AS comprobante,
        tc.nombre_tipo_comprobante                      AS tipo_comprobante,
        c.estado_sunat,
        v.total_gravada,
        v.total_igv,
        v.total_venta
    FROM ventas v
    LEFT JOIN tipo_documento   td ON v.id_tipo_documento   = td.id_tipo_documento
    LEFT JOIN medio_pago       mp ON v.id_medio_pago       = mp.id_medio_pago
    LEFT JOIN comprobantes      c ON c.id_venta            = v.id_venta
    LEFT JOIN tipo_comprobante tc ON c.id_tipo_comprobante = tc.id_tipo_comprobante
    WHERE DATE(v.fecha_registro) BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY v.fecha_registro DESC;
END //

CREATE PROCEDURE sp_ia_top_productos_vendidos(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
)
BEGIN
    SELECT
        p.nombre_producto,
        c.nombre_categoria,
        SUM(dv.cantidad_producto)             AS unidades_vendidas,
        ROUND(SUM(dv.total_producto), 2)      AS monto_generado,
        ROUND(AVG(dv.precio_unitario), 2)     AS precio_promedio
    FROM detalle_ventas dv
    JOIN ventas              v ON dv.id_venta    = v.id_venta
    JOIN productos           p ON dv.id_producto = p.id_producto
    JOIN categorias_producto c ON p.id_categoria = c.id_categoria
    WHERE DATE(v.fecha_registro) BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY p.id_producto, p.nombre_producto, c.nombre_categoria
    ORDER BY unidades_vendidas DESC
    LIMIT 10;
END //

CREATE PROCEDURE sp_ia_productos_catalogo(
    IN p_id_categoria INT,
    IN p_nombre       VARCHAR(100)
)
BEGIN
    SELECT
        p.id_producto,
        p.nombre_producto,
        p.descripcion_producto,
        p.precio_producto,
        c.nombre_categoria,
        CASE WHEN p.usa_insumos = 1 THEN 'Sí' ELSE 'No' END AS usa_insumos,
        COUNT(ip.id_imagen_producto) AS total_imagenes
    FROM productos p
    JOIN categorias_producto    c  ON p.id_categoria  = c.id_categoria
    LEFT JOIN imagenes_producto ip ON ip.id_producto  = p.id_producto
    WHERE p.estado_producto = 1
      AND (p_id_categoria IS NULL OR p.id_categoria   = p_id_categoria)
      AND (p_nombre IS NULL       OR p.nombre_producto LIKE CONCAT('%', p_nombre, '%'))
    GROUP BY p.id_producto, p.nombre_producto, p.descripcion_producto,
             p.precio_producto, c.nombre_categoria, p.usa_insumos
    ORDER BY c.nombre_categoria, p.nombre_producto;
END //

CREATE PROCEDURE sp_ia_productos_con_insumos(
    IN p_id_producto INT
)
BEGIN
    SELECT
        p.id_producto,
        p.nombre_producto,
        p.precio_producto,
        c.nombre_categoria,
        i.nombre_insumo,
        cip.cantidad_uso,
        i.unidad_medida,
        i.stock_insumo                              AS stock_actual,
        CASE
            WHEN i.stock_insumo <= 5  THEN 'crítico'
            WHEN i.stock_insumo <= 10 THEN 'bajo'
            ELSE 'normal'
        END                                         AS nivel_stock
    FROM productos p
    JOIN categorias_producto       c   ON p.id_categoria  = c.id_categoria
    JOIN cantidad_insumo_producto  cip ON cip.id_producto = p.id_producto
    JOIN insumos                   i   ON cip.id_insumo   = i.id_insumo
    WHERE p.estado_producto = 1
      AND p.usa_insumos = 1
      AND (p_id_producto IS NULL OR p.id_producto = p_id_producto)
    ORDER BY p.nombre_producto, i.nombre_insumo;
END //

CREATE PROCEDURE sp_ia_caja_resumen(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
)
BEGIN
    SELECT
        c.id_caja,
        DATE(c.fecha_caja)                          AS fecha,
        c.saldo_inicial,
        c.monto_actual,
        c.saldo_final,
        c.estado_caja,
        c.hora_cierre,
        COALESCE(SUM(CASE WHEN mc.tipo_movimiento = 'ingreso' THEN mc.monto_movimiento ELSE 0 END), 0) AS total_ingresos,
        COALESCE(SUM(CASE WHEN mc.tipo_movimiento = 'egreso'  THEN mc.monto_movimiento ELSE 0 END), 0) AS total_egresos,
        COUNT(mc.id_movimiento_caja)                AS cantidad_movimientos,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS abierta_por
    FROM caja c
    LEFT JOIN movimientos_caja mc ON mc.id_caja    = c.id_caja
    LEFT JOIN eventos_caja     ec ON ec.id_caja    = c.id_caja AND ec.tipo_evento = 'apertura'
    LEFT JOIN usuarios          u ON ec.id_usuario = u.id_usuario
    WHERE DATE(c.fecha_caja) BETWEEN p_fecha_inicio AND p_fecha_fin
    GROUP BY c.id_caja, c.fecha_caja, c.saldo_inicial, c.monto_actual,
             c.saldo_final, c.estado_caja, c.hora_cierre,
             u.nombre_usuario, u.apellido_usuario
    ORDER BY c.fecha_caja DESC;
END //

CREATE PROCEDURE sp_ia_caja_movimientos(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE,
    IN p_tipo         ENUM('ingreso','egreso')
)
BEGIN
    SELECT
        mc.id_movimiento_caja,
        mc.tipo_movimiento,
        DATE(mc.fecha_movimiento)                   AS fecha,
        TIME(mc.fecha_movimiento)                   AS hora,
        mc.monto_movimiento,
        mc.descripcion_mov_caja,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS usuario,
        mc.id_venta
    FROM movimientos_caja mc
    JOIN usuarios u ON mc.id_usuario = u.id_usuario
    WHERE DATE(mc.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
      AND (p_tipo IS NULL OR mc.tipo_movimiento = p_tipo)
    ORDER BY mc.fecha_movimiento DESC;
END //

CREATE PROCEDURE sp_ia_caja_arqueos(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
)
BEGIN
    SELECT
        a.id_arqueo,
        DATE(a.fecha_arqueo)                        AS fecha,
        TIME(a.fecha_arqueo)                        AS hora,
        a.monto_fisico,
        a.monto_tarjeta,
        a.monto_billetera_digital,
        a.otros,
        a.diferencia,
        a.estado_caja                               AS resultado_arqueo,
        a.descripcion_arqueo,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS registrado_por
    FROM arqueos_caja a
    JOIN usuarios u ON a.id_usuario = u.id_usuario
    WHERE DATE(a.fecha_arqueo) BETWEEN p_fecha_inicio AND p_fecha_fin
    ORDER BY a.fecha_arqueo DESC;
END //

CREATE PROCEDURE sp_ia_inventario_estado(
    IN p_nivel VARCHAR(10)
)
BEGIN
    SELECT
        i.id_insumo,
        i.nombre_insumo,
        i.stock_insumo,
        i.unidad_medida,
        CASE
            WHEN i.stock_insumo <= 5  THEN 'critico'
            WHEN i.stock_insumo <= 10 THEN 'bajo'
            ELSE 'normal'
        END                                         AS nivel_stock,
        GROUP_CONCAT(p.nombre_producto ORDER BY p.nombre_producto SEPARATOR ', ') AS usado_en_productos
    FROM insumos i
    LEFT JOIN cantidad_insumo_producto cip ON cip.id_insumo   = i.id_insumo
    LEFT JOIN productos                p   ON cip.id_producto = p.id_producto AND p.estado_producto = 1
    WHERE i.estado_insumo = 1
      AND (
            p_nivel IS NULL
        OR (p_nivel = 'critico' AND i.stock_insumo <= 5)
        OR (p_nivel = 'bajo'    AND i.stock_insumo >  5 AND i.stock_insumo <= 10)
        OR (p_nivel = 'normal'  AND i.stock_insumo > 10)
      )
    GROUP BY i.id_insumo, i.nombre_insumo, i.stock_insumo, i.unidad_medida
    ORDER BY i.stock_insumo ASC;
END //

CREATE PROCEDURE sp_ia_inventario_movimientos(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE,
    IN p_id_insumo    INT
)
BEGIN
    SELECT
        ms.id_movimiento_stock,
        i.nombre_insumo,
        ms.tipo_movimiento,
        ms.cantidad_movimiento,
        i.unidad_medida,
        DATE(ms.fecha_movimiento)                   AS fecha,
        TIME(ms.fecha_movimiento)                   AS hora,
        ms.detalle_movimiento,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS registrado_por
    FROM movimientos_stock ms
    JOIN insumos  i ON ms.id_insumo  = i.id_insumo
    JOIN usuarios u ON ms.id_usuario = u.id_usuario
    WHERE DATE(ms.fecha_movimiento) BETWEEN p_fecha_inicio AND p_fecha_fin
      AND (p_id_insumo IS NULL OR ms.id_insumo = p_id_insumo)
    ORDER BY ms.fecha_movimiento DESC;
END //

CREATE PROCEDURE sp_ia_reservas(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE,
    IN p_estado       VARCHAR(20)
)
BEGIN
    SELECT
        r.id_reservacion,
        r.codigo_reservacion,
        r.fecha_reservacion,
        r.hora_reservacion,
        r.cantidad_personas,
        r.estado_reservacion,
        r.fecha_creacion,
        GROUP_CONCAT(
            CONCAT('Mesa ', m.numero_mesa, ' (', m.capacidad, ' personas)')
            ORDER BY m.numero_mesa SEPARATOR ' | '
        )                                           AS mesas_asignadas,
        pp.monto_pagado,
        pp.estado_pago,
        CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS cliente
    FROM reservaciones r
    LEFT JOIN mesas_reservacion  mr ON mr.id_reservacion = r.id_reservacion
    LEFT JOIN mesas               m ON mr.id_mesa        = m.id_mesa
    LEFT JOIN pago_reservacion   pp ON pp.id_reservacion = r.id_reservacion
    LEFT JOIN usuarios            u ON r.id_usuario      = u.id_usuario
    WHERE r.fecha_reservacion BETWEEN p_fecha_inicio AND p_fecha_fin
      AND (p_estado IS NULL OR r.estado_reservacion = p_estado)
    GROUP BY r.id_reservacion, r.codigo_reservacion, r.fecha_reservacion,
             r.hora_reservacion, r.cantidad_personas, r.estado_reservacion,
             r.fecha_creacion, pp.monto_pagado, pp.estado_pago,
             u.nombre_usuario, u.apellido_usuario
    ORDER BY r.fecha_reservacion ASC, r.hora_reservacion ASC;
END //

CREATE PROCEDURE sp_ia_reservas_resumen(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin    DATE
)
BEGIN
    SELECT
        COUNT(*)                                    AS total_reservas,
        SUM(CASE WHEN r.estado_reservacion = 'pendiente'  THEN 1 ELSE 0 END) AS pendientes,
        SUM(CASE WHEN r.estado_reservacion = 'completado' THEN 1 ELSE 0 END) AS completadas,
        SUM(CASE WHEN r.estado_reservacion = 'cancelado'  THEN 1 ELSE 0 END) AS canceladas,
        SUM(r.cantidad_personas)                    AS total_personas,
        ROUND(AVG(r.cantidad_personas), 1)          AS promedio_personas,
        COALESCE(SUM(pp.monto_pagado), 0)           AS total_pagos_reserva
    FROM reservaciones r
    LEFT JOIN pago_reservacion pp ON pp.id_reservacion = r.id_reservacion
                                  AND pp.estado_pago = 'confirmado'
    WHERE r.fecha_reservacion BETWEEN p_fecha_inicio AND p_fecha_fin;
END //

DELIMITER ;