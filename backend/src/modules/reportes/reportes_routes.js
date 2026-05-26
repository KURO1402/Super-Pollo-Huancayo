const express = require('express');
const router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');

const {
    generarReporteVentasController,
    generarReporteClientesController,
    generarReporteInventarioController,
    generarReporteCajaController,
} = require('./reportes_controller');

router.get('/ventas',     autenticacionToken, verificarRoles(3), generarReporteVentasController);
router.get('/clientes',   autenticacionToken, verificarRoles(3), generarReporteClientesController);
router.get('/inventario', autenticacionToken, verificarRoles(3), generarReporteInventarioController);
router.get('/caja',       autenticacionToken, verificarRoles(3), generarReporteCajaController);

module.exports = router;