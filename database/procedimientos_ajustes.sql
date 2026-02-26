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

-- Procedimientos de categorias de productos
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
    WHERE nombre_tipo_comprobante = p_nombre
      OR serie = p_serie
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

DELIMITER ;