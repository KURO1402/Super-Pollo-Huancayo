const express = require('express');
router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');

const {
    insertarCategoriaProductoController,
    actualizarCategoriaProductoController,
    eliminarCategoriaProductoController,
    listarCategoriasProductoController,
    obtenerCategoriaProductoPorIdController
} = require('./categorias_producto/categorias_producto_controller');

const {
    insertarTipoDocumentoController,
    actualizarTipoDocumentoController,
    eliminarTipoDocumentoController,
    listarTiposDocumentoController,
    obtenerTipoDocumentoPorIdController
} = require('./tipos_documento/tipos_documento_controller');

const {
    insertarMedioPagoController,
    actualizarMedioPagoController,
    eliminarMedioPagoController,
    listarMediosPagoController,
    obtenerMedioPagoPorIdController
} = require('./medios_pago/medios_pago_controller');

const {
    insertarTipoComprobanteController,
    actualizarTipoComprobanteController,
    eliminarTipoComprobanteController,
    listarTiposComprobanteController
} = require('./tipos_comprobante/tipos_comprobante_controller');

//Rutas para categorias de productos
router.post('/categorias-producto/agregar', autenticacionToken, verificarRoles(2, 3), insertarCategoriaProductoController);
router.put('/categorias-producto/actualizar/:idCategoria', autenticacionToken, verificarRoles(2, 3), actualizarCategoriaProductoController);
router.delete('/categorias-producto/eliminar/:idCategoria', autenticacionToken, verificarRoles(2, 3), eliminarCategoriaProductoController);
router.get('/categorias-producto', listarCategoriasProductoController);
router.get('/categorias-producto/:idCategoria', autenticacionToken, verificarRoles(2, 3), obtenerCategoriaProductoPorIdController);

//Rutas para tipos de documento
router.post('/tipos-documento/agregar', autenticacionToken, verificarRoles(2, 3), insertarTipoDocumentoController);
router.put('/tipos-documento/actualizar/:idTipoDocumento', autenticacionToken, verificarRoles(2, 3), actualizarTipoDocumentoController);
router.delete('/tipos-documento/eliminar/:idTipoDocumento', autenticacionToken, verificarRoles(2, 3), eliminarTipoDocumentoController);
router.get('/tipos-documento', autenticacionToken, verificarRoles(2, 3), listarTiposDocumentoController);
router.get('/tipos-documento/:idTipoDocumento', autenticacionToken, verificarRoles(2, 3), obtenerTipoDocumentoPorIdController);

//Rutas para medios de pago
router.post('/medios-pago/agregar', autenticacionToken, verificarRoles(2, 3), insertarMedioPagoController);
router.put('/medios-pago/actualizar/:idMedioPago', autenticacionToken, verificarRoles(2, 3), actualizarMedioPagoController);
router.delete('/medios-pago/eliminar/:idMedioPago', autenticacionToken, verificarRoles(2, 3), eliminarMedioPagoController);
router.get('/medios-pago', autenticacionToken, verificarRoles(2, 3), listarMediosPagoController);
router.get('/medios-pago/:idMedioPago', autenticacionToken, verificarRoles(2, 3), obtenerMedioPagoPorIdController);

//Rutas para tipos de comprobante
router.post('/tipos-comprobante/agregar', autenticacionToken, verificarRoles(2, 3), insertarTipoComprobanteController);
router.put('/tipos-comprobante/actualizar/:idTipoComprobante', autenticacionToken, verificarRoles(2, 3), actualizarTipoComprobanteController);
router.delete('/tipos-comprobante/eliminar/:idTipoComprobante', autenticacionToken, verificarRoles(2, 3), eliminarTipoComprobanteController);
router.get('/tipos-comprobante', autenticacionToken, verificarRoles(2, 3), listarTiposComprobanteController);

module.exports = router;