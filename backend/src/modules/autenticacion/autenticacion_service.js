require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crear_error = require('../../utilidades/crear_error');
const { validarCorreo } = require('../../utilidades/validaciones');
const {
  registroUsuarioModel,
  seleccionarUsuarioPorCorreoModel,
  registrarVerificacionCorreoModel,
  validarCodigoCorreoModel,
  validarVerificacionCorreo
} = require('./autenticacion_model');
const { validarRegistroUsuario } = require('./autenticacion_validacion');
const enviarCorreoVerificacion = require('../../utilidades/helpers/enviar_codigo_correo');

const registroUsuarioService = async (datos) => {
  validarRegistroUsuario(datos);

  const { nombreUsuario, apellidoUsuario, correoUsuario, claveUsuario, telefonoUsuario } = datos;

  let telefono;
  if (telefonoUsuario == undefined || !telefonoUsuario) {
    telefono = null;
  } else {
    telefono = telefonoUsuario;
  }
  const correoValidado = await validarVerificacionCorreo(correoUsuario);
  if(!correoValidado || correoValidado.estado_verificacion == 0 ){
    throw crear_error('Verificación pendiente: Primero valide su correo.', 403);
  }
  const coincidenciasCorreo = await seleccionarUsuarioPorCorreoModel(correoUsuario);
  if (coincidenciasCorreo > 0) {
    throw crear_error('Correo electrónico ya en uso, ingrese otro correo.', 409);
  }

  const claveEncriptada = await bcrypt.hash(claveUsuario, 10);

  const nuevoUsuario = await registroUsuarioModel(nombreUsuario, apellidoUsuario, correoUsuario, claveEncriptada, telefono);

  const accessToken = jwt.sign(
    nuevoUsuario,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
  );

  const refreshToken = jwt.sign(
    nuevoUsuario,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '20h' }
  );

  return {
    usuario: nuevoUsuario,
    accessToken,
    refreshToken
  };
};

const registrarVerificacionCorreoService = async (datos) => {
  if (!datos || typeof datos !== 'object') {
    throw crear_error('Se necesitan datos(correo) para generar el codigo de verificación.', 400);
  }
  const { correo } = datos;

  if (!correo || typeof correo !== 'string' || !correo.trim()) {
    throw crear_error('Se necesita el correo', 400);
  };

  if (!validarCorreo(correo)) {
    throw crear_error('Formato de correo no valido', 400);
  };

  const correosCoincidentes = await seleccionarUsuarioPorCorreoModel(correo);
  if (correosCoincidentes > 0) {
    throw crear_error('Ya existe un usuario registrado con el correo ingresado.', 409);
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  const resultado = await registrarVerificacionCorreoModel(correo, codigo);
  if (resultado.affectedRows === 0) {
    throw crear_error('No se pudo verificar el correo', 500);
  }
  const info = await enviarCorreoVerificacion(correo, codigo)

  return {
    ok: true,
    mensaje: `Código de verificación enviado correctamente a ${info.accepted[0]}.`
  };
};

const validarCodigoCorreoService = async (datos) => {
  if (!datos, typeof datos !== 'object') {
    throw crear_error('Se necesita el codigo y correo para verificar el codigo', 400);
  };

  const { correo, codigo } = datos;

  if (!correo || typeof correo !== 'string' || !correo.trim()) {
    throw crear_error('Se necesita el correo', 400)
  }

  if (!codigo || typeof codigo !== 'string' || !codigo.trim() || codigo.length !== 6) {
    throw crear_error('Se necesita el codigo de 6 digitos', 400);
  }
  const fechaActual = new Date();

  const resultado = await validarCodigoCorreoModel(correo, codigo, fechaActual);

  if (!resultado) {
    throw crear_error('Ocurrrio un error al verificar el correo', 500);
  }

  switch (resultado?.status) {
    case 1:
      return {
        ok: true,
        mensaje: resultado?.mensaje
      }

    case 2:
      throw crear_error(resultado?.mensaje, 404);

    case 3:
      throw crear_error(resultado?.mensaje, 409);

    case 4:
      throw crear_error(resultado?.mensaje, 410);

    default:
      throw crear_error('Estado desconocido', 500);
  }

};

module.exports = {
  registroUsuarioService,
  registrarVerificacionCorreoService,
  validarCodigoCorreoService
}