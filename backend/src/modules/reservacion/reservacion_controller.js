const {
    crearPreferenciaReservacionService,
    confirmarPagoReservacionService
} = require('./reservacion_service');

const crearPreferenciaReservacionController = async (req, res) => {
    try {
        const { id_usuario } = req.usuario;
        const resultado = await crearPreferenciaReservacionService(req.body, id_usuario);
        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const webhookReservacionController = async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type !== 'payment') return res.sendStatus(200);

        await confirmarPagoReservacionService(data.id);

        return res.sendStatus(200);

    } catch (err) {
        console.error('Error en webhook:', err.message);
        return res.sendStatus(200);
    }
};

module.exports = {
    crearPreferenciaReservacionController,
    webhookReservacionController
};