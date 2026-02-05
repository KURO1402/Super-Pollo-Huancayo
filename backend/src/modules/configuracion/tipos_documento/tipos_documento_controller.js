const {
    insertarTipoDocumentoService,
    actualizarTipoDocumentoService,
    eliminarTipoDocumentoService,
    listarTiposDocumentoService,
    obtenerTipoDocumentoPorIdService  
} = require('./tipos_documento_service');

const insertarTipoDocumentoController = async (req, res) => {
    try {
        const resultado = await insertarTipoDocumentoService(req.body);
        return res.status(201).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        })
    }
};

const actualizarTipoDocumentoController = async (req, res) => {
    try {
        const { idTipoDocumento } = req.params;
        const resultado = await actualizarTipoDocumentoService(req.body, idTipoDocumento);

        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const eliminarTipoDocumentoController = async (req, res) => {
    try {
        const { idTipoDocumento } = req.params;

        const resultado = await eliminarTipoDocumentoService(idTipoDocumento);

        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const listarTiposDocumentoController = async (req, res) => {
    try {
        const resultado = await listarTiposDocumentoService();
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const obtenerTipoDocumentoPorIdController = async (req, res) => {
    try {
        const { idTipoDocumento } = req.params;

        const resultado = await obtenerTipoDocumentoPorIdService(idTipoDocumento);
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
    insertarTipoDocumentoController,
    actualizarTipoDocumentoController,
    eliminarTipoDocumentoController,
    listarTiposDocumentoController,
    obtenerTipoDocumentoPorIdController
}