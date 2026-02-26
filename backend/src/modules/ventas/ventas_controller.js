const { 
    generarVentaService, 
    obtenerVentasService
} = require('./ventas_service');

const generarVentaController = async (req, res) => {
    try {
        const { id_usuario } = req.usuario;
        
        const resultado = await generarVentaService(req.body, id_usuario);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

const obtenerVentasController = async (req, res) => {
    try {
        const ventas = await obtenerVentasService(req.query);
        return res.status(200).json(ventas);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor'
        });
    }
};

module.exports = {
    generarVentaController,
    obtenerVentasController
}