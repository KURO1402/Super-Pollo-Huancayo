const express = require('express');
const router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../../middlewares/autenticacion_middleware');
const verificarImagen = require('../../../middlewares/verificar_imagen_middleware');

const { 
    agregarProductoController,
    actualizarDatosProductoController,
    agregarCantidadInsumoProductoController,
    actualizarCantidadInsumoProductoController,
    eliminarCantidadInsumoProductoController
 } = require('./producto_controller');

router.post('/agregar-producto', autenticacionToken, verificarRoles(2, 3), verificarImagen, agregarProductoController);
router.patch('/actualizar-producto/:idProducto', autenticacionToken, verificarRoles(2, 3), actualizarDatosProductoController);
router.post('/agregar-cantidad-insumo/:idProducto', autenticacionToken, verificarRoles(2, 3), agregarCantidadInsumoProductoController);
router.patch('/actualizar-cantidad-insumo/:idProducto', autenticacionToken, verificarRoles(2, 3), actualizarCantidadInsumoProductoController);
router.delete('/eliminar-cantidad-insumo/:idProducto', autenticacionToken, verificarRoles(2,3), eliminarCantidadInsumoProductoController);

module.exports = router;