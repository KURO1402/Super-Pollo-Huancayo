const pool = require('../../config/conexion_DB');
const { ejecutarSP } = require('../../utilidades/helpers/db_helper');

const ocuparMesasRepository = async (mesas, idUsuario, fechaActual) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        await conexion.beginTransaction();

        if (Array.isArray(mesas)) {
            for (const mesa of mesas) {
                await conexion.execute(
                    'CALL sp_bloquear_mesa(?, ?, ?)',
                    [mesa.idMesa, idUsuario, fechaActual]
                );
            }
        }

        await conexion.commit();
        return 'Mesas ocupadas exitosamente';

    } catch (err) {
        if (conexion) await conexion.rollback();
        console.log(err.message);
        const errorControlado = new Error('Error al procesar el grupo de mesas. No se realizaron cambios.');
        errorControlado.detalle = err.message;
        throw errorControlado;
    } finally {
        if (conexion) conexion.release();
    }
};

const verificarMesaDisponibleRepository = async (idMesa, fechaHora, idUsuario) => {
    const rows = await ejecutarSP(
        'sp_verificar_mesa_disponible',
        [idMesa, fechaHora, idUsuario],
        'Error al verificar la disponibilidad de la mesa.'
    );
    return rows[0][0]?.conflictos;
};

const obtenerMesaPorIdRepository = async (idMesa) => {
    const rows = await ejecutarSP(
        'sp_obtener_mesa_por_id',
        [idMesa],
        'Error al consultar los datos de la mesa.'
    );
    return rows[0][0];
};

const registrarReservacionRepository = async (fecha, hora, cantidadPersonas, nombreCliente = null, idUsuario = null, mesas, fechaHoraReserva, codigoReservacion) => {
    let conexion;
    try {
        conexion = await pool.getConnection();
        await conexion.beginTransaction();

        const [result] = await conexion.execute(
            'CALL sp_insertar_reservacion(?, ?, ?, ?, ?, ?)',
            [fecha, hora, cantidadPersonas, nombreCliente, idUsuario, codigoReservacion]
        );

        const reservacion = result[0][0];

        for (const mesa of mesas) {
            await conexion.execute(
                'CALL sp_insertar_mesas_reservacion(?, ?, ?)',
                [reservacion.id_reservacion, mesa.id_mesa, fechaHoraReserva]
            );
        }

        await conexion.commit();
        return reservacion.id_reservacion;

    } catch (err) {
        if (conexion) await conexion.rollback();
        console.log(err.message);
        const errorControlado = new Error('Error al registrar la reservación.');
        errorControlado.detalle = err.message;
        throw errorControlado;
    } finally {
        if (conexion) conexion.release();
    }
};

const registrarPagoReservacionRepository = async (montoPagado, idTransaccion, idReservacion) => {
    await ejecutarSP(
        'sp_insertar_pago_reservacion',
        [montoPagado, idTransaccion, idReservacion],
        'Error al registrar el pago de la reservación.'
    );
};

const confirmarReservacionRepository = async (idReservacion) => {
    const rows = await ejecutarSP(
        'sp_confirmar_reservacion',
        [idReservacion],
        'Error al confirmar la reservación.'
    );
    return rows[0][0]?.mensaje;
};

const cancelarReservacionRepository = async (idReservacion) => {
    const rows = await ejecutarSP(
        'sp_cancelar_reservacion',
        [idReservacion],
        'Error al cancelar la reservación.'
    );
    return rows[0][0]?.mensaje;
};

const obtenerEstadoReservacionRepository = async (idReservacion) => {
    const rows = await ejecutarSP(
        'sp_obtener_estado_reservacion',
        [idReservacion],
        'Error al obtener el estado de la reservación.'
    );
    return rows[0][0]?.estado_reservacion;
};

const obtenerReservacionPorCodigoRepository = async (codigo) => {
    const rows = await ejecutarSP(
        'sp_obtener_reservacion_por_codigo',
        [codigo],
        'Error al obtener la reservación por código.'
    );
    return rows[0][0];
};

const contarReservacionPorIdRepository = async (idReservacion) => {
    const rows = await ejecutarSP(
        'sp_contar_reservacion_por_id',
        [idReservacion],
        'Error al contar la reservación por id.'
    );
    return rows[0][0]?.total;
};

const obtenerMesasPorIdReservacionRepository = async (idReservacion) => {
    const rows = await ejecutarSP(
        'sp_obtener_mesas_por_id_reservacion',
        [idReservacion],
        'Error al obtener las mesas de la reservación.'
    );
    return rows[0];
};

const listarMesasDisponibilidadRepository = async (fechaHora) => {
    const rows = await ejecutarSP(
        'sp_listar_mesas_disponibilidad',
        [fechaHora],
        'Error al listar la disponibilidad de mesas.'
    );
    return rows[0];
};

const listarReservacionesPorFechaRepository = async (fechaInicio, fechaFin) => {
    const rows = await ejecutarSP(
        'sp_listar_reservaciones_por_rango',
        [fechaInicio, fechaFin],
        'Error al listar las reservaciones por rango de fecha.'
    );
    return rows[0];
};

const listarReservacionesPorUsuarioRepository = async (idUsuario) => {
    const rows = await ejecutarSP(
        'sp_listar_reservaciones_por_usuario',
        [idUsuario],
        'Error al listar las reservaciones del usuario.'
    );
    return rows[0];
};

const obtenerReservacionPorIdRepository = async (idReservacion) => {
    const rows = await ejecutarSP(
        'sp_obtener_reservacion_por_id',
        [idReservacion],
        'Error al obtener la reservación por id.'
    );
    return rows[0][0];
};

const obtenerPagoPorReservacionRepository = async (idReservacion) => {
    const rows = await ejecutarSP(
        'sp_obtener_pago_por_reservacion',
        [idReservacion],
        'Error al obtener el pago de la reservación.'
    );
    return rows[0][0];
};

module.exports = {
    ocuparMesasRepository,
    verificarMesaDisponibleRepository,
    obtenerMesaPorIdRepository,
    registrarReservacionRepository,
    registrarPagoReservacionRepository,
    confirmarReservacionRepository,
    cancelarReservacionRepository,
    obtenerEstadoReservacionRepository,
    obtenerReservacionPorCodigoRepository,
    contarReservacionPorIdRepository,
    obtenerMesasPorIdReservacionRepository,
    listarMesasDisponibilidadRepository,
    listarReservacionesPorFechaRepository,
    listarReservacionesPorUsuarioRepository,
    obtenerReservacionPorIdRepository,
    obtenerPagoPorReservacionRepository
};