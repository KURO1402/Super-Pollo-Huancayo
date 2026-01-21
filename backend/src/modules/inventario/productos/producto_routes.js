const express = require('express');
const router = express.Router();

const upload = require('../../../config/multer_config');

const verificarImagen = require('../../../middlewares/verificar_imagen_middleware');

const { 
    agregarProductoController
 } = require('./producto_controller');

router.post('/agregar-producto', upload.none(), agregarProductoController);

module.exports = router;