const pool = require('../../config/conexion_DB');

const registroUsuarioModel = async (nombre, apellido, correo, clave, telefono) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_registrar_usuario(?, ?, ?, ?, ?)',
            [nombre, apellido, correo, clave, telefono]);
        
        const usuarioNuevo = result[0][0];

        return usuarioNuevo;

    } catch (err) {
        console.log('Error en registroUsuarioModel:', err.message);
        throw new Error('Ocurrio un error al insertar usuario en la base de datos')
    } finally {
        if (conexion) conexion.release();
    }
};

const seleccionarUsuarioPorCorreoModel = async (correo) => {
    let conexion;

    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            'CALL sp_seleccionar_usuario_correo(?)',
            [correo]
        );

        const total = result[0][0]?.total;

        return total;

    } catch (err) {
        console.error('Error en seleccionarUsuarioPorCorreoModel:', err.message);
        throw new Error('Ocurrió un error al consultar el correo en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = {
    registroUsuarioModel,
    seleccionarUsuarioPorCorreoModel
}