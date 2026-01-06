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

