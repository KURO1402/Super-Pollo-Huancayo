const crear_error = require('../../utilidades/crear_error');
const {
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
} = require('./caja_model')
const { 
    validarDatosAbrirCaja,
    validarDatosMovimientosCaja, 
    validarDatosArqueoCaja 
} = require('./caja_validacion');

const { contarUsuarioPorIdModel } = require('../usuarios/usuario_model');

const crearCajaService = async (datos, idUsuario) => {
    validarDatosAbrirCaja(datos);
    const { montoInicial } = datos;
    const caja = await consultarCajaAbiertaModel();
    if (caja) {
        throw crear_error('Ya hay una caja abierta. No se puede abrir otra.', 409);
    }

    const idGenerado = await crearCajaModel(montoInicial, idUsuario);

    return {
        ok: true,
        idCaja: idGenerado,
        mensaje: 'Caja creada exitosamente'
    };
};

const registrarIngresoCajaService = async (datos, idUsuario) => {

    validarDatosMovimientosCaja(datos);
    const { monto, descripcion } = datos;

    const usuariosCoincidentes = await contarUsuarioPorIdModel(idUsuario);
    if (usuariosCoincidentes === 0) {
        throw crear_error('Usuario inexistente', 400);
    }

    const caja = await consultarCajaAbiertaModel();
    if (!caja) {
        throw crear_error('No se puede registrar un ingreso si no hay una caja abierta.', 400);
    }

    const resultado = await registrarIngresoCajaModel(monto, descripcion, idUsuario);

    return {
        ok: true,
        mensaje: resultado
    };
};

const registrarEgresoCajaService = async (datos, idUsuario) => {

    validarDatosMovimientosCaja(datos);
    const { monto, descripcion } = datos;

    const usuariosCoincidentes = await contarUsuarioPorIdModel(idUsuario);
    if (usuariosCoincidentes === 0) {
        throw crear_error('Usuario inexistente', 400);
    }

    const caja = await consultarCajaAbiertaModel();

    if (!caja) {
        throw crear_error('No se puede registrar un egreso si no hay una caja abierta.', 400);
    }

    if (caja.monto_actual < monto) {
        throw Object.assign(new Error("No hay suficiente saldo en la caja para realizar el egreso."), { status: 400 });
    }

    const resultado = await registrarEgresoCajaModel(monto, descripcion, idUsuario);

    return {
        ok: true,
        mensaje: resultado
    };
};

const registrarArqueoCajaService = async (datos, idUsuario) => {

    validarDatosArqueoCaja(datos);
    const usuariosCoincidentes = await contarUsuarioPorIdModel(idUsuario);
    if (usuariosCoincidentes === 0) {
        throw crear_error('Usuario inexistente', 400);
    }

    const caja = await consultarCajaAbiertaModel();
    if (!caja) {
        throw crear_error('No hay ninguna caja abierta para registrar el arqueo', 400);
    }

    const { montoFisico, montoTarjeta, montoBilleteraDigital, montoOtros } = datos;

    const montoTotal = montoFisico + montoTarjeta + montoBilleteraDigital + montoOtros;
    const diferencia = montoTotal - caja.monto_actual;
    const estadoArqueo = diferencia === 0 ? 'cuadra' : diferencia > 0 ? 'sobra' : 'falta';

    const resultado = await registrarArqueoCajaModel(datos, diferencia, estadoArqueo, idUsuario, caja.id_caja);

    return {
        ok: true,
        mensaje: resultado
    };
};

const cerrarCajaService = async (idUsuario) => {
    if (typeof idUsuario !== 'number' || idUsuario <= 0) {
        throw crear_error('El id de usuario tiene que ser válido', 400);
    }

    const cajaAbierta = await consultarCajaAbiertaModel();
    if(!cajaAbierta){
        throw crear_error('No existe ninguna caja abierta', 409)
    }

    const arqueosCaja = await obtenerArqueosPorCajaModel(cajaAbierta.id_caja);
    if(arqueosCaja.length === 0){
        throw crear_error('Primero necesita realizar minimo un arqueo de caja', 403)
    }

    const respuesta= await cerrarCajaModel(cajaAbierta.id_caja, idUsuario, cajaAbierta.monto_actual);

    return {
        ok: true,
        mensaje: respuesta
    };
}

module.exports = {
    crearCajaService,
    registrarIngresoCajaService,
    registrarEgresoCajaService,
    registrarArqueoCajaService,
    cerrarCajaService
}