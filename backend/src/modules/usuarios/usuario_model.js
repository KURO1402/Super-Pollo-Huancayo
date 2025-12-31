const pool = require('../../config/conexion_DB');

const obtenerUsuariosModel = async (limite, desplazamiento, idUsuario) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_listar_usuarios(?, ?, ?)', [limite, desplazamiento, idUsuario]);

        return result[0];
    } catch (err) {
        console.log(err.message)
        throw new Error('Ocurrio un error al listar usuarios en la base de datos'); 
    } finally {
        if(conexion) conexion.release();
    }
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

        const [result] = await conexion.execute(
            'CALL sp_obtener_usuario_por_id(?)',
            [idUsuario]
        );

        return result[0][0]; 
    } catch (err) {
        throw new Error('Ocurrió un error al obtener el usuario desde la base de datos');
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
        console.log(err.message);
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
            nombreUsuario,
            apellidoUsuario,
            telefonoUsuario
        } = datos;
        const [result] = await conexion.execute(
            'CALL sp_actualizar_datos_usuario(?, ?, ?, ?)',
            [
                idUsuario,
                nombreUsuario,
                apellidoUsuario,
                telefonoUsuario
            ]
        );

        return result[0][0]?.mensaje;
    } catch (err) {
        console.log(err.message);
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
        console.log(err.message);
        throw new Error("Error al eliminar el usaurio en la base de datos.");
    } finally {
        if (conexion) conexion.release
    }
};

module.exports = {
    obtenerUsuariosModel,
    contarUsuarioPorIdModel,
    obtenerUsuarioPorIdModel,
    obtenerClaveUsuarioPorIdModel,
    actualizarDatosUsuarioModel,
    actualizarCorreoUsuarioModel,
    actualizarClaveUsuarioModel,
    eliminarUsuarioModel
}