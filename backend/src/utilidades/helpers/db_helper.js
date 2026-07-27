const pool = require('../../config/conexion_DB');

const ejecutarSP = async (sp, params = [], mensajeError = null) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const placeholders = params.map(() => '?').join(', ');
        const [rows] = await conexion.execute(`CALL ${sp}(${placeholders})`, params);
        return rows;
    } catch (err) {
        console.log(err.message);
        const errorControlado = new Error(mensajeError || `Error al procesar la solicitud en la base de datos en ${sp}.`);
        errorControlado.detalle = err.message;
        throw errorControlado;
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = { ejecutarSP };