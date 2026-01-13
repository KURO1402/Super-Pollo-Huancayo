const {
 insertarInsumoModel,
 contarInsumosPorNombreModel,
 recuperarInsumoModel,
 actualizarDatosInsumoModel,
 actualizarEstadoInsumoModel,
 contarInsumosPorIdModel,
 contarInsumosPorNombre2Model
} = require('./insumos_model');

const {
    validarDatosInsumo
} = require('./insumo_validacion');
const crearError = require('../../../utilidades/crear_error');

const insertarInsumoService = async (datos) => {
    validarDatosInsumo(datos);

    const { nombreInsumo, cantidadInicial, unidadMedida } = datos;
    let respuesta, insumoID;

    const coincidenciasNombre = await contarInsumosPorNombreModel(nombreInsumo);
    if(coincidenciasNombre.total_activos > 0){
        throw crearError('Ya existe un insumo registrado con ese nombre.', 409);
    } if (coincidenciasNombre.total_inactivos > 0){
        respuesta = await recuperarInsumoModel(coincidenciasNombre.id_insumo_inactivo, unidadMedida, 1);
        insumoID = coincidenciasNombre.id_insumo_inactivo;
    } else {
        resultado = await insertarInsumoModel(nombreInsumo, cantidadInicial, unidadMedida);
        respuesta = resultado.mensaje;
        insumoID = resultado.id_insumo;
    }
    if(cantidadInicial > 0){
        console.log('Añadir un movimiento de stock al insumo: '+insumoID);
        //Aqui va a ir el modelo de añadir una entrada
    };

    return {
        ok: true,
        mensaje: respuesta
    }
};

const actualizarDatosInsumoService = async (idInsumo, datos) => {

    if(!datos || typeof datos !== 'object'){
        throw crearError('Se necesitan datos del insumo', 400);
    }

    const { nombreInsumo, unidadMedida } = datos;
    
    if(!nombreInsumo || typeof nombreInsumo !== 'string' || !nombreInsumo.trim()){
        throw crearError('Se necesita el nombre del insumo.', 400);
    }

    if(!unidadMedida || typeof unidadMedida !== 'string' || !unidadMedida.trim()){
        throw crearError('Se necesita la unidad de medida del insumo.', 400);
    }

    totalInsumos = await contarInsumosPorIdModel(idInsumo);
    if(totalInsumos === 0){
        throw crearError('Insumo no existente.', 404);
    }
    const coincidenciasNombre = await contarInsumosPorNombre2Model(nombreInsumo, idInsumo);
    if(coincidenciasNombre > 0){
        throw crearError('Ya existe un insumo registrado con ese nombre.', 409);
    }

    const respuesta = await actualizarDatosInsumoModel(idInsumo, nombreInsumo, unidadMedida);

    return {
        ok: true,
        mensaje: respuesta
    }
};

const eliminarInsumoService = async (idInsumo) => {
    const totalInsumos = await contarInsumosPorIdModel(idInsumo);
    
    if (totalInsumos === 0) {
        throw crearError('Insumo no existente.', 404);
    }

    await actualizarEstadoInsumoModel(idInsumo, 0);

    return {
        ok: true,
        mensaje: 'Insumo eliminado correctamente'
    };
};


module.exports = {
    insertarInsumoService,
    actualizarDatosInsumoService,
    eliminarInsumoService
}