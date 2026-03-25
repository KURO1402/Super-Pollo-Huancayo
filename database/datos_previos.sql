USE super_pollo_hyo;

INSERT INTO rol_usuario(nombre_rol) VALUES ('usuario'), ('colaborador'), ('administrador');


-- TIPO_DOCUMENTO
INSERT INTO tipo_documento (nombre_tipo_documento, estado_documento) VALUES
('DNI', 1),
('RUC', 1);

-- MEDIO_PAGO
INSERT INTO medio_pago (nombre_medio_pago, estado_medio_pago) VALUES
('efectivo', 1),
('tarjeta',  1);

-- TIPO_COMPROBANTE
INSERT INTO tipo_comprobante (nombre_tipo_comprobante, serie, correlativo, estado_comprobante) VALUES
('boleta',        'B001', 0, 1),
('factura',       'F001', 0, 1),
('nota de venta', 'NV',   0, 1);

-- MESAS
INSERT INTO mesas (numero_mesa, capacidad) VALUES
(1,4),(2,4),(3,4),(4,4),(5,4),
(6,4),(7,4),(8,4),(9,4),(10,4),
(11,8), (12,8), (13,4), (14, 8), (15, 8), (16, 4), (17,8);