const {
    insertarMedioPagoService,
    actualizarMedioPagoService,
    eliminarMedioPagoService,
    listarMediosPagoService,
    obtenerMedioPagoPorIdService  
} = require('./medios_pago_service');

const insertarMedioPagoController = async (req, res) => {
    try {
        const resultado = await insertarMedioPagoService(req.body);
        return res.status(201).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const actualizarMedioPagoController = async (req, res) => {
    try {
        const { idMedioPago } = req.params;
        const resultado = await actualizarMedioPagoService(req.body, idMedioPago);

        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const eliminarMedioPagoController = async (req, res) => {
    try {
        const { idMedioPago } = req.params;

        const resultado = await eliminarMedioPagoService(idMedioPago);

        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const listarMediosPagoController = async (req, res) => {
    try {
        const resultado = await listarMediosPagoService();
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const obtenerMedioPagoPorIdController = async (req, res) => {
    try {
        const { idMedioPago } = req.params;

        const resultado = await obtenerMedioPagoPorIdService(idMedioPago);
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
    insertarMedioPagoController,
    actualizarMedioPagoController,
    eliminarMedioPagoController,
    listarMediosPagoController,
    obtenerMedioPagoPorIdController
};
