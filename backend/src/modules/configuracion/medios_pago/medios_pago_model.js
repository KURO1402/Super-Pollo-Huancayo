const pool = require('../../../config/conexion_DB');

const insertarMedioPagoModel = async (nombreMedioPago) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_insertar_medio_pago(?)',[nombreMedioPago]);

        return result[0][0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al insertar medio de pago en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarMedioPagoPorNombreModel = async (nombre) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_medio_pago_por_nombre(?)',[nombre]);

        return result[0][0]?.total;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al contar medios de pago en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarMedioPagoModel = async (idMedioPago, nombreMedioPago) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_actualizar_medio_pago(?, ?)',[idMedioPago, nombreMedioPago]);

        return result[0][0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al actualizar medio de pago en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarMedioPagoPorIdModel = async (idMedioPago) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_medio_pago_por_id(?)',[idMedioPago]);

        return result[0][0]?.total;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al contar medio de pago por ID en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarMedioPagoNombreExcluyendoIdModel = async (nombreMedioPago, idMedioPago) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_contar_medio_pago_nombre_excluyendo_id(?, ?)',[nombreMedioPago, idMedioPago]);

        return result[0][0]?.total;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al contar medio de pago por nombre excluyendo ID en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const eliminarMedioPagoModel = async (idMedioPago) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_eliminar_medio_pago(?)',[idMedioPago]);

        return result[0][0]?.mensaje;
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al eliminar medio de pago en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const listarMediosPagoModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_listar_medios_pago()');

        return result[0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al listar medios de pago');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerMedioPagoPorIdModel = async (idMedioPago) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_obtener_medio_pago_por_id(?)',[idMedioPago]);

        return result[0][0];
    } catch (err) {
        console.log(err.message);
        throw new Error('Error al obtener el medio de pago por id');
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = {
    insertarMedioPagoModel,
    contarMedioPagoPorNombreModel,
    actualizarMedioPagoModel,
    contarMedioPagoPorIdModel,
    contarMedioPagoNombreExcluyendoIdModel,
    eliminarMedioPagoModel,
    listarMediosPagoModel,
    obtenerMedioPagoPorIdModel
};
