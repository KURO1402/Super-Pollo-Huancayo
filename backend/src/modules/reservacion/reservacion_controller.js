const {
    crearPreferenciaReservacionService,
    confirmarPagoReservacionService,
    registrarReservacionManualService,
    obtenerReservacionPorCodigoService,
    confirmarReservacionService,
    cancelarReservacionService,
    listarMesasDisponibilidadService,
    listarReservacionesPorFechaService,
    listarReservacionesPorUsuarioService,
    obtenerReservacionPorIdService,
    obtenerPagoPorReservacionService
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

const registrarReservacionManualController = async (req, res) => {
    try {
        const resultado = await registrarReservacionManualService(req.body);
        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const obtenerReservacionPorCodigoController = async (req, res) => {
    try {
        const { codigo } = req.params;
        const resultado = await obtenerReservacionPorCodigoService(codigo);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const confirmarReservacionController = async (req, res) => {
    try {
        const { idReservacion } = req.params;
        const resultado = await confirmarReservacionService(Number(idReservacion));
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const cancelarReservacionController = async (req, res) => {
    try {
        const { idReservacion } = req.params;
        const resultado = await cancelarReservacionService(Number(idReservacion));
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const listarMesasDisponibilidadController = async (req, res) => {
    try {
        const { fecha, hora } = req.query;
        const resultado = await listarMesasDisponibilidadService(fecha, hora);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const listarReservacionesPorFechaController = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        const resultado = await listarReservacionesPorFechaService(fecha_inicio, fecha_fin);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const listarReservacionesPorUsuarioController = async (req, res) => {
    try {
        const { id_usuario } = req.usuario;
        const resultado = await listarReservacionesPorUsuarioService(id_usuario);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const obtenerReservacionPorIdController = async (req, res) => {
    try {
        const { id_reservacion } = req.params;
        const { id_usuario, id_rol } = req.usuario;
        const resultado = await obtenerReservacionPorIdService(id_reservacion, id_usuario, id_rol);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const obtenerPagoPorReservacionController = async (req, res) => {
    try {
        const { id_reservacion } = req.params;
        const { id_usuario, id_rol } = req.usuario;
        const resultado = await obtenerPagoPorReservacionService(id_reservacion, id_usuario, id_rol);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

module.exports = {
    crearPreferenciaReservacionController,
    webhookReservacionController,
    registrarReservacionManualController,
    obtenerReservacionPorCodigoController,
    confirmarReservacionController,
    cancelarReservacionController,
    listarMesasDisponibilidadController,
    listarReservacionesPorFechaController,
    listarReservacionesPorUsuarioController,
    obtenerReservacionPorIdController,
    obtenerPagoPorReservacionController
};