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
}

module.exports = {
    validarDatosInsumo
}