const express = require('express');
const router = express.Router();

const { 
    registroUsuarioController,
    registrarVerificacionCorreoController,
    validarCodigoCorreoController,
    iniciarSesionUsuarioController,
    renovarAccessTokenController
 } = require('./autenticacion_controller');

router.post('/registro', registroUsuarioController);
router.post('/enviar-codigo-verificacion', registrarVerificacionCorreoController);
router.post('/verificar-codigo', validarCodigoCorreoController);
router.post('/login', iniciarSesionUsuarioController);
router.post('/renovar-token', renovarAccessTokenController);

module.exports = router;