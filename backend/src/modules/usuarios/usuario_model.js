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
}


module.exports = {
    obtenerUsuariosModel
}