USE super_pollo_hyo;

-- USUARIOS
INSERT INTO usuarios (nombre_usuario, apellido_usuario, correo_usuario, clave_usuario, telefono_usuario, estado_usuario) VALUES
('Juan',    'Perez',   'juan.perez@mail.com',     '$2b$10$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', '999111111', 1),
('Maria',   'Gomez',   'maria.gomez@mail.com',    '$2b$10$bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', '999222222', 1),
('Carlos',  'Lopez',   'carlos.lopez@mail.com',   '$2b$10$cccccccccccccccccccccccccccccccccccccccccccccccccccc', '999333333', 1),
('Ana',     'Torres',  'ana.torres@mail.com',     '$2b$10$dddddddddddddddddddddddddddddddddddddddddddddddddddd', '999444444', 1),
('Luis',    'Ramirez', 'luis.ramirez@mail.com',   '$2b$10$eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', '999555555', 1),
('Sofia',   'Diaz',    'sofia.diaz@mail.com',     '$2b$10$ffffffffffffffffffffffffffffffffffffffffffffffffffff', '999666666', 1),
('Pedro',   'Castillo','pedro.castillo@mail.com', '$2b$10$gggggggggggggggggggggggggggggggggggggggggggggggggggg', '999777777', 1),
('Lucia',   'Vargas',  'lucia.vargas@mail.com',   '$2b$10$hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh', '999888888', 1),
('Miguel',  'Rojas',   'miguel.rojas@mail.com',   '$2b$10$iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii', '999999999', 1),
('Valeria', 'Mendoza', 'valeria.mendoza@mail.com','$2b$10$jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj', '988111222', 1);

-- USUARIO_ROL
INSERT INTO usuario_rol (id_rol, id_usuario, fecha_inicio, rol_activo) VALUES
(1, 1, CURRENT_DATE, 1),
(1, 2, CURRENT_DATE, 1),
(1, 3, CURRENT_DATE, 1),
(1, 4, CURRENT_DATE, 1),
(2, 5, CURRENT_DATE, 1),
(2, 6, CURRENT_DATE, 1),
(2, 7, CURRENT_DATE, 1),
(3, 8, CURRENT_DATE, 1),
(3, 9, CURRENT_DATE, 1),
(3, 10, CURRENT_DATE, 1);

-- CAJA
INSERT INTO caja (saldo_inicial, monto_actual, saldo_final, fecha_caja, hora_cierre, estado_caja) VALUES
( 500.00, 1200.00, 1200.00, '2026-01-05', '22:00:00', 'cerrada'),
( 800.00, 1500.00, 1500.00, '2026-01-15', '22:00:00', 'cerrada'),
(1000.00, 1800.00, 1800.00, '2026-01-25', '22:00:00', 'cerrada');

-- EVENTOS_CAJA
INSERT INTO eventos_caja (tipo_evento, fecha_evento, id_caja, id_usuario) VALUES
('apertura', '2026-01-05 08:00:00', 1, 8),
('cierre',   '2026-01-05 22:00:00', 1, 8),
('apertura', '2026-01-15 08:15:00', 2, 9),
('cierre',   '2026-01-15 22:00:00', 2, 9),
('apertura', '2026-01-25 09:00:00', 3, 10),
('cierre',   '2026-01-25 22:00:00', 3, 10);

-- MOVIMIENTOS_CAJA
INSERT INTO movimientos_caja (tipo_movimiento, fecha_movimiento, monto_movimiento, descripcion_mov_caja, id_caja, id_usuario) VALUES
('ingreso', '2026-01-05 10:30:00', 300.00, 'Venta del día',      1, 8),
('egreso',  '2026-01-05 15:00:00', 100.00, 'Compra de insumos',  1, 8),
('ingreso', '2026-01-15 12:00:00', 500.00, 'Pago de clientes',   2, 9),
('egreso',  '2026-01-15 18:30:00', 200.00, 'Pago de servicios',  2, 9),
('ingreso', '2026-01-25 14:00:00', 800.00, 'Ventas varias',      3, 10),
('egreso',  '2026-01-25 19:00:00', 300.00, 'Gastos operativos',  3, 10);

-- ARQUEOS_CAJA
INSERT INTO arqueos_caja (fecha_arqueo, monto_fisico, monto_tarjeta, monto_billetera_digital, otros, diferencia, estado_caja, id_caja, id_usuario) VALUES
('2026-01-05 21:50:00',  700.00, 400.00, 100.00, 0.00, 0.00, 'cuadra', 1, 8),
('2026-01-15 21:50:00',  900.00, 500.00, 100.00, 0.00, 0.00, 'cuadra', 2, 9),
('2026-01-25 21:50:00', 1200.00, 500.00, 100.00, 0.00, 0.00, 'cuadra', 3, 10);

-- CATEGORIAS_PRODUCTO
INSERT INTO categorias_producto (nombre_categoria) VALUES
('Pollos'), ('Bebidas'), ('Extras');

-- INSUMOS
INSERT INTO insumos (nombre_insumo, stock_insumo, unidad_medida, estado_insumo) VALUES
('Pollo entero marinado',  50.00, 'unidades', 1),
('Papa cortada amarilla', 120.00, 'kg',       1),
('Aceite vegetal',         40.00, 'litros',   1),
('Carbón vegetal',        100.00, 'kg',       1),
('Gaseosa 1.5L',           15.00, 'unidad',   1);

-- PRODUCTOS
INSERT INTO productos (nombre_producto, descripcion_producto, precio_producto, usa_insumos, estado_producto, id_categoria) VALUES
('1/4 de Pollo a la Brasa', 'Pollo jugoso y dorado, con papas y ensalada.',           14.00, 1, 1, 1),
('1 Pollo Entero',           'Pollo completo, ideal para disfrutar en familia.',       56.00, 1, 1, 1),
('Gaseosa 1.5L',             'Perfecta para grupos o familias.',                      12.00, 1, 1, 2),
('Porción de Papa',          'Papas doradas y crocantes recién salidas de la cocina.', 7.00, 1, 1, 3),
('1/8 de Pollo a la Brasa',  'Porción pequeña con todo el sabor de la brasa.',         8.50, 0, 1, 1);

-- CANTIDAD_INSUMO_PRODUCTO
INSERT INTO cantidad_insumo_producto (id_producto, id_insumo, cantidad_uso) VALUES
(1, 1, 0.25),
(1, 2, 0.40),
(2, 1, 1.00),
(3, 5, 1.00);
(4, 3, 0.10);

-- MOVIMIENTOS_STOCK
INSERT INTO movimientos_stock (cantidad_movimiento, tipo_movimiento, detalle_movimiento, id_insumo, id_usuario) VALUES
(100.00, 'entrada', 'Compra semanal de pollo fresco',    1, 8),
( 50.00, 'entrada', 'Ingreso de sacos de papa',          2, 8),
(  2.50, 'salida',  'Papas en mal estado (merma)',       2, 8),
( 20.00, 'entrada', 'Reposición de aceite vegetal',      3, 9),
( 30.00, 'entrada', 'Compra de carbón mensual',          4, 9),
( 24.00, 'entrada', 'Compra de gaseosas para la semana', 5, 10),
(  3.00, 'salida',  'Consumo de gaseosas del día',       5, 10),
(  6.25, 'salida',  'Uso de pollo en servicio del día',  1, 8),
( 10.00, 'salida',  'Papa usada en servicio del día',    2, 8);

-- IMAGENES_PRODUCTO
INSERT INTO imagenes_producto (url_imagen, public_id, id_producto) VALUES
('https://res.cloudinary.com/dwj05ueoe/image/upload/v1769788681/superpollo/sfccqvcr75y8kkvphqfv.png', 'superpollo/sfccqvcr75y8kkvphqfv', 1),
('https://res.cloudinary.com/dwj05ueoe/image/upload/v1769788697/superpollo/wue0rskkua5ufb1fzhdq.png', 'superpollo/wue0rskkua5ufb1fzhdq', 1),
('https://res.cloudinary.com/dwj05ueoe/image/upload/v1769788747/superpollo/nujo9qddgasqifkyrlun.png', 'superpollo/nujo9qddgasqifkyrlun', 2),
('https://res.cloudinary.com/dwj05ueoe/image/upload/v1769788819/superpollo/ow16qvlls6gvp0r3pgyy.png', 'superpollo/ow16qvlls6gvp0r3pgyy', 3),
('https://res.cloudinary.com/dwj05ueoe/image/upload/v1769788840/superpollo/mkxmajkqydglbbeqs9gu.png', 'superpollo/mkxmajkqydglbbeqs9gu', 4),
('https://res.cloudinary.com/dwj05ueoe/image/upload/v1769790283/superpollo/cjwczqui2lzwjpbbgexk.png', 'superpollo/cjwczqui2lzwjpbbgexk', 5);

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
(6,4),(7,4),(8,4),(9,4),(10,4);

-- BLOQUEOS_TEMPORALES_MESA
INSERT INTO bloqueos_temporales_mesa (id_mesa, id_usuario, bloqueado_desde, bloqueado_hasta, expira_en) VALUES
(1, 5, '2026-01-10 12:00:00', '2026-01-10 12:05:00', '2026-01-10 12:05:00'),
(3, 6, '2026-01-18 19:30:00', '2026-01-18 19:35:00', '2026-01-18 19:35:00'),
(5, 7, '2026-01-22 13:00:00', '2026-01-22 13:05:00', '2026-01-22 13:05:00');

-- RESERVACIONES
INSERT INTO reservaciones (fecha_reservacion, hora_reservacion, cantidad_personas, estado_reservacion, codigo_reservacion, fecha_creacion, id_usuario) VALUES
('2026-01-05', '13:00:00', 4, 'completado', 'RES001', '2026-01-04 10:00:00', 1),
('2026-01-10', '20:00:00', 2, 'completado', 'RES002', '2026-01-09 09:30:00', 2),
('2026-01-15', '12:30:00', 6, 'completado', 'RES003', '2026-01-14 11:00:00', 3),
('2026-01-22', '19:00:00', 4, 'cancelado',  'RES004', '2026-01-21 08:45:00', 4),
('2026-02-05', '13:30:00', 3, 'pendiente',  'RES005', '2026-02-04 14:00:00', 1),
('2026-02-10', '20:30:00', 5, 'pendiente',  'RES006', '2026-02-09 16:20:00', 2),
('2026-02-15', '12:00:00', 2, 'pendiente',  'RES007', '2026-02-14 10:10:00', 3);

-- MESAS_RESERVACION
INSERT INTO mesas_reservacion (id_mesa, id_reservacion, reserva_desde, reserva_hasta) VALUES
(2, 1, '2026-01-05 13:00:00', '2026-01-05 15:00:00'),
(4, 2, '2026-01-10 20:00:00', '2026-01-10 22:00:00'),
(1, 3, '2026-01-15 12:30:00', '2026-01-15 14:30:00'),
(3, 3, '2026-01-15 12:30:00', '2026-01-15 14:30:00'),
(6, 4, '2026-01-22 19:00:00', '2026-01-22 21:00:00'),
(7, 5, '2026-02-05 13:30:00', '2026-02-05 15:30:00'),
(8, 6, '2026-02-10 20:30:00', '2026-02-10 22:30:00'),
(5, 7, '2026-02-15 12:00:00', '2026-02-15 14:00:00');

-- PAGO_RESERVACION
INSERT INTO pago_reservacion (monto_pagado, id_transaccion, fecha_pago, estado_pago, id_reservacion) VALUES
(28.00, 'TXN-001-2026', '2026-01-04 10:05:00', 'confirmado', 1),
(14.00, 'TXN-002-2026', '2026-01-09 09:35:00', 'confirmado', 2),
(42.00, 'TXN-003-2026', '2026-01-14 11:10:00', 'confirmado', 3),
(28.00, 'TXN-004-2026', '2026-01-21 08:50:00', 'fallido',    4),
(21.00, 'TXN-005-2026', '2026-02-04 14:05:00', 'confirmado', 5),
(35.00, 'TXN-006-2026', '2026-02-09 16:25:00', 'pendiente',  6),
(14.00, 'TXN-007-2026', '2026-02-14 10:15:00', 'pendiente',  7);

-- VENTAS
INSERT INTO ventas (numero_documento_cliente, id_tipo_documento, porcentaje_igv, total_gravada, total_igv, total_venta, id_medio_pago, fecha_registro) VALUES
('12345678',    1, 18.00,  33.90,  6.10,  40.00, 1, '2026-01-05 12:00:00'),
('87654321',    1, 18.00,  47.46,  8.54,  56.00, 2, '2026-01-05 14:30:00'),
('20512345678', 2, 18.00,  84.75, 15.25, 100.00, 2, '2026-01-15 13:00:00'),
('11223344',    1, 18.00,  20.34,  3.66,  24.00, 1, '2026-01-15 19:00:00'),
('44332211',    1, 18.00,  55.93, 10.07,  66.00, 1, '2026-01-25 12:30:00'),
('55667788',    1, 18.00,  38.14,  6.86,  45.00, 2, '2026-01-25 20:00:00'),
('99887766',    1, 18.00,  30.51,  5.49,  36.00, 1, '2026-02-05 13:00:00'),
('33445566',    1, 18.00,  16.95,  3.05,  20.00, 1, '2026-02-10 11:30:00');

-- COMPROBANTES
-- Nota: se eliminó la columna inexistente 'aceptado_por_sunat' y se usa 'estado_sunat'
--       con los valores del ENUM: 'pendiente', 'enviado', 'rechazado'
INSERT INTO comprobantes (id_venta, id_tipo_comprobante, serie, numero_correlativo, fecha_emision, fecha_vencimiento, sunat_transaccion, estado_sunat, url_comprobante_pdf, url_comprobante_xml, fecha_envio) VALUES
(1, 1, 'B001', 1, '2026-01-05', '2026-02-05', 1, 'enviado',    'https://storage.sunat.pe/pdf/B001-1.pdf', 'https://storage.sunat.pe/xml/B001-1.xml', '2026-01-05 12:05:00'),
(2, 1, 'B001', 2, '2026-01-05', '2026-02-05', 1, 'enviado',    'https://storage.sunat.pe/pdf/B001-2.pdf', 'https://storage.sunat.pe/xml/B001-2.xml', '2026-01-05 14:35:00'),
(3, 2, 'F001', 1, '2026-01-15', '2026-02-15', 1, 'enviado',    'https://storage.sunat.pe/pdf/F001-1.pdf', 'https://storage.sunat.pe/xml/F001-1.xml', '2026-01-15 13:05:00'),
(4, 1, 'B001', 3, '2026-01-15', '2026-02-15', 1, 'enviado',    'https://storage.sunat.pe/pdf/B001-3.pdf', 'https://storage.sunat.pe/xml/B001-3.xml', '2026-01-15 19:05:00'),
(5, 1, 'B001', 4, '2026-01-25', '2026-02-25', 1, 'enviado',    'https://storage.sunat.pe/pdf/B001-4.pdf', 'https://storage.sunat.pe/xml/B001-4.xml', '2026-01-25 12:35:00'),
(6, 1, 'B001', 5, '2026-01-25', '2026-02-25', 1, 'rechazado',  'https://storage.sunat.pe/pdf/B001-5.pdf', 'https://storage.sunat.pe/xml/B001-5.xml', '2026-01-25 20:05:00'),
(7, 1, 'B001', 6, '2026-02-05', '2026-03-05', 1, 'enviado',    'https://storage.sunat.pe/pdf/B001-6.pdf', 'https://storage.sunat.pe/xml/B001-6.xml', '2026-02-05 13:05:00'),
(8, 1, 'B001', 7, '2026-02-10', '2026-03-10', 1, 'enviado',    'https://storage.sunat.pe/pdf/B001-7.pdf', 'https://storage.sunat.pe/xml/B001-7.xml', '2026-02-10 11:35:00');

-- DETALLE_VENTAS
INSERT INTO detalle_ventas (cantidad_producto, valor_unitario, precio_unitario, subtotal, igv, total_producto, id_venta, id_producto) VALUES
-- Venta 1: 2x 1/4 pollo + 1x gaseosa
(2, 11.86, 14.00, 23.73, 4.27, 28.00, 1, 1),
(1, 10.17, 12.00, 10.17, 1.83, 12.00, 1, 3),
-- Venta 2: 1x pollo entero
(1, 47.46, 56.00, 47.46, 8.54, 56.00, 2, 2),
-- Venta 3: 1x pollo entero + 2x gaseosa + 1x porción de papa
(1, 47.46, 56.00, 47.46, 8.54, 56.00, 3, 2),
(2, 10.17, 12.00, 20.34, 3.66, 24.00, 3, 3),
(1,  5.93,  7.00,  5.93, 1.07,  7.00, 3, 4),
-- Venta 4: 2x 1/8 pollo + 1x gaseosa
(2,  7.20,  8.50, 14.41, 2.59, 17.00, 4, 5),
(1, 10.17, 12.00,  5.93, 1.07,  7.00, 4, 3),
-- Venta 5: 1x pollo entero + 1x 1/4 pollo
(1, 47.46, 56.00, 47.46, 8.54, 56.00, 5, 2),
(1, 11.86, 14.00,  8.47, 1.53, 10.00, 5, 1),
-- Venta 6: 3x 1/4 pollo + 1x porción papa
(3, 11.86, 14.00, 35.59, 6.41, 42.00, 6, 1),
(1,  5.93,  7.00,  2.54, 0.46,  3.00, 6, 4),
-- Venta 7: 2x 1/4 pollo + 1x gaseosa
(2, 11.86, 14.00, 23.73, 4.27, 28.00, 7, 1),
(1, 10.17, 12.00, 10.17, 1.83, 12.00, 7, 3),
-- Venta 8: 1x 1/8 pollo + 1x porción papa + 1x gaseosa
(1,  7.20,  8.50,  7.20, 1.30,  8.50, 8, 5),
(1,  5.93,  7.00,  5.93, 1.07,  7.00, 8, 4),
(1,  3.81,  4.50,  3.81, 0.69,  4.50, 8, 3);

-- PEDIDO_MESA
INSERT INTO pedido_mesa (fecha_pedido, estado_pedido, fecha_actualizacion_estado, precio_precuenta) VALUES
('2026-01-05 12:05:00', 'completado', '2026-01-05 13:10:00', 40.00),
('2026-01-05 14:35:00', 'completado', '2026-01-05 15:50:00', 56.00),
('2026-01-15 13:05:00', 'completado', '2026-01-15 14:20:00', 87.00),
('2026-01-15 19:05:00', 'completado', '2026-01-15 20:35:00', 24.00),
('2026-01-25 12:35:00', 'completado', '2026-01-25 13:45:00', 66.00),
('2026-01-25 20:05:00', 'completado', '2026-01-25 21:30:00', 45.00),
('2026-02-05 13:05:00', 'completado', '2026-02-05 14:15:00', 36.00),
('2026-02-10 11:30:00', 'completado', '2026-02-10 12:55:00', 20.00);

-- DETALLE_PEDIDO
INSERT INTO detalle_pedido (cantidad_pedido, id_producto, id_pedido) VALUES
(2, 1, 1),
(1, 3, 1),
(1, 2, 2),
(1, 2, 3),
(2, 3, 3),
(1, 4, 3),
(2, 5, 4),
(1, 3, 4),
(1, 2, 5),
(1, 1, 5),
(3, 1, 6),
(1, 4, 6),
(2, 1, 7),
(1, 3, 7),
(1, 5, 8),
(1, 4, 8),
(1, 3, 8);

-- MESAS_PEDIDO
INSERT INTO mesas_pedido (id_mesa, id_pedido) VALUES
(2, 1),
(4, 2),
(1, 3),
(3, 3),
(3, 4),
(5, 5),
(7, 6),
(2, 7),
(6, 8);