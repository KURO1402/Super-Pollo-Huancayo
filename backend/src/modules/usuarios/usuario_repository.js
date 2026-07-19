const { ejecutarSP } = require('../../utilidades/helpers/db_helper');

const obtenerRolesUsuario = async () => {
    const rows = await ejecutarSP('sp_listar_roles');
    return rows[0];
};

const contarUsuarios = async (idUsuario, idRol = null, valor = null) => {
    const rows = await ejecutarSP('sp_contar_usuarios', [idUsuario, idRol, valor]);
    return rows[0][0]?.total_usuarios;
};

const obtenerUsuarios = async (limite, desplazamiento, idUsuario, idRol = null, valor = null) => {
    const rows = await ejecutarSP('sp_listar_usuarios', [limite, desplazamiento, idUsuario, idRol, valor]);
    return rows[0];
};

const contarUsuarioPorIdModel = async (idUsuario) => {
    const result = await ejecutarSP('sp_contar_usuario_id', [idUsuario]);
    return result[0][0]?.total_usuarios;
};

const obtenerUsuarioPorIdModel = async (idUsuario) => {
    const rows = await ejecutarSP('sp_obtener_usuario_por_id', [idUsuario]);
    return rows[0][0];
};

const obtenerHistorialRolesUsuarioModel = async (idUsuario) => {
    const rows = await ejecutarSP('sp_obtener_historial_roles_usuario', [idUsuario]);
    return rows[0];
};

const obtenerClaveUsuarioPorIdModel = async (idUsuario) => {
    const result = await ejecutarSP('sp_obtener_clave_usuario_por_id', [idUsuario]);
    return result[0][0];
};

const actualizarDatosUsuarioModel = async (datos, idUsuario) => {
    const { nombresUsuario, apellidosUsuario, telefonoUsuario } = datos;
    const result = await ejecutarSP('sp_actualizar_datos_usuario', [
        idUsuario,
        nombresUsuario,
        apellidosUsuario,
        telefonoUsuario
    ]);
    return result[0][0]?.mensaje;
};

const actualizarCorreoUsuarioModel = async (idUsuario, nuevoCorreo) => {
    const result = await ejecutarSP('sp_actualizar_correo_usuario', [idUsuario, nuevoCorreo]);
    return result[0][0]?.mensaje;
};

const actualizarClaveUsuarioModel = async (idUsuario, clave) => {
    const result = await ejecutarSP('sp_actualizar_clave_usuario', [idUsuario, clave]);
    return result[0][0]?.mensaje;
};

const eliminarUsuarioModel = async (idUsuario, estado) => {
    const result = await ejecutarSP('sp_actualizar_estado_usuario', [idUsuario, estado]);
    return result[0][0]?.mensaje;
};

const obtenerRolPorIdModel = async (idRol) => {
    const result = await ejecutarSP('sp_obtener_rol_por_id_rol', [idRol]);
    return result[0][0];
};

const actualizarRolUsuarioModel = async (idUsuario, idRolNuevo) => {
    const result = await ejecutarSP('sp_actualizar_rol_usuario', [idUsuario, idRolNuevo]);
    return result[0][0];
};

module.exports = {
    obtenerRolesUsuario,
    contarUsuarios,
    obtenerUsuarios,
    contarUsuarioPorIdModel,
    obtenerUsuarioPorIdModel,
    obtenerHistorialRolesUsuarioModel,
    obtenerClaveUsuarioPorIdModel,
    actualizarDatosUsuarioModel,
    actualizarCorreoUsuarioModel,
    actualizarClaveUsuarioModel,
    eliminarUsuarioModel,
    obtenerRolPorIdModel,
    actualizarRolUsuarioModel
};