const express = require('express');
const router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');

const {
    obtenerUsuariosController,
    actualizarDatosUsuarioController
} = require('./usuario_controller');

router.get('/', autenticacionToken, verificarRoles(3), obtenerUsuariosController);
router.patch('/actualizar-usuario', autenticacionToken, actualizarDatosUsuarioController);  

module.exports = router;