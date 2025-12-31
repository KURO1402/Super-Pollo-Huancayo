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
  validarVerificacionCorreo,
  seleccionarUsuarioCorreoModel
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
  if (!correoValidado || correoValidado.estado_verificacion == 0) {
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

  return {
    usuario: nuevoUsuario,
    accessToken,
    refreshToken
  };
};

const registrarVerificacionCorreoService = async (datos) => {
  if (!datos || typeof datos !== 'object') {
    throw crearError('Se necesitan datos(correo) para generar el codigo de verificación.', 400);
  }
  const { correo } = datos;

  if (!correo || typeof correo !== 'string' || !correo.trim()) {
    throw crearError('Se necesita el correo', 400);
  };

  if (!validarCorreo(correo)) {
    throw crearError('Formato de correo no valido', 400);
  };

  const correosCoincidentes = await seleccionarTotalUsuarioPorCorreoModel(correo);
  if (correosCoincidentes > 0) {
    throw crearError('Ya existe un usuario registrado con el correo ingresado.', 409);
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  const resultado = await registrarVerificacionCorreoModel(correo, codigo);
  if (resultado.affectedRows === 0) {
    throw crearError('No se pudo verificar el correo', 500);
  }
  const info = await enviarCorreoVerificacion(correo, codigo)

  return {
    ok: true,
    mensaje: `Código de verificación enviado correctamente a ${info.accepted[0]}.`
  };
};

const validarCodigoCorreoService = async (datos) => {
  if (!datos, typeof datos !== 'object') {
    throw crearError('Se necesita el codigo y correo para verificar el codigo', 400);
  };

  const { correo, codigo } = datos;

  if (!correo || typeof correo !== 'string' || !correo.trim()) {
    throw crearError('Se necesita el correo', 400)
  }

  if (!codigo || typeof codigo !== 'string' || !codigo.trim() || codigo.length !== 6) {
    throw crearError('Se necesita el codigo de 6 digitos', 400);
  }
  const fechaActual = new Date();

  const resultado = await validarCodigoCorreoModel(correo, codigo, fechaActual);

  if (!resultado) {
    throw crearError('Ocurrrio un error al verificar el correo', 500);
  }

  switch (resultado?.status) {
    case 1:
      return {
        ok: true,
        mensaje: resultado?.mensaje
      }

    case 2:
      throw crearError(resultado?.mensaje, 404);

    case 3:
      throw crearError(resultado?.mensaje, 409);

    case 4:
      throw crearError(resultado?.mensaje, 410);

    default:
      throw crearError('Estado desconocido', 500);
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

  const resultado = await seleccionarUsuarioCorreoModel(email);

  if (resultado.length === 0) {
    throw crearError('Correo o contraseña incorrectos. Por favor, verifica e intenta de nuevo.', 401);
  }

  const usuario = resultado[0];
  const contraseñaValida = await bcrypt.compare(clave, usuario.clave_usuario);

  if (!contraseñaValida) {
    throw crearError('Correo o contraseña incorrectos. Por favor, verifica e intenta de nuevo.', 401);
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
      idUsuario: usuario.id_usuario,
      nombresUsuario: usuario.nombre_usuario,
      apellidosUsuario: usuario.apellido_usuario,
      idRol: usuario.id_rol,
      rol: usuario.nombre_rol
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  return nuevoAccessToken;
};

module.exports = {
  registroUsuarioService,
  registrarVerificacionCorreoService,
  validarCodigoCorreoService,
  iniciarSesionUsuarioService,
  renovarAccessTokenService
}