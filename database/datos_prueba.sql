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
