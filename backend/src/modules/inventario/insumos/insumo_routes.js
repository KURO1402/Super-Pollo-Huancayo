const express = require('express');
const router = express.Router();
const { autenticacionToken, verificarRoles } = require('../../../middlewares/autenticacion_middleware');
const {
    insertarInsumoController,
    actualizarDatosInsumoController,
    eliminarInsumoController,
    obtenerInsumosController, 
    obtenerInsumosPaginacionController,
    obtenerInsumoIDController,
    obtenerInsumoNombreController,
    registrarEntradaStockController,
    registrarSalidaStockController,
    obtenerMovimientosStockController
} = require('./insumo_controller');

router.post('/agregar-insumo', autenticacionToken, verificarRoles(2, 3), insertarInsumoController);
router.patch('/actualizar-insumo/:idInsumo', autenticacionToken, verificarRoles(2, 3), actualizarDatosInsumoController);
router.delete('/eliminar-insumo/:idInsumo', autenticacionToken, verificarRoles(2, 3), eliminarInsumoController);
router.get('/', autenticacionToken, verificarRoles(2, 3), obtenerInsumosController);
router.get('/paginacion', autenticacionToken, verificarRoles(2, 3), obtenerInsumosPaginacionController);
router.get('/insumo/:idInsumo', autenticacionToken, verificarRoles(2, 3), obtenerInsumoIDController);
router.get('/buscar-insumo', autenticacionToken, verificarRoles(2, 3), obtenerInsumoNombreController);

router.post('/registrar-entrada', autenticacionToken, verificarRoles(2, 3), registrarEntradaStockController);
router.post('/registrar-salida', autenticacionToken, verificarRoles(2, 3), registrarSalidaStockController);
router.get('/movimientos-stock', autenticacionToken, verificarRoles(2, 3), obtenerMovimientosStockController);

module.exports = router;