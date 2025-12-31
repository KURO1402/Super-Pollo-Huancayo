const {
    obtenerUsuariosService,
    actualizarDatosUsuarioService,
    actualizarCorreoUsuarioService,
    actualizarClaveUsuarioService,
    eliminarUsuarioService
} = require('./usuario_service')

const obtenerUsuariosController = async (req, res) => {
    try {
        const { limit, offset} = req.query;
        const { idUsuario } = req.usuario;

        const resultado = await obtenerUsuariosService(limit, offset, idUsuario);

        return res.status(200).json(resultado);
        
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const actualizarDatosUsuarioController = async (req, res) => {
    try {
        const {idUsuario} = req.usuario;
        const respuesta = await actualizarDatosUsuarioService(req.body, idUsuario);
        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const actualizarCorreoUsuarioController = async (req, res) => {
    try {
        const { idUsuario } = req.usuario; 
        const respuesta = await actualizarCorreoUsuarioService(req.body, idUsuario);

        return res.status(200).json(respuesta);
    } catch (err) {

        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const actualizarClaveUsuarioController = async (req, res) => {
    try {
        const { idUsuario } = req.usuario; 
        const respuesta = await actualizarClaveUsuarioService(req.body, idUsuario);

        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const eliminarUsuarioController = async (req, res) => {
    try {
        const { idUsuario } = req.params; 
        const respuesta = await eliminarUsuarioService(idUsuario);

        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

module.exports = {
    obtenerUsuariosController,
    actualizarDatosUsuarioController,
    actualizarCorreoUsuarioController,
    actualizarClaveUsuarioController,
    eliminarUsuarioController
}