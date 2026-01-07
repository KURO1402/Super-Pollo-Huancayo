const pool = require('../../config/conexion_DB');

const crearCajaModel = async (montoInicial, usuarioId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.query('CALL sp_crear_caja_con_evento(?, ?)', [montoInicial, usuarioId]);
        return result[0][0]?.id_caja;
    } catch (err) {
        console.log(err.message)
        throw new Error('Error al crear la caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }      
};

const cerrarCajaModel = async (cajaId, usuarioId, montoFinal) => {
    let conexion;

    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.query('CALL sp_cerrar_caja_registrar_evento(?, ?, ?)', [cajaId, usuarioId, montoFinal]);
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
        const [rows] = await conexion.query('CALL sp_consultar_caja_abierta()');
        return rows[0][0]; 
    } catch (err) {
        throw new Error('Error al consultar la caja abierta en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
}

const registrarIngresoCajaModel = async (datos, usuarioId) => {
    let conexion;
    try {
        const { monto, descripcion } = datos;
        conexion = await pool.getConnection();
        const [rows] = await conexion.query('CALL sp_registrar_ingreso_caja(?, ?, ?)', [monto, descripcion, usuarioId]);
        return rows[0][0]?.mensaje;
    } catch (err) {
        throw new Error('Error al registrar el ingreso en caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const registrarEgresoCajaModel = async (datos, usuarioId) => {
    let conexion;
    try {
        const { monto, descripcion } = datos;
        conexion = await pool.getConnection();
        const [rows] = await conexion.query('CALL sp_registrar_egreso_caja(?, ?, ?)', [monto, descripcion, usuarioId]);
        return rows[0][0]?.mensaje;
    } catch (err) {
        throw new Error('Error al registrar el egreso en caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const registrarArqueoCajaModel = async (montos, diferencia, estadoArqueo, usuarioId) => {
    let conexion;
    try {
        const { montoFisico, montoTarjeta, montoBilleteraDigital, otros } = montos;
        conexion = await pool.getConnection();
        const [result] = await conexion.query('CALL sp_registrar_arqueo_caja(?, ?, ?, ?, ?, ?, ?)', [usuarioId, montoFisico, montoTarjeta, montoBilleteraDigital, otros, diferencia, estadoArqueo]);
        return result;
    } catch (err) {
        throw new Error('Error al registrar el arqueo de caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerCajasModel = async (limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query('CALL sp_obtener_cajas_cerradas(?, ?)', [limit, offset]);
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener las cajas cerradas en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerMovimientosCajaModel = async (limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query('CALL sp_obtener_ultimos_movimientos_caja(?, ?)', [limit, offset]);
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener los últimos movimientos de caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerMovimientosPorCajaModel = async (cajaId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query('CALL sp_obtener_movimientos_por_caja(?)', [cajaId]);
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener los movimientos de la caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerArqueosCaja = async (limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query('CALL sp_obtener_arqueos_caja(?,?)', [limit, offset]);
        return rows[0];
    } catch (err) {
        throw new Error('Error al obtener los arqueos de la caja en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerArqueosPorCajaModel = async (cajaId) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await conexion.query('CALL sp_obtener_arqueos_por_caja(?)', [cajaId]);
        return rows[0];
    } catch (err) {
        console.log(err.message)
        throw new Error('Error al obtener los arqueos de la caja en la base de datos');
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
    obtenerMovimientosPorCajaModel,
    obtenerMovimientosCajaModel,
    obtenerCajasModel,
    obtenerArqueosCaja,
    obtenerArqueosPorCajaModel
}