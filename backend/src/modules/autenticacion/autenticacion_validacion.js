const crearError = require('../../utilidades/crear_error');
const { validarCorreo } = require('../../utilidades/validaciones');

const validarRegistroUsuario = (datos) => {

    if (!datos || typeof datos !== 'object') {
        throw crearError('No se recibieron los datos del usuario', 400);
    }

    const { nombreUsuario, apellidoUsuario, correoUsuario, claveUsuario, telefonoUsuario } = datos;

    if (!nombreUsuario || typeof nombreUsuario !== 'string' || !nombreUsuario.trim()) {
        throw crearError('El nombre del usuario es obligatorio', 400);
    }

    if (!apellidoUsuario || typeof apellidoUsuario !== 'string' || !apellidoUsuario.trim()) {
        throw crearError('El apellido del usuario es obligatorio', 400);
    }

    if (!correoUsuario || typeof correoUsuario !== 'string' || !correoUsuario.trim()) {
        throw crearError('El correo electrónico es obligatorio', 400);
    }

    if (!validarCorreo(correoUsuario)) {
        throw crearError('El formato del correo electrónico no es válido', 400);
    }

    if (!claveUsuario || typeof claveUsuario !== 'string' || !claveUsuario.trim()) {
        throw crearError('La contraseña es obligatoria', 400);
    }

    if (claveUsuario.length < 8) {
        throw crearError('La contraseña debe tener al menos 8 caracteres', 400);
    }

    if (telefonoUsuario) {

        if (typeof telefonoUsuario !== 'string' || !telefonoUsuario.trim()) {
            throw crearError('El teléfono debe ser un texto y debe ser valido', 400);
        }

        if (telefonoUsuario.trim().length < 6) {
            throw crearError('El teléfono debe tener al menos 6 dígitos', 400);
        }
    }
};

module.exports = {
    validarRegistroUsuario
}