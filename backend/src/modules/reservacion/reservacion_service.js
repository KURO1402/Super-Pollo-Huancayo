const crearError = require('../../utilidades/crear_error');
const { preference, payment } = require('../../config/mercado_pago');
const generarCodigoReservacion = require('../../utilidades/helpers/generar_codigo_reservacion');
const { validarCorreo } = require('../../utilidades/validaciones');
const enviarCorreoReservacion = require('../../utilidades/helpers/enviar_reservacion_correo');
const { obtenerUsuarioPorIdModel } = require('../usuarios/usuario_model');

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

    const maxMesasPermitidas = Math.ceil(cantidadPersonas / 2);
    if (mesas.length > maxMesasPermitidas) {
        throw crearError(
            `Ha seleccionado demasiadas mesas para ${cantidadPersonas} personas. Máximo permitido: ${maxMesasPermitidas}.`,
            400
        );
    }

    // Obtener correo del usuario
    const usuario = await obtenerUsuarioPorIdModel(idUsuario);
    if (!usuario) throw crearError('Usuario no encontrado', 404);
    const correo = usuario.correo_usuario;

    let capacidadTotal = 0;
    const mesasOcupadas = [];
    const mesasConInfo = [];

    for (const mesa of mesas) {
        const mesaInfo = await obtenerMesaPorIdModel(mesa.idMesa);
        if (!mesaInfo) throw crearError('Mesa seleccionada no existente', 400);

        const conflictos = await verificarMesaDisponibleModel(mesa.idMesa, fechaHoraReserva, idUsuario);
        if (conflictos > 0) mesasOcupadas.push(mesa.idMesa);

        capacidadTotal += mesaInfo.capacidad;
        mesasConInfo.push({ idMesa: mesa.idMesa, numeroMesa: mesaInfo.numero_mesa });
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

    await ocuparMesasModel(mesas, idUsuario, fechaHoraReserva);

    const codigoReservacion = generarCodigoReservacion();
    const montoPorMesa = 10;
    const montoTotal = mesas.length * montoPorMesa;

    const items = mesasConInfo.map((mesa, index) => ({
        title: `Reservación Pollería - Mesa ${mesa.numeroMesa}`,  // ← ahora usa numeroMesa real
        quantity: 1,
        unit_price: montoPorMesa,
        currency_id: 'PEN'
    }));

    const result = await preference.create({
        body: {
            items,
            metadata: {
                codigo_reservacion: codigoReservacion,
                fecha,
                hora,
                cantidad_personas: cantidadPersonas,
                id_usuario: idUsuario,
                correo,
                mesas: mesasConInfo,
                monto_total: montoTotal
            },
            back_urls: {
                success: `${process.env.FRONTEND_URL}/reservacion/resultado?status=success`,
                failure: `${process.env.FRONTEND_URL}/reservacion/resultado?status=failure`,
                pending: `${process.env.FRONTEND_URL}/reservacion/resultado?status=pending`
            },
            external_reference: codigoReservacion,
            notification_url: `${process.env.BACKEND_URL}/api/reservaciones/webhook`,
            statement_descriptor: 'Polleria Super Pollo',
            expires: true,
            expiration_date_from: new Date().toISOString(),
            expiration_date_to: new Date(Date.now() + 10 * 60 * 1000).toISOString()
        }
    });

    return {
        ok: true,
        mensaje: 'Mesas ocupadas exitosamente. Tiene 5 min para efectuar el pago',
        sandbox_init_point: result.sandbox_init_point
    };
};

const confirmarPagoReservacionService = async (paymentId) => {
    const pagoMP = await payment.get({ id: paymentId });

    if (pagoMP.status !== 'approved') return;

    const codigoReservacion = pagoMP.external_reference;

    const reservacionExistente = await obtenerReservacionPorCodigoModel(codigoReservacion);
    if (reservacionExistente) return;

    const { fecha, hora, cantidad_personas, id_usuario, correo, mesas, monto_total } = pagoMP.metadata;
    const fechaHoraReserva = `${fecha} ${hora}:00`;
    const montoPagado = pagoMP.transaction_amount;

    const idReservacion = await registrarReservacionModel(fecha, hora, cantidad_personas, id_usuario, mesas, fechaHoraReserva, codigoReservacion);

    await registrarPagoReservacionModel(monto_total, montoPagado, Math.round((montoPagado / monto_total) * 100), String(paymentId), idReservacion);

    await enviarCorreoReservacion({ correo, codigoReservacion, fecha, hora, cantidadPersonas: cantidad_personas, mesas });
};

const registrarReservacionManualService = async (datos) => {
    validarDatosReservacion(datos);

    const { fecha, hora, cantidadPersonas, mesas, correo } = datos;

    if (!correo || typeof correo !== 'string' || !validarCorreo(correo)) {
        throw crearError('Se necesita un correo para enviar el codigo de reservacion.', 400);
    }

    const fechaHoraReserva = `${fecha} ${hora}`;

    const maxMesasPermitidas = Math.ceil(cantidadPersonas / 2);
    if (mesas.length > maxMesasPermitidas) {
        throw crearError(
            `Ha seleccionado demasiadas mesas para ${cantidadPersonas} personas. Máximo permitido: ${maxMesasPermitidas}.`,
            400
        );
    }

    let capacidadTotal = 0;
    const mesasOcupadas = [];
    const mesasConInfo = []; 

    for (const mesa of mesas) {
        const mesaInfo = await obtenerMesaPorIdModel(mesa.idMesa);
        if (!mesaInfo) throw crearError('Mesa seleccionada no existente', 400);

        const conflictos = await verificarMesaDisponibleModel(mesa.idMesa, fechaHoraReserva, null);
        if (conflictos > 0) mesasOcupadas.push(mesa.idMesa);

        capacidadTotal += mesaInfo.capacidad;
        mesasConInfo.push({ idMesa: mesa.idMesa, numeroMesa: mesaInfo.numero_mesa });
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

    const codigoReservacion = generarCodigoReservacion();

    await registrarReservacionModel(fecha, hora, cantidadPersonas, null, mesas, fechaHoraReserva, codigoReservacion);

    const info = await enviarCorreoReservacion({ correo, codigoReservacion, fecha, hora, cantidadPersonas, mesasConInfo });

    return {
        ok: true,
        mensaje: `Reservación registrada exitosamente y código de reserva enviado a ${info.accepted[0]}`
    };
};

module.exports = {
    crearPreferenciaReservacionService,
    confirmarPagoReservacionService,
    registrarReservacionManualService
};