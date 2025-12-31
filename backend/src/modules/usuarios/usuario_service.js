const bcrypt = require('bcryptjs');

const crearError = require('../../utilidades/crear_error');
const {
    obtenerUsuariosModel,
    contarUsuarioPorIdModel,
    actualizarDatosUsuarioModel,
    obtenerUsuarioPorIdModel,
    obtenerClaveUsuarioPorIdModel,
    actualizarCorreoUsuarioModel,
    actualizarClaveUsuarioModel
} = require('./usuario_model');
const { validarActualizarUsuario, validarActualizarCorreoUsuario } = require('./usuario_validacion');

const { seleccionarTotalUsuarioPorCorreoModel, validarVerificacionCorreo } = require('../autenticacion/autenticacion_model');

const obtenerUsuariosService = async (limit, offset, idUsuario) => {
    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    const usuarios = await obtenerUsuariosModel(limite, desplazamiento, idUsuario);

    if (!usuarios || usuarios.length === 0) {
        throw crearError('No se encontraron usuarios', 404);
    }

    return {
        ok: true,
        usuarios
    }
};

const actualizarDatosUsuarioService = async (datos, idUsuario) => {
    const idUsuarioNumerico = Number(idUsuario)
    validarActualizarUsuario(datos, idUsuarioNumerico);
    const { telefonoUsuario } = datos;
    if (!telefonoUsuario || typeof telefonoUsuario !== 'string' || !telefonoUsuario.trim()) {
        datos.telefonoUsuario = null;
    }

    const totalUsuarios = await contarUsuarioPorIdModel(idUsuarioNumerico);

    if (totalUsuarios === 0) {
        throw crearError('El usuario especificado no existe', 404);
    }
    const respuesta = await actualizarDatosUsuarioModel(datos, idUsuarioNumerico);
    return {
        ok: true,
        mensaje: respuesta
    }
};
const actualizarCorreoUsuarioService = async (datos, idUsuario) => {
    validarActualizarCorreoUsuario(datos, idUsuario)
    const { nuevoCorreo, clave } = datos
    const idUsuarioNumerico = Number(idUsuario);

    const usuarioClave = await obtenerClaveUsuarioPorIdModel(idUsuarioNumerico);
    if (!usuarioClave) {
        throw crearError('El usuario especificado no existe', 404);
    }

    const cantidadUsuariosCorreo = await seleccionarTotalUsuarioPorCorreoModel(nuevoCorreo);
    if (cantidadUsuariosCorreo > 0) {
        throw crearError('Ya existe un usuario registrado con el correo ingresado.', 409);
    }

    const contraseñaValida = await bcrypt.compare(clave, usuarioClave.clave_usuario);

    if (!contraseñaValida) {
        throw crearError('Clave incorrecta.', 401);
    }

    const correoValidado = await validarVerificacionCorreo(nuevoCorreo);
    if (!correoValidado || correoValidado.estado_verificacion == 0) {
        throw crearError('Verificación pendiente: Primero valide su correo.', 403);
    }

    const respuesta = await actualizarCorreoUsuarioModel(idUsuarioNumerico, nuevoCorreo);

    return {
        ok: true,
        mensaje: respuesta
    };
};

const actualizarClaveUsuarioService = async (datos, idUsuario) => {
    if (!idUsuario || isNaN(Number(idUsuario))) {
        throw crearError('Se necesita un ID de usuario válido.', 400);
    }

    const idUsuarioNumerico = Number(idUsuario);

    if (!datos || typeof datos !== 'object') {
        throw crearError('Se necesita la clave actual y la nueva clave.', 400)
    }

    const { clave, nuevaClave } = datos;

    if (!clave || typeof clave !== 'string' || !clave.trim()) {
        throw crearError('La clave actual es obligatoria.', 400);
    }

    if (!nuevaClave || typeof nuevaClave !== 'string' || !nuevaClave.trim()) {
        throw crearError('La nueva clave es obligatoria.', 400);
    }
    if (nuevaClave.length < 8) {
        throw crearError('La nueva clave debe tener al menos 8 caracteres.', 400);
    }

    const usuarioClave = await obtenerClaveUsuarioPorIdModel(idUsuarioNumerico);
    if (!usuarioClave) {
        throw crearError('El usuario especificado no existe.', 404)
    }

    const contraseñaValida = await bcrypt.compare(clave, usuarioClave.clave_usuario);
    if (!contraseñaValida) {
        throw crearError('Clave incorrecta.', 401);
    }

    const nuevaClaveEncriptada = await bcrypt.hash(nuevaClave, 10);

    const respuesta = await actualizarClaveUsuarioModel(idUsuarioNumerico, nuevaClaveEncriptada);

    return {
        ok: true,
        mensaje: respuesta
    };
};

module.exports = {
    obtenerUsuariosService,
    actualizarDatosUsuarioService,
    actualizarCorreoUsuarioService,
    actualizarClaveUsuarioService
}