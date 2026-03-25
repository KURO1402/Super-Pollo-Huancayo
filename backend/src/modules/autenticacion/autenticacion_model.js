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
        throw new Error('Ocurrio un error al insertar usuario en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const seleccionarTotalUsuarioPorCorreoModel = async (correo) => {
    let conexion;

    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            'CALL sp_seleccionar_total_usuario_correo(?)',
            [correo]
        );

         return result[0][0]?.total;

    } catch (err) {
        console.error('Error en seleccionarUsuarioPorCorreoModel:', err.message);
        throw new Error('Ocurrió un error al consultar el correo en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const registrarVerificacionCorreoModel = async (correo, codigo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_registrar_codigo_verificacion(?, ?)', [correo, codigo]);

        return result;
    } catch (err) {
        throw new Error('Error al insertar codigo de verificacion en la base de datos');

    } finally {
        if (conexion) conexion.release();
    }
};


const validarCodigoCorreoModel = async (correo, codigo, fechaActual) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_verificar_codigo_correo(?, ?, ?)', [correo, codigo, fechaActual]);

        return  result[0][0];

    } catch (err) {
        throw new Error('Error al validar codigo de correo en la base de datos.');

    } finally {
        if(conexion) conexion.release();
    }
};

const validarVerificacionCorreo = async (correo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_verificar_validacion_correo(?)', [correo]);

        return rows[0]?.[0] || null;

    } catch (err) {
        throw Object.assign(new Error('Error al obtener el estado de verificación del correo'), { status: 500 });
    } finally {
        if (conexion) conexion.release();
    }
};

const seleccionarUsuarioCorreoModel = async (correoUsuario) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_seleccionar_usuario_correo(?)', [correoUsuario]);

        return result[0];
    } catch (err) {
        throw new Error('Error en la base de datos al buscar usuario');
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = {
    registroUsuarioModel,
    seleccionarTotalUsuarioPorCorreoModel,
    registrarVerificacionCorreoModel,
    validarCodigoCorreoModel,
    validarVerificacionCorreo,
    seleccionarUsuarioCorreoModel
}