require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crearError = require('../../utilidades/crear_error');
const { validarCorreo } = require('../../utilidades/validaciones');
const {
  registroUsuarioModel,
  seleccionarTotalUsuarioPorCorreoModel,
  registrarVerificacionCorreoModel,
  validarCodigoCorreoModel,
  validarVerificacionModel,
  seleccionarUsuarioCorreoModel,
  eliminarVerificacionModel
} = require('./autenticacion_model');
const { actualizarClaveUsuarioModel } = require('../usuarios/usuario_model');
const { validarRegistroUsuario } = require('./autenticacion_validacion');
const enviarCorreoVerificacion = require('../../utilidades/helpers/enviar_codigo_correo');
const limpiarCachePorPrefijo = require('../../utilidades/limpiar_cache');

const registroUsuarioService = async (datos) => {
  validarRegistroUsuario(datos);

  const { nombreUsuario, apellidoUsuario, correoUsuario, claveUsuario, telefonoUsuario } = datos;

  let telefono;
  if (telefonoUsuario == undefined || !telefonoUsuario) {
    telefono = null;
  } else {
    telefono = telefonoUsuario;
  }
  const correoValidado = await validarVerificacionModel(correoUsuario, "registro");
  if (!correoValidado || correoValidado.verificado == 0) {
    throw crearError('Verificación pendiente: Primero valide su correo.', 403);
  }
  const coincidenciasCorreo = await seleccionarTotalUsuarioPorCorreoModel(correoUsuario);
  if (coincidenciasCorreo > 0) {
    throw crearError('Correo electrónico ya en uso, ingrese otro correo.', 409);
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
  limpiarCachePorPrefijo('usuarios:');
  return {
    usuario: nuevoUsuario,
    accessToken,
    refreshToken
  };
};

const registrarVerificacionCorreoService = async (datos) => {
  if (!datos || typeof datos !== 'object') {
    throw crearError('Se necesitan datos para generar el código de verificación.', 400);
  }

  const { correo, tipoVerificacion } = datos;

  if (!correo || typeof correo !== 'string' || !correo.trim()) {
    throw crearError('Se necesita el correo.', 400);
  }

  if (!validarCorreo(correo)) {
    throw crearError('Formato de correo no válido.', 400);
  }

  if (!tipoVerificacion || typeof tipoVerificacion !== 'number' || (tipoVerificacion !== 1 && tipoVerificacion !== 2)) {
    throw crearError('Tipo de verificación no válido. Debe ser 1 (registro) o 2 (recuperación).', 400);
  }

  const tipoTexto = tipoVerificacion === 1 ? 'registro' : 'recuperacion_password';

  if (tipoTexto === 'registro') {
    const correosCoincidentes = await seleccionarTotalUsuarioPorCorreoModel(correo);
    if (correosCoincidentes > 0) {
      throw crearError('Ya existe un usuario registrado con el correo ingresado.', 409);
    }
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  await registrarVerificacionCorreoModel(correo, codigo, tipoTexto);

  const info = await enviarCorreoVerificacion(correo, codigo);

  return {
    ok: true,
    mensaje: `Código de verificación enviado correctamente a ${correo}.`,
    emailId: info.id
  };
};

const validarCodigoCorreoService = async (datos) => {
  if (!datos || typeof datos !== 'object') {
    throw crearError('Se necesitan los datos para verificar el código.', 400);
  }

  const { correo, codigo, tipoVerificacion } = datos;

  if (!correo || typeof correo !== 'string' || !correo.trim()) {
    throw crearError('Se necesita el correo.', 400);
  }

  if (!codigo || typeof codigo !== 'string' || !codigo.trim() || codigo.length !== 6) {
    throw crearError('Se necesita el código de 6 dígitos.', 400);
  }

  if (!tipoVerificacion || (tipoVerificacion !== 1 && tipoVerificacion !== 2)) {
    throw crearError('Tipo de verificación no válido. Debe ser 1 (registro) o 2 (recuperación).', 400);
  }

  const tipoTexto = tipoVerificacion === 1 ? 'registro' : 'recuperacion_password';

  const fechaActual = new Date();
  const resultado = await validarCodigoCorreoModel(correo, codigo, tipoTexto, fechaActual);

  if (!resultado) {
    throw crearError('Ocurrió un error al verificar el correo.', 500);
  }

  switch (resultado?.status) {
    case 1:
      return {
        ok: true,
        mensaje: resultado?.mensaje
      };

    case 2:
      throw crearError(resultado?.mensaje, 404);

    case 3:
      throw crearError(resultado?.mensaje, 409);

    case 4:
      throw crearError(resultado?.mensaje, 410);

    default:
      throw crearError('Estado desconocido.', 500);
  }
};

const iniciarSesionUsuarioService = async (datos) => {
  if (!datos || typeof datos !== 'object') {
    throw crearError('Se necesita correo y contraseña para iniciar sesion', 400);
  }
  const { email, clave } = datos;

  if (!email || typeof email != 'string' || !email.trim()) {
    throw crearError('Se necesita el email o correo para iniciar sesion');
  }

  if (!clave || typeof clave != 'string' || !clave.trim()) {
    throw crearError('Se necesita la clave para iniciar sesión');
  }

  const usuario = await seleccionarUsuarioCorreoModel(email);

  if (!usuario) {
    throw crearError('Correo o contraseña incorrecto', 401);
  }
  const contraseñaValida = await bcrypt.compare(clave, usuario.clave_usuario);

  if (!contraseñaValida) {
    throw crearError('Correo o contraseña incorrecto', 401);
  }

  const payload = {
    id_usuario: usuario.id_usuario,
    nombre_usuario: usuario.nombre_usuario,
    apellido_usuario: usuario.apellido_usuario,
    id_rol: usuario.id_rol,
    nombre_rol: usuario.nombre_rol
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '20h' }
  );

  return {
    usuario: payload,
    accessToken,
    refreshToken
  };
};

const renovarAccessTokenService = async (refreshToken) => {

  const usuario = await new Promise((resolve, reject) => {

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) reject(err);
      else resolve(decoded);
    });
  });

  const nuevoAccessToken = jwt.sign(
    {
      id_usuario: usuario.id_usuario,
      nombre_usuario: usuario.nombre_usuario,
      apellido_usuario: usuario.apellido_usuario,
      id_rol: usuario.id_rol,
      nombre_rol: usuario.nombre_rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  return nuevoAccessToken;
};

const iniciarSesionMovilService = async (datos) => {
  if (!datos || typeof datos !== 'object') {
    throw crearError('Se necesita correo y contraseña para iniciar sesion', 400);
  }
  const { email, clave } = datos;

  if (!email || typeof email != 'string' || !email.trim()) {
    throw crearError('Se necesita el email para iniciar sesion', 400);
  }

  if (!clave || typeof clave != 'string' || !clave.trim()) {
    throw crearError('Se necesita la clave para iniciar sesión', 400);
  }

  const usuario = await seleccionarUsuarioCorreoModel(email);

  if (!usuario) {
    throw crearError('Correo o contraseña incorrecto', 401);
  }
  const contraseñaValida = await bcrypt.compare(clave, usuario.clave_usuario);

  if (!contraseñaValida) {
    throw crearError('Correo o contraseña incorrecto', 401);
  }

  const payload = {
    id_usuario: usuario.id_usuario,
    nombre_usuario: usuario.nombre_usuario,
    apellido_usuario: usuario.apellido_usuario,
    id_rol: usuario.id_rol,
    nombre_rol: usuario.nombre_rol
  };

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' }
  );

  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_MOBILE_REFRESH_EXPIRATION || '30d' }
  );

  return {
    usuario: payload,
    accessToken,
    refreshToken
  };
};

const restaurarClaveUsuarioService = async (datos) => {
  if (!datos || typeof datos !== 'object') {
    throw crearError('Se necesita el correo del usuario para cambiar contraseña', 400);
  }
  const { correoUsuario, nuevaClave } = datos;

  if (!correoUsuario || typeof correoUsuario !== 'string' || !correoUsuario.trim()) {
    throw crearError('Se necesita el correo.', 400);
  }

  if (!validarCorreo(correoUsuario)) {
    throw crearError('Formato de correo no válido.', 400);
  }

  if (!nuevaClave || typeof nuevaClave !== 'string' || !nuevaClave.trim()) {
    throw crearError('La nueva clave es obligatoria.', 400);
  }
  if (nuevaClave.length < 8) {
    throw crearError('La nueva clave debe tener al menos 8 caracteres.', 400);
  }

  const validacion = await validarVerificacionModel(correoUsuario, "recuperacion_password");
  console.log(validacion);
  if (!validacion || validacion.verificado !== 1) {
    throw crearError('Revise su correo y verifique el código primero.', 403);
  }
  const nuevaClaveEncriptada = await bcrypt.hash(nuevaClave, 10);
  const usuario = await seleccionarUsuarioCorreoModel(correoUsuario);
  const resultado = actualizarClaveUsuarioModel(usuario.id_usuario, nuevaClaveEncriptada);
  await eliminarVerificacionModel(validacion.id_verificacion);
  return {
    ok: true,
    mensaje: "Contraseña actualizada con éxito. Ya puede iniciar sesion con su nueva contraseña."
  };

}

module.exports = {
  registroUsuarioService,
  registrarVerificacionCorreoService,
  validarCodigoCorreoService,
  iniciarSesionUsuarioService,
  renovarAccessTokenService,
  iniciarSesionMovilService,
  restaurarClaveUsuarioService
}