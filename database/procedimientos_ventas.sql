USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_insertar_venta;
DROP PROCEDURE IF EXISTS sp_insertar_comprobante;
DROP PROCEDURE IF EXISTS sp_insertar_detalle_venta;
DROP PROCEDURE IF EXISTS sp_obtener_detalle_venta_por_id_venta;
DROP PROCEDURE IF EXISTS sp_obtener_comprobante_por_id_venta;
DROP PROCEDURE IF EXISTS sp_obtener_venta_por_id;
DROP PROCEDURE IF EXISTS sp_obtener_ventas;
DROP PROCEDURE IF EXISTS sp_contar_ventas;
DROP PROCEDURE IF EXISTS sp_contar_venta_por_id;

-- ─── SP: Insertar Venta ───────────────────────────────────────────────────────
DELIMITER //

CREATE PROCEDURE sp_insertar_venta(
    IN p_numero_documento_cliente VARCHAR(12),
    IN p_id_tipo_documento INT,
    IN p_porcentaje_igv DECIMAL(5,2),
    IN p_total_gravada DECIMAL(10,2),
    IN p_total_igv DECIMAL(10,2),
    IN p_total_venta DECIMAL(10,2),
    IN p_id_medio_pago INT
)
BEGIN
    INSERT INTO ventas (
        numero_documento_cliente,
        id_tipo_documento,
        porcentaje_igv,
        total_gravada,
        total_igv,
        total_venta,
        id_medio_pago
    ) VALUES (
        p_numero_documento_cliente,
        p_id_tipo_documento,
        p_porcentaje_igv,
        p_total_gravada,
        p_total_igv,
        p_total_venta,
        p_id_medio_pago
    );

    SELECT LAST_INSERT_ID() AS id_venta;
END //

-- ─── SP: Insertar Comprobante ─────────────────────────────────────────────────
CREATE PROCEDURE sp_insertar_comprobante(
    IN p_id_venta INT,
    IN p_id_tipo_comprobante INT,
    IN p_serie VARCHAR(5),
    IN p_numero_correlativo INT,
    IN p_fecha_emision DATE,
    IN p_fecha_vencimiento DATE,
    IN p_sunat_transaccion TINYINT(4),
    IN p_aceptado_por_sunat TINYINT(1),
    IN p_url_comprobante_pdf VARCHAR(150),
    IN p_url_comprobante_xml VARCHAR(150),
    IN p_fecha_envio DATETIME
)
BEGIN
    INSERT INTO comprobantes (
        id_venta,
        id_tipo_comprobante,
        serie,
        numero_correlativo,
        fecha_emision,
        fecha_vencimiento,
        sunat_transaccion,
        aceptado_por_sunat,
        url_comprobante_pdf,
        url_comprobante_xml,
        fecha_envio
    ) VALUES (
        p_id_venta,
        p_id_tipo_comprobante,
        p_serie,
        p_numero_correlativo,
        p_fecha_emision,
        p_fecha_vencimiento,
        p_sunat_transaccion,
        p_aceptado_por_sunat,
        p_url_comprobante_pdf,
        p_url_comprobante_xml,
        p_fecha_envio
    );

    SELECT LAST_INSERT_ID() AS id_comprobante;
END //


CREATE PROCEDURE sp_insertar_detalle_venta(
    IN p_cantidad_producto INT,
    IN p_valor_unitario DECIMAL(10,2),
    IN p_precio_unitario DECIMAL(10,2),
    IN p_subtotal DECIMAL(10,2),
    IN p_igv DECIMAL(10,2),
    IN p_total_producto DECIMAL(10,2),
    IN p_id_venta INT,
    IN p_id_producto INT
)
BEGIN
    INSERT INTO detalle_ventas (
        cantidad_producto,
        valor_unitario,
        precio_unitario,
        subtotal,
        igv,
        total_producto,
        id_venta,
        id_producto
    ) VALUES (
        p_cantidad_producto,
        p_valor_unitario,
        p_precio_unitario,
        p_subtotal,
        p_igv,
        p_total_producto,
        p_id_venta,
        p_id_producto
    );

    SELECT LAST_INSERT_ID() AS id_detalle_venta;
END //

CREATE PROCEDURE sp_obtener_venta_por_id(
    IN p_id_venta INT
)
BEGIN
    SELECT 
        v.id_venta,
        v.porcentaje_igv,
        v.total_gravada,
        v.total_igv,
        v.total_venta,
        mp.nombre_medio_pago
    FROM ventas v
    INNER JOIN medio_pago mp 
        ON v.id_medio_pago = mp.id_medio_pago
    WHERE v.id_venta = p_id_venta;
END //

CREATE PROCEDURE sp_obtener_comprobante_por_id_venta(
    IN p_id_venta INT
)
BEGIN
    SELECT 
        c.id_comprobante,
        c.id_tipo_comprobante,
        c.serie,
        c.numero_correlativo,
        DATE_FORMAT(c.fecha_emision, '%d-%m-%Y') AS fecha_emision,
        DATE_FORMAT(c.fecha_vencimiento, '%d-%m-%Y') AS fecha_vencimiento,
        c.sunat_transaccion,
        c.aceptado_por_sunat,
        c.url_comprobante_pdf,
        c.url_comprobante_xml
    FROM comprobantes c
    WHERE c.id_venta = p_id_venta;
END //

CREATE PROCEDURE sp_obtener_detalle_venta_por_id_venta(
    IN p_id_venta INT
)
BEGIN
    SELECT 
        dv.id_detalle_venta,
        dv.cantidad_producto,
        dv.valor_unitario,
        dv.precio_unitario,
        dv.subtotal,
        dv.igv,
        dv.total_producto,
        p.nombre_producto
    FROM detalle_ventas dv
    INNER JOIN productos p 
        ON dv.id_producto = p.id_producto
    WHERE dv.id_venta = p_id_venta;
END //

CREATE PROCEDURE sp_obtener_ventas(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE,
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        v.id_venta,
        v.porcentaje_igv,
        v.total_gravada,
        v.total_igv,
        v.total_venta,
        mp.nombre_medio_pago,
        DATE_FORMAT(v.fecha_registro, '%d-%m-%Y') AS fecha,
        DATE_FORMAT(v.fecha_registro, '%H:%i:%s') AS hora
    FROM ventas v
    LEFT JOIN medio_pago mp
        ON v.id_medio_pago = mp.id_medio_pago
    WHERE (p_fecha_inicio IS NULL OR DATE(v.fecha_registro) >= p_fecha_inicio)
      AND (p_fecha_fin IS NULL OR DATE(v.fecha_registro) <= p_fecha_fin)
    ORDER BY v.fecha_registro DESC
    LIMIT p_limit OFFSET p_offset;
END //

CREATE PROCEDURE sp_contar_ventas(
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    SELECT 
        COUNT(*) AS total_registros
    FROM ventas v
    WHERE (p_fecha_inicio IS NULL OR DATE(v.fecha_registro) >= p_fecha_inicio)
      AND (p_fecha_fin IS NULL OR DATE(v.fecha_registro) <= p_fecha_fin);
END //

CREATE PROCEDURE sp_contar_venta_por_id(
    IN p_id_venta INT
)
BEGIN
    SELECT COUNT(*) AS total
    FROM ventas
    WHERE id_venta = p_id_venta;
END //

DELIMITER ;