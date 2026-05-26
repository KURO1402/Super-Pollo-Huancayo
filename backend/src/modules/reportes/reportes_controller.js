const {
    generarReporteVentasService,
    generarReporteClientesService,
    generarReporteInventarioService,
    generarReporteCajaService,
} = require('./reportes_service');


const generarReporteVentasController = async (req, res) => {
    try {
        const { desde, hasta } = req.query;

        const buffer = await generarReporteVentasService(desde, hasta);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="reporte_ventas_${desde}_${hasta}.xlsx"`);

        return res.status(200).end(buffer);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

// REPORTE 2: CLIENTES
const generarReporteClientesController = async (req, res) => {
    try {
        const { desde, hasta } = req.query;

        const buffer = await generarReporteClientesService(desde, hasta);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="reporte_clientes_${desde}_${hasta}.xlsx"`);

        return res.status(200).end(buffer);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

// REPORTE 3: INVENTARIO
const generarReporteInventarioController = async (req, res) => {
    try {
        const { desde, hasta } = req.query;

        const buffer = await generarReporteInventarioService(desde, hasta);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="reporte_inventario_${desde}_${hasta}.xlsx"`);

        return res.status(200).end(buffer);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

// REPORTE 4: CAJA
const generarReporteCajaController = async (req, res) => {
    try {
        const { desde, hasta } = req.query;

        const buffer = await generarReporteCajaService(desde, hasta);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="reporte_caja_${desde}_${hasta}.xlsx"`);

        return res.status(200).end(buffer);
    } catch (err) {
        const statusCode = err.status || 500;

        return res.status(statusCode).json({
            ok: false,
            mensaje: err.message || 'Error interno del servidor',
        });
    }
};

module.exports = {
    generarReporteVentasController,
    generarReporteClientesController,
    generarReporteInventarioController,
    generarReporteCajaController,
};