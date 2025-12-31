const express = require('express');
const router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');

const {
    obtenerUsuariosController,
    actualizarDatosUsuarioController,
    actualizarCorreoUsuarioController,
    actualizarClaveUsuarioController,
    eliminarUsuarioController
} = require('./usuario_controller');

router.get('/', autenticacionToken, verificarRoles(3), obtenerUsuariosController);
router.patch('/actualizar-usuario', autenticacionToken, actualizarDatosUsuarioController);  
router.patch('/actualizar-correo', autenticacionToken, actualizarCorreoUsuarioController);
router.patch('/actualizar-clave', autenticacionToken, actualizarClaveUsuarioController);
router.delete('/eliminar-usuario/:idUsuario', autenticacionToken, verificarRoles(3), eliminarUsuarioController);

module.exports = router;