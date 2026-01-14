const crearError = require('../../../utilidades/crear_error');

const validarDatosInsumo = (datos) => {
    if(!datos || typeof datos !== 'object'){
        throw crearError('Faltan datos del insumo', 400);
    };

    const { nombreInsumo, cantidadInicial, unidadMedida } = datos;

    if(!nombreInsumo || typeof nombreInsumo !== 'string' || !nombreInsumo.trim()){
        throw crearError('Se necesita el nombre del insumo.', 400);
    };

    if(cantidadInicial === undefined || cantidadInicial === null || typeof cantidadInicial !== 'number' || cantidadInicial < 0){
        throw crearError('Se necesita una cantidad inicial para el stock del insumo.', 400);
    };

    if(!unidadMedida || typeof unidadMedida !== 'string' || !unidadMedida.trim()){
        throw crearError('Se necesita la unidad de medida del insumo.', 400);
    }
};

const validarDatosMovimiento = (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw crearError('No se enviaron los datos necesarios para registrar el movimiento de stock.', 400);
    }

    const { idInsumo, cantidadMovimiento, detalleMovimiento } = datos;

    if (!idInsumo || typeof idInsumo !== 'number' || idInsumo <= 0) {
        throw crearError('El id del insumo es obligatorio y debe ser un número válido.', 400);
    }

    if (cantidadMovimiento === undefined || typeof cantidadMovimiento !== 'number' || cantidadMovimiento <= 0) {
        throw crearError('La cantidad del movimiento debe ser un número mayor a cero.', 400);
    }

    if (detalleMovimiento && (typeof detalleMovimiento !== 'string' || !detalleMovimiento.trim())) {
        throw crearError('El detalle del movimiento debe ser un texto válido.',400);
    }
};


module.exports = {
    validarDatosInsumo,
    validarDatosMovimiento
}