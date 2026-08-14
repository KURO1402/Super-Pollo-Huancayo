const { ejecutarSP } = require('../../utilidades/helpers/db_helper');

const obtenerResumenVentasEgresosMensualRepository = async (cantidadMeses) => {
    const rows = await ejecutarSP(
        'sp_resumen_ventas_egresos_mensual',
        [cantidadMeses],
        'Error al obtener el resumen de ventas y egresos.'
    );
    return rows[0];
};

const obtenerVentasHoyComparacionRepository = async () => {
    const rows = await ejecutarSP(
        'sp_ventas_hoy_comparacion',
        [],
        'Error al obtener las ventas de hoy.'
    );
    return rows[0][0];
};

const obtenerReservasMesComparacionRepository = async () => {
    const rows = await ejecutarSP(
        'sp_reservas_mes_comparacion',
        [],
        'Error al obtener las reservas del mes.'
    );
    return rows[0][0];
};

const obtenerBalanceAnualRepository = async () => {
    const rows = await ejecutarSP(
        'sp_balance_general_anual',
        [],
        'Error al obtener el balance anual.'
    );
    return rows[0][0];
};

const obtenerPorcentajeMediosPagoRepository = async () => {
    const rows = await ejecutarSP(
        'sp_porcentaje_medios_pago',
        [],
        'Error al obtener el porcentaje de medios de pago.'
    );
    return rows[0];
};

const obtenerVentasPorMesRepository = async (cantidadMeses) => {
    const rows = await ejecutarSP(
        'sp_ventas_por_mes',
        [cantidadMeses],
        'Error al obtener las ventas por mes.'
    );
    return rows[0];
};

const obtenerTopProductosMasVendidosRepository = async (fechaInicio, fechaFin) => {
    const rows = await ejecutarSP(
        'sp_top_productos_mas_vendidos',
        [fechaInicio, fechaFin],
        'Error al obtener el top de productos más vendidos.'
    );
    return rows[0];
};

const obtenerMesasActivasPorcentajeRepository = async () => {
    const rows = await ejecutarSP(
        'sp_mesas_activas_porcentaje',
        [],
        'Error al obtener las mesas activas.'
    );
    return rows[0][0]; 
};

module.exports = {
    obtenerResumenVentasEgresosMensualRepository,
    obtenerVentasHoyComparacionRepository,
    obtenerReservasMesComparacionRepository,
    obtenerBalanceAnualRepository,
    obtenerPorcentajeMediosPagoRepository,
    obtenerVentasPorMesRepository,
    obtenerTopProductosMasVendidosRepository,
    obtenerMesasActivasPorcentajeRepository
};