const crearError = require('../../utilidades/crear_error');

const {
    verificarMesaDisponibleModel,
    obtenerMesaPorIdModel,
    registrarReservacionModel
} = require('./reservacion_model');

const { validarDatosReservacion } = require('./reservacion_validacion');

const ocuparMesasService = async (datos, idUsuario) => {
    validarDatosReservacion(datos);

    const { mesas, fecha, hora, cantidadPersonas } = datos;

    const fechaHoraReserva = `${fecha} ${hora}`; 
    let capacidadTotal = 0;
    const mesasOcupadas = [];

    const maxMesasPermitidas = Math.ceil(cantidadPersonas / 2);
    if (mesas.length > maxMesasPermitidas) {
        throw crearError(`Ha seleccionado demasiadas mesas para ${cantidadPersonas} personas. Máximo permitido: ${maxMesasPermitidas}.`,400);
    }

    for (const mesa of mesas) {
        const mesaInfo = await obtenerMesaPorIdModel(mesa.idMesa);
        if(!mesaInfo){
            throw crearError('Mesa seleccionada no existente', 400);
        }
        const conflictos = await verificarMesaDisponibleModel(mesa.idMesa, fechaHoraReserva, idUsuario);

        if (conflictos > 0) {
            mesasOcupadas.push(mesa.idMesa);
        }
        const mesaExistente = await contarMesasPorNumeroModel(mesa.numeroMesa);
        if(!mesaExistente | mesaExistente === 0) {
            throw crearError(`Mesa ${mesa.numeroMesa} no existente.`, 404)
        }

        capacidadTotal += mesaInfo.capacidad;
    }

    if (mesasOcupadas.length > 0) {
        let mensaje;
        if (mesasOcupadas.length === 1) {
            mensaje = `La mesa ${mesasOcupadas[0]} está ocupada. Por favor seleccione otra mesa.`;
        } else {
            const ultima = mesasOcupadas.pop();
            mensaje = `Las mesas ${mesasOcupadas.join(', ')} y ${ultima} están ocupadas. Por favor seleccione otras mesas.`;
        }
        throw crearError(mensaje, 409);
    }

    if (capacidadTotal < cantidadPersonas) {
        throw crearError('Capacidad de mesas insuficiente. Seleccione más mesas.', 400);
    }

    const resultado = await ocuparMesasModel(mesas, idUsuario, fechaHoraReserva);

    return {
        ok: true,
        mensaje: resultado
    };
};

const realizarReservacionService = async (datos, idUsuario) => {
    validarDatosReservacion(datos);

    const { fecha, hora, cantidadPersonas, mesas } = datos;
    const fechaHoraReserva = `${fecha} ${hora}`; 

    let capacidadTotal = 0;
    const mesasOcupadas = [];

    const maxMesasPermitidas = Math.ceil(cantidadPersonas / 2);
    if (mesas.length > maxMesasPermitidas) {
        throw crearError(`Ha seleccionado demasiadas mesas para ${cantidadPersonas} personas. Máximo permitido: ${maxMesasPermitidas}.`,400);
    }

    for (const mesa of mesas) {
        const mesaInfo = await obtenerMesaPorIdModel(mesa.idMesa);
        if(!mesaInfo){
            throw crearError('Mesa seleccionada no existente', 400);
        }
        const conflictos = await verificarMesaDisponibleModel(mesa.idMesa, fechaHoraReserva, idUsuario);
        if (conflictos > 0) {
            mesasOcupadas.push(mesa.idMesa);
        }

        capacidadTotal += mesaInfo.capacidad;
    }

    if (mesasOcupadas.length > 0) {
        let mensaje;
        if (mesasOcupadas.length === 1) {
            mensaje = `La mesa ${mesasOcupadas[0]} está ocupada. Por favor seleccione otra mesa.`;
        } else {
            const ultima = mesasOcupadas.pop();
            mensaje = `Las mesas ${mesasOcupadas.join(', ')} y ${ultima} están ocupadas. Por favor seleccione otras mesas.`;
        }
        throw crearError(mensaje, 409);
    }

    if (capacidadTotal < cantidadPersonas) {
        throw crearError('Capacidad de mesas insuficiente. Seleccione más mesas.', 400);
    }
    const resultado = await registrarReservacionModel(fecha, hora, cantidadPersonas, idUsuario, mesas, fechaHoraReserva);

    return {
        ok: true,
        mensaje: resultado
    };
};

module.exports = {
    ocuparMesasService,
    realizarReservacionService
}