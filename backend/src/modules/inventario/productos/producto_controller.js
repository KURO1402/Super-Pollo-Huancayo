const {
    agregarProductoService
} = require('./producto_service');

const agregarProductoController = async (req, res) => {
    try {
        console.log(req.body)
        console.log(JSON.parse(req.body.datos))
        const resultado = await agregarProductoService(req.body);
        return res.status(200).json(resultado);
    } catch (err) {
        console.log(err.message)
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
}

module.exports = {
    agregarProductoController
}