const express = require('express');
const router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');

const {
    obtenerRolesController,
    obtenerUsuariosController,
    obtenerUsuarioPorIdController,
    buscarUsuariosPorValorController,
    actualizarDatosUsuarioController,
    actualizarCorreoUsuarioController,
    actualizarClaveUsuarioController,
    eliminarUsuarioController,
    actualizarRolUsuarioController
} = require('./usuario_controller');

router.get('/', autenticacionToken, verificarRoles(3), obtenerUsuariosController);
router.get('/usuario', autenticacionToken, obtenerUsuarioPorIdController);
router.get('/buscar-usuario', autenticacionToken, verificarRoles(3), buscarUsuariosPorValorController);
router.patch('/actualizar-usuario', autenticacionToken, actualizarDatosUsuarioController);  
router.patch('/actualizar-correo', autenticacionToken, actualizarCorreoUsuarioController);
router.patch('/actualizar-clave', autenticacionToken, actualizarClaveUsuarioController);
router.delete('/eliminar-usuario/:idUsuario', autenticacionToken, verificarRoles(3), eliminarUsuarioController);
router.get('/roles', autenticacionToken, verificarRoles(3), obtenerRolesController);
router.patch('/actualizar-rol/:idUsuario', autenticacionToken, verificarRoles(3), actualizarRolUsuarioController);

module.exports = router;