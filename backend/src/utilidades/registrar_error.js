const { ejecutarSP } = require('./helpers/db_helper');

const registrarError = async (err, req) => {
    try {
        const endpoint = `${req.method} ${req.originalUrl}`;
        const statusCode = err.status || 500;
        const mensajeError = err.detalle || err.message;
        const idUsuario = req.usuario?.id_usuario || null;
        const requestData = JSON.stringify({
            params: req.params,
            query: req.query,
            body: req.body
        });

        await ejecutarSP('sp_registrar_error', [endpoint, statusCode, mensajeError, idUsuario, requestData]);
    } catch (errorInterno) {

    }
};

module.exports = registrarError;