const crearError = require('../../../utilidades/crear_error');

const {
    insertarMedioPagoModel,
    contarMedioPagoPorNombreModel,
    actualizarMedioPagoModel,
    contarMedioPagoPorIdModel,
    contarMedioPagoNombreExcluyendoIdModel,
    eliminarMedioPagoModel,
    listarMediosPagoModel,
    obtenerMedioPagoPorIdModel
} = require('./medios_pago_model');

const insertarMedioPagoService = async (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos para crear un nuevo medio de pago', 400);
    }

    const { nombreMedioPago } = datos;

    if (!nombreMedioPago || typeof nombreMedioPago !== 'string' || !nombreMedioPago.trim()) {
        throw crearError('Se necesita el nombre del nuevo medio de pago', 400);
    }

    const nombreActivoCoincidente = await contarMedioPagoPorNombreModel(nombreMedioPago);
    if (nombreActivoCoincidente > 0) {
        throw crearError('Ya existe un medio de pago activo con ese nombre', 409);
    }

    const medio_pago = await insertarMedioPagoModel(nombreMedioPago);

    return {
        ok: true,
        mensaje: 'Medio de pago registrado correctamente',
        medio_pago
    };
};

const actualizarMedioPagoService = async (datos, idMedioPago) => {

    if (!idMedioPago.trim() || isNaN(Number(idMedioPago))) {
        throw crearError('ID de medio de pago no válido', 400);
    }
    const medioPagoID = Number(idMedioPago);

    if (!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos para actualizar el medio de pago', 400);
    }

    const { nombreMedioPago } = datos;

    if (!nombreMedioPago || typeof nombreMedioPago !== 'string' || !nombreMedioPago.trim()) {
        throw crearError('El nombre del medio de pago es obligatorio', 400);
    }

    const existe = await contarMedioPagoPorIdModel(medioPagoID);
    if (existe === 0) {
        throw crearError('El medio de pago no existe', 404);
    }

    const nombreDuplicado = await contarMedioPagoNombreExcluyendoIdModel(nombreMedioPago, medioPagoID);
    if (nombreDuplicado > 0) {
        throw crearError('Ya existe otro medio de pago con ese nombre', 409);
    }

    const medioPagoActualizado = await actualizarMedioPagoModel(medioPagoID, nombreMedioPago);

    return {
        ok: true,
        mensaje: 'Medio de pago actualizado correctamente',
        medioPago: medioPagoActualizado
    };
};

const eliminarMedioPagoService = async (idMedioPago) => {
    if (!idMedioPago.trim() || isNaN(Number(idMedioPago))) {
        throw crearError('ID de medio de pago no válido', 400);
    }

    const medioPagoID = Number(idMedioPago);

    const medioPagoExiste = await contarMedioPagoPorIdModel(medioPagoID);

    if (medioPagoExiste === 0) {
        throw crearError('El medio de pago no existe', 404);
    }

    const resultado = await eliminarMedioPagoModel(medioPagoID);

    return {
        ok: true,
        mensaje: resultado
    };
};

const listarMediosPagoService = async () => {

    const medios_pago = await listarMediosPagoModel();

    if (!medios_pago || medios_pago.length === 0) {
        throw crearError('No se encontraron medios de pago', 404);
    }

    return {
        ok: true,
        medios_pago
    };
};

const obtenerMedioPagoPorIdService = async (idMedioPago) => {

    if (!idMedioPago || isNaN(Number(idMedioPago))) {
        throw crearError('Medio de pago no válido', 400);
    }

    const medioPagoID = Number(idMedioPago);
    const medio_pago = await obtenerMedioPagoPorIdModel(medioPagoID);

    if (!medio_pago) {
        throw crearError('Medio de pago no encontrado', 404);
    }

    return {
        ok: true,
        medio_pago
    };
};

module.exports = {
    insertarMedioPagoService,
    actualizarMedioPagoService,
    eliminarMedioPagoService,
    listarMediosPagoService,
    obtenerMedioPagoPorIdService
};
