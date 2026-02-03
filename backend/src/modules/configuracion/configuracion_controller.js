const {
    insertarCategoriaProductoService,
    actualizarCategoriaProductoService,
    eliminarCategoriaProductoService,
    listarCategoriasProductoService,
    obtenerCategoriaProductoPorIdService  
} = require('./configuracion_service');

const insertarCategoriaProductoController = async (req, res) => {
    try {
        const resultado = await insertarCategoriaProductoService(req.body);
        return res.status(201).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        })
    }
};

const actualizarCategoriaProductoController = async (req, res) => {
    try {
        const {idCategoria} = req.params;
        const resultado = await actualizarCategoriaProductoService(req.body, idCategoria);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const eliminarCategoriaProductoController = async (req, res) => {
    try {
        const { idCategoria } = req.params;

        const resultado = await eliminarCategoriaProductoService(idCategoria);

        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const listarCategoriasProductoController = async (req, res) => {
    try {
        const resultado = await listarCategoriasProductoService();
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const obtenerCategoriaProductoPorIdController = async (req, res) => {
    try {
        const { idCategoria } = req.params;

        const resultado = await obtenerCategoriaProductoPorIdService(idCategoria);
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
    insertarCategoriaProductoController,
    actualizarCategoriaProductoController,
    eliminarCategoriaProductoController,
    listarCategoriasProductoController,
    obtenerCategoriaProductoPorIdController
}