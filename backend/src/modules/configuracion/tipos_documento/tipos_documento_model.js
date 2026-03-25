const pool = require('../../../config/conexion_DB');

const insertarTipoDocumentoModel = async (nombreTipoDocumento) => {

    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_insertar_tipo_documento(?)',[nombreTipoDocumento]);

        return result[0][0];
    } catch (err) {
        throw new Error('Error al insertar tipo de documento en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarTipoDocumentoPorNombreModel = async (nombre) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_tipo_documento_por_nombre(?)',[nombre]);

        return result[0][0]?.total;
    } catch (err) {
        throw new Error('Error al contar tipos de documento en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarTipoDocumentoModel = async (idTipoDocumento, nombreTipoDocumento) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_actualizar_tipo_documento(?, ?)',[idTipoDocumento, nombreTipoDocumento]);

        return result[0][0];
    } catch (err) {
        throw new Error('Error al actualizar tipo de documento en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarTipoDocumentoPorIdModel = async (idTipoDocumento) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_tipo_documento_por_id(?)',[idTipoDocumento]);

        return result[0][0]?.total;
    } catch (err) {
        throw new Error('Error al contar tipo de documento por ID en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarTipoDocumentoNombreExcluyendoIdModel = async (nombreTipoDocumento, idTipoDocumento) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_tipo_documento_nombre_excluyendo_id(?, ?)',[nombreTipoDocumento, idTipoDocumento]
        );

        return result[0][0]?.total;
    } catch (err) {
        throw new Error('Error al contar tipo de documento por nombre excluyendo ID en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const eliminarTipoDocumentoModel = async (idTipoDoc) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_eliminar_tipo_documento(?)',[idTipoDoc]);

        return result[0][0]?.mensaje;
    } catch (err) {
        throw new Error('Error al eliminar tipo de documento en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const listarTiposDocumentoModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_listar_tipos_documento()');

        return result[0];
    } catch (err) {
        throw new Error('Error al listar tipos de documento');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerTipoDocumentoPorIdModel = async (idTipoDocumento) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_obtener_tipo_documento_por_id(?)',[idTipoDocumento]);

        return result[0][0];
    } catch (err) {
        throw new Error('Error al obtener el tipo de documento por id');
    } finally {
        if (conexion) conexion.release();
    }
};


module.exports = {
    insertarTipoDocumentoModel,
    contarTipoDocumentoPorNombreModel,
    actualizarTipoDocumentoModel,
    contarTipoDocumentoPorIdModel,
    contarTipoDocumentoNombreExcluyendoIdModel,
    eliminarTipoDocumentoModel,
    listarTiposDocumentoModel,
    obtenerTipoDocumentoPorIdModel
}