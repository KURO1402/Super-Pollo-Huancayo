const express = require('express');
router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');

const { 
    crearCajaController,
    cerrarCajaController 
} = require('./caja_controller')

router.post('/abrir-caja', autenticacionToken, verificarRoles(2, 3), crearCajaController);
router.post('/cerrar-caja', autenticacionToken, verificarRoles(2, 3), cerrarCajaController);

module.exports = router;