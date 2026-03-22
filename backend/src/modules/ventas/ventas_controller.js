const {
    generarVentaService,
    anularVentaService,
    obtenerVentasService,
    obtenerDetalleVentaPorIdVentaService,
    obtenerComprobantePorIdVentaService,
    reenvirarComprobanteService
} = require('./ventas_service');

const generarVentaController = async (req, res) => {
    try {
        const { id_usuario } = req.usuario;
    
        const resultado = await generarVentaService(req.body, id_usuario);
        return res.status(200).json(resultado);
    } catch (err) {
        console.log(err.message);
        const statusCode = err.status || 500;
        return res.status(statusCode).json({ 
            ok: false,
            mensaje: err.message || 'Error interno del servidor' 
        });
    }
};

const anularVentaController = async (req, res) => {
    try {
        const { id_usuario } = req.usuario;
        const { idVenta } = req.params;
        const resultado = await anularVentaService(idVenta, id_usuario);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({ ok: false, mensaje: err.message || 'Error interno del servidor' });
    }
};

const obtenerVentasController = async (req, res) => {
    try {
        const ventas = await obtenerVentasService(req.query);
        return res.status(200).json(ventas);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({ ok: false, mensaje: err.message || 'Error interno del servidor' });
    }
};

const obtenerDetalleVentaPorIdVentaController = async (req, res) => {
    try {
        const { idVenta } = req.params;
        const resultado = await obtenerDetalleVentaPorIdVentaService(idVenta);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({ ok: false, mensaje: err.message || 'Error interno del servidor' });
    }
};

const obtenerComprobantePorIdVentaController = async (req, res) => {
    try {
        const { idVenta } = req.params;
        const resultado = await obtenerComprobantePorIdVentaService(idVenta);
        return res.status(200).json(resultado);
    } catch (err) {
        const statusCode = err.status || 500;
        return res.status(statusCode).json({ ok: false, mensaje: err.message || 'Error interno del servidor' });
    }
};

const reenvirarComprobanteController = async (req, res) => {
  try {
    const { idComprobante } = req.params;

    if (!idComprobante || isNaN(Number(idComprobante))) {
      return res.status(400).json({ 
        ok: false, 
        mensaje: 'ID de comprobante inválido' 
      });
    }

    const resultado = await reenvirarComprobanteService(Number(idComprobante));
    return res.status(200).json(resultado);

  } catch (err) {
    const statusCode = err.status || 500;
    return res.status(statusCode).json({ 
      ok: false, 
      mensaje: err.message || 'Error al reenviar comprobante' 
    });
  }
};

module.exports = {
    generarVentaController,
    anularVentaController,
    obtenerVentasController,
    obtenerDetalleVentaPorIdVentaController,
    obtenerComprobantePorIdVentaController,
    reenvirarComprobanteController
};