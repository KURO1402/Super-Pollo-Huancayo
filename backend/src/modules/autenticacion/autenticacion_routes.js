const express = require('express');
const router = express.Router();
const verificarClienteMovil = require('../../middlewares/verificar_cliente_movil');

const { 
    registroUsuarioController,
    registrarVerificacionCorreoController,
    validarCodigoCorreoController,
    iniciarSesionUsuarioController,
    renovarAccessTokenController,
    renovarAccessTokenMovilController,
    cerrarSesionController,
    iniciarSesionMovilController
 } = require('./autenticacion_controller');

router.post('/registro', registroUsuarioController);
router.post('/enviar-codigo-verificacion', registrarVerificacionCorreoController);
router.post('/verificar-codigo', validarCodigoCorreoController);
router.post('/login', iniciarSesionUsuarioController);
router.post('/renovar-token', renovarAccessTokenController);
router.post('/logout', cerrarSesionController);
router.post('/movil/login', verificarClienteMovil, iniciarSesionMovilController);
router.post('/movil/renovar-token', verificarClienteMovil, renovarAccessTokenMovilController);

module.exports = router;