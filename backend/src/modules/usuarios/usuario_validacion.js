const crear_error = require('../../utilidades/crear_error');

const validarActualizarUsuario = (datos, idUsuario) => {

    if (!datos || typeof datos !== 'object') {
        throw crear_error('Debe enviar los datos del usuario para poder actualizarlo', 400);
    }

    const {
        nombreUsuario,
        apellidoUsuario
    } = datos;

    if (!idUsuario || typeof idUsuario !== 'number') {
        throw crear_error('El ID del usuario es obligatorio y debe ser un valor numérico válido', 400);
    }

    if (!nombreUsuario || typeof nombreUsuario !== 'string' || !nombreUsuario.trim()) {
        throw crear_error('El nombre del usuario es obligatorio y no puede estar vacío', 400);
    }

    if (!apellidoUsuario || typeof apellidoUsuario !== 'string' || !apellidoUsuario.trim()) {
        throw crear_error('El apellido del usuario es obligatorio y no puede estar vacío', 400);
    }
};

module.exports = {
    validarActualizarUsuario
};
