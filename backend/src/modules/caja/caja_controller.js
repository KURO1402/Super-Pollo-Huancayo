const {
  crearCajaService,
  registrarIngresoCajaService,
  registrarEgresoCajaService,
  registrarArqueoCajaService,
  cerrarCajaService,
  obtenerCajasService,
  obtenerMovimientosPorCajaService,
  obtenerArqueosPorCajaService
} = require('./caja_service');

const crearCajaController = async (req, res) => {
  try {
    const { id_usuario } = req.usuario;
    const resultado = await crearCajaService(req.body, id_usuario);
    return res.status(201).json(resultado);
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
    return res.status(200).json(resultado);
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
    return res.status(200).json(resultado);
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
    return res.status(200).json(resultado);
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
    return res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || 'Error interno del servidor'
    })
  }
};

const obtenerCajasController = async (req, res) => {
  try {

    const resultado = await obtenerCajasService(req.query);

    return res.status(200).json(resultado);

  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || 'Error interno del servidor'
    })
  }
};

const obtenerMovimientosPorCajaController = async (req, res) => {
  try {
    const { idCaja } = req.params;
    const querys = req.query;
    const resultado = await obtenerMovimientosPorCajaService(idCaja, querys);
    return res.status(200).json(resultado);
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
    const arqueos = await obtenerArqueosPorCajaService(idCaja, req.query);
    return res.status(200).json(arqueos);
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
  obtenerCajasController,
  obtenerMovimientosPorCajaController,
  obtenerArqueosPorCajaController
}