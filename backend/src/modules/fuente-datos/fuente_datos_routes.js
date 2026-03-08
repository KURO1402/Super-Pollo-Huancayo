const express = require('express');
const router = express.Router();
const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');

const {
  obtenerResumenVentasEgresosMensualController,
  obtenerVentasHoyComparacionController,
  obtenerReservasMesComparacionController,
  obtenerBalanceAnualController,
  obtenerPorcentajeMediosPagoController,
  obtenerVentasPorMesController,
  obtenerTopProductosMasVendidosController
} = require('./fuente_datos_controller');

router.get('/ingresos-egresos', autenticacionToken, verificarRoles(3), obtenerResumenVentasEgresosMensualController);
router.get('/ventas-hoy', autenticacionToken, verificarRoles(3), obtenerVentasHoyComparacionController);
router.get('/cantidad-reservaciones', autenticacionToken, verificarRoles(3), obtenerReservasMesComparacionController);
router.get('/balance-anual', autenticacionToken, verificarRoles(3), obtenerBalanceAnualController);
router.get('/porcentaje-medios-pago', autenticacionToken, verificarRoles(3), obtenerPorcentajeMediosPagoController);
router.get('/ventas-mes', autenticacionToken, verificarRoles(3), obtenerVentasPorMesController);
router.get('/top-productos', autenticacionToken, verificarRoles(3), obtenerTopProductosMasVendidosController);

module.exports = router;