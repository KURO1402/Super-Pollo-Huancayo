const express = require('express');
const router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');

const {
    obtenerMesasPedidoController,
    insertarPedidoController,
    listarPedidosController,
    obtenerPedidoCompletoController,
    editarPedidoController,
    cancelarPedidoController,
    completarPedidoController
} = require('./pedido_controller');

router.get('/mesas', autenticacionToken, verificarRoles(2, 3), obtenerMesasPedidoController);
router.get('/', autenticacionToken, verificarRoles(2, 3), listarPedidosController);
router.post('/crear-pedido', autenticacionToken, verificarRoles(2, 3), insertarPedidoController);
router.get('/pedido/:idPedido', autenticacionToken, verificarRoles(2, 3), obtenerPedidoCompletoController);
router.put('/pedido/:idPedido', autenticacionToken, verificarRoles(2, 3), editarPedidoController);
router.patch('/pedido/:idPedido/cancelar', autenticacionToken, verificarRoles(2, 3), cancelarPedidoController);
router.post('/pedido/:idPedido/completar', autenticacionToken, verificarRoles(2, 3), completarPedidoController);

module.exports = router;