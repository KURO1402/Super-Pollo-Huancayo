const express = require('express');
router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');

const { 
    crearCajaController,
    registrarIngresoCajaController,
    registrarEgresoCajaController,
    registrarArqueoCajaController,
    cerrarCajaController,
    obtenerCajasController,
    obtenerMovimientosPorCajaController ,
    obtenerArqueosPorCajaController
} = require('./caja_controller')

router.post('/abrir-caja', autenticacionToken, verificarRoles(2, 3), crearCajaController);
router.post('/cerrar-caja', autenticacionToken, verificarRoles(2, 3), cerrarCajaController);
router.post('/registrar-ingreso', autenticacionToken, verificarRoles(2, 3), registrarIngresoCajaController);
router.post('/registrar-egreso', autenticacionToken, verificarRoles(2, 3), registrarEgresoCajaController);
router.post('/arqueo-caja', autenticacionToken, verificarRoles(2, 3), registrarArqueoCajaController);
router.get('/cajas', autenticacionToken, verificarRoles(2, 3), obtenerCajasController);
router.get('/movimientos-caja/:idCaja', autenticacionToken, verificarRoles(2, 3), obtenerMovimientosPorCajaController);
router.get('/arqueos-caja/:idCaja', autenticacionToken, verificarRoles(2, 3), obtenerArqueosPorCajaController);

module.exports = router;