const {
    agregarProductoService,
    actualizarDatosProductoService,
    agregarCantidadInsumoProductoService,
    actualizarCantidadInsumoProductoService,
    eliminarCantidadInsumoProductoService,
    deshabilitarProductoService,
    habilitarProductoService,
    insertarImagenProductoService,
    actualizarImagenProductoService,
    eliminarImagenProductoService,
    obtenerProductosCatalogoService,
    obtenerProductosGestionService,
    obtenerProductosDeshabilitadosService,
    obtenerProductoIdService,
    obtenerImagenesPorProductoService,
    obtenerImagenesProductosService,
    obtenerInsumosPorProductoService
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
};

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

const insertarImagenProductoController = async (req, res) => {
    try {
        const {idProducto} = req.params;

        const file = req.file;
        
        const resultado = await insertarImagenProductoService(idProducto, file);

        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const actualizarImagenProductoController = async (req, res) => {
    try {
        const {idImagen} = req.params;

        const file = req.file;

        const resultado = await actualizarImagenProductoService(idImagen, file);

        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const eliminarImagenProductoController = async (req, res) => {
    try {
        const {idImagen} = req.params;

        const resultado = await eliminarImagenProductoService(idImagen);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const obtenerProductosCatalogoController = async (req, res) => {
    try {
        const {categoria} = req.query;

        const resultado = await obtenerProductosCatalogoService(categoria);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const obtenerProductosGestionController = async (req, res) => {
    try {

        const resultado = await obtenerProductosGestionService(req.query);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const obtenerProductosDeshabilitadosController = async (req, res) => {
    try {
        const resultado = await obtenerProductosDeshabilitadosService(req.query);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const obtenerProductoIdController = async (req, res) => {
    try {
        const {idProducto} = req.params;
        const resultado = await obtenerProductoIdService(idProducto);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const obtenerImagenesPorProductoController = async (req, res) => {
    try {
        const {idProducto} = req.params;
        const resultado = await obtenerImagenesPorProductoService(idProducto);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const obtenerImagenesProductosController = async (req, res) => {
    try {
        const resultado = await obtenerImagenesProductosService(req.query);

        return res.status(200).json(resultado);

    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

const obtenerInsumosPorProductoController = async (req, res) => {
    try {
        const { idProducto } = req.params;
        
        const resultado = await obtenerInsumosPorProductoService(idProducto);
        return res.status(200).json(resultado);

    } catch (err) {
        console.log(err.message);
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
    habilitarProductoController,
    insertarImagenProductoController,
    actualizarImagenProductoController,
    eliminarImagenProductoController,
    obtenerProductosCatalogoController,
    obtenerProductosGestionController,
    obtenerProductosDeshabilitadosController,
    obtenerProductoIdController,
    obtenerImagenesPorProductoController,
    obtenerImagenesProductosController,
    obtenerInsumosPorProductoController
}