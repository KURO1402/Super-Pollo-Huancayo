const { ejecutarSP } = require('../../utilidades/helpers/db_helper');

const registroUsuarioModel = async (nombre, apellido, correo, clave, telefono) => {
    const result = await ejecutarSP('sp_registrar_usuario', [nombre, apellido, correo, clave, telefono]);
    return result[0][0];
};

const seleccionarTotalUsuarioPorCorreoRepository = async (correo) => {
    const result = await ejecutarSP('sp_seleccionar_total_usuario_correo', [correo]);
    return result[0][0]?.total;
};

const registrarVerificacionCorreoRepository = async (correo, codigo, tipo) => {
    return await ejecutarSP('sp_registrar_codigo_verificacion', [correo, codigo, tipo]);
};

const validarCodigoCorreoRepository = async (correo, codigo, tipo, fechaActual) => {
    const result = await ejecutarSP('sp_verificar_codigo_correo', [correo, codigo, tipo, fechaActual]);
    return result[0][0];
};

const validarVerificacionRepository = async (correo, tipo) => {
    const rows = await ejecutarSP('sp_verificar_validacion_correo', [correo, tipo]);
    return rows[0]?.[0] || null;
};

const seleccionarUsuarioCorreoRepository = async (correoUsuario) => {
    const result = await ejecutarSP('sp_seleccionar_usuario_correo', [correoUsuario]);
    return result[0][0];
};

const eliminarVerificacionRepository = async (idVerificacion) => {
    await ejecutarSP('sp_eliminar_verificacion', [idVerificacion]);
    return true;
};

module.exports = {
    registroUsuarioModel,
    seleccionarTotalUsuarioPorCorreoRepository,
    registrarVerificacionCorreoRepository,
    validarCodigoCorreoRepository,
    validarVerificacionRepository,
    seleccionarUsuarioCorreoRepository,
    eliminarVerificacionRepository
};