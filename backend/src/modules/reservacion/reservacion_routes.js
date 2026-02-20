const express = require('express');
const router = express.Router();
const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');
const {
    crearPreferenciaReservacionController,
    webhookReservacionController,
    registrarReservacionManualController
} = require('./reservacion_controller');

router.post('/crear-reserva', autenticacionToken, crearPreferenciaReservacionController);
router.post('/webhook', webhookReservacionController);
router.post('/reserva-manual', autenticacionToken, verificarRoles(2, 3), registrarReservacionManualController);

module.exports = router;