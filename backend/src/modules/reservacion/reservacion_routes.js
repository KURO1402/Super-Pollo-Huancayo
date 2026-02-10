const express = require('express');
const router = express.Router();
const { autenticacionToken } = require('../../middlewares/autenticacion_middleware');
const {
    ocuparMesasController
} = require('./reservacion_controller');

router.post('/ocupar-mesa', autenticacionToken, ocuparMesasController);

module.exports = router;