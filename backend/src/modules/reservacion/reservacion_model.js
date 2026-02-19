const pool = require('../../config/conexion_DB');

const ocuparMesasModel = async (mesas, idUsuario, fechaActual) => {
    let conexion;
    try {
        conexion = await pool.getConnection();

        await conexion.beginTransaction();

        if (Array.isArray(mesas)) {
            for (const mesa of mesas) {
                await conexion.execute('CALL sp_bloquear_mesa(?, ?, ?)', [mesa.idMesa, idUsuario, fechaActual]
                );
            }
        }

        await conexion.commit();

        return 'Mesas ocupadas exitosamente';

    } catch (err) {
        if (conexion) await conexion.rollback();
        console.error("Error en el modelo:", err.message);
        throw new Error('Error al procesar el grupo de mesas. No se realizaron cambios.');
    } finally {
        if (conexion) conexion.release();
    }
};

const verificarMesaDisponibleModel = async (idMesa, fechaHora, idUsuario) => {
    let conexion;

    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_verificar_mesa_disponible(?, ?, ?)',[idMesa, fechaHora, idUsuario]);
        return result[0][0]?.conflictos;

    } catch (err) {
        console.log(err.message)
        throw new Error('Error al verificar disponibilidad de la mesa');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerMesaPorIdModel = async (idMesa) => {
    let conexion;

    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute('CALL sp_obtener_mesa_por_id(?)', [idMesa]);

        return result[0][0];

    } catch (err) {
        console.error('Error en obtenerMesaPorIdModel:', err.message);
        
        throw new Error('Error al consultar los datos de la mesa en la base de datos');
    } finally {
        if (conexion) conexion.release();
    }
};

const registrarReservacionModel = async (fecha, hora, cantidadPersonas, idUsuario, mesas, fechaHoraReserva, codigoReservacion) =>{
    let conexion;

    try {
        conexion = await pool.getConnection();
        await conexion.beginTransaction();

        const [result] = await conexion.execute(
            'CALL sp_insertar_reservacion(?, ?, ?, ?, ?)',
            [fecha, hora, cantidadPersonas, idUsuario, codigoReservacion] // ← agregado
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

    } catch (error) {
        console.log(error.message)
        if (conexion) await conexion.rollback();
        throw new Error('Error al registrar la reservación');
    } finally {
        if (conexion) conexion.release();
    }
};

const registrarPagoReservacionModel = async (montoTotal, montoPagado, porcentajePago, idTransaccion, idReservacion) => {
    let conexion;

    try {
        conexion = await pool.getConnection();

        await conexion.execute(
            'CALL sp_insertar_pago_reservacion(?, ?, ?, ?, ?)',
            [montoTotal, montoPagado, porcentajePago, idTransaccion, idReservacion]
        );

    } catch (err) {
        throw new Error('Error al registrar el pago de la reservación');
    } finally {
        if (conexion) conexion.release();
    }
};

const obtenerReservacionPorCodigoModel = async (codigo) => {
    let conexion;

    try {
        conexion = await pool.getConnection();

        const [result] = await conexion.execute(
            'CALL sp_obtener_reservacion_por_codigo(?)',
            [codigo]
        );

        return result[0][0];

    } catch (err) {
        throw new Error('Error al buscar la reservación por código');
    } finally {
        if (conexion) conexion.release();
    }
};

module.exports = {
    ocuparMesasModel,
    verificarMesaDisponibleModel,
    obtenerMesaPorIdModel,
    registrarReservacionModel,
    registrarPagoReservacionModel,
    obtenerReservacionPorCodigoModel
}