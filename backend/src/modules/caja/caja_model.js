const pool = require('../../config/conexion_DB');

const crearCajaModel = async (montoInicial, usuarioId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_crear_caja_con_evento(?, ?)', [montoInicial, usuarioId]);
        return result[0][0];
    } catch (err) {
        throw new Error('Error al crear la caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const cerrarCajaModel = async (cajaId, usuarioId, montoFinal) => {
    let conexion;

    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_cerrar_caja_registrar_evento(?, ?, ?)', [cajaId, usuarioId, montoFinal]);
        return result[0][0]?.mensaje;
    } catch (err) {
        throw new Error('Error al cerrar la caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const consultarCajaAbiertaModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_consultar_caja_abierta()');
        return rows[0][0];
    } catch (err) {
        throw new Error('Error al consultar la caja abierta en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
}

const registrarIngresoCajaModel = async (monto, descripcion, usuarioId, ventaId=null) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_registrar_ingreso_caja(?, ?, ?, ?)', [monto, descripcion, usuarioId, ventaId]);
        return rows[0][0];
    } catch (err) {
        throw new Error('Error al registrar el ingreso en caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const registrarEgresoCajaModel = async (monto, descripcion, usuarioId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_registrar_egreso_caja(?, ?, ?)', [monto, descripcion, usuarioId]);
        return rows[0][0];
    } catch (err) {
        throw new Error('Error al registrar el egreso en caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const registrarArqueoCajaModel = async (montos, diferencia, estadoArqueo, idUsuario, idCaja, descripcionArqueo = null) => {
    let conexion;
    try {

        const { montoFisico, montoTarjeta, montoBilleteraDigital, montoOtros } = montos;

        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_registrar_arqueo_caja(?, ?, ?, ?, ?, ?, ?, ?, ?)', [idUsuario, idCaja, montoFisico, montoTarjeta, montoBilleteraDigital, montoOtros, diferencia, estadoArqueo, descripcionArqueo]);

        return result[0][0]?.mensaje;

    } catch (err) {
        throw new Error('Error al registrar el arqueo de caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarCajasModel = async (fechaInicio = null, fechaFin = null) => {
    let conexion;
    try {

        conexion = await pool.getConnection();

        const [rows] = await conexion.execute('CALL sp_contar_cajas(?, ?)', [fechaInicio, fechaFin]);

        return rows[0][0]?.total_registros;
    } catch (err) {
        throw new Error('Error al contar cajas de la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerCajasModel = async (limit, offset, fechaInicio = null, fechaFin = null) => {
    let conexion;
    try {

        conexion = await pool.getConnection();

        const [rows] = await conexion.execute('CALL sp_listar_cajas(?, ?, ?, ?)', [limit, offset, fechaInicio, fechaFin]);

        return rows[0];
    } catch (err) {
        throw new Error('Error al listar cajas de la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerMovimientosPorCajaModel = async (cajaId, tipoMovimiento = null, limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_obtener_movimientos_por_caja(?, ?, ?, ?)', [cajaId, tipoMovimiento, limit, offset]);
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener los movimientos de la caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarMovimientosPorCajaModel = async (cajaId, tipoMovimiento = null) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_contar_movimientos_por_caja(?, ?)', [cajaId, tipoMovimiento]);
        return rows[0][0]?.total_registros;
    } catch (err) {
        throw new Error('Error al contar los movimientos de la caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerArqueosPorCajaModel = async (cajaId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_obtener_arqueos_por_caja(?)', [cajaId]);
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener los arqueos de la caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerCajaActualModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.execute('CALL sp_obtener_caja_actual()');
        return rows[0][0] || null;
    } catch (err) {
        throw new Error('Error al obtener la caja actual en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};


module.exports = {
    crearCajaModel,
    cerrarCajaModel,
    consultarCajaAbiertaModel,
    registrarIngresoCajaModel,
    registrarEgresoCajaModel,
    registrarArqueoCajaModel,
    contarCajasModel,
    obtenerCajasModel,
    obtenerMovimientosPorCajaModel,
    contarMovimientosPorCajaModel,
    obtenerArqueosPorCajaModel,
    obtenerCajaActualModel
}