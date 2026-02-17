const {
    ocuparMesasService,
    realizarReservacionService
} = require('./reservacion_service');

const ocuparMesasController = async (req, res) => {
    try {
        const {id_usuario} = req.usuario;

        const resultado = await ocuparMesasService(req.body, id_usuario);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const realizarReservacionController = async (req, res) => {
    try {
        const {id_usuario} = req.usuario;
        const resultado = await realizarReservacionService(req.body, id_usuario);
        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
}

module.exports = {
    ocuparMesasController,
    realizarReservacionController
}