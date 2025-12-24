USE super_pollo_hyo;
DROP PROCEDURE IF EXISTS sp_registrar_usuario;
DROP PROCEDURE IF EXISTS sp_seleccionar_usuario_correo;

DELIMITER //

CREATE PROCEDURE sp_registrar_usuario(
    IN p_nombre_usuario   VARCHAR(50),
    IN p_apellido_usuario VARCHAR(100),
    IN p_correo_usuario   VARCHAR(50),
    IN p_clave_usuario    CHAR(60),
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
CREATE PROCEDURE sp_seleccionar_usuario_correo (
    IN p_correo_usuario VARCHAR(50)
)
BEGIN
    SELECT COUNT(*) AS total
    FROM usuarios
    WHERE correo_usuario = p_correo_usuario;
END //

DELIMITER ;
