const { ejecutarSP } = require('../../utilidades/helpers/db_helper');

const obtenerRolesUsuarioRepository = async () => {
    const rows = await ejecutarSP(
        'sp_listar_roles',
        [],
        'Error al obtener la lista de roles.'
    );
    return rows[0];
};

const contarUsuariosRepository = async (idUsuario, idRol = null, valor = null) => {
    const rows = await ejecutarSP(
        'sp_contar_usuarios',
        [idUsuario, idRol, valor],
        'Error al contar los usuarios.'
    );
    return rows[0][0]?.total_usuarios;
};

const obtenerUsuariosRepository = async (limite, desplazamiento, idUsuario, idRol = null, valor = null) => {
    const rows = await ejecutarSP(
        'sp_listar_usuarios',
        [limite, desplazamiento, idUsuario, idRol, valor],
        'Error al obtener la lista de usuarios.'
    );
    return rows[0];
};

const contarUsuarioPorIdRepository = async (idUsuario) => {
    const result = await ejecutarSP(
        'sp_contar_usuario_id',
        [idUsuario],
        'Error al verificar la existencia del usuario.'
    );
    return result[0][0]?.total_usuarios;
};

const obtenerUsuarioPorIdRepository = async (idUsuario) => {
    const rows = await ejecutarSP(
        'sp_obtener_usuario_por_id',
        [idUsuario],
        'Error al obtener los datos del usuario.'
    );
    return rows[0][0];
};

const obtenerHistorialRolesUsuarioRepository = async (idUsuario) => {
    const rows = await ejecutarSP(
        'sp_obtener_historial_roles_usuario',
        [idUsuario],
        'Error al obtener el historial de roles del usuario.'
    );
    return rows[0];
};

const obtenerClaveUsuarioPorIdRepository = async (idUsuario) => {
    const result = await ejecutarSP(
        'sp_obtener_clave_usuario_por_id',
        [idUsuario],
        'Error al verificar las credenciales del usuario.'
    );
    return result[0][0];
};

const actualizarDatosUsuarioRepository = async (datos, idUsuario) => {
    const { nombresUsuario, apellidosUsuario, telefonoUsuario } = datos;
    const result = await ejecutarSP(
        'sp_actualizar_datos_usuario',
        [idUsuario, nombresUsuario, apellidosUsuario, telefonoUsuario],
        'Error al actualizar los datos del usuario. No se realizaron cambios.'
    );
    return result[0][0]?.mensaje;
};

const actualizarCorreoUsuarioRepository = async (idUsuario, nuevoCorreo) => {
    const result = await ejecutarSP(
        'sp_actualizar_correo_usuario',
        [idUsuario, nuevoCorreo],
        'Error al actualizar el correo del usuario. No se realizaron cambios.'
    );
    return result[0][0]?.mensaje;
};

const actualizarClaveUsuarioRepository = async (idUsuario, clave) => {
    const result = await ejecutarSP(
        'sp_actualizar_clave_usuario',
        [idUsuario, clave],
        'Error al actualizar la clave del usuario. No se realizaron cambios.'
    );
    return result[0][0]?.mensaje;
};

const cambiarEstadoUsuarioRepository = async (idUsuario, estado) => {
    const result = await ejecutarSP(
        'sp_actualizar_estado_usuario',
        [idUsuario, estado],
        'Error al actualizar el estado del usuario. No se realizaron cambios.'
    );
    return result[0][0]?.mensaje;
};

const obtenerRolPorIdRepository = async (idRol) => {
    const result = await ejecutarSP(
        'sp_obtener_rol_por_id_rol',
        [idRol],
        'Error al obtener el rol especificado.'
    );
    return result[0][0];
};

const actualizarRolUsuarioRepository = async (idUsuario, idRolNuevo) => {
    const result = await ejecutarSP(
        'sp_actualizar_rol_usuario',
        [idUsuario, idRolNuevo],
        'Error al actualizar el rol del usuario. No se realizaron cambios.'
    );
    return result[0][0];
};

const obtenerUsuarioReactivarRepository = async (idUsuario) => {
    const rows = await ejecutarSP(
        'sp_obtener_usuario_id_reactivar',
        [idUsuario],
        'Error al verificar el usuario a reactivar.'
    );
    return rows[0][0];
}

module.exports = {
    obtenerRolesUsuarioRepository,
    contarUsuariosRepository,
    obtenerUsuariosRepository,
    contarUsuarioPorIdRepository,
    obtenerUsuarioPorIdRepository,
    obtenerHistorialRolesUsuarioRepository,
    obtenerClaveUsuarioPorIdRepository,
    actualizarDatosUsuarioRepository,
    actualizarCorreoUsuarioRepository,
    actualizarClaveUsuarioRepository,
    cambiarEstadoUsuarioRepository,
    obtenerRolPorIdRepository,
    actualizarRolUsuarioRepository,
    obtenerUsuarioReactivarRepository
};