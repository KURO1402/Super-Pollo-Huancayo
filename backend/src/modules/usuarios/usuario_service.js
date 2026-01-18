const bcrypt = require('bcryptjs');
const cache = require('../../config/node_cache');

const crearError = require('../../utilidades/crear_error');
const {
    obtenerRolesModel,
    contarUsuariosModel,
    obtenerUsuariosModel,
    contarUsuarioPorIdModel,
    actualizarDatosUsuarioModel,
    obtenerUsuarioPorIdModel,
    obtenerHistorialRolesUsuarioModel,
    obtenerClaveUsuarioPorIdModel,
    actualizarCorreoUsuarioModel,
    actualizarClaveUsuarioModel,
    eliminarUsuarioModel,
    obtenerRolPorIdModel,
    actualizarRolUsuarioModel
} = require('./usuario_model');
const { validarActualizarUsuario, validarActualizarCorreoUsuario } = require('./usuario_validacion');

const { seleccionarTotalUsuarioPorCorreoModel, validarVerificacionCorreo } = require('../autenticacion/autenticacion_model');

const obtenerRolesService = async () => {
    const roles = await obtenerRolesModel();
    if (roles.length === 0) {
        throw crearError('No se encontraron roles.', 404);
    }

    return {
        ok: true,
        roles
    };
};

const obtenerUsuariosService = async (limit, offset, idUsuario, idRol, valor) => {
    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    const valorBusqueda = valor?.trim() || null;

    const cacheKey = `usuarios:count:${idUsuario}:${idRol ?? 'null'}:${valorBusqueda ?? 'null'}`;


    const cachedTotal = cache.get(cacheKey);

    if (cachedTotal !== undefined) {
        console.log('Cache hit usuarios');

        const usuarios = await obtenerUsuariosModel(limite,desplazamiento,idUsuario,idRol, valorBusqueda);

        if (!usuarios || usuarios.length === 0) {
            throw crearError('No se encontraron usuarios', 404);
        }

        return {
            ok: true,
            cantidad_filas: cachedTotal,
            usuarios
        };
    }

    console.log('Cache miss usuarios');

    const totalUsuarios = await contarUsuariosModel(idUsuario, idRol, valorBusqueda);

    if (totalUsuarios === 0) {
        throw crearError('No se encontraron usuarios', 404);
    }
    cache.set(cacheKey, totalUsuarios);

    const usuarios = await obtenerUsuariosModel(limite, desplazamiento, idUsuario, idRol, valorBusqueda);

    return {
        ok: true,
        cantidad_filas: totalUsuarios,
        usuarios
    };
};


const obtenerUsuarioPorIdService = async (id) => {
    if (!id || isNaN(Number(id))) {
        throw crearError('Se requiere un ID de usuario válido.', 400);
    }

    const usuario = await obtenerUsuarioPorIdModel(Number(id));
    const historialRoles = await obtenerHistorialRolesUsuarioModel(Number(id));
    usuario.roles = historialRoles;

    if (!usuario) {
        crearError('El usuario no existe.', 404);
    }

    return {
        ok: true,
        usuario
    };
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

const eliminarUsuarioService = async (idUsuario) => {
    if (!idUsuario || isNaN(Number(idUsuario))) {
        throw crearError('Se necesita un ID de usuario válido.', 400)
    }

    const idUsuarioNumerico = Number(idUsuario);

    const usuario = await obtenerUsuarioPorIdModel(idUsuarioNumerico);

    if (!usuario) {
        throw crearError('El usuario especificado no existe', 404)
    }
    if(usuario.id_rol == 3 || usuario.nombre_rol == 'administrador') {
        throw crearError('No puedes eliminar a este usuario', 403);
    }

    const respuesta = await eliminarUsuarioModel(idUsuarioNumerico, 0);
    return {
        ok: true,
        mensaje: respuesta
    }
};

const actualizarRolUsuarioService = async (datos, idUsuario, idActual) => {

    if (!idUsuario || isNaN(Number(idUsuario))) {
        throw crearError("Se necesita un ID de usuario válido.", 400);
    }

    if (!datos || typeof datos !== "object") {
        throw crearError("Se necesitan datos para actualizar el rol.", 400);
    }

    const { nuevoRol } = datos;

    if (!nuevoRol || typeof nuevoRol !== "number") {
        throw crearError("Debe proporcionar un rol válido.", 400);
    }

    if (Number(idUsuario) === Number(idActual)) {
        throw crearError("Usted mismo no puede modificar su rol.", 403);
    }

    const usuario = await obtenerUsuarioPorIdModel(idUsuario);
    if (!usuario) {
        throw crearError("El usuario especificado no existe.", 404);
    }

    const rol = await obtenerRolPorIdModel(nuevoRol);
    if (!rol || rol.length === 0) {
        throw crearError("El rol especificado no existe.", 404);
    }

    if (usuario.id_rol === nuevoRol) {
        throw crearError("El usuario ya tiene asignado este rol.", 400);
    }

    if(usuario.id_rol == 3 || usuario.nombre_rol == 'administrador') {
        throw crearError('No puedes actualizar el rol de este usuario', 403);
    }

    const resultado = await actualizarRolUsuarioModel(idUsuario, nuevoRol);

    return {
        ok: true,
        mensaje: 'Rol actualizado correctamente',
        resultado
    };
};

module.exports = {
    obtenerRolesService,
    obtenerUsuariosService,
    obtenerUsuarioPorIdService,
    actualizarDatosUsuarioService,
    actualizarCorreoUsuarioService,
    actualizarClaveUsuarioService,
    eliminarUsuarioService,
    actualizarRolUsuarioService
}