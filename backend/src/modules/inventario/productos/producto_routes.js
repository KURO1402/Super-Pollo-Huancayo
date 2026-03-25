const express = require('express');
const router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../../middlewares/autenticacion_middleware');
const verificarImagen = require('../../../middlewares/verificar_imagen_middleware');

const { 
    agregarProductoController,
    actualizarDatosProductoController,
    agregarCantidadInsumoProductoController,
    actualizarCantidadInsumoProductoController,
    eliminarCantidadInsumoProductoController,
    deshabilitarProductoController,
    habilitarProductoController,
    insertarImagenProductoController,
    actualizarImagenProductoController,
    eliminarImagenProductoController,
    obtenerProductosCatalogoController,
    obtenerProductosGestionController,
    obtenerProductosDeshabilitadosController,
    obtenerProductoIdController,
    obtenerImagenesPorProductoController,
    obtenerImagenesProductosController,
    obtenerInsumosPorProductoController
 } = require('./producto_controller');

router.post('/agregar-producto', autenticacionToken, verificarRoles(2, 3), verificarImagen, agregarProductoController);
router.patch('/actualizar-producto/:idProducto', autenticacionToken, verificarRoles(2, 3), actualizarDatosProductoController);
router.post('/agregar-cantidad-insumo/:idProducto', autenticacionToken, verificarRoles(2, 3), agregarCantidadInsumoProductoController);
router.patch('/actualizar-cantidad-insumo/:idProducto', autenticacionToken, verificarRoles(2, 3), actualizarCantidadInsumoProductoController);
router.delete('/eliminar-cantidad-insumo/:idProducto', autenticacionToken, verificarRoles(2,3), eliminarCantidadInsumoProductoController);
router.patch('/deshabilitar-producto/:idProducto', autenticacionToken, verificarRoles(2,3), deshabilitarProductoController);
router.patch('/habilitar-producto/:idProducto',autenticacionToken, verificarRoles(2,3), habilitarProductoController);
router.post('/agregar-imagen/:idProducto', autenticacionToken, verificarRoles(2, 3), verificarImagen, insertarImagenProductoController);
router.put('/actualizar-imagen/:idImagen', autenticacionToken, verificarRoles(2, 3), verificarImagen, actualizarImagenProductoController);
router.delete('/eliminar-imagen/:idImagen', autenticacionToken, verificarRoles(2, 3), eliminarImagenProductoController);
router.get('/catalogo', obtenerProductosCatalogoController);
router.get('/', autenticacionToken, verificarRoles(2, 3), obtenerProductosGestionController);
router.get('/producto/:idProducto', autenticacionToken, verificarRoles(2, 3), obtenerProductoIdController);
router.get('/deshabilitados', autenticacionToken, verificarRoles(2, 3), obtenerProductosDeshabilitadosController);
router.get('/imagenes', autenticacionToken, verificarRoles(2, 3), obtenerImagenesProductosController);
router.get('/imagenes/:idProducto', autenticacionToken, verificarRoles(2, 3), obtenerImagenesPorProductoController);
router.get('/insumos/:idProducto', autenticacionToken, verificarRoles(2, 3), obtenerInsumosPorProductoController);


module.exports = router;