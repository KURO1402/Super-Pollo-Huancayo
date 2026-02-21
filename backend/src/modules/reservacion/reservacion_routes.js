const express = require('express');
const router = express.Router();
const { autenticacionToken, verificarRoles } = require('../../middlewares/autenticacion_middleware');
const {
    crearPreferenciaReservacionController,
    webhookReservacionController,
    registrarReservacionManualController,
    obtenerReservacionPorCodigoController,
    confirmarReservacionController,
    cancelarReservacionController,
    listarMesasDisponibilidadController,
    listarReservacionesPorFechaController,
    listarReservacionesPorUsuarioController,
    obtenerReservacionPorIdController,
    obtenerPagoPorReservacionController
} = require('./reservacion_controller');

router.post('/crear-reserva', autenticacionToken, crearPreferenciaReservacionController);
router.post('/webhook', webhookReservacionController);
router.post('/reserva-manual', autenticacionToken, verificarRoles(2, 3), registrarReservacionManualController);
router.get('/reservacion-codigo/:codigo', autenticacionToken, verificarRoles(2,3), obtenerReservacionPorCodigoController);
router.patch('/confirmar-reservacion/:idReservacion', autenticacionToken, verificarRoles(2,3), confirmarReservacionController);
router.patch('/cancelar-reservacion/:idReservacion', autenticacionToken, verificarRoles(2, 3), cancelarReservacionController);
router.get('/mesas',listarMesasDisponibilidadController);
router.get('/calendario', autenticacionToken, verificarRoles(2, 3), listarReservacionesPorFechaController);
router.get('/mis-reservaciones', autenticacionToken, listarReservacionesPorUsuarioController);
router.get('/:id_reservacion', autenticacionToken, obtenerReservacionPorIdController);
router.get('/:id_reservacion/pago', autenticacionToken, obtenerPagoPorReservacionController);

module.exports = router;