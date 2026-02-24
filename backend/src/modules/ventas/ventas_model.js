const pool = require('../../config/conexion_DB');

const insertarVentaModel = async ({ numeroDocumentoCliente, idTipoDocumento, fechaEmision, fechaVencimiento, porcentajeIgv, totalGravada, totalIgv, totalVenta, idMedioPago, idTipoComprobante, serie, numeroCorrelativo, sunatTransaccion, aceptadoPorSunat, urlComprobantePdf, urlComprobanteXml, fechaEnvio, detalles }) => {
    const conexion = await pool.getConnection();

    try {
        await conexion.beginTransaction();

        // ─── 1. Insertar venta ────────────────────────────────────────────────
        const [ventaResult] = await conexion.query(
            'CALL sp_insertar_venta(?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [numeroDocumentoCliente, idTipoDocumento, fechaEmision, fechaVencimiento, porcentajeIgv, totalGravada, totalIgv, totalVenta, idMedioPago]
        );
        const idVenta = ventaResult[0][0].id_venta;

        // ─── 2. Insertar comprobante ──────────────────────────────────────────
        await conexion.query(
            'CALL sp_insertar_comprobante(?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [idVenta, idTipoComprobante, serie, numeroCorrelativo, sunatTransaccion, aceptadoPorSunat, urlComprobantePdf, urlComprobanteXml, fechaEnvio]
        );

        // ─── 3. Insertar detalles ─────────────────────────────────────────────
        for (const detalle of detalles) {
            await conexion.query(
                'CALL sp_insertar_detalle_venta(?, ?, ?, ?, ?, ?, ?, ?)',
                [detalle.cantidad, detalle.valorUnitario, detalle.precioUnitario, detalle.subtotal, detalle.igv, detalle.totalProducto, idVenta, detalle.idProducto]
            );
        }

        await conexion.commit();
        return { idVenta };

    } catch (error) {
        await conexion.rollback();
        throw error;
    } finally {
        conexion.release();
    }
};

module.exports = { insertarVentaModel };