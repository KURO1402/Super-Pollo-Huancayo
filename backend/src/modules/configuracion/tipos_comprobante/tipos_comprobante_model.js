const pool = require('../../../config/conexion_DB');

const contarTipoComprobanteIdModel = async (idComprobante) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_tipo_comprobante_por_id(?)',[idComprobante]);

        return result[0][0]?.total;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al contar medios de pago en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerTipoComprobantePorIdModel = async (idComprobante) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            'CALL sp_obtener_tipo_comprobante_por_id(?)',
            [idComprobante]
        );

        return result[0][0];

    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener tipo de comprobante en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarCorrelativoComprobanteModel = async (idComprobante, nuevoCorrelativo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            'CALL sp_actualizar_correlativo_tipo_comprobante(?, ?)',
            [idComprobante, nuevoCorrelativo]
        );

        return result[0]; 
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al actualizar correlativo en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = {
    contarTipoComprobanteIdModel,
    obtenerTipoComprobantePorIdModel,
    actualizarCorrelativoComprobanteModel
}