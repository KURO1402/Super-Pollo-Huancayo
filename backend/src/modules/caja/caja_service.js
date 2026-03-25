const crearError = require('../../utilidades/crear_error');
const cache = require('../../config/node_cache');
const {
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
} = require('./caja_model')
const {
    validarDatosAbrirCaja,
    validarDatosMovimientosCaja,
    validarDatosArqueoCaja
} = require('./caja_validacion');

const { contarUsuarioPorIdModel } = require('../usuarios/usuario_model');
const limpiarCachePorPrefijo = require('../../utilidades/limpiar_cache');

const crearCajaService = async (datos, idUsuario) => {
    validarDatosAbrirCaja(datos);
    const { montoInicial } = datos;
    const caja = await consultarCajaAbiertaModel();
    if (caja) {
        throw crearError('Ya hay una caja abierta. No se puede abrir otra.', 409);
    }

    const resultado = await crearCajaModel(montoInicial, idUsuario);

    limpiarCachePorPrefijo('cajas:');

    return {
        ok: true,
        mensaje: 'Caja creada exitosamente',
        caja: resultado
    };
};

const registrarIngresoCajaService = async (datos, idUsuario) => {

    validarDatosMovimientosCaja(datos);
    const { monto, descripcion } = datos;

    const usuariosCoincidentes = await contarUsuarioPorIdModel(idUsuario);
    if (usuariosCoincidentes === 0) {
        throw crearError('Usuario inexistente', 400);
    }

    const caja = await consultarCajaAbiertaModel();
    if (!caja) {
        throw crearError('No se puede registrar un ingreso si no hay una caja abierta.', 400);
    }

    const movimiento = await registrarIngresoCajaModel(monto, descripcion, idUsuario);

    limpiarCachePorPrefijo('cajas:');
    limpiarCachePorPrefijo('movimientos_caja:');

    return {
        ok: true,
        mensaje: 'Ingreso registrado en caja exitosamente',
        movimiento
    };
};

const registrarEgresoCajaService = async (datos, idUsuario) => {

    validarDatosMovimientosCaja(datos);
    const { monto, descripcion } = datos;

    const usuariosCoincidentes = await contarUsuarioPorIdModel(idUsuario);
    if (usuariosCoincidentes === 0) {
        throw crearError('Usuario inexistente', 400);
    }

    const caja = await consultarCajaAbiertaModel();

    if (!caja) {
        throw crearError('No se puede registrar un egreso si no hay una caja abierta.', 400);
    }

    if (caja.monto_actual < monto) {
        throw Object.assign(new Error("No hay suficiente saldo en la caja para realizar el egreso."), { status: 400 });
    }

    const movimiento = await registrarEgresoCajaModel(monto, descripcion, idUsuario);

    limpiarCachePorPrefijo('cajas:');
    limpiarCachePorPrefijo('movimientos_caja:');

    return {
        ok: true,
        mensaje: 'Egreso registrado en caja exitosamente',
        movimiento
    };
};

const registrarArqueoCajaService = async (datos, idUsuario) => {

    validarDatosArqueoCaja(datos);
    const usuariosCoincidentes = await contarUsuarioPorIdModel(idUsuario);
    if (usuariosCoincidentes === 0) {
        throw crearError('Usuario inexistente', 400);
    }

    const caja = await consultarCajaAbiertaModel();
    if (!caja) {
        throw crearError('No hay ninguna caja abierta para registrar el arqueo', 400);
    }

    const { montoFisico, montoTarjeta, montoBilleteraDigital, montoOtros, descripcionArqueo } = datos;

    const montoTotal = montoFisico + montoTarjeta + montoBilleteraDigital + montoOtros;
    const diferencia = montoTotal - caja.monto_actual;
    const estadoArqueo = diferencia === 0 ? 'cuadra' : diferencia > 0 ? 'sobra' : 'falta';

    const descripcionFinal = descripcionArqueo?.trim() || null;

    if (estadoArqueo !== 'cuadra' && !descripcionFinal) {
        throw crearError('La descripción es obligatoria cuando hay sobrante o faltante', 400);
    }

    const resultado = await registrarArqueoCajaModel(datos, diferencia, estadoArqueo, idUsuario, caja.id_caja, descripcionFinal);

    limpiarCachePorPrefijo('cajas:');

    return {
        ok: true,
        mensaje: resultado
    };
};

const cerrarCajaService = async (idUsuario) => {
    if (typeof idUsuario !== 'number' || idUsuario <= 0) {
        throw crearError('El id de usuario tiene que ser válido', 400);
    }

    const cajaAbierta = await consultarCajaAbiertaModel();
    if (!cajaAbierta) {
        throw crearError('No existe ninguna caja abierta', 409)
    }

    const arqueosCaja = await obtenerArqueosPorCajaModel(cajaAbierta.id_caja);
    if (arqueosCaja.length === 0) {
        throw crearError('Primero necesita realizar minimo un arqueo de caja', 403)
    }

    const respuesta = await cerrarCajaModel(cajaAbierta.id_caja, idUsuario, cajaAbierta.monto_actual);

    limpiarCachePorPrefijo('cajas:');

    return {
        ok: true,
        mensaje: respuesta
    };
};

const obtenerCajasService = async (querys) => {
    const allowedQuerys = ['limit', 'offset', 'fechaInicio', 'fechaFin'];

    const keysInvalidas = Object.keys(querys).filter(
        key => !allowedQuerys.includes(key)
    );

    if (keysInvalidas.length > 0) {
        throw crearError('Filtro no valido',400);
    }

    const { limit, offset, fechaInicio, fechaFin } = querys;

    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
        throw crearError('Se necesitan ambas fechas para el filtrado', 400);
    }

    const cacheKey = `cajas:count:${fechaInicio || 'null'}:${fechaFin || 'null'}`;

    const cachedTotal = cache.get(cacheKey);

    if (cachedTotal !== undefined) {

        const cajas = await obtenerCajasModel(limite, desplazamiento, fechaInicio, fechaFin);
        if (!cajas || cajas.length === 0) {
            throw crearError('No se encontraron cajas', 404);
        }
        return {
            ok: true,
            cantidad_filas: cachedTotal,
            cajas
        };
    }


    const totalCajas = await contarCajasModel(fechaInicio, fechaFin);

    cache.set(cacheKey, totalCajas);

    const cajas = await obtenerCajasModel(limite, desplazamiento, fechaInicio, fechaFin);

    if (!cajas || cajas.length === 0) {
        throw crearError('No se encontraron cajas', 404);
    }

    return {
        ok: true,
        cantidad_filas: totalCajas,
        cajas
    };
};

const obtenerMovimientosPorCajaService = async (cajaId, querys) => {
    const allowedQuerys = ['limit', 'offset', 'tipoMovimiento'];

    const keysInvalidas = Object.keys(querys).filter(
        key => !allowedQuerys.includes(key)
    );

    if (keysInvalidas.length > 0) {
        throw crearError('Filtro no valido',400);
    }

    const { tipoMovimiento, limit , offset } = querys;

    if (tipoMovimiento !== undefined && (tipoMovimiento !== 'ingreso' && tipoMovimiento !== 'egreso')) {
        throw crearError(`El tipo de movimiento solo puede ser 'ingreso' o 'egreso'`, 400);
    }

    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    const cacheKey = `movimientos_caja:count:${tipoMovimiento || 'null'}`;
    const cachedTotal = cache.get(cacheKey);
    if (cachedTotal !== undefined) {

        const movimientos = await obtenerMovimientosPorCajaModel(cajaId, tipoMovimiento, limite, desplazamiento);
        
        if (!movimientos || movimientos.length === 0) {
            throw crearError('No se encontraron movimientos para la caja especificada', 404);
        }

        return {
            ok: true,
            cantidad_filas: cachedTotal,
            movimientos
        };
    }

    const totalMovimientos = await contarMovimientosPorCajaModel(cajaId, tipoMovimiento);

    cache.set(cacheKey, totalMovimientos);

    const movimientos = await obtenerMovimientosPorCajaModel(cajaId, tipoMovimiento, limite, desplazamiento);

    if (!movimientos || movimientos.length === 0) {
        throw crearError('No se encontraron movimientos para la caja especificada', 404);
    }

    return {
        ok: true,
        cantidad_filas: totalMovimientos,
        movimientos
    };
};

const obtenerArqueosPorCajaService = async (cajaId) => {

    const arqueos = await obtenerArqueosPorCajaModel(cajaId);

    if (arqueos.length === 0) {
        throw crearError('No se encontraron arqueos para la caja especificada', 404);
    }

    return arqueos;
};

const obtenerCajaActualService = async () => {
    const caja = await obtenerCajaActualModel();

    if (!caja) {
        throw crearError('No hay ninguna caja abierta actualmente', 404);
    }

    return caja;
};

module.exports = {
    crearCajaService,
    registrarIngresoCajaService,
    registrarEgresoCajaService,
    registrarArqueoCajaService,
    cerrarCajaService,
    obtenerCajasService,
    obtenerMovimientosPorCajaService,
    obtenerArqueosPorCajaService,
    obtenerCajaActualService
}