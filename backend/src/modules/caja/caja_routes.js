const express = require('express');
router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');

const { crearCajaController } = require('./caja_controller')

router.post('/abrir-caja', autenticacionToken, verificarRoles(2, 3), crearCajaController);

module.exports = router;