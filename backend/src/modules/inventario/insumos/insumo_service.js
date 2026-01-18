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
    obtenerInsumosPaginacionModel,
    obtenerInsumoIDModel,
    obtenerInsumoNombreModel,
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

const insertarInsumoService = async (datos) => {
    validarDatosInsumo(datos);

    const { nombreInsumo, cantidadInicial, unidadMedida } = datos;
    let respuesta, insumoID;

    const coincidenciasNombre = await contarInsumosPorNombreModel(nombreInsumo);
    if (coincidenciasNombre.total_activos > 0) {
        throw crearError('Ya existe un insumo registrado con ese nombre.', 409);
    } if (coincidenciasNombre.total_inactivos > 0) {
        respuesta = await recuperarInsumoModel(coincidenciasNombre.id_insumo_inactivo, unidadMedida, 1);
        insumoID = coincidenciasNombre.id_insumo_inactivo;
    } else {
        resultado = await insertarInsumoModel(nombreInsumo, cantidadInicial, unidadMedida);
        respuesta = resultado.mensaje;
        insumoID = resultado.id_insumo;
    }
    if (cantidadInicial > 0) {
        console.log('Añadir un movimiento de stock al insumo: ' + insumoID);
        //Aqui va a ir el modelo de añadir una entrada
    };

    return {
        ok: true,
        mensaje: respuesta
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

    const respuesta = await actualizarDatosInsumoModel(idInsumo, nombreInsumo, unidadMedida);

    return {
        ok: true,
        mensaje: respuesta
    }
};

const eliminarInsumoService = async (idInsumo) => {
    const totalInsumos = await contarInsumosPorIdModel(idInsumo);

    if (totalInsumos === 0) {
        throw crearError('Insumo no existente.', 404);
    }

    await actualizarEstadoInsumoModel(idInsumo, 0);

    return {
        ok: true,
        mensaje: 'Insumo eliminado correctamente'
    };
};

const obtenerInsumosService = async () => {
    const insumos = await obtenerInsumosModel();

    if (!insumos || insumos.length === 0) {
        throw crearError('No existen insumos.', 404)
    }

    return {
        ok: true,
        insumos
    }
};

const obtenerInsumosPaginacionService = async (limit, offset) => {
    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;
    const insumos = await obtenerInsumosPaginacionModel(limite, desplazamiento);

    if (!insumos || insumos.length === 0) {
        throw crearError('No existen insumos.', 404)
    }

    return {
        ok: true,
        insumos
    }
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

const obtenerInsumoNombreService = async (nombre) => {

    const insumos = await obtenerInsumoNombreModel(nombre);

    if (!insumos) {
        throw crearError('Insumo no encontrado.', 404);
    }

    return {
        ok: true,
        insumos
    };
};

//Servicos para movimientos de stock
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

    const hoy = new Date().toISOString().split('T')[0];

    if (fechaInicio && !fechaFin) fechaFin = hoy;
    if (!fechaInicio && fechaFin) fechaInicio = fechaFin;

    if (fechaInicio && fechaFin) {
        if (new Date(fechaFin) < new Date(fechaInicio)) {
            throw crearError('La fecha fin no puede ser menor que la fecha inicio', 400);
        }
    }

    const cacheKey = `movimientos_stock:count:${fechaInicio || 'null'}:${fechaFin || 'null'}:${tipoMovimiento || 'null'}:${insumo || 'null'}`;

    const cachedTotal = cache.get(cacheKey);

    if (cachedTotal !== undefined) {
        console.log('Cache hit');
        const movimientos = await obtenerMovimientosStockFiltrosModel(fechaInicio, fechaFin, tipoMovimiento, insumo, limite, desplazamiento)
        return {
            ok: true,
            cantidad_filas: cachedTotal,
            movimientos
        };
    }

    console.log('Cache miss');

    const totalRegistros = await contarMovimientosStockFiltrosModel(fechaInicio,fechaFin,tipoMovimiento,insumo);

    if (totalRegistros === 0) {
        throw crearError('No se encontraron movimientos de stock', 404);
    }

    cache.set(cacheKey, totalRegistros);

    const movimientos = await obtenerMovimientosStockFiltrosModel(fechaInicio, fechaFin, tipoMovimiento, insumo, limite, desplazamiento);

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
    obtenerInsumosPaginacionService,
    obtenerInsumoIDService,
    obtenerInsumoNombreService,
    registrarEntradaStockService,
    registrarSalidaStockService,
    obtenerMovimientosStockService
}