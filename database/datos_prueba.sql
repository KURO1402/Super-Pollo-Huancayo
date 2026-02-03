USE super_pollo_hyo;

INSERT INTO usuarios (
    nombre_usuario,
    apellido_usuario,
    correo_usuario,
    clave_usuario,
    telefono_usuario,
    estado_usuario
) VALUES
('Juan', 'Perez', 'juan.perez@mail.com', '$2b$10$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '999111111', 1),
('Maria', 'Gomez', 'maria.gomez@mail.com', '$2b$10$bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', '999222222', 1),
('Carlos', 'Lopez', 'carlos.lopez@mail.com', '$2b$10$cccccccccccccccccccccccccccccccccccccccccccccccccccc', '999333333', 1),
('Ana', 'Torres', 'ana.torres@mail.com', '$2b$10$dddddddddddddddddddddddddddddddddddddddddddddddddddd', '999444444', 1),
('Luis', 'Ramirez', 'luis.ramirez@mail.com', '$2b$10$eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', '999555555', 1),
('Sofia', 'Diaz', 'sofia.diaz@mail.com', '$2b$10$ffffffffffffffffffffffffffffffffffffffffffffffffffff', '999666666', 1),
('Pedro', 'Castillo', 'pedro.castillo@mail.com', '$2b$10$gggggggggggggggggggggggggggggggggggggggggggggggggggg', '999777777', 1),
('Lucia', 'Vargas', 'lucia.vargas@mail.com', '$2b$10$hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh', '999888888', 1),
('Miguel', 'Rojas', 'miguel.rojas@mail.com', '$2b$10$iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', '999999999', 1),
('Valeria', 'Mendoza', 'valeria.mendoza@mail.com', '$2b$10$jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj', '988111222', 1);

INSERT INTO usuario_rol (
    id_rol,
    id_usuario,
    fecha_inicio,
    rol_activo
) VALUES
-- Usuarios normales
(1, 1, CURRENT_DATE, 1),
(1, 2, CURRENT_DATE, 1),
(1, 3, CURRENT_DATE, 1),
(1, 4, CURRENT_DATE, 1),

-- Colaboradores
(2, 5, CURRENT_DATE, 1),
(2, 6, CURRENT_DATE, 1),
(2, 7, CURRENT_DATE, 1),

-- Administradores
(3, 8, CURRENT_DATE, 1),
(3, 9, CURRENT_DATE, 1),
(3, 10, CURRENT_DATE, 1);

INSERT INTO caja (saldo_inicial, monto_actual, saldo_final, fecha_caja, estado_caja) VALUES
(500.00, 1200.00, 1200.00, '2025-12-01 08:00:00', 'cerrada'),
(800.00, 1500.00, 1500.00, '2025-12-10 08:15:00', 'cerrada'),
(1000.00, 1800.00, 1800.00, '2025-12-20 09:00:00', 'cerrada');

INSERT INTO eventos_caja (tipo_evento, fecha_evento, id_caja, id_usuario) VALUES
('apertura', '2025-12-01 08:00:00', 1, 1),
('cierre',   '2025-12-01 20:00:00', 1, 1),

('apertura', '2025-12-10 08:15:00', 2, 1),
('cierre',   '2025-12-10 21:00:00', 2, 1),

('apertura', '2025-12-20 09:00:00', 3, 1),
('cierre',   '2025-12-20 22:00:00', 3, 1);

INSERT INTO movimientos_caja
(tipo_movimiento, fecha_movimiento, monto_movimiento, descripcion_mov_caja, id_caja, id_usuario)
VALUES
('ingreso', '2025-12-01 10:30:00', 300.00, 'Venta del día', 1, 1),
('egreso',  '2025-12-01 15:00:00', 100.00, 'Compra de insumos', 1, 1),

('ingreso', '2025-12-10 12:00:00', 500.00, 'Pago de clientes', 2, 1),
('egreso',  '2025-12-10 18:30:00', 200.00, 'Pago de servicios', 2, 1),

('ingreso', '2025-12-20 14:00:00', 800.00, 'Ventas varias', 3, 1),
('egreso',  '2025-12-20 19:00:00', 300.00, 'Gastos operativos', 3, 1);

INSERT INTO arqueos_caja
(fecha_arqueo, monto_fisico, monto_tarjeta, monto_billetera_digital, otros, diferencia, estado_caja, id_caja, id_usuario)
VALUES
('2025-12-01 19:50:00', 700.00, 400.00, 100.00, 0.00, 0.00, 'cuadra', 1, 1),
('2025-12-10 20:45:00', 900.00, 500.00, 100.00, 0.00, 0.00, 'cuadra', 2, 1),
('2025-12-20 21:50:00', 1200.00, 500.00, 100.00, 0.00, 0.00, 'cuadra', 3, 1);

INSERT INTO categorias_producto (nombre_categoria) 
VALUES ('Pollos'), ('Bebidas'), ('Extras');

INSERT INTO insumos (nombre_insumo, stock_insumo, unidad_medida, estado_insumo) 
VALUES 
('Pollo entero marinado', 50.00, 'unidades', 1),
('Papa cortada amarilla', 120.00, 'kg', 1),
('Aceite vegetal', 40.00, 'litros', 1),
('Carbón vegetal', 100.00, 'kg', 1),
('Gaseosa 1.5L', 15.00, 'unidad', 1);

INSERT INTO productos (nombre_producto, descripcion_producto, precio_producto, usa_insumos, estado_producto, id_categoria) 
VALUES 
('1/4 de Pollo a la Brasa', 'Pollo jugoso y dorado, con papas y ensalada.', 14.00, 1, 1, 1),
('1 Pollo Entero', 'Pollo completo, ideal para disfrutar en familia.', 56.00, 1, 1, 1),
('Gaseosa 1.5L', 'Perfecta para grupos o familias.', 12.00, 0, 1, 2),
('Porción de Papa', 'Papas doradas y crocantes recién salidas de la cocina.', 7.00, 1, 1, 3),
('1/8 de Pollo a la Brasa', 'Porción pequeña con todo el sabor de la brasa.', 8.50, 0, 1, 1);

INSERT INTO cantidad_insumo_producto (id_producto, id_insumo, cantidad_uso) 
VALUES 
(1, 1, 0.25), -- 1/4 de pollo usa 0.25 unidades de un pollo entero
(1, 2, 0.40), -- 1/4 de pollo usa 400 gramos de papa (0.40 kg)
(2, 1, 1.00), -- 1 Pollo entero usa 1.00 unidad de insumo pollo
(3, 4, 1.00); -- Una gaseosa usa la misma gaseosa de insumos

-- Asumiendo id_usuario = 1 (el administrador o almacenero)
INSERT INTO movimientos_stock (cantidad_movimiento, tipo_movimiento, detalle_movimiento, id_insumo, id_usuario) 
VALUES 
(100.00, 'entrada', 'Compra semanal de pollo fresco', 1, 1),
(50.00, 'entrada', 'Ingreso de sacos de papa', 2, 1),
(2.50, 'salida', 'Papas en mal estado (merma)', 2, 1);

INSERT INTO imagenes_producto ( url_imagen, public_id, id_producto)
VALUES
('https://res.cloudinary.com/dwj05ueoe/image/upload/v1769788681/superpollo/sfccqvcr75y8kkvphqfv.png', 'superpollo/sfccqvcr75y8kkvphqfv', 1),
('https://res.cloudinary.com/dwj05ueoe/image/upload/v1769788697/superpollo/wue0rskkua5ufb1fzhdq.png', 'superpollo/wue0rskkua5ufb1fzhdq', 1),
('https://res.cloudinary.com/dwj05ueoe/image/upload/v1769788747/superpollo/nujo9qddgasqifkyrlun.png', 'superpollo/nujo9qddgasqifkyrlun', 2),
('https://res.cloudinary.com/dwj05ueoe/image/upload/v1769788819/superpollo/ow16qvlls6gvp0r3pgyy.png', 'superpollo/ow16qvlls6gvp0r3pgyy', 3),
('https://res.cloudinary.com/dwj05ueoe/image/upload/v1769788840/superpollo/mkxmajkqydglbbeqs9gu.png', 'superpollo/mkxmajkqydglbbeqs9gu', 4),
('https://res.cloudinary.com/dwj05ueoe/image/upload/v1769790283/superpollo/cjwczqui2lzwjpbbgexk.png', 'superpollo/cjwczqui2lzwjpbbgexk', 5);

-- Inserts para la tabla tipo_documento
INSERT INTO tipo_documento (nombre_tipo_documento, estado_documento) VALUES
('DNI', 1),
('RUC', 1);

-- Inserts para la tabla medio_pago
INSERT INTO medio_pago (nombre_medio_pago, estado_medio_pago) VALUES
('efectivo', 1),
('tarjeta', 1);

-- Inserts para la tabla tipo_comprobante
INSERT INTO tipo_comprobante (nombre_tipo_comprobante, serie, correlativo, estado_comprobante) VALUES
('boleta', 'B001', 0, 1),
('factura', 'F001', 0, 1);