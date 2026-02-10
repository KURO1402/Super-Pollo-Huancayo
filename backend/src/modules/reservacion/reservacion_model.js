const pool = require('../../config/conexion_DB');

const ocuparMesasModel = async (mesas, minutosOcupada, fechaActual) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        await conexion.beginTransaction();

        if (Array.isArray(mesas)) {
            for (const mesa of mesas) {
                await conexion.execute('CALL sp_ocupar_mesa(?, ?, ?)', [mesa.numeroMesa, minutosOcupada, fechaActual]
                );
            }
        }

        await conexion.commit();

        return 'Mesas ocupadas exitosamente';

    } catch (err) {
        if (conexion) await conexion.rollback();
        console.error("Error en el modelo:", err.message);
        throw new Error('Error al procesar el grupo de mesas. No se realizaron cambios.');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerEstadoMesaModel = async (numeroMesa) => {
    let conexion;

    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_obtener_estado_mesa(?)',[numeroMesa]);

        return result[0][0]?.estado_mesa;


    } catch (error) {
        throw new Error('Error al obtener el estado de la mesa');
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = {
    ocuparMesasModel,
    obtenerEstadoMesaModel
}