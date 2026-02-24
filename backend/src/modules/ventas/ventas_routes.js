const express = require('express');
const router = express.Router();
const {
    generarVentaController
} = require('./ventas_controller')

router.post('/generar-venta', generarVentaController);

module.exports = router;