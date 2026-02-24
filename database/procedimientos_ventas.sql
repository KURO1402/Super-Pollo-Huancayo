USE super_pollo_hyo;
DROP PROCEDURE IF EXISTS sp_insertar_venta;
DROP PROCEDURE IF EXISTS sp_insertar_comprobante;
DROP PROCEDURE IF EXISTS sp_insertar_detalle_venta;

-- ─── SP: Insertar Venta ───────────────────────────────────────────────────────
DELIMITER //

CREATE PROCEDURE sp_insertar_venta(
    IN p_numero_documento_cliente VARCHAR(12),
    IN p_id_tipo_documento        INT,
    IN p_fecha_emision            DATE,
    IN p_fecha_vencimiento        DATE,
    IN p_porcentaje_igv           DECIMAL(5,2),
    IN p_total_gravada            DECIMAL(10,2),
    IN p_total_igv                DECIMAL(10,2),
    IN p_total_venta              DECIMAL(10,2),
    IN p_id_medio_pago            INT
)
BEGIN
    INSERT INTO ventas (
        numero_documento_cliente,
        id_tipo_documento,
        fecha_emision,
        fecha_vencimiento,
        porcentaje_igv,
        total_gravada,
        total_igv,
        total_venta,
        id_medio_pago
    ) VALUES (
        p_numero_documento_cliente,
        p_id_tipo_documento,
        p_fecha_emision,
        p_fecha_vencimiento,
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
    IN p_id_venta              INT,
    IN p_id_tipo_comprobante   INT,
    IN p_serie                 VARCHAR(5),
    IN p_numero_correlativo    INT,
    IN p_sunat_transaccion     TINYINT(4),
    IN p_aceptado_por_sunat    TINYINT(1),
    IN p_url_comprobante_pdf   VARCHAR(150),
    IN p_url_comprobante_xml   VARCHAR(150),
    IN p_fecha_envio           DATETIME
)
BEGIN
    INSERT INTO comprobantes (
        id_venta,
        id_tipo_comprobante,
        serie,
        numero_correlativo,
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
        p_sunat_transaccion,
        p_aceptado_por_sunat,
        p_url_comprobante_pdf,
        p_url_comprobante_xml,
        p_fecha_envio
    );

    SELECT LAST_INSERT_ID() AS id_comprobante;
END //


-- ─── SP: Insertar Detalle Venta ───────────────────────────────────────────────
CREATE PROCEDURE sp_insertar_detalle_venta(
    IN p_cantidad_producto INT,
    IN p_valor_unitario    DECIMAL(10,2),
    IN p_precio_unitario   DECIMAL(10,2),
    IN p_subtotal          DECIMAL(10,2),
    IN p_igv               DECIMAL(10,2),
    IN p_total_producto    DECIMAL(10,2),
    IN p_id_venta          INT,
    IN p_id_producto       INT
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

DELIMITER ;