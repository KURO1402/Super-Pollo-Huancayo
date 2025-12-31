const crear_error = require('../../utilidades/crear_error');
const { 
    obtenerUsuariosModel,
    contarUsuarioPorIdModel,
    actualizarDatosUsuarioModel 
} = require('./usuario_model');
const { validarActualizarUsuario } = require('./usuario_validacion');

const obtenerUsuariosService = async (limit, offset, idUsuario) => {
    const limite = parseInt(limit) || 10;
    const desplazamiento = parseInt(offset) || 0;

    const usuarios = await obtenerUsuariosModel(limite, desplazamiento, idUsuario);

    if(!usuarios || usuarios.length === 0){
        throw crear_error('No se encontraron usuarios', 404);
    }
    
    return {
        ok: true,
        usuarios
    }
};

const actualizarDatosUsuarioService = async (datos, idUsuario) => {
    const idUsuarioNumerico = Number(idUsuario)
    validarActualizarUsuario(datos, idUsuarioNumerico);
    const {telefonoUsuario} = datos;
    if(!telefonoUsuario || typeof telefonoUsuario !== 'string' || !telefonoUsuario.trim()){
        datos.telefonoUsuario = null;
    }

    const totalUsuarios = await contarUsuarioPorIdModel(idUsuarioNumerico);

    if (totalUsuarios === 0) {
        throw crear_error('El usuario especificado no existe', 404);
    }
    const respuesta = await actualizarDatosUsuarioModel(datos, idUsuarioNumerico);
    return {
        ok: true,
        mensaje: respuesta
    }
};

module.exports = {
    obtenerUsuariosService,
    actualizarDatosUsuarioService
}