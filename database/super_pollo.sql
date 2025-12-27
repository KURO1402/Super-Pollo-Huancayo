CREATE DATABASE super_pollo_hyo;

USE super_pollo_hyo;

-- Tabla para verificar correos
CREATE TABLE verificacion_correos(
    id_verificacion INT PRIMARY KEY AUTO_INCREMENT,
    correo_verificacion VARCHAR(100) NOT NULL,
    codigo_verificacion CHAR(6) NOT NULL,
    expiracion_verificacion DATETIME NOT NULL,
    estado_verificacion TINYINT(1) NOT NULL,
    registro_verificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
)

-- Tabla de roles
CREATE TABLE rol_usuario (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL
);

INSERT INTO rol_usuario(nombre_rol) VALUES
('usuario'),
('colaborador'),
('administrador')


-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(50) NOT NULL,
    apellido_usuario VARCHAR(100) NOT NULL,
    correo_usuario VARCHAR(50) NOT NULL,
    clave_usuario CHAR(60) NOT NULL,
    telefono_usuario VARCHAR(15) ,
    estado_usuario TINYINT(1) DEFAULT 1
);

-- Tabla de usuarios_roles
CREATE TABLE usuario_rol (
    id_rol INT NOT NULL,
    id_usuario INT  NOT NULL,
    fecha_inicio DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(),
    fecha_fin DATE DEFAULT NULL,
    rol_activo TINYINT(1) DEFAULT 1
)
