const { 
    obtenerResumenVentasEgresosMensualModel,
    obtenerVentasHoyComparacionModel 
} = require('./fuente_datos_model');

const obtenerResumenVentasEgresosMensualService = async (cantidadMeses) => {
    const meses = parseInt(cantidadMeses) || 6;

    if (meses < 1 || meses > 12) {
        throw crearError('La cantidad de meses debe estar entre 1 y 12.', 400);
    }

    const resultado = await obtenerResumenVentasEgresosMensualModel(meses);

    return {
        ok: true,
        resultado
    };
};

const obtenerVentasHoyComparacionService = async () => {
    const resultado = await obtenerVentasHoyComparacionModel();
    console.log(resultado)
    return {
        ok: true,
        resultado
    };
};

module.exports = { 
    obtenerResumenVentasEgresosMensualService,
    obtenerVentasHoyComparacionService 
};