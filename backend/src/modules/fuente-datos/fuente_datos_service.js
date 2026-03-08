const { 
    obtenerResumenVentasEgresosMensualModel,
    obtenerVentasHoyComparacionModel,
    obtenerReservasMesComparacionModel,
    obtenerBalanceAnualModel,
    obtenerPorcentajeMediosPagoModel,
    obtenerVentasPorMesModel,
    obtenerTopProductosMasVendidosModel
} = require('./fuente_datos_model');

const obtenerResumenVentasEgresosMensualService = async (cantidadMeses) => {
    const meses = parseInt(cantidadMeses) || 6;

    if (meses < 1 || meses > 12) {
        throw crearError('La cantidad de meses debe estar entre 1 y 12.', 400);
    }

    const resultado = await obtenerResumenVentasEgresosMensualModel(meses);

    return {
        ok: true,
        resultado
    };
};

const obtenerVentasHoyComparacionService = async () => {
    const resultado = await obtenerVentasHoyComparacionModel();
    return {
        ok: true,
        resultado
    };
};

const obtenerReservasMesComparacionService = async () => {
    const resultado = await obtenerReservasMesComparacionModel();
    return {
        ok: true,
        resultado
    };
};

const obtenerBalanceAnualService = async () => {
    const resultado = await obtenerBalanceAnualModel();
    return {
        ok: true,
        resultado
    };
};

const obtenerPorcentajeMediosPagoService = async () => {
    const resultado = await obtenerPorcentajeMediosPagoModel();
    return {
        ok: true,
        resultado
    };
};

const obtenerVentasPorMesService = async (cantidadMeses) => {
    const meses = parseInt(cantidadMeses) || 6;

    if (meses < 1 || meses > 12) {
        throw crearError('La cantidad de meses debe estar entre 1 y 12.', 400);
    }

    const resultado = await obtenerVentasPorMesModel(meses);
    return {
        ok: true,
        resultado
    };
};

const obtenerTopProductosMasVendidosService = async (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) {
        throw crearError('Las fechas de inicio y fin son requeridas.', 400);
    }

    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;
    if (!regexFecha.test(fechaInicio) || !regexFecha.test(fechaFin)) {
        throw crearError('Formato de fecha no valida.', 400);
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (isNaN(inicio.getTime()) || isNaN(fin.getTime())) {
        throw crearError('Las fechas proporcionadas no son válidas.', 400);
    }

    if (inicio > fin) {
        throw crearError('La fecha de inicio no puede ser mayor a la fecha fin.', 400);
    }

    const resultado = await obtenerTopProductosMasVendidosModel(fechaInicio, fechaFin);
    return {
        ok: true,
        resultado
    };
};

module.exports = { 
    obtenerResumenVentasEgresosMensualService,
    obtenerVentasHoyComparacionService,
    obtenerReservasMesComparacionService,
    obtenerBalanceAnualService,
    obtenerPorcentajeMediosPagoService,
    obtenerVentasPorMesService,
    obtenerTopProductosMasVendidosService
};