const { ejecutarSP } = require('../../utilidades/helpers/db_helper');

const reporteVentasResumenRepository = async (fechaInicio, fechaFin) => {
    const rows = await ejecutarSP(
        'sp_reporte_ventas_resumen',
        [fechaInicio, fechaFin],
        'Error al obtener el resumen de ventas.'
    );
    return rows[0];
};

const reporteVentasDetalleRepository = async (fechaInicio, fechaFin) => {
    const rows = await ejecutarSP(
        'sp_reporte_ventas_detalle',
        [fechaInicio, fechaFin],
        'Error al obtener el detalle de ventas.'
    );
    return rows[0];
};

const reporteClientesResumenRepository = async (fechaInicio, fechaFin) => {
    const rows = await ejecutarSP(
        'sp_reporte_clientes_resumen',
        [fechaInicio, fechaFin],
        'Error al obtener el resumen de clientes.'
    );
    return rows[0];
};

const reporteClientesDetalleRepository = async (fechaInicio, fechaFin) => {
    const rows = await ejecutarSP(
        'sp_reporte_clientes_detalle',
        [fechaInicio, fechaFin],
        'Error al obtener el detalle de clientes.'
    );
    return rows[0];
};

const reporteInventarioResumenRepository = async (fechaInicio, fechaFin) => {
    const rows = await ejecutarSP(
        'sp_reporte_inventario_resumen',
        [fechaInicio, fechaFin],
        'Error al obtener el resumen de inventario.'
    );
    return rows[0];
};

const reporteInventarioDetalleRepository = async (fechaInicio, fechaFin) => {
    const rows = await ejecutarSP(
        'sp_reporte_inventario_detalle',
        [fechaInicio, fechaFin],
        'Error al obtener el detalle de inventario.'
    );
    return rows[0];
};

const reporteCajaResumenRepository = async (fechaInicio, fechaFin) => {
    const rows = await ejecutarSP(
        'sp_reporte_caja_resumen',
        [fechaInicio, fechaFin],
        'Error al obtener el resumen de caja.'
    );
    return rows[0];
};

const reporteCajaDetalleRepository = async (fechaInicio, fechaFin) => {
    const rows = await ejecutarSP(
        'sp_reporte_caja_detalle',
        [fechaInicio, fechaFin],
        'Error al obtener el detalle de caja.'
    );
    return rows[0];
};

module.exports = {
    reporteVentasResumenRepository,
    reporteVentasDetalleRepository,
    reporteClientesResumenRepository,
    reporteClientesDetalleRepository,
    reporteInventarioResumenRepository,
    reporteInventarioDetalleRepository,
    reporteCajaResumenRepository,
    reporteCajaDetalleRepository
};