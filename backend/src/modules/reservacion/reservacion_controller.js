const {
    ocuparMesasService
} = require('./reservacion_service');

const ocuparMesasController = async (req, res) => {
    try {

        const resultado = await ocuparMesasService(req.body);

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
    ocuparMesasController
}