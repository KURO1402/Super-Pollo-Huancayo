const express = require('express');
const router = express.Router();
const { autenticacionToken } = require('../../middlewares/autenticacion_middleware');
const {
    crearPreferenciaReservacionController,
    webhookReservacionController
} = require('./reservacion_controller');

router.post('/crear-preferencia', autenticacionToken, crearPreferenciaReservacionController);
router.post('/webhook', webhookReservacionController);

module.exports = router;