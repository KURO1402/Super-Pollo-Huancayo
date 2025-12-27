const express = require('express');
const router = express.Router();

const { 
    registroUsuarioController,
    registrarVerificacionCorreoController,
    validarCodigoCorreoController
 } = require('./autenticacion_controller');

router.post('/registro', registroUsuarioController);
router.post('/enviar-codigo-verificacion', registrarVerificacionCorreoController);
router.post('/verificar-codigo', validarCodigoCorreoController)

module.exports = router;