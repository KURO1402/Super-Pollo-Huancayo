const pool = require('../../config/conexion_DB');

const ejecutarSP = async (sp, params = []) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const placeholders = params.map(() => '?').join(', ');
        const [rows] = await conexion.execute(`CALL ${sp}(${placeholders})`, params);
        return rows;
    } catch (err) {
        throw new Error(`Error al procesar la solicitud en la base de datos en ${sp}.`);
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = { ejecutarSP };