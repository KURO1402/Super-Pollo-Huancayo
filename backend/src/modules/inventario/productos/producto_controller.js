const {
    agregarProductoService,
    actualizarDatosProductoService,
    agregarCantidadInsumoProductoService,
    actualizarCantidadInsumoProductoService,
    eliminarCantidadInsumoProductoService,
    deshabilitarProductoService,
    habilitarProductoService
} = require('./producto_service');

const agregarProductoController = async (req, res) => {
    try {
        if (!req.body.datos) {
            throw Object.assign(new Error('Se necesitan los datos del producto.'), { status: 400 });
        }
        let datos;
        try {
            datos = JSON.parse(req.body.datos);
        } catch (parseError) {
            throw Object.assign(new Error("Formato incorrecto de los datos del producto."), { status: 400 });
        }

        const file = req.file;

        const resultado = await agregarProductoService(datos, file);

        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
}

const actualizarDatosProductoController = async (req, res) => {
    try {
        const { idProducto } = req.params;

        const resultado = await actualizarDatosProductoService(req.body, idProducto);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const agregarCantidadInsumoProductoController = async (req, res) => {
    try {
        const { idProducto } = req.params;

        const resultado = await agregarCantidadInsumoProductoService(idProducto, req.body);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const actualizarCantidadInsumoProductoController = async (req, res) => {
    try {
        const { idProducto } = req.params;

        const resultado = await actualizarCantidadInsumoProductoService(idProducto, req.body);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const eliminarCantidadInsumoProductoController = async (req, res) => {
    try {
        const { idProducto } = req.params;

        const resultado = await eliminarCantidadInsumoProductoService(idProducto, req.body.idInsumo);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const deshabilitarProductoController = async (req, res) => {
    try {
        const { idProducto } = req.params;

        const resultado = await deshabilitarProductoService(idProducto);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const habilitarProductoController = async (req, res) => {
    try {
        const { idProducto } = req.params;

        const resultado = await habilitarProductoService(idProducto);

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
    agregarProductoController,
    actualizarDatosProductoController,
    agregarCantidadInsumoProductoController,
    actualizarCantidadInsumoProductoController, 
    eliminarCantidadInsumoProductoController,
    deshabilitarProductoController,
    habilitarProductoController
}