const express = require('express');
const router = express.Router();

const {autenticacionToken, verificarRoles} = require('../../middlewares/autenticacion_middleware');
const {
    generarVentaController,
    obtenerVentasController
} = require('./ventas_controller')

router.post('/generar-venta', autenticacionToken, verificarRoles(2, 3), generarVentaController);
router.get('/', autenticacionToken, verificarRoles(2, 3), obtenerVentasController);

module.exports = router;