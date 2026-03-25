const pool = require('../../../config/conexion_DB');

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
        throw new Error('Error al actualizar correlativo en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const insertarTipoComprobanteModel = async (nombreTipoComprobante, serie) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_insertar_tipo_comprobante(?, ?)', [nombreTipoComprobante, serie]);

        return result[0][0];
    } catch (err) {
        throw new Error('Error al insertar tipo de comprobante en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarTipoComprobantePorNombreSerieModel = async (nombre, serie) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_tipo_comprobante_por_nombre_serie(?, ?)', [nombre, serie]);

        return result[0][0]?.total;
    } catch (err) {
        throw new Error('Error al contar tipos de comprobante en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarTipoComprobanteModel = async (idTipoComprobante, nombreTipoComprobante, serie) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_actualizar_tipo_comprobante(?, ?, ?)', [idTipoComprobante, nombreTipoComprobante, serie]);

        return result[0][0];
    } catch (err) {
        throw new Error('Error al actualizar tipo de comprobante en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarTipoComprobantePorIdModel = async (idTipoComprobante) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_tipo_comprobante_por_id(?)', [idTipoComprobante]);

        return result[0][0]?.total;
    } catch (err) {
        throw new Error('Error al contar tipo de comprobante por ID en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarTipoComprobanteNombreSerieExcluyendoIdModel = async (nombreTipoComprobante, serie, idTipoComprobante) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_tipo_comprobante_nombre_serie_excluyendo_id(?, ?, ?)', [nombreTipoComprobante, serie, idTipoComprobante]);

        return result[0][0]?.total;
    } catch (err) {
        throw new Error('Error al contar tipo de comprobante por nombre y serie excluyendo ID en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const eliminarTipoComprobanteModel = async (idTipoComprobante) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_eliminar_tipo_comprobante(?)', [idTipoComprobante]);

        return result[0][0]?.mensaje;
    } catch (err) {
        throw new Error('Error al eliminar tipo de comprobante en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const listarTiposComprobanteModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_listar_tipos_comprobante()');

        return result[0];
    } catch (err) {
        throw new Error('Error al listar tipos de comprobante');
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = {
    obtenerTipoComprobantePorIdModel,
    actualizarCorrelativoComprobanteModel,
    insertarTipoComprobanteModel,
    contarTipoComprobantePorNombreSerieModel,
    actualizarTipoComprobanteModel,
    contarTipoComprobantePorIdModel,
    contarTipoComprobanteNombreSerieExcluyendoIdModel,
    eliminarTipoComprobanteModel,
    listarTiposComprobanteModel
};