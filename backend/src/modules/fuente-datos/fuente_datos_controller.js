const { 
    obtenerResumenVentasEgresosMensualService,
    obtenerVentasHoyComparacionService,
    obtenerReservasMesComparacionService,
    obtenerBalanceAnualService,
    obtenerPorcentajeMediosPagoService,
    obtenerVentasPorMesService,
    obtenerTopProductosMasVendidosService 
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

const obtenerReservasMesComparacionController = async (req, res) => {
    try {
        const resultado = await obtenerReservasMesComparacionService();
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const obtenerBalanceAnualController = async (req, res) => {
    try {
        const resultado = await obtenerBalanceAnualService();
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const obtenerPorcentajeMediosPagoController = async (req, res) => {
    try {
        const resultado = await obtenerPorcentajeMediosPagoService();
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const obtenerVentasPorMesController = async (req, res) => {
    try {
        const { meses } = req.query;
        const resultado = await obtenerVentasPorMesService(meses);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const obtenerTopProductosMasVendidosController = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        const resultado = await obtenerTopProductosMasVendidosService(fechaInicio, fechaFin);
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
    obtenerVentasHoyComparacionController,
    obtenerReservasMesComparacionController,
    obtenerBalanceAnualController,
    obtenerPorcentajeMediosPagoController,
    obtenerVentasPorMesController,
    obtenerTopProductosMasVendidosController  
};