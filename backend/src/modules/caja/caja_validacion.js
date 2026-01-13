const { contarUsuarioPorIdModel } = require('../usuarios/usuario_model')
const crearError = require('../../utilidades/crear_error');

const validarDatosAbrirCaja = (datos) => {
    if(!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos como el monto inicial para aperturar una caja.', 400);
    }
    const { montoInicial } = datos;

    if (!montoInicial || typeof montoInicial !== 'number') {
         throw crearError('Se necesita un monto inicial', 400);
    }

    if (montoInicial < 0) {
        throw crearError('El monto inicial debe ser un número mayor o igual a 0', 400);
    }
};

const validarDatosMovimientosCaja = (datos) => {
    if(!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos como monto y descripción para registrar un movimiento en caja', 400);
    }
    const { monto, descripcion } = datos;
    if(!monto || typeof monto !== 'number' || monto <= 0){
        throw crearError('Se necesita un monto valido', 400);
    }

    if(!descripcion || typeof descripcion !== 'string' || !descripcion.trim()){
        throw crearError('Se necesita una descripción válida')
    }
};

const validarDatosArqueoCaja = (datos) => {
    if(!datos || typeof datos !== 'object') {
        throw crearError('Se necesitan datos como el dinero físico de caja', 400);
    }
    
    const { montoFisico, montoTarjeta, montoBilleteraDigital, montoOtros } = datos;

    if (montoFisico == undefined || typeof montoFisico !== 'number' || montoFisico < 0) {
        throw crearError('Se necesita el monto físico de caja', 400);
    }
    
    if (montoTarjeta === undefined || typeof montoTarjeta !== 'number' || montoTarjeta < 0) {
        throw crearError('Se necesita el monto de tarjeta', 400);
    }

    if (montoBilleteraDigital === undefined || typeof montoBilleteraDigital !== 'number' || montoBilleteraDigital < 0) {
        throw crearError('Se necesita el monto de billetera digital', 400);
    }

    if (montoOtros === undefined || typeof montoOtros !== 'number' || montoOtros < 0) {
        throw crearError('Se necesita el monto de otros metodos de pago', 400);
    }
};

module.exports = { 
    validarDatosAbrirCaja, 
    validarDatosMovimientosCaja,
    validarDatosArqueoCaja 
};