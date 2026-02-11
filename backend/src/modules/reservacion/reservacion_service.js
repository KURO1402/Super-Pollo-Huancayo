const crearError = require('../../utilidades/crear_error');

const {
    obtenerEstadoMesaModel,
    contarMesasPorNumeroModel,
    ocuparMesasModel,
} = require('./reservacion_model');

const ocuparMesasService = async (datos) => {
    if (!datos || typeof datos !== 'object') {
        throw crearError('Se necesita seleccionar una mesa al menos.', 400);
    }

    const { mesas } = datos;

    if (!mesas || !Array.isArray(mesas) || mesas.length === 0) {
        throw crearError('Se necesita seleccionar una mesa al menos.', 400);
    }

    const mesasOcupadas = [];

    for (const mesa of mesas) {
        if (!mesa || typeof mesa !== 'object' || typeof mesa.numeroMesa !== 'number' || mesa.numeroMesa <= 0) {
            throw crearError('Se necesita que cada mesa tenga su numero de mesa', 400);
        }
        const mesaExistente = await contarMesasPorNumeroModel(mesa.numeroMesa);
        if(!mesaExistente | mesaExistente === 0) {
            throw crearError(`Mesa ${mesa.numeroMesa} no existente.`, 404)
        }

        const estadoMesa = await obtenerEstadoMesaModel(mesa.numeroMesa);

        if (estadoMesa === 'ocupada') {
            mesasOcupadas.push(mesa.numeroMesa);
        }
    }

    if (mesasOcupadas.length > 0) {
        let mensajeMesas = '';
        if (mesasOcupadas.length === 1) {
            mensajeMesas = `La mesa ${mesasOcupadas[0]} está ocupada. Por favor seleccione otra mesa.`;
        } else {
            const ultimaMesa = mesasOcupadas.pop();
            mensajeMesas = `Las mesas ${mesasOcupadas.join(', ')} y ${ultimaMesa} están ocupadas. Por favor seleccione otras mesas.`;
        }
        throw crearError(mensajeMesas, 400);
    }

    const fechaActual = new Date();

    const resultado = await ocuparMesasModel(mesas, 5, fechaActual);

    return {
        ok: true,
        mensaje: resultado
    }
}

module.exports = {
    ocuparMesasService
}