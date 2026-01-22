const express = require('express');
const router = express.Router();

const verificarImagen = require('../../../middlewares/verificar_imagen_middleware');

const { 
    agregarProductoController
 } = require('./producto_controller');

router.post('/agregar-producto', verificarImagen, agregarProductoController);

module.exports = router;