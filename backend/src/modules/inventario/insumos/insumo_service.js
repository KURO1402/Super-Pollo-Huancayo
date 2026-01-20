const cache = require('../../../config/node_cache');
const {
    insertarInsumoModel,
    contarInsumosPorNombreModel,
    recuperarInsumoModel,
    actualizarDatosInsumoModel,
    actualizarEstadoInsumoModel,
    contarInsumosPorIdModel,
    contarInsumosPorNombre2Model,
    obtenerInsumosModel,
    contarInsumosModel,
    obtenerInsumoIDModel,
    obtenerStockActualModel,
    registrarMovimientoStockModel,
    contarMovimientosStockFiltrosModel,
    obtenerMovimientosStockFiltrosModel
} = require('./insumos_model');

const {
    validarDatosInsumo,
    validarDatosMovimiento
} = require('./insumo_validacion');
const crearError = require('../../../utilidades/crear_error');
const limpiarCachePorPrefijo = require('../../../utilidades/limpiar_cache');

const insertarInsumoService = async (datos, idUsuario) => {
    validarDatosInsumo(datos);

    const { nombreInsumo, cantidadInicial, unidadMedida } = datos;
    let insumo;

    const coincidenciasNombre = await contarInsumosPorNombreModel(nombreInsumo);

    if (coincidenciasNombre.total_activos > 0) {
        throw crearError('Ya existe un insumo registrado con ese nombre.', 409);
    } else if (coincidenciasNombre.total_inactivos > 0) {
        insumo = await recuperarInsumoModel(coincidenciasNombre.id_insumo_inactivo, unidadMedida, 1, cantidadInicial, idUsuario);
    } else {
        insumo = await insertarInsumoModel(nombreInsumo, cantidadInicial, unidadMedida, idUsuario);
    }

    limpiarCachePorPrefijo('movimientos_stock:')
    limpiarCachePorPrefijo('insumos:');

    return {
        ok: true,
        mensaje: 'Insumo registrado exitosamente',
        insumo
    }
};

const actualizarDatosInsumoService = async (idInsumo, datos) => {

    if (!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos del insumo', 400);
    }

    const { nombreInsumo, unidadMedida } = datos;

    if (!nombreInsumo || typeof nombreInsumo !== 'string' || !nombreInsumo.trim()) {
        throw crearError('Se necesita el nombre del insumo.', 400);
    }

    if (!unidadMedida || typeof unidadMedida !== 'string' || !unidadMedida.trim()) {
        throw crearError('Se necesita la unidad de medida del insumo.', 400);
    }

    const totalInsumos = await contarInsumosPorIdModel(idInsumo);
    if (totalInsumos === 0) {
        throw crearError('Insumo no existente.', 404);
    }
    const coincidenciasNombre = await contarInsumosPorNombre2Model(nombreInsumo, idInsumo);
    if (coincidenciasNombre > 0) {
        throw crearError('Ya existe un insumo registrado con ese nombre.', 409);
    }

    const insumo = await actualizarDatosInsumoModel(idInsumo, nombreInsumo, unidadMedida);

    limpiarCachePorPrefijo('insumos:');

    return {
        ok: true,
        mensaje: 'Datos de insumo actualizado correctamente',
        insumo
    }
};

const eliminarInsumoService = async (idInsumo) => {
    const insumo = await obtenerInsumoIDModel(idInsumo);

    if (!insumo || insumo.length === 0) {
        throw crearError('Insumo no existente.', 404);
    }

    if (insumo.stock_insumo > 0) {
        throw crearError('El insumo debe estar sin stock para ser eliminado.', 409);
    }

    await actualizarEstadoInsumoModel(idInsumo, 0);

    limpiarCachePorPrefijo('insumos:');

    return {
        ok: true,
        mensaje: 'Insumo eliminado correctamente'
    };
};

const obtenerInsumosService = async (limit, offset, nombreInsumo, nivelStock) => {
    if (nivelStock !== undefined && (nivelStock !== 'critico' && nivelStock !== 'bajo' && nivelStock !== 'normal')) {
        throw crearError(`El nivel de stock solo puede ser 'critico', 'bajo' o 'normal'`, 400);
    }

    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    const cacheKey = `insumo:count:${nombreInsumo || null}:${nivelStock || null}`;

    const cachedTotal = cache.get(cacheKey);

    if (cachedTotal !== undefined) {
        console.log('Cache hit');
        const insumos = await obtenerInsumosModel(limite, desplazamiento, nombreInsumo, nivelStock);

        if (!insumos || insumos.length === 0) {
            throw crearError('No se encontraron insumos', 404)
        }
        
        return {
            ok: true,
            cantidad_filas: cachedTotal,
            insumos
        };
    }

    console.log('Cache miss');

    const totalRegistros = await contarInsumosModel(nombreInsumo, nivelStock);

    cache.set(cacheKey, totalRegistros);

    const insumos = await obtenerInsumosModel(limite, desplazamiento, nombreInsumo, nivelStock);
    if (!insumos || insumos.length === 0) {
        throw crearError('No se encontraron insumos', 404)
    }

    return {
        ok: true,
        cantidad_filas: totalRegistros,
        insumos
    };
};

const obtenerInsumoIDService = async (idInsumo) => {

    const insumo = await obtenerInsumoIDModel(idInsumo);

    if (!insumo) {
        throw crearError('Insumo no encontrado.', 404);
    }

    return {
        ok: true,
        insumo
    };
};

//Servicios para movimientos de stock
const registrarEntradaStockService = async (datos, idUsuario) => {
    validarDatosMovimiento(datos);
    const { idInsumo, cantidadMovimiento, detalleMovimiento } = datos;

    const totalInsumos = await contarInsumosPorIdModel(idInsumo);
    if (totalInsumos === 0) {
        throw crearError('Insumo no existente.', 404);
    }

    const detalle = detalleMovimiento || null;

    const respuesta = await registrarMovimientoStockModel(idInsumo, cantidadMovimiento, 'entrada', detalle, idUsuario);
    limpiarCachePorPrefijo('movimientos_stock:');
    limpiarCachePorPrefijo('insumos:');
    return {
        ok: true,
        mensaje: 'Entrada registrada correctamente',
        movimiento: respuesta
    }
};

const registrarSalidaStockService = async (datos, idUsuario) => {
    validarDatosMovimiento(datos);
    const { idInsumo, cantidadMovimiento, detalleMovimiento } = datos;

    const totalInsumos = await contarInsumosPorIdModel(idInsumo);
    if (totalInsumos === 0) {
        throw crearError('Insumo no existente.', 404);
    }

    const stockActual = await obtenerStockActualModel(idInsumo);

    if (cantidadMovimiento > stockActual) {
        throw crearError('Stock insuficiente para realizar el descuento del insumo', 409)
    }

    const detalle = detalleMovimiento || null;

    const respuesta = await registrarMovimientoStockModel(idInsumo, cantidadMovimiento, 'salida', detalle, idUsuario);
    limpiarCachePorPrefijo('movimientos_stock:');
    limpiarCachePorPrefijo('insumos:');
    return {
        ok: true,
        mensaje: 'Salida registrada correctamente',
        movimiento: respuesta
    }
};

const obtenerMovimientosStockService = async (querys) => {
    let { limit, offset, fechaInicio, fechaFin, tipoMovimiento, insumo } = querys;

    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
        throw crearError('Se necesitan ambas fechas para el filtrado', 400);
    }

    const cacheKey = `movimientos_stock:count:${fechaInicio || 'null'}:${fechaFin || 'null'}:${tipoMovimiento || 'null'}:${insumo || 'null'}`;

    const cachedTotal = cache.get(cacheKey);

    if (cachedTotal !== undefined) {
        console.log('Cache hit');
        const movimientos = await obtenerMovimientosStockFiltrosModel(fechaInicio, fechaFin, tipoMovimiento, insumo, limite, desplazamiento);

        if (!movimientos || movimientos.length === 0) {
            throw crearError('No se encontraron movimientos de stock', 404);
        }

        return {
            ok: true,
            cantidad_filas: cachedTotal,
            movimientos
        };
    }

    console.log('Cache miss');

    const totalRegistros = await contarMovimientosStockFiltrosModel(fechaInicio, fechaFin, tipoMovimiento, insumo);

    cache.set(cacheKey, totalRegistros);

    const movimientos = await obtenerMovimientosStockFiltrosModel(fechaInicio, fechaFin, tipoMovimiento, insumo, limite, desplazamiento);

    if (!movimientos || movimientos.length === 0) {
        throw crearError('No se encontraron movimientos de stock', 404);
    }

    return {
        ok: true,
        cantidad_filas: totalRegistros,
        movimientos,
    };
};


module.exports = {
    insertarInsumoService,
    actualizarDatosInsumoService,
    eliminarInsumoService,
    obtenerInsumosService,
    obtenerInsumoIDService,
    registrarEntradaStockService,
    registrarSalidaStockService,
    obtenerMovimientosStockService
}