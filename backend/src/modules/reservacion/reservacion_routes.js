const express = require('express');
const router = express.Router();
const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');
const {
    crearPreferenciaReservacionController,
    webhookReservacionController,
    registrarReservacionManualController,
    obtenerReservacionPorCodigoController,
    confirmarReservacionController,
    cancelarReservacionController
} = require('./reservacion_controller');

router.post('/crear-reserva', autenticacionToken, crearPreferenciaReservacionController);
router.post('/webhook', webhookReservacionController);
router.post('/reserva-manual', autenticacionToken, verificarRoles(2, 3), registrarReservacionManualController);
router.get('/reservacion-codigo/:codigo', autenticacionToken, verificarRoles(2,3), obtenerReservacionPorCodigoController);
router.patch('/confirmar-reservacion/:idReservacion', autenticacionToken, verificarRoles(2,3), confirmarReservacionController);
router.patch('/cancelar-reservacion/:idReservacion', autenticacionToken, verificarRoles(2, 3), cancelarReservacionController);

module.exports = router;