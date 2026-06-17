const express = require('express');
const router = express.Router();
const {consultarChatbot} = require('./ai_controller');

const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');

router.post('/chat', consultarChatbot);

module.exports = router;