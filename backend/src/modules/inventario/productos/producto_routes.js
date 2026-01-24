const express = require('express');
const router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../../middlewares/autenticacion_middleware');
const verificarImagen = require('../../../middlewares/verificar_imagen_middleware');

const { 
    agregarProductoController,
    actualizarDatosProductoController
 } = require('./producto_controller');

router.post('/agregar-producto', autenticacionToken, verificarRoles(2, 3), verificarImagen, agregarProductoController);
router.patch('/actualizar-producto/:idProducto', autenticacionToken, verificarRoles(2, 3), actualizarDatosProductoController);

module.exports = router;