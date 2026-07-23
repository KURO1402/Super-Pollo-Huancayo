const { ejecutarSP } = require('../../utilidades/helpers/db_helper');

const obtenerRolesUsuarioRepository = async () => {
    const rows = await ejecutarSP('sp_listar_roles');
    return rows[0];
};

const contarUsuariosRepository  = async (idUsuario, idRol = null, valor = null) => {
    const rows = await ejecutarSP('sp_contar_usuarios', [idUsuario, idRol, valor]);
    return rows[0][0]?.total_usuarios;
};

const obtenerUsuariosRepository = async (limite, desplazamiento, idUsuario, idRol = null, valor = null) => {
    const rows = await ejecutarSP('sp_listar_usuarios', [limite, desplazamiento, idUsuario, idRol, valor]);
    return rows[0];
};

const contarUsuarioPorIdRepository = async (idUsuario) => {
    const result = await ejecutarSP('sp_contar_usuario_id', [idUsuario]);
    return result[0][0]?.total_usuarios;
};

const obtenerUsuarioPorIdRepository = async (idUsuario) => {
    const rows = await ejecutarSP('sp_obtener_usuario_por_id', [idUsuario]);
    return rows[0][0];
};

const obtenerHistorialRolesUsuarioRepository = async (idUsuario) => {
    const rows = await ejecutarSP('sp_obtener_historial_roles_usuario', [idUsuario]);
    return rows[0];
};

const obtenerClaveUsuarioPorIdRepository = async (idUsuario) => {
    const result = await ejecutarSP('sp_obtener_clave_usuario_por_id', [idUsuario]);
    return result[0][0];
};

const actualizarDatosUsuarioRepository = async (datos, idUsuario) => {
    const { nombresUsuario, apellidosUsuario, telefonoUsuario } = datos;
    const result = await ejecutarSP('sp_actualizar_datos_usuario', [
        idUsuario,
        nombresUsuario,
        apellidosUsuario,
        telefonoUsuario
    ]);
    return result[0][0]?.mensaje;
};

const actualizarCorreoUsuarioRepository = async (idUsuario, nuevoCorreo) => {
    const result = await ejecutarSP('sp_actualizar_correo_usuario', [idUsuario, nuevoCorreo]);
    return result[0][0]?.mensaje;
};

const actualizarClaveUsuarioRepository = async (idUsuario, clave) => {
    const result = await ejecutarSP('sp_actualizar_clave_usuario', [idUsuario, clave]);
    return result[0][0]?.mensaje;
};

const cambiarEstadoUsuarioRepository = async (idUsuario, estado) => {
    const result = await ejecutarSP('sp_actualizar_estado_usuario', [idUsuario, estado]);
    return result[0][0]?.mensaje;
};

const obtenerRolPorIdRepository = async (idRol) => {
    const result = await ejecutarSP('sp_obtener_rol_por_id_rol', [idRol]);
    return result[0][0];
};

const actualizarRolUsuarioRepository = async (idUsuario, idRolNuevo) => {
    const result = await ejecutarSP('sp_actualizar_rol_usuario', [idUsuario, idRolNuevo]);
    return result[0][0];
};

const obtenerUsuarioReactivarRepository = async(idUsuario) => {
    const rows = await ejecutarSP('sp_obtener_usuario_id_reactivar', [idUsuario]);
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