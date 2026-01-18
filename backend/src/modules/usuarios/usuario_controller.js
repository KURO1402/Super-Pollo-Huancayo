const {
    obtenerRolesService,
    obtenerUsuariosService,
    obtenerUsuarioPorIdService,
    actualizarDatosUsuarioService,
    actualizarCorreoUsuarioService,
    actualizarClaveUsuarioService,
    eliminarUsuarioService,
    actualizarRolUsuarioService
} = require('./usuario_service');

const obtenerRolesController = async (req, res) => {
    try {
        const respuesta = await obtenerRolesService();
        return res.status(200).json(respuesta);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const obtenerUsuariosController = async (req, res) => {
    try {
        const { limit, offset, rol, valor} = req.query;
        const { id_usuario } = req.usuario;

        const resultado = await obtenerUsuariosService(limit, offset, id_usuario, rol, valor);

        return res.status(200).json(resultado);
        
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const obtenerUsuarioPorIdController = async (req, res) => {
    try {
        const { id_usuario } = req.usuario;

        const usuario = await obtenerUsuarioPorIdService(id_usuario);

        return res.status(200).json(usuario);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const buscarUsuariosPorValorController = async (req, res) => {
    try {
        const { valor } = req.query;
        const {id_usuario} = req.usuario;
        const usuarios = await buscarUsuariosPorValorService(valor, id_usuario);

        return res.status(200).json(usuarios);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || "Error interno del servidor"
        });
    }
};

const actualizarDatosUsuarioController = async (req, res) => {
    try {
        const {id_usuario} = req.usuario;
        const respuesta = await actualizarDatosUsuarioService(req.body, id_usuario);
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
        const { id_usuario } = req.usuario; 
        const respuesta = await actualizarCorreoUsuarioService(req.body, id_usuario);

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
        const { id_usuario } = req.usuario; 
        const respuesta = await actualizarClaveUsuarioService(req.body, id_usuario);

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

const actualizarRolUsuarioController = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const {id_usuario} = req.usuario;

        const respuesta = await actualizarRolUsuarioService(req.body, idUsuario, id_usuario);

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
    obtenerRolesController,
    obtenerUsuariosController,
    obtenerUsuarioPorIdController,
    actualizarDatosUsuarioController,
    actualizarCorreoUsuarioController,
    actualizarClaveUsuarioController,
    eliminarUsuarioController,
    actualizarRolUsuarioController
}