const { 
    obtenerResumenVentasEgresosMensualService,
    obtenerVentasHoyComparacionService 
} = require('./fuente_datos_service');

const obtenerResumenVentasEgresosMensualController = async (req, res) => {
    try {
        const { meses } = req.query;
        const resultado = await obtenerResumenVentasEgresosMensualService(meses);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const obtenerVentasHoyComparacionController = async (req, res) => {
    try {
        const resultado = await obtenerVentasHoyComparacionService();
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

module.exports = { 
    obtenerResumenVentasEgresosMensualController,
    obtenerVentasHoyComparacionController
 };