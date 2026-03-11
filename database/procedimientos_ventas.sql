USE super_pollo_hyo;

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

DELIMITER //
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
    IN p_estado_sunat ENUM('pendiente','enviado','rechazado'),
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

    c.serie,
    c.numero_correlativo,
    DATE_FORMAT(c.fecha_emision, '%d-%m-%Y') AS fecha_emision,
    DATE_FORMAT(c.fecha_vencimiento, '%d-%m-%Y') AS fecha_vencimiento,
    c.sunat_transaccion,
    c.estado_sunat,
    c.url_comprobante_pdf,
    c.url_comprobante_xml,
    c.fecha_envio,
    c.fecha_limite_correccion
FROM
    comprobantes c
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
    c.numero_correlativo
FROM
    ventas v
    LEFT JOIN medio_pago mp ON v.id_medio_pago = mp.id_medio_pago
    LEFT JOIN comprobantes c ON c.id_venta = v.id_venta
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
    IN p_estado ENUM ('pendiente', 'enviado', 'rechazado'),
    IN p_url_comprobante_xml VARCHAR(150),
    IN p_public_id_xml VARCHAR(150),
    IN p_fecha_envio DATETIME
) BEGIN
UPDATE comprobantes
SET
    estado_sunat = p_estado,
    url_comprobante_xml = p_url_comprobante_xml,
    public_id_xml = p_public_id_xml,
    fecha_envio = p_fecha_envio
WHERE
    id_comprobante = p_id_comprobante;

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

DELIMITER ;