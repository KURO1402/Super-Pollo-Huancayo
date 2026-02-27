CREATE DATABASE super_pollo_hyo;
USE super_pollo_hyo;

-- Tablas con más dependencias (hijas)
DROP TABLE IF EXISTS cantidad_insumo_producto;
DROP TABLE IF EXISTS movimientos_stock;
DROP TABLE IF EXISTS arqueos_caja;
DROP TABLE IF EXISTS movimientos_caja;
DROP TABLE IF EXISTS eventos_caja;
DROP TABLE IF EXISTS usuario_rol;
DROP TABLE IF EXISTS imagenes_producto;
DROP TABLE IF EXISTS mesas_reservacion;
DROP TABLE IF EXISTS bloqueos_temporales_mesa;
DROP TABLE IF EXISTS detalle_ventas;

-- Tablas intermedias
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS insumos;
DROP TABLE IF EXISTS caja;
DROP TABLE IF EXISTS pago_reservacion;
DROP TABLE IF EXISTS comprobantes;

-- Tablas base
DROP TABLE IF EXISTS categorias_producto;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS rol_usuario;
DROP TABLE IF EXISTS verificacion_correos;
DROP TABLE IF EXISTS tipo_documento;
DROP TABLE IF EXISTS medio_pago;
DROP TABLE IF EXISTS tipo_comprobante;
DROP TABLE IF EXISTS mesas;
DROP TABLE IF EXISTS reservaciones;
DROP TABLE IF EXISTS ventas;

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

-- Tabla para imagenes
CREATE TABLE imagenes_producto (
    id_imagen_producto INT AUTO_INCREMENT PRIMARY KEY,
    url_imagen VARCHAR(300),
    public_id VARCHAR(100),
    id_producto INT,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
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

-- Tabla de tipos de documento
CREATE TABLE tipo_documento (
  id_tipo_documento INT AUTO_INCREMENT PRIMARY KEY,
  nombre_tipo_documento VARCHAR(50) NOT NULL ,
  estado_documento TINYINT(1) NOT NULL DEFAULT 1
);

-- Tabla de medios de pago
CREATE TABLE medio_pago (
  id_medio_pago INT AUTO_INCREMENT PRIMARY KEY,
  nombre_medio_pago VARCHAR(50) NOT NULL,
  estado_medio_pago TINYINT(1) NOT NULL DEFAULT 1
);

-- Tabla de tipos de comprobantes
CREATE TABLE tipo_comprobante (
  id_tipo_comprobante INT AUTO_INCREMENT PRIMARY KEY,
  nombre_tipo_comprobante VARCHAR(50) NOT NULL,
  serie VARCHAR(5) NOT NULL,
  correlativo INT NOT NULL DEFAULT 0,
  estado_comprobante TINYINT(1) NOT NULL DEFAULT 1
);

-- Tabla para mesas
CREATE TABLE mesas (
    id_mesa INT AUTO_INCREMENT PRIMARY KEY,
    numero_mesa INT NOT NULL,
    capacidad INT NOT NULL
);

-- Tabla para blouqeos de mesa
CREATE TABLE bloqueos_temporales_mesa (
    id_bloqueo INT AUTO_INCREMENT PRIMARY KEY,
    id_mesa INT NOT NULL,
    id_usuario INT NOT NULL,
    bloqueado_desde DATETIME NOT NULL,
    bloqueado_hasta DATETIME NOT NULL,
    expira_en DATETIME NOT NULL,
    FOREIGN KEY (id_mesa) REFERENCES mesas(id_mesa) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);


-- Tabla para reservaciones
CREATE TABLE reservaciones (
    id_reservacion INT AUTO_INCREMENT PRIMARY KEY,
    fecha_reservacion DATE NOT NULL,
    hora_reservacion TIME NOT NULL,
    cantidad_personas INT NOT NULL,
    estado_reservacion ENUM('pendiente','cancelado', 'completado') NOT NULL DEFAULT 'pendiente',
    codigo_reservacion CHAR(6) DEFAULT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Tabla intermedia para las mesas de una reservacion
CREATE TABLE mesas_reservacion (
    id_mesa INT NOT NULL,
    id_reservacion INT NOT NULL,
    reserva_desde DATETIME,
    reserva_hasta DATETIME,
    PRIMARY KEY (id_mesa, id_reservacion),
    FOREIGN KEY (id_mesa) REFERENCES mesas(id_mesa) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_reservacion) REFERENCES reservaciones(id_reservacion) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla para pagos de las reservaciones
CREATE TABLE pago_reservacion (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    monto_pagado DECIMAL(5,2) NOT NULL,
    id_transaccion VARCHAR(100) NOT NULL,
    fecha_pago DATETIME NOT NULL,
    estado_pago ENUM('pendiente','confirmado','fallido') NOT NULL,
    id_reservacion INT NOT NULL,
    FOREIGN KEY (id_reservacion) REFERENCES reservaciones(id_reservacion)
);

-- Tabla para ventas
CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    numero_documento_cliente VARCHAR(12) NOT NULL,
    id_tipo_documento INT NOT NULL,
    porcentaje_igv DECIMAL(5,2),
    total_gravada DECIMAL(10,2),
    total_igv DECIMAL(10,2),
    total_venta DECIMAL(10,2),
    id_medio_pago INT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comprobantes (
    id_comprobante INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    id_tipo_comprobante INT NOT NULL,
    serie VARCHAR(5) NOT NULL,
    numero_correlativo INT NOT NULL,
    fecha_emision DATE,
    fecha_vencimiento DATE,
    sunat_transaccion TINYINT(4) NOT NULL,
    aceptado_por_sunat TINYINT(1),
    url_comprobante_pdf VARCHAR(150),
    url_comprobante_xml VARCHAR(150),
    fecha_envio DATETIME,
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_comprobante) REFERENCES tipo_comprobante(id_tipo_comprobante) ON DELETE CASCADE
);

-- Tabla para de talles de ventas
CREATE TABLE detalle_ventas (
    id_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
    cantidad_producto INT NOT NULL,
    valor_unitario DECIMAL(10,2),
    precio_unitario DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    igv DECIMAL(10,2),
    total_producto DECIMAL(10,2),
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    FOREIGN KEY (id_venta)REFERENCES ventas(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);