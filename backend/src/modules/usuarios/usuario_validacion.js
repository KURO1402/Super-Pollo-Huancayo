const crearError = require('../../utilidades/crear_error');
const { validarCorreo } =  require('../../utilidades/validaciones');

const validarActualizarUsuario = (datos, idUsuario) => {

    if (!datos || typeof datos !== 'object') {
        throw crearError('Debe enviar los datos del usuario para poder actualizarlo', 400);
    }

    const {
        nombresUsuario,
        apellidosUsuario
    } = datos;

    if (!idUsuario || typeof idUsuario !== 'number') {
        throw crearError('El ID del usuario es obligatorio y debe ser un valor numérico válido', 400);
    }

    if (!nombresUsuario || typeof nombresUsuario !== 'string' || !nombresUsuario.trim()) {
        throw crearError('El nombre del usuario es obligatorio y no puede estar vacío', 400);
    }

    if (!apellidosUsuario || typeof apellidosUsuario !== 'string' || !apellidosUsuario.trim()) {
        throw crearError('El apellido del usuario es obligatorio y no puede estar vacío', 400);
    }
};

const validarActualizarCorreoUsuario = (datos, idUsuario) => {
    if (!idUsuario || isNaN(Number(idUsuario))) {
        throw crearError('Se necesita un ID de usuario válido.', 400)
    }

    if (!datos || typeof datos !== "object") {
        throw crearError('Se necesita el nuevo correo y clave para actualizar el correo', 400);
    }

    const { nuevoCorreo, clave } = datos;

    if (!nuevoCorreo || typeof nuevoCorreo !== "string" || !nuevoCorreo.trim()) {
        throw crearError('El nuevo correo es obligatorio para actualizar el correo.', 400);
    }

    if (!clave || typeof clave !== "string" || !clave.trim()) {
        throw crearError('La clave es obligatoria para actualizar el correo.')
    }

    if (!validarCorreo(nuevoCorreo)) {
        throw crearError('El formato del correo electrónico no es válido', 400);
    }
};

module.exports = {
    validarActualizarUsuario,
    validarActualizarCorreoUsuario
};
