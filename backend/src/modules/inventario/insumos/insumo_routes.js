const express = require('express');
const router = express.Router();
const { autenticacionToken, verificarRoles } = require('../../../middlewares/autenticacion_middleware');
const {
    insertarInsumoController,
    actualizarDatosInsumoController,
    eliminarInsumoController,
    obtenerInsumosController, 
    obtenerInsumosPaginacionController,
    obtenerInsumoIDController
} = require('./insumo_controller');

router.post('/agregar-insumo', autenticacionToken, verificarRoles(2, 3), insertarInsumoController);
router.patch('/actualizar-insumo/:idInsumo', autenticacionToken, verificarRoles(2, 3), actualizarDatosInsumoController);
router.delete('/eliminar-insumo/:idInsumo', autenticacionToken, verificarRoles(2, 3), eliminarInsumoController);
router.get('/', autenticacionToken, verificarRoles(2, 3), obtenerInsumosController);
router.get('/paginacion', autenticacionToken, verificarRoles(2, 3), obtenerInsumosPaginacionController);
router.get('/insumo/:idInsumo', autenticacionToken, verificarRoles(2, 3), obtenerInsumoIDController);

module.exports = router;