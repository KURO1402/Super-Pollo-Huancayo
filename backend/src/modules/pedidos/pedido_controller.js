const {
    obtenerMesasPedidoService,
    insertarPedidoService,
    listarPedidosService,
    obtenerPedidoCompletoService,
    obtenerPedidoActivoMesaService,
    editarPedidoService,
    cancelarPedidoService,
    completarPedidoService,
} = require('./pedidos_service');

const obtenerMesasPedidoController = async (req, res) => {
    try {
        const { fecha, hora } = req.query;

        const resultado = await obtenerMesasPedidoService(fecha, hora);

        res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const insertarPedidoController = async (req, res) => {
    try {
        const resultado = await insertarPedidoService(req.body);
        res.status(201).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const listarPedidosController = async (req, res) => {
    try {
        const { fecha, hora } = req.query;
        const resultado = await listarPedidosService(fecha, hora);
        res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const obtenerPedidoCompletoController = async (req, res) => {
    try {
        const { idPedido } = req.params;
        const resultado = await obtenerPedidoCompletoService(idPedido);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const obtenerPedidoActivoMesaController = async (req, res) => {
    try {
        const { idMesa } = req.params;
        const resultado = await obtenerPedidoActivoMesaService(idMesa);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const editarPedidoController = async (req, res) => {
    try {
        const { idPedido } = req.params;
        const resultado = await editarPedidoService(idPedido, req.body);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const cancelarPedidoController = async (req, res) => {
    try {
        const { idPedido } = req.params;
        const resultado = await cancelarPedidoService(idPedido);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const completarPedidoController = async (req, res) => {
    try {
        const { idPedido } = req.params;
        const resultado = await completarPedidoService(idPedido);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const obtenerPedidoCompletoC = async (req, res) => {
    try {
        const { idPedido } = req.params;
        const resultado = await completarPedidoService(idPedido);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

module.exports = {
    obtenerMesasPedidoController,
    insertarPedidoController,
    listarPedidosController,
    obtenerPedidoCompletoController,
    obtenerPedidoActivoMesaController,
    editarPedidoController,
    cancelarPedidoController,
    completarPedidoController
};