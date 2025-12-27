require('dotenv').config();
const {
  registroUsuarioService,
  registrarVerificacionCorreoService,
  validarCodigoCorreoService
} = require("./autenticacion_service");

const registroUsuarioController = async (req, res) => {
  try {

    const { usuario, accessToken, refreshToken } = await registroUsuarioService(req.body);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Strict",
      maxAge: 20 * 60 * 60 * 1000
    };

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(201).json({
      ok: true,
      mensaje: "Usuario registrado exitosamente",
      usuario,
      accessToken
    });

  } catch (err) {

    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const registrarVerificacionCorreoController = async (req, res) => {
  try {

    const resultado = await registrarVerificacionCorreoService(req.body);
    return res.status(200).json(resultado);

  } catch (err) {

    const statusCode = err.status || 500;

    return res.status(statusCode).json({
      ok: false,
      mensaje: err.message || "Error interno del servidor",
    });
  }
};

const validarCodigoCorreoController = async (req, res) => {
  try {

    const resultado = await validarCodigoCorreoService(req.body);
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
  registroUsuarioController,
  registrarVerificacionCorreoController,
  validarCodigoCorreoController
}