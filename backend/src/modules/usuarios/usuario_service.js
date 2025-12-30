const crear_error = require('../../utilidades/crear_error');
const { 
    obtenerUsuariosModel 
} = require('./usuario_model');

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

module.exports = {
    obtenerUsuariosService
}