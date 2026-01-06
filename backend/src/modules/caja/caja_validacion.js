const { consultarCajaAbiertaModel, obtenerArqueosPorCajaModel } = require('./caja_model')
const { contarUsuarioPorIdModel } = require('../usuarios/usuario_model')
const crear_error = require('../../utilidades/crear_error');

const validarDatosAbrirCaja = (datos) => {
    if(!datos || typeof datos !== 'object') {
        throw crear_error('Se necesitan datos como el monto inicial para aperturar una caja.', 400);
    }
    const { montoInicial } = datos;

    if (!montoInicial || typeof montoInicial !== 'number') {
         throw crear_error('Se necesita un monto inicial', 400);
    }

    if (montoInicial < 0) {
        throw crear_error('El monto inicial debe ser un número mayor o igual a 0', 400);
    }
}

const validarDatosCerrarCaja = async (usuarioId) => {
    if (typeof usuarioId !== 'number' || usuarioId <= 0) {
        throw crear_error('El id de usuario tiene que ser válido y numérico', 400);
    }

    const caja = await consultarCajaAbiertaModel();
    if (caja.length === 0) {
        throw crear_error('No hay una caja abierta para cerrar.', 400);
    }
    
    const cajaData = caja[0];
    const idCaja = cajaData.idCaja;
    const arqueos = await obtenerArqueosPorCajaModel(idCaja);
    if (arqueos.length === 0) {
        throw crear_error('No se puede cerrar la caja sin antes hacer un arqueo.', 400);
    }

    const usuariosCoincidentes = await contarUsuarioPorIdModel(usuarioId);
    if (usuariosCoincidentes === 0) {
        throw crear_error('Usuario inexistente', 400);
    }
}

const validarDatosIngresoCaja = async (datos, usuarioId) => {
    if(!datos || typeof datos !== 'object') {
        throw crear_error('Se necesitan datos como monto y descripción para registrar un ingreso a caja', 400);
    }

    const { monto, descripcion } = datos;

    if (!monto || !descripcion) {
        throw crear_error('Se necesita un monto y una descripción válidos', 400);
    }

    if (typeof monto !== 'number' || monto <= 0) {
        throw crear_error('El monto debe ser un número mayor a 0', 400);
    }

    const usuariosCoincidentes = await contarUsuarioPorIdModel(usuarioId);
    if (usuariosCoincidentes === 0) {
        throw crear_error('Usuario inexistente', 400);
    }

    const cajas = await consultarCajaAbiertaModel();
    if (cajas.length === 0) {
        throw crear_error('No se puede registrar un ingreso si no hay una caja abierta.', 400);
    }
}

const validarDatosEgresoCaja = async (datos, usuarioId) => {
    if(!datos || typeof datos !== 'object') {
        throw crear_error('Se necesitan datos como monto y descripción para registrar un egreso a caja', 400);
    }
    
    const { monto, descripcion } = datos;

    if (!monto || !descripcion) {
        throw crear_error('Se necesita un monto y una descripción válidos', 400);
    }

    if (typeof monto !== 'number' || monto <= 0) {
        throw crear_error('El monto debe ser un número mayor a 0', 400);
    }

    const usuariosCoincidentes = await contarUsuarioPorIdModel(usuarioId);
    if (usuariosCoincidentes === 0) {
        throw crear_error('Usuario inexistente', 400);
    }

    const cajas = await consultarCajaAbiertaModel();
    if (cajas.length === 0) {
        throw crear_error('No se puede registrar un egreso si no hay una caja abierta.', 400);
    }

    const caja = cajas[0];
    if (caja.montoActual < monto) {
        throw crear_error('No hay suficiente saldo en la caja para realizar el egreso.', 400);
    }
}

const validarDatosArqueoCaja = async (datos, usuarioId) => {
    if(!datos || typeof datos !== 'object') {
        throw crear_error('Se necesitan datos como el dinero físico de caja', 400);
    }
    
    const { montoFisico, montoTarjeta, montoBilleteraDigital, otros } = datos;

    if (montoFisico == undefined || typeof montoFisico !== 'number' || montoFisico < 0) {
        throw crear_error('Se necesita el monto físico de caja y que sea un número válido', 400);
    }
    
    if (montoTarjeta === undefined || typeof montoTarjeta !== 'number' || montoTarjeta < 0) {
        throw crear_error('Se necesita el monto de tarjeta y que sea un número válido', 400);
    }

    if (montoBilleteraDigital === undefined || typeof montoBilleteraDigital !== 'number' || montoBilleteraDigital < 0) {
        throw crear_error('Se necesita el monto de billetera digital y que sea un número válido', 400);
    }

    if (otros === undefined || typeof otros !== 'number' || otros < 0) {
        throw crear_error('Se necesita el monto de otros y que sea un número válido', 400);
    }

    const usuariosCoincidentes = await contarUsuarioPorIdModel(usuarioId);
    if (usuariosCoincidentes === 0) {
        throw crear_error('Usuario inexistente', 400);
    }

    const cajas = await consultarCajaAbiertaModel();
    if (cajas.length === 0) {
        throw crear_error('No hay ninguna caja abierta para registrar el arqueo', 400);
    }
};

module.exports = { 
    validarDatosAbrirCaja, 
    validarDatosCerrarCaja, 
    validarDatosIngresoCaja,
    validarDatosEgresoCaja,
    validarDatosArqueoCaja 
};