const {
    insertarTipoComprobanteService,
    actualizarTipoComprobanteService,
    eliminarTipoComprobanteService,
    listarTiposComprobanteService
} = require('./tipos_comprobate_service');

const insertarTipoComprobanteController = async (req, res) => {
    try {
        const resultado = await insertarTipoComprobanteService(req.body);
        return res.status(201).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const actualizarTipoComprobanteController = async (req, res) => {
    try {
        const { idTipoComprobante } = req.params;
        const resultado = await actualizarTipoComprobanteService(req.body, idTipoComprobante);

        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const eliminarTipoComprobanteController = async (req, res) => {
    try {
        const { idTipoComprobante } = req.params;
        const resultado = await eliminarTipoComprobanteService(idTipoComprobante);

        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const listarTiposComprobanteController = async (req, res) => {
    try {
        const resultado = await listarTiposComprobanteService();
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
    insertarTipoComprobanteController,
    actualizarTipoComprobanteController,
    eliminarTipoComprobanteController,
    listarTiposComprobanteController
};