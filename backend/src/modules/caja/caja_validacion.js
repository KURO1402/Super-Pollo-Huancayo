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
};

const validarDatosMovimientosCaja = (datos) => {
    if(!datos || typeof datos !== 'object') {
        throw crear_error('Se necesitan datos como monto y descripción para registrar un movimiento en caja', 400);
    }
    const { monto, descripcion } = datos;
    if(!monto || typeof monto !== 'number' || monto <= 0){
        throw crear_error('Se necesita un monto valido', 400);
    }

    if(!descripcion || typeof descripcion !== 'string' || !descripcion.trim()){
        throw crear_error('Se necesita una descripción válida')
    }
};

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
    validarDatosMovimientosCaja,
    validarDatosArqueoCaja 
};