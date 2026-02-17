const crearError = require('../../utilidades/crear_error');


const validarDatosReservacion = (datos) => {

    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        throw crearError('Se necesitan datos válidos para realizar una reservación', 400);
    }

    const { fecha, hora, cantidadPersonas, mesas } = datos;

    if (!fecha || isNaN(Date.parse(fecha))) {
        throw crearError('La fecha de reservación es obligatoria', 400);
    }

    const formatoHora = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!hora || !formatoHora.test(hora)) {
        throw crearError('La hora es obligatoria', 400);
    }

    if (!cantidadPersonas || typeof cantidadPersonas !== 'number' || cantidadPersonas <= 0) {
        throw crearError('La cantidad de personas es obligatoria', 400);
    }

    if (!mesas || !Array.isArray(mesas) || mesas.length === 0) {
        throw crearError('Debe seleccionar al menos una mesa para la reservación', 400);
    }

    const idsVistos = new Set();

    mesas.forEach((mesa) => {
        if(!mesa || typeof mesa !== 'object') {
            throw crearError('Seleccione mesas validad')
        }
        if (!mesa.idMesa || typeof mesa.idMesa !== 'number') {
            throw crearError('Seleccione mesas validas', 400);
        }

        if (idsVistos.has(mesa.idMesa)) {
            throw crearError('Se necesita seleccionar mesas diferentes si es mas de 1 mesa', 400); 
        }

        idsVistos.add(mesa.idMesa);
    });
};

module.exports = {
    validarDatosReservacion
}