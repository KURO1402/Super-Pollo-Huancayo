const express = require('express');
const router = express.Router();
const { autenticacionToken } = require('../../middlewares/autenticacion_middleware');
const {
    ocuparMesasController,
    realizarReservacionController
} = require('./reservacion_controller');

router.post('/ocupar-mesa', autenticacionToken, ocuparMesasController);
router.post('/reservar-mesa', autenticacionToken, realizarReservacionController);

module.exports = router;