require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crear_error = require('../../utilidades/crear_error');
const { 
    registroUsuarioModel,
    seleccionarUsuarioPorCorreoModel
 } = require('./autenticacion_model');
const { validarRegistroUsuario } = require('./autenticacion_validacion')

const registroUsuarioService = async (datos) => {
    validarRegistroUsuario(datos);

    const { nombreUsuario, apellidoUsuario, correoUsuario, claveUsuario, telefonoUsuario } = datos;
    
    let telefono;
    if (telefonoUsuario == undefined || !telefonoUsuario) {
        telefono = null;
    } else {
        telefono = telefonoUsuario;
    }

    const coincidenciasCorreo = await seleccionarUsuarioPorCorreoModel(correoUsuario);  
    if(coincidenciasCorreo > 0){
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


}

module.exports = {
    registroUsuarioService
}