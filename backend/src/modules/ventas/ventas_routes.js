const express = require('express');
const router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');
const {
    generarVentaController,
    anularVentaController,
    obtenerVentasController,
    obtenerDetalleVentaPorIdVentaController,
    obtenerComprobantePorIdVentaController,
    reenvirarComprobanteController
} = require('./ventas_controller');

router.post('/generar-venta', autenticacionToken, verificarRoles(2, 3), generarVentaController);
router.delete('/anular-venta/:idVenta', autenticacionToken, verificarRoles(2, 3), anularVentaController);
router.get('/', autenticacionToken, verificarRoles(2, 3), obtenerVentasController);
router.get('/detalle-venta/:idVenta', autenticacionToken, verificarRoles(2, 3), obtenerDetalleVentaPorIdVentaController);
router.get('/comprobante-venta/:idVenta', autenticacionToken, verificarRoles(2, 3), obtenerComprobantePorIdVentaController);
router.post('/reenviar-comprobante/:idComprobante', autenticacionToken, verificarRoles(2, 3), reenvirarComprobanteController);

module.exports = router;