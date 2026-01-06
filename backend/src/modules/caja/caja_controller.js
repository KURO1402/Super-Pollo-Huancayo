const { 
    crearCajaService 
} = require('./caja_service');

const crearCajaController = async (req, res) => {
  try {
    const { id_usuario }= req.usuario
    const resultado = await crearCajaService(req.body, id_usuario);
    res.status(200).json(resultado);
  } catch (err) {
    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || 'Error interno del servidor',
    });
  }
};

module.exports = {
    crearCajaController
}