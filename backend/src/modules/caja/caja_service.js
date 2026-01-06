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
    validarDatosCerrarCaja, 
    validarDatosIngresoCaja, 
    validarDatosEgresoCaja, 
    validarDatosArqueoCaja 
} = require('./caja_validacion');

const crearCajaService = async (datos, idUsuario) => {
    validarDatosAbrirCaja(datos);
    const { montoInicial } = datos;
    cajas = await consultarCajaAbiertaModel();

    if (cajas.length > 0) {
        throw crear_error('Ya hay una caja abierta. No se puede abrir otra.', 400);
    }

    const idGenerado = await crearCajaModel(montoInicial, idUsuario);

    return {
        ok: true,
        idCaja: idGenerado,
        mensaje: 'Caja creada exitosamente'
    };
}

module.exports = {
    crearCajaService
}