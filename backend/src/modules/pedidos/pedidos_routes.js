const express = require('express');
const router = express.Router();

const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');

const {
  obtenerMesasPedidoController,
  insertarPedidoController,
  listarPedidosController,
  obtenerPedidoCompletoController
} = require('./pedido_controller');

router.get('/mesas', autenticacionToken, verificarRoles(2, 3), obtenerMesasPedidoController);
router.get('/', autenticacionToken, verificarRoles(2, 3), listarPedidosController);
router.post('/crear-pedido', autenticacionToken, verificarRoles(2,3), insertarPedidoController);
router.get('/pedido/:idPedido', obtenerPedidoCompletoController);

module.exports = router;