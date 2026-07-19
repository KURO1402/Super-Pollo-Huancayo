const pool = require('../../config/conexion_DB');
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
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_usuario_id(?)', [idUsuario]);
        return result[0][0]?.total_usuarios;
        
    } catch (err) {
        throw new Error('Error al contar usuarios en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerUsuarioPorIdModel = async (idUsuario) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [rows] = await conexion.execute('CALL sp_obtener_usuario_por_id(?)',[idUsuario]);

        return rows[0][0]; 
    } catch (err) {
        throw new Error('Ocurrió un error al obtener el usuario desde la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerHistorialRolesUsuarioModel = async (idUsuario) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [rows] = await conexion.execute('CALL sp_obtener_historial_roles_usuario(?)',[idUsuario]);

        return rows[0]; 
    } catch (err) {
        throw new Error('Ocurrió un error al obtener historial de roles desde la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerClaveUsuarioPorIdModel = async (idUsuario) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            'CALL sp_obtener_clave_usuario_por_id(?)',
            [idUsuario]
        );

        return result[0][0];
    } catch (err) {
        throw new Error('Ocurrió un error al obtener la clave del usuario desde la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarDatosUsuarioModel = async (datos, idUsuario) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const {
            nombresUsuario,
            apellidosUsuario,
            telefonoUsuario
        } = datos;
        const [result] = await conexion.execute(
            'CALL sp_actualizar_datos_usuario(?, ?, ?, ?)',
            [
                idUsuario,
                nombresUsuario,
                apellidosUsuario,
                telefonoUsuario
            ]
        );

        return result[0][0]?.mensaje;
    } catch (err) {
        throw new Error('Error al actualizar datos de el usuario en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarCorreoUsuarioModel = async (idUsuario, nuevoCorreo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            'CALL sp_actualizar_correo_usuario(?, ?)',
            [idUsuario, nuevoCorreo]
        );

        return result[0][0]?.mensaje;
    } catch (err) {
        throw new Error('Error al actualizar el correo en la base de datos.');
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarClaveUsuarioModel = async (idUsuario, clave) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            'CALL sp_actualizar_clave_usuario(?, ?)',
            [idUsuario, clave]
        );

        return result[0][0]?.mensaje;
    } catch (err) {
        throw new Error('Error al actualizar la contraseña en la base de datos.');
    } finally {
        if (conexion) conexion.release();
    }
};

const eliminarUsuarioModel = async (idUsuario, estado) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute("CALL sp_actualizar_estado_usuario(?, ?)", [idUsuario, estado]);

        return result[0][0]?.mensaje;
        
    } catch (err) {
        throw new Error("Error al eliminar el usaurio en la base de datos.");
    } finally {
        if (conexion) conexion.release
    }
};

const obtenerRolPorIdModel = async (idRol) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_obtener_rol_por_id_rol(?)', [idRol]);

        return result[0][0];
    } catch (err) {
        throw new Error('Ocurrió un error al obtener el rol desde la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarRolUsuarioModel = async (idUsuario, idRolNuevo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute("CALL sp_actualizar_rol_usuario(?, ?)", [idUsuario, idRolNuevo]);

        return result[0][0];

    } catch (err) {
        throw new Error("Error al actualizar el rol del usuario en la base de datos.");
    } finally {
        if (conexion) conexion.release();
    }
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
}