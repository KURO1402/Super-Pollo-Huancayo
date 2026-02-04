const express = require('express');
router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');
const {
    insertarCategoriaProductoController,
    actualizarCategoriaProductoController,
    eliminarCategoriaProductoController,
    listarCategoriasProductoController,
    obtenerCategoriaProductoPorIdController,
    insertarTipoDocumentoController,
    actualizarTipoDocumentoController
} = require('./configuracion_controller');

router.post('/categorias/agregar', autenticacionToken, verificarRoles(2, 3), insertarCategoriaProductoController);
router.put('/categorias/actualizar/:idCategoria', autenticacionToken, verificarRoles(2, 3), actualizarCategoriaProductoController);
router.delete('/categorias/eliminar/:idCategoria', autenticacionToken, verificarRoles(2, 3), eliminarCategoriaProductoController);
router.get('/categorias', listarCategoriasProductoController);
router.get('/categorias/:idCategoria', autenticacionToken, verificarRoles(2, 3), obtenerCategoriaProductoPorIdController);
//tipos de documento
router.post('/tipos-documentos/agregar', autenticacionToken, verificarRoles(2, 3), insertarTipoDocumentoController);
router.put('/tipos-documentos/actualizar/:idTipoDocumento', autenticacionToken, verificarRoles(2, 3), actualizarTipoDocumentoController);

module.exports = router;