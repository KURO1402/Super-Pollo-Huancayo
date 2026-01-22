const {
    agregarProductoService
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