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
    cerrarCajaService
}