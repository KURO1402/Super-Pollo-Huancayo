SET FOREIGN_KEY_CHECKS = 0;
USE super_pollo_hyo;


-- Hijas
DROP TABLE IF EXISTS cantidad_insumo_producto;
DROP TABLE IF EXISTS movimientos_stock;
DROP TABLE IF EXISTS arqueos_caja;
DROP TABLE IF EXISTS movimientos_caja;
DROP TABLE IF EXISTS eventos_caja;
DROP TABLE IF EXISTS usuario_rol;
DROP TABLE IF EXISTS imagenes_producto;
DROP TABLE IF EXISTS bloqueos_temporales_mesa;
DROP TABLE IF EXISTS mesas_reservacion;
DROP TABLE IF EXISTS mesas_pedido;
DROP TABLE IF EXISTS detalle_pedido;
DROP TABLE IF EXISTS detalle_ventas;
DROP TABLE IF EXISTS comprobantes;
DROP TABLE IF EXISTS pago_reservacion;
DROP TABLE IF EXISTS pedido_mesa;

-- Intermedias
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS insumos;
DROP TABLE IF EXISTS caja;
DROP TABLE IF EXISTS reservaciones;
DROP TABLE IF EXISTS ventas;

-- Base
DROP TABLE IF EXISTS categorias_producto;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS rol_usuario;
DROP TABLE IF EXISTS verificacion_correos;
DROP TABLE IF EXISTS tipo_documento;
DROP TABLE IF EXISTS medio_pago;
DROP TABLE IF EXISTS tipo_comprobante;
DROP TABLE IF EXISTS mesas;

-- =========================
-- CREACIÓN
-- =========================

CREATE TABLE verificacion_correos(
    id_verificacion INT PRIMARY KEY AUTO_INCREMENT,
    correo_verificacion VARCHAR(100) NOT NULL,
    codigo_verificacion CHAR(6) NOT NULL,
    expiracion_verificacion DATETIME NOT NULL,
    estado_verificacion TINYINT(1) NOT NULL DEFAULT 0,
    registro_verificacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rol_usuario (
    id_rol INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL
);

CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(100) NOT NULL,
    apellido_usuario VARCHAR(100) NOT NULL,
    correo_usuario VARCHAR(100) NOT NULL,
    clave_usuario CHAR(60) NOT NULL,
    telefono_usuario VARCHAR(15),
    estado_usuario TINYINT(1) DEFAULT 1
);

CREATE TABLE usuario_rol (
    id_rol INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_inicio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_fin DATE DEFAULT NULL,
    rol_activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_rol) REFERENCES rol_usuario(id_rol),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE caja (
    id_caja INT AUTO_INCREMENT PRIMARY KEY,
    saldo_inicial DECIMAL(10,2) NOT NULL,
    monto_actual DECIMAL(10,2) NOT NULL,
    saldo_final DECIMAL(10,2) DEFAULT NULL,
    fecha_caja DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    hora_cierre TIME DEFAULT NULL,
    estado_caja ENUM('abierta', 'cerrada') NOT NULL
);

CREATE TABLE eventos_caja (
    id_evento_caja INT AUTO_INCREMENT PRIMARY KEY,
    tipo_evento ENUM('apertura', 'cierre') NOT NULL,
    fecha_evento DATETIME NOT NULL,
    id_caja INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_caja) REFERENCES caja(id_caja),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE arqueos_caja (
    id_arqueo INT AUTO_INCREMENT PRIMARY KEY,
    fecha_arqueo DATETIME NOT NULL,
    monto_fisico DECIMAL(6,2) NOT NULL,
    monto_tarjeta DECIMAL(6,2) NOT NULL,
    monto_billetera_digital DECIMAL(10,2) NOT NULL,
    otros DECIMAL(6,2) DEFAULT 0.00,
    diferencia DECIMAL(6,2) NOT NULL,
    estado_caja ENUM('cuadra', 'sobra', 'falta') NOT NULL,
    descripcion_arqueo TEXT,
    id_caja INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_caja) REFERENCES caja(id_caja),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE insumos (
    id_insumo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_insumo VARCHAR(100) NOT NULL,
    stock_insumo DECIMAL(5,2) NOT NULL,
    unidad_medida VARCHAR(30) NOT NULL,
    estado_insumo TINYINT(1) DEFAULT 1
);

CREATE TABLE movimientos_stock (
    id_movimiento_stock INT AUTO_INCREMENT PRIMARY KEY,
    cantidad_movimiento DECIMAL(5,2) NOT NULL,
    tipo_movimiento ENUM('entrada','salida') NOT NULL,
    fecha_movimiento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    detalle_movimiento TEXT,
    id_insumo INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_insumo) REFERENCES insumos(id_insumo),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE categorias_producto (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL
);

CREATE TABLE productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion_producto TEXT NOT NULL,
    precio_producto DECIMAL(5,2) NOT NULL,
    usa_insumos TINYINT(1) NOT NULL,
    estado_producto TINYINT(1) DEFAULT 1,
    id_categoria INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categorias_producto(id_categoria)
);

CREATE TABLE imagenes_producto (
    id_imagen_producto INT AUTO_INCREMENT PRIMARY KEY,
    url_imagen VARCHAR(300),
    public_id VARCHAR(100),
    id_producto INT,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE cantidad_insumo_producto (
    id_producto INT,
    id_insumo INT,
    cantidad_uso DECIMAL(5,2) NOT NULL,
    PRIMARY KEY (id_producto, id_insumo),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_insumo) REFERENCES insumos(id_insumo)
);

CREATE TABLE tipo_documento (
    id_tipo_documento INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo_documento VARCHAR(50) NOT NULL,
    estado_documento TINYINT(1) DEFAULT 1
);

CREATE TABLE medio_pago (
    id_medio_pago INT AUTO_INCREMENT PRIMARY KEY,
    nombre_medio_pago VARCHAR(50) NOT NULL,
    estado_medio_pago TINYINT(1) DEFAULT 1
);

CREATE TABLE tipo_comprobante (
    id_tipo_comprobante INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo_comprobante VARCHAR(50) NOT NULL,
    serie VARCHAR(5) NOT NULL,
    correlativo INT DEFAULT 0,
    estado_comprobante TINYINT(1) DEFAULT 1
);

CREATE TABLE mesas (
    id_mesa INT AUTO_INCREMENT PRIMARY KEY,
    numero_mesa INT NOT NULL,
    capacidad INT NOT NULL,
    estado_local ENUM('disponible','ocupado') DEFAULT 'disponible'
);

CREATE TABLE bloqueos_temporales_mesa (
    id_bloqueo INT AUTO_INCREMENT PRIMARY KEY,
    id_mesa INT NOT NULL,
    id_usuario INT NOT NULL,
    bloqueado_desde DATETIME NOT NULL,
    bloqueado_hasta DATETIME NOT NULL,
    expira_en DATETIME NOT NULL,
    FOREIGN KEY (id_mesa) REFERENCES mesas(id_mesa),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE reservaciones (
    id_reservacion INT AUTO_INCREMENT PRIMARY KEY,
    fecha_reservacion DATE NOT NULL,
    hora_reservacion TIME NOT NULL,
    cantidad_personas INT NOT NULL,
    estado_reservacion ENUM('pendiente','cancelado','completado') DEFAULT 'pendiente',
    codigo_reservacion CHAR(6),
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE mesas_reservacion (
    id_mesa INT,
    id_reservacion INT,
    reserva_desde DATETIME,
    reserva_hasta DATETIME,
    PRIMARY KEY (id_mesa, id_reservacion),
    FOREIGN KEY (id_mesa) REFERENCES mesas(id_mesa),
    FOREIGN KEY (id_reservacion) REFERENCES reservaciones(id_reservacion)
);

CREATE TABLE pago_reservacion (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    monto_pagado DECIMAL(5,2) NOT NULL,
    id_transaccion VARCHAR(100) NOT NULL,
    fecha_pago DATETIME NOT NULL,
    estado_pago ENUM('pendiente','confirmado','fallido') NOT NULL,
    id_reservacion INT NOT NULL,
    FOREIGN KEY (id_reservacion) REFERENCES reservaciones(id_reservacion)
);

CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    numero_documento_cliente VARCHAR(12) NOT NULL,
    id_tipo_documento INT NOT NULL,
    porcentaje_igv DECIMAL(5,2),
    total_gravada DECIMAL(10,2),
    total_igv DECIMAL(10,2),
    total_venta DECIMAL(10,2),
    id_medio_pago INT,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_tipo_documento) REFERENCES tipo_documento(id_tipo_documento),
    FOREIGN KEY (id_medio_pago) REFERENCES medio_pago(id_medio_pago)
);

CREATE TABLE movimientos_caja (
    id_movimiento_caja INT AUTO_INCREMENT PRIMARY KEY,
    tipo_movimiento ENUM('ingreso','egreso') NOT NULL,
    fecha_movimiento DATETIME NOT NULL,
    monto_movimiento DECIMAL(6,2) NOT NULL,
    descripcion_mov_caja TEXT NOT NULL,
    id_caja INT NOT NULL,
    id_usuario INT NOT NULL,
    id_venta INT,
    FOREIGN KEY (id_caja) REFERENCES caja(id_caja),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta)
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
    estado_sunat ENUM('pendiente', 'enviado_sunat', 'aceptado', 'rechazado', 'interno') NOT NULL DEFAULT 'pendiente',
    url_comprobante_pdf VARCHAR(150),
    public_id_pdf VARCHAR(150) NULL,
    url_comprobante_xml VARCHAR(150),
    public_id_xml VARCHAR(150) NULL,
    url_cdr VARCHAR(150) NULL,
    public_id_cdr VARCHAR(150) NULL,
    hash_comprobante VARCHAR(100) NULL,
    fecha_envio DATETIME NULL,
    fecha_ultimo_reintento DATETIME NULL,
    intentos_reenvio INT DEFAULT 0,
    fecha_limite_correccion DATETIME NULL,
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_tipo_comprobante) REFERENCES tipo_comprobante(id_tipo_comprobante) ON DELETE CASCADE
);

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
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto) ON DELETE CASCADE
);

CREATE TABLE pedido_mesa (
    id_pedido INT AUTO_INCREMENT PRIMARY KEY,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_pedido ENUM('pendiente','completado') DEFAULT 'pendiente',
    precio_precuenta DECIMAL(6,2)
);

CREATE TABLE detalle_pedido (
    id_detalle_pedido INT AUTO_INCREMENT PRIMARY KEY,
    cantidad_pedido INT,
    id_producto INT,
    id_pedido INT,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_pedido) REFERENCES pedido_mesa(id_pedido)
);

CREATE TABLE mesas_pedido (
    id_mesa INT,
    id_pedido INT,
    PRIMARY KEY (id_mesa, id_pedido),
    FOREIGN KEY (id_mesa) REFERENCES mesas(id_mesa),
    FOREIGN KEY (id_pedido) REFERENCES pedido_mesa(id_pedido)
);

SET FOREIGN_KEY_CHECKS = 1;