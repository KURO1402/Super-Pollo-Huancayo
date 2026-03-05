const { obtenerResumenVentasEgresosMensualModel } = require('./fuente_datos_model');

const obtenerResumenVentasEgresosMensualService = async (cantidadMeses) => {
    const meses = parseInt(cantidadMeses) || 6;

    if (meses < 1 || meses > 24) {
        throw crearError('La cantidad de meses debe estar entre 1 y 24.', 400);
    }

    const resultado = await obtenerResumenVentasEgresosMensualModel(meses);

    return {
        ok: true,
        data: resultado
    };
};

module.exports = { obtenerResumenVentasEgresosMensualService };