const {
  obtenerMesasPedidoService,
  insertarPedidoService,
  listarPedidosService,
  obtenerPedidoCompletoService
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
      mensaje: err.message || "Error interno del servidor",
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
      mensaje: err.message || "Error interno del servidor",
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
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const obtenerPedidoCompletoController = async (req, res) => {
  try {
    const {idPedido} = req.params;
    const resultado = await obtenerPedidoCompletoService(idPedido);
    return res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

module.exports = {
  obtenerMesasPedidoController,
  insertarPedidoController,
  listarPedidosController,
  obtenerPedidoCompletoController
}