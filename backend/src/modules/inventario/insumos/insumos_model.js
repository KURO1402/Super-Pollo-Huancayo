const pool = require('../../../config/conexion_DB');

const insertarInsumoModel = async (nombreInsumo, stockIncial, unidadMedida) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await pool.query('CALL sp_insertar_insumo(?, ?, ?)', [nombreInsumo, stockIncial, unidadMedida]);
        return result[0][0];
        
    } catch (err) {
        throw new Error('Error al insertar insumo en la base de datos.');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarInsumosPorNombreModel = async (nombreInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await pool.query('CALL sp_contar_insumos_por_nombre(?)', [nombreInsumo]);
        return rows[0][0];
        
    } catch (err) {
        throw new Error('Error al contar insumos en la base de datos.');
    } finally {
        if (conexion) conexion.release();
    }
};

const recuperarInsumoModel  = async (idInsumo, unidadMedida, estadoInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await pool.query('CALL sp_recuperar_insumo(?, ?, ?)', [idInsumo, unidadMedida, estadoInsumo]);
        return result[0][0]?.mensaje;
        
    } catch (err) {
        console.log(err.message)
        throw new Error('Error al insertar insumo en la base de datos.');
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarDatosInsumoModel = async (idInsumo, nombreInsumo, unidadMedida) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await pool.query('CALL sp_actualizar_insumo_datos(?, ?, ?)', [idInsumo, nombreInsumo, unidadMedida]);
        return result[0][0]?.mensaje;

    } catch (err) {
        throw new Error('Error al actualizar datos del insumo en la base de datos.');
    } finally {
        if (conexion) conexion.release();
    }
};

const actualizarEstadoInsumoModel = async (idInsumo, estadoInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await pool.query('CALL sp_actualizar_estado_insumo(?, ?)', [idInsumo, estadoInsumo]);
        return result[0][0]?.mensaje;

    } catch (err) {
        throw new Error('Error al actualizar datos del insumo en la base de datos.');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarInsumosPorIdModel = async (idInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await pool.query('CALL sp_contar_insumo_por_id(?)', [idInsumo]);
        return rows[0][0]?.total;
        
    } catch (err) {
        throw new Error('Error al contar insumos en la base de datos.');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarInsumosPorNombre2Model = async (nombreInsumo, idInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await pool.query('CALL sp_contar_insumos_por_nombre_2(?, ?)', [nombreInsumo, idInsumo]);
        return rows[0][0]?.total;
        
    } catch (err) {
        throw new Error('Error al contar insumos en la base de datos.');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerInsumosModel = async () => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        
        const [rows] = await conexion.execute('CALL sp_obtener_insumos()');
        
        return rows[0];
    } catch (err) {
        console.log(err.message)
        throw new Error('Error al obtener los insumos de la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerInsumosPaginacionModel = async (limit, offset) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [rows] = await conexion.execute(
            'CALL sp_obtener_insumos_paginacion(?, ?)',
            [limit, offset]
        );

        return rows[0]; 
    } catch (err) {
        throw new Error('Error al obtener insumos con paginación');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerInsumoIDModel = async (id) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await pool.execute('CALL sp_obtener_insumo_por_id(?)', [id]);
        return rows[0][0]; 
    } catch (err) {
        console.log(err.message)
        throw new Error('Error al obtener al insumo de la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerInsumoNombreModel = async (nombre=null) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [rows] = await pool.execute('CALL sp_obtener_insumo_por_nombre(?)', [nombre]);
        return rows[0]; 
    } catch (err) {
        console.log(err.message)
        throw new Error('Error al obtener al insumo de la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerStockActualModel = async (idInsumo) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_optener_stock_actual_insumo(?)', [idInsumo]);

        return result[0][0]?.stock_insumo;
    } catch (err) {
        throw new Error('Error al obtener stock del insumo de la base de datos.');
    } finally {
        if (conexion) conexion.release();
    }
};

//Modelo para stock
const registrarMovimientoStockModel = async (idInsumo , cantidad, tipoMovimiento, detalleMovimiento, idUsuario) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        const [result] = await conexion.execute('CALL sp_registrar_movimiento_stock(?, ?, ?, ?, ?)',
            [idInsumo , cantidad, tipoMovimiento, detalleMovimiento, idUsuario]);

        return result[0][0];    
    
    } catch (err) {
        throw new Error('Error al obtener movimientos de stock de la base de datos.');
    } finally {
        if (conexion) conexion.release();
    }
};

const contarMovimientosStockFiltrosModel = async (
    fechaInicio = null,
    fechaFin = null,
    tipoMovimiento = null,
    idInsumo = null
) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            'CALL sp_contar_movimientos_stock_filtros(?, ?, ?, ?)',
            [fechaInicio, fechaFin, tipoMovimiento, idInsumo]
        );

        return result[0][0]?.total_registros ?? 0;

    } catch (err) {
        console.error(err.message);
        throw new Error('Error al contar movimientos de stock');
    } finally {
        if (conexion) conexion.release();
    }
};


const obtenerMovimientosStockFiltrosModel = async (fechaInicio = null,
    fechaFin = null,
    tipoMovimiento = null,
    idInsumo = null,
    limit,
    offset
) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        const [rows] = await conexion.execute(
            'CALL sp_obtener_movimientos_stock_filtros(?, ?, ?, ?, ?, ?)',
            [fechaInicio, fechaFin, tipoMovimiento, idInsumo, limit, offset]
        );

        return rows[0];

    } catch (err) {
        console.error(err.message);
        throw new Error('Error al obtener movimientos de stock');
    } finally {
        if (conexion) conexion.release();
    }
};



module.exports = {
    insertarInsumoModel,
    contarInsumosPorNombreModel,
    recuperarInsumoModel,
    actualizarDatosInsumoModel,
    actualizarEstadoInsumoModel,
    contarInsumosPorIdModel,
    contarInsumosPorNombre2Model,
    obtenerInsumosModel,
    obtenerInsumosPaginacionModel,
    obtenerInsumoIDModel,
    obtenerInsumoNombreModel,
    obtenerStockActualModel,
    registrarMovimientoStockModel,
    contarMovimientosStockFiltrosModel,
    obtenerMovimientosStockFiltrosModel
};