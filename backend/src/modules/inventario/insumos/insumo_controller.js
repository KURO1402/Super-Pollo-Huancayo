const {
    insertarInsumoService,
    actualizarDatosInsumoService,
    eliminarInsumoService,
    obtenerInsumosService,
    obtenerInsumoIDService,
    registrarEntradaStockService,
    registrarSalidaStockService,
    obtenerMovimientosStockService
} = require('./insumo_service');

const insertarInsumoController = async (req, res) => {
    try {

        const {id_usuario} = req.usuario;

        const resultado = await insertarInsumoService(req.body, id_usuario);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const actualizarDatosInsumoController = async (req, res) => {
    try {
        const {idInsumo} = req.params;
        const resultado = await actualizarDatosInsumoService(idInsumo, req.body);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const eliminarInsumoController = async (req, res) => {
    try {
        const { idInsumo } = req.params;

        const resultado = await eliminarInsumoService(Number(idInsumo));

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};


const obtenerInsumosController = async (req, res) => {
    try {
        const { limit, offset, insumo, nivelStock } = req.query;
        const resultado = await obtenerInsumosService(limit, offset, insumo, nivelStock);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const obtenerInsumoIDController = async (req, res) => {
    try {
        const { idInsumo } = req.params;
        const resultado = await obtenerInsumoIDService(idInsumo);
        console.log(resultado);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const registrarEntradaStockController = async (req, res) => {
    try {
        const { id_usuario } = req.usuario;
        const resultado = await registrarEntradaStockService(req.body, id_usuario);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const registrarSalidaStockController = async (req, res) => {
    try {
        const { id_usuario } = req.usuario;
        const resultado = await registrarSalidaStockService(req.body, id_usuario);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const obtenerMovimientosStockController = async (req, res) => {
    try {
        const resultado = await obtenerMovimientosStockService(req.query);

        return res.status(200).json(resultado);

    } catch (err) {
        console.log(err.message)
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};



module.exports = {
    insertarInsumoController,
    actualizarDatosInsumoController,
    eliminarInsumoController,
    obtenerInsumosController,
    obtenerInsumoIDController,
    registrarEntradaStockController,
    registrarSalidaStockController,
    obtenerMovimientosStockController
}