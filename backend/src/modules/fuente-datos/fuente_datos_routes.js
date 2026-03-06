const express = require('express');
const router = express.Router();
const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');

const {
  obtenerResumenVentasEgresosMensualController,
  obtenerVentasHoyComparacionController
} = require('./fuente_datos_controller');

router.get('/ingresos-egresos', autenticacionToken, verificarRoles(3), obtenerResumenVentasEgresosMensualController);
router.get('/ventas-hoy', autenticacionToken, verificarRoles(3), obtenerVentasHoyComparacionController);

module.exports = router;