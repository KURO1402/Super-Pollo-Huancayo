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
} = require('./pedido_controller');

router.get('/mesas', autenticacionToken, verificarRoles(2, 3), obtenerMesasPedidoController);
router.get('/', autenticacionToken, verificarRoles(2, 3), listarPedidosController);
router.post('/crear-pedido', autenticacionToken, verificarRoles(2, 3), insertarPedidoController);
router.get('/pedido/:idPedido', autenticacionToken, verificarRoles(2, 3), obtenerPedidoCompletoController);
router.put('/pedido/:idPedido', autenticacionToken, verificarRoles(2, 3), editarPedidoController);
router.patch('/pedido/:idPedido/cancelar', autenticacionToken, verificarRoles(2, 3), cancelarPedidoController);

module.exports = router;