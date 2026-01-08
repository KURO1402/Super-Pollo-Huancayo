const {
  crearCajaService,
  registrarIngresoCajaService,
  registrarEgresoCajaService,
  registrarArqueoCajaService,
  cerrarCajaService,
  obtenerMovimientosCajaService,
  obtenerMovimientosPorCajaService
} = require('./caja_service');

const crearCajaController = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const resultado = await crearCajaService(req.body, id_usuario);
    res.status(201).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || 'Error interno del servidor'
    });
  }
};

const registrarIngresoCajaController = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const resultado = await registrarIngresoCajaService(req.body, id_usuario);
    res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const registrarEgresoCajaController = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const resultado = await registrarEgresoCajaService(req.body, id_usuario);
    res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const registrarArqueoCajaController = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const resultado = await registrarArqueoCajaService(req.body, id_usuario);
    res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const cerrarCajaController = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const resultado = await cerrarCajaService(id_usuario);
    res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    res.status(statusCode).json({
      ok: false,
      mensaje: err.message || 'Error interno del servidor'
    })
  }
};

const obtenerMovimientosPorCajaController = async (req, res) => {
  const { idCaja } = req.params;

  try {
    const resultado = await obtenerMovimientosPorCajaService(idCaja);
    res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const obtenerMovimientosCajaController = async (req, res) => {
  try {
    const { limit, offset} = req.query;
    const movimientos = await obtenerMovimientosCajaService(limit, offset);
    res.status(200).json(movimientos);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const obtenerArqueosCajaController = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const arqueos = await obtenerArqueosCajaService(limit, offset);
    res.status(200).json(arqueos);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const obtenerArqueosPorCajaController = async (req, res) => {
  const { idCaja } = req.params;

  try {
    const arqueos = await obtenerArqueosPorCajaService(idCaja);
    res.status(200).json(arqueos);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

module.exports = {
  crearCajaController,
  registrarIngresoCajaController,
  registrarEgresoCajaController,
  registrarArqueoCajaController,
  cerrarCajaController,
  obtenerMovimientosCajaController,
  obtenerMovimientosPorCajaController
}