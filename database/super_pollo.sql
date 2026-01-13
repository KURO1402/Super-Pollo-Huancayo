USE super_pollo_hyo;

-- Tablas con más dependencias (hijas)
DROP TABLE IF EXISTS cantidad_insumo_producto;
DROP TABLE IF EXISTS movimientos_stock;
DROP TABLE IF EXISTS arqueos_caja;
DROP TABLE IF EXISTS movimientos_caja;
DROP TABLE IF EXISTS eventos_caja;
DROP TABLE IF EXISTS usuario_rol;

-- Tablas intermedias
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS insumos;
DROP TABLE IF EXISTS caja;

-- Tablas base
DROP TABLE IF EXISTS categorias_producto;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS rol_usuario;
DROP TABLE IF EXISTS verificacion_correos;

-- Tabla para verificar correos
CREATE TABLE verificacion_correos(
    id_verificacion INT PRIMARY KEY AUTO_INCREMENT,
    correo_verificacion VARCHAR(100) NOT NULL,
    codigo_verificacion CHAR(6) NOT NULL,
    expiracion_verificacion DATETIME NOT NULL,
    estado_verificacion TINYINT(1) NOT NULL,
    registro_verificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de roles
CREATE TABLE rol_usuario (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL
);

INSERT INTO rol_usuario(nombre_rol) VALUES
('usuario'),
('colaborador'),
('administrador');

-- Tabla de usuarios
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(100) NOT NULL,
    apellido_usuario VARCHAR(100) NOT NULL,
    correo_usuario VARCHAR(100) NOT NULL,
    clave_usuario CHAR(60) NOT NULL,
    telefono_usuario VARCHAR(15) ,
    estado_usuario TINYINT(1) DEFAULT 1
);

-- Tabla de usuarios_roles
CREATE TABLE usuario_rol (
    id_rol INT NOT NULL,
    id_usuario INT  NOT NULL,
    fecha_inicio DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATE DEFAULT NULL,
    rol_activo TINYINT(1) DEFAULT 1
);

-- Tabla para registro de cajas
CREATE TABLE caja (
    id_caja INT AUTO_INCREMENT PRIMARY KEY,
    saldo_inicial DECIMAL(10,2) NOT NULL,
    monto_actual DECIMAL(10,2) NOT NULL,
    saldo_final DECIMAL(10,2) DEFAULT NULL,
    fecha_caja DATETIME NOT NULL,
    estado_caja ENUM('abierta', 'cerrada') NOT NULL
);

-- Tabla para eventos de apertura y cierre de caja
CREATE TABLE eventos_caja (
    id_evento_caja INT AUTO_INCREMENT PRIMARY KEY,
    tipo_evento ENUM('apertura', 'cierre') NOT NULL,
    fecha_evento DATETIME NOT NULL,
    id_caja INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_caja) REFERENCES caja(id_caja),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla para movimientos(ingresos y egresos) de caja
CREATE TABLE movimientos_caja (
    id_movimiento_caja INT AUTO_INCREMENT PRIMARY KEY,
    tipo_movimiento ENUM('ingreso', 'egreso') NOT NULL,
    fecha_movimiento DATETIME NOT NULL,
    monto_movimiento DECIMAL(6,2) NOT NULL,
    descripcion_mov_caja TEXT NOT NULL,
    id_caja INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_caja) REFERENCES caja(id_caja),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla para registros de arqueos de caja
CREATE TABLE arqueos_caja (
    id_arqueo INT AUTO_INCREMENT PRIMARY KEY,
    fecha_arqueo DATETIME NOT NULL,
    monto_fisico DECIMAL(6,2) NOT NULL,
    monto_tarjeta DECIMAL(6,2) NOT NULL,
    monto_billetera_digital DECIMAL(10,2) NOT NULL,
    otros DECIMAL(6,2) DEFAULT 0.00,
    diferencia DECIMAL(6,2) NOT NULL,
    estado_caja ENUM('cuadra', 'sobra', 'falta') NOT NULL,
    id_caja INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_caja) REFERENCES caja(id_caja),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla para insumos
CREATE TABLE insumos (
    id_insumo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_insumo VARCHAR(100) NOT NULL,
    stock_insumo decimal(5, 2) NOT NULL,
    unidad_medida VARCHAR(30) NOT NULL,
    estado_insumo TINYINT(1) NOT NULL DEFAULT 1
);

-- Tabla para los movimientos de insumos
CREATE TABLE movimientos_stock (
    id_movimiento_stock INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    cantidad_movimiento DECIMAL(5,2) NOT NULL,
    tipo_movimiento ENUM('entrada', 'salida') NOT NULL,
    fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detalle_movimiento TEXT,
    id_insumo INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_insumo) REFERENCES insumos(id_insumo),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla para categorias de productos
CREATE TABLE categorias_producto (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL
);

-- Tabla para productos 
CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion_producto TEXT NOT NULL,
    precio_producto DECIMAL(5, 2) NOT NULL,
    usa_insumos TINYINT(1) NOT NULL,
    estado_producto TINYINT(1) NOT NULL DEFAULT 1,
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categorias_producto(id_categoria)
);

-- Tabla para relacionar uno o mas insumos a un producto
CREATE TABLE cantidad_insumo_producto (
    id_producto INT NOT NULL,
    id_insumo INT NOT NULL,
    cantidad_uso DECIMAL(5,2) NOT NULL,
    PRIMARY KEY (id_producto, id_insumo),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_insumo) REFERENCES insumos(id_insumo)
);