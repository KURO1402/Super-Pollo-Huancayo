const {
    obtenerUsuariosService
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

module.exports = {
    obtenerUsuariosController
}