const crearError = require('../../utilidades/crear_error');
const { preference, payment } = require('../../config/mercado_pago');
const generarCodigoReservacion = require('../../utilidades/helpers/generar_codigo_reservacion');

const {
    ocuparMesasModel,
    verificarMesaDisponibleModel,
    obtenerMesaPorIdModel,
    registrarReservacionModel,
    registrarPagoReservacionModel,
    obtenerReservacionPorCodigoModel
} = require('./reservacion_model');

const { validarDatosReservacion } = require('./reservacion_validacion');

//  Ocupar mesas + Crear preferencia MP 
const crearPreferenciaReservacionService = async (datos, idUsuario) => {
    validarDatosReservacion(datos);

    const { fecha, hora, cantidadPersonas, mesas } = datos;
    const fechaHoraReserva = `${fecha} ${hora}`;

    // Validar límite de mesas
    const maxMesasPermitidas = Math.ceil(cantidadPersonas / 2);
    if (mesas.length > maxMesasPermitidas) {
        throw crearError(
            `Ha seleccionado demasiadas mesas para ${cantidadPersonas} personas. Máximo permitido: ${maxMesasPermitidas}.`,
            400
        );
    }

    // Verificar disponibilidad y capacidad
    let capacidadTotal = 0;
    const mesasOcupadas = [];

    for (const mesa of mesas) {
        const mesaInfo = await obtenerMesaPorIdModel(mesa.idMesa);
        if (!mesaInfo) throw crearError('Mesa seleccionada no existente', 400);

        const conflictos = await verificarMesaDisponibleModel(mesa.idMesa, fechaHoraReserva, idUsuario);
        if (conflictos > 0) mesasOcupadas.push(mesa.idMesa);

        capacidadTotal += mesaInfo.capacidad;
    }

    if (mesasOcupadas.length > 0) {
        const copiaMesas = [...mesasOcupadas];
        const ultima = copiaMesas.pop();
        const mensaje = copiaMesas.length === 0
            ? `La mesa ${ultima} está ocupada. Por favor seleccione otra mesa.`
            : `Las mesas ${copiaMesas.join(', ')} y ${ultima} están ocupadas. Por favor seleccione otras mesas.`;
        throw crearError(mensaje, 409);
    }

    if (capacidadTotal < cantidadPersonas) {
        throw crearError('Capacidad de mesas insuficiente. Seleccione más mesas.', 400);
    }

    // Bloquear mesas temporalmente
    await ocuparMesasModel(mesas, idUsuario, fechaHoraReserva);

    // Generar código único de reservación
    const codigoReservacion = generarCodigoReservacion();

    // Construir items a partir de las mesas
    const montoPorMesa = 10;
    const montoTotal = mesas.length * montoPorMesa;

    const items = mesas.map((mesa, index) => ({
        title: `Reservación Pollería - Mesa ${index + 1}`,
        quantity: 1,
        unit_price: montoPorMesa,
        currency_id: 'PEN'
    }));

    // Crear preferencia en MP
    const result = await preference.create({
        body: {
            items,
            metadata: {
                codigo_reservacion: codigoReservacion,
                fecha,
                hora,
                cantidad_personas: cantidadPersonas,
                id_usuario: idUsuario,
                mesas,
                monto_total: montoTotal
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/reservacion/resultado?status=success`,
                failure: `${process.env.FRONTEND_URL}/reservacion/resultado?status=failure`,
                pending: `${process.env.FRONTEND_URL}/reservacion/resultado?status=pending`
            },
            external_reference: codigoReservacion,
            notification_url: 'https://unfiltering-heartbrokenly-manuela.ngrok-free.dev/api/reservaciones/webhook',
            statement_descriptor: 'Polleria Super Pollo',
            expires: true,
            expiration_date_from: new Date().toISOString(),
            expiration_date_to: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        }
    });

    return {
        ok: true,
        codigoReservacion,
        sandbox_init_point: result.sandbox_init_point
    };
};

// Confirmar pago (llamado por webhook)
const confirmarPagoReservacionService = async (paymentId) => {
    const pagoMP = await payment.get({ id: paymentId });

    // Solo procesar pagos aprobados
    if (pagoMP.status !== 'approved') return;

    const codigoReservacion = pagoMP.external_reference;

    // Evitar procesar el mismo webhook dos veces
    const reservacionExistente = await obtenerReservacionPorCodigoModel(codigoReservacion);
    if (reservacionExistente) return;

    // Recuperar datos desde metadata de MP
    const { fecha, hora, cantidad_personas, id_usuario, mesas, monto_total } = pagoMP.metadata;
    const fechaHoraReserva = `${fecha} ${hora}:00`;
    const montoPagado = pagoMP.transaction_amount;

    // Registrar reservación en BD
    const idReservacion = await registrarReservacionModel(
        fecha,
        hora,
        cantidad_personas,
        id_usuario,
        mesas,
        fechaHoraReserva,
        codigoReservacion
    );

    // Registrar pago en BD
    await registrarPagoReservacionModel(
        monto_total,
        montoPagado,
        Math.round((montoPagado / monto_total) * 100),
        String(paymentId),
        idReservacion
    );
};

module.exports = {
    crearPreferenciaReservacionService,
    confirmarPagoReservacionService
};