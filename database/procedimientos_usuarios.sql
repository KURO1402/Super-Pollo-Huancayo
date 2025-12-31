USE super_pollo_hyo;

DROP PROCEDURE IF EXISTS sp_registrar_usuario;
DROP PROCEDURE IF EXISTS sp_seleccionar_total_usuario_correo;
DROP PROCEDURE IF EXISTS sp_registrar_codigo_verificacion;
DROP PROCEDURE IF EXISTS sp_obtener_verificacion_correo;
DROP PROCEDURE IF EXISTS sp_verificar_codigo_correo;
DROP PROCEDURE IF EXISTS sp_verificar_validacion_correo;
DROP PROCEDURE IF EXISTS sp_seleccionar_usuario_correo;
DROP PROCEDURE IF EXISTS sp_listar_usuarios;
DROP PROCEDURE IF EXISTS sp_contar_usuario_id;
DROP PROCEDURE IF EXISTS sp_obtener_usuario_por_id;
DROP PROCEDURE IF EXISTS sp_actualizar_datos_usuario;
DROP PROCEDURE IF EXISTS sp_actualizar_correo_usuario;
DROP PROCEDURE IF EXISTS sp_actualizar_clave_usuario;

DELIMITER //

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
        u.correo_usuario,
        ur.id_rol
    FROM usuarios u
    INNER JOIN usuario_rol ur ON ur.id_usuario = u.id_usuario
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

CREATE PROCEDURE sp_listar_usuarios(
    IN p_limite INT,
    IN p_desplazamiento INT,
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
    LEFT JOIN usuario_rol ur
        ON u.id_usuario = ur.id_usuario
        AND ur.rol_activo = 1
    LEFT JOIN rol_usuario ru
        ON ur.id_rol = ru.id_rol
    WHERE u.estado_usuario = 1
      AND u.id_usuario <> p_id_usuario
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
    LEFT JOIN usuario_rol ur
        ON u.id_usuario = ur.id_usuario
        AND ur.rol_activo = 1
    LEFT JOIN rol_usuario ru
        ON ur.id_rol = ru.id_rol
    WHERE u.estado_usuario = 1
      AND u.id_usuario = p_id_usuario;
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

DELIMITER ;
