const express = require('express');
const router = express.Router();

const { registroUsuarioController } = require('./autenticacion_controller');

router.post('/registro', registroUsuarioController);

module.exports = router;