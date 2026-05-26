const ExcelJS = require('exceljs');

const {
    reporteVentasResumenModel,
    reporteVentasDetalleModel,
    reporteClientesResumenModel,
    reporteClientesDetalleModel,
    reporteInventarioResumenModel,
    reporteInventarioDetalleModel,
    reporteCajaResumenModel,
    reporteCajaDetalleModel,
} = require('./reportes_model');

const {
    validarFechas,
    formatearFecha,
    formatearDecimal,
    ESTILO_TITULO,
    ESTILO_SUBTITULO,
    ESTILO_KPI_VALOR,
    ESTILO_KPI_LABEL,
    ESTILO_FILA_PAR,
    ESTILO_FILA_IMPAR,
    ESTILO_ENCABEZADO,
    aplicarEstiloFila,
    insertarCabeceraHoja,
    aplicarEstiloEncabezado
} = require('./utilidades_reportes');

// REPORTE 1: VENTAS
const generarReporteVentasService = async (desde, hasta) => {
    validarFechas(desde, hasta);

    const [resumen, detalle] = await Promise.all([
        reporteVentasResumenModel(desde, hasta),
        reporteVentasDetalleModel(desde, hasta),
    ]);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Super Pollo';
    workbook.created = new Date();

    // ----- HOJA 1: RESUMEN -----
    const hojaResumen = workbook.addWorksheet('Resumen');
    hojaResumen.views = [{ showGridLines: false }];

    const COL_RESUMEN = 4;
    let fila = insertarCabeceraHoja(hojaResumen, 'REPORTE DE VENTAS', desde, hasta, COL_RESUMEN);

    hojaResumen.getColumn(1).width = 35;
    hojaResumen.getColumn(2).width = 20;
    hojaResumen.getColumn(3).width = 35;
    hojaResumen.getColumn(4).width = 20;

    // KPIs generales (primera fila del SP — totales globales)
    const kpiGlobal = resumen[0] || {};

    // Calcular totales globales acumulando todos los grupos de medio_pago
    const totales = resumen.reduce((acc, row) => {
        acc.total_ventas += Number(row.total_ventas || 0);
        acc.monto_total += Number(row.monto_total || 0);
        acc.total_igv += Number(row.total_igv || 0);
        acc.total_gravada += Number(row.total_gravada || 0);
        return acc;
    }, { total_ventas: 0, monto_total: 0, total_igv: 0, total_gravada: 0 });

    const ticketPromedio = totales.total_ventas > 0
        ? totales.monto_total / totales.total_ventas
        : 0;

    const medioPagoFrecuente = resumen.length > 0 ? resumen[0].medio_pago_frecuente || '-' : '-';

    const kpis = [
        ['Total de ventas', totales.total_ventas, 'Monto total (S/)', formatearDecimal(totales.monto_total)],
        ['Total gravada (S/)', formatearDecimal(totales.total_gravada), 'Total IGV (S/)', formatearDecimal(totales.total_igv)],
        ['Ticket promedio (S/)', formatearDecimal(ticketPromedio), 'Medio de pago frecuente', medioPagoFrecuente],
    ];

    kpis.forEach(([label1, val1, label2, val2]) => {
        const r = hojaResumen.getRow(fila);
        r.height = 22;

        const c1 = r.getCell(1); c1.value = label1; Object.assign(c1, ESTILO_KPI_LABEL); c1.font = ESTILO_KPI_LABEL.font; c1.fill = ESTILO_KPI_LABEL.fill; c1.alignment = ESTILO_KPI_LABEL.alignment; c1.border = ESTILO_KPI_LABEL.border;
        const c2 = r.getCell(2); c2.value = val1; Object.assign(c2, ESTILO_KPI_VALOR); c2.font = ESTILO_KPI_VALOR.font; c2.alignment = { horizontal: 'center', vertical: 'middle' }; c2.border = ESTILO_KPI_VALOR.border;
        const c3 = r.getCell(3); c3.value = label2; Object.assign(c3, ESTILO_KPI_LABEL); c3.font = ESTILO_KPI_LABEL.font; c3.fill = ESTILO_KPI_LABEL.fill; c3.alignment = ESTILO_KPI_LABEL.alignment; c3.border = ESTILO_KPI_LABEL.border;
        const c4 = r.getCell(4); c4.value = val2; Object.assign(c4, ESTILO_KPI_VALOR); c4.font = ESTILO_KPI_VALOR.font; c4.alignment = { horizontal: 'center', vertical: 'middle' }; c4.border = ESTILO_KPI_VALOR.border;

        fila++;
    });

    fila++; // separador

    // Tabla: ventas por medio de pago
    hojaResumen.mergeCells(fila, 1, fila, COL_RESUMEN);
    const celdaSubtitulo = hojaResumen.getCell(fila, 1);
    celdaSubtitulo.value = 'Ventas por medio de pago';
    celdaSubtitulo.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF1F4E79' } };
    celdaSubtitulo.alignment = { horizontal: 'left', vertical: 'middle' };
    hojaResumen.getRow(fila).height = 20;
    fila++;

    const encResumen = hojaResumen.getRow(fila);
    encResumen.values = ['Medio de pago', 'Cantidad ventas', 'Monto total (S/)', 'Ticket promedio (S/)'];
    aplicarEstiloEncabezado(encResumen);
    fila++;

    resumen.forEach((row, i) => {
        const r = hojaResumen.getRow(fila);
        const prom = Number(row.total_ventas) > 0
            ? formatearDecimal(Number(row.monto_total) / Number(row.total_ventas))
            : 0;
        r.values = [
            row.medio_pago_frecuente || 'Sin medio de pago',
            Number(row.total_ventas || 0),
            formatearDecimal(row.monto_total),
            prom,
        ];
        r.height = 18;
        aplicarEstiloFila(r, i % 2 === 0, ['left', 'center', 'center', 'center']);
        fila++;
    });

    // ----- HOJA 2: DETALLE -----
    const hojaDetalle = workbook.addWorksheet('Detalle');
    hojaDetalle.views = [{ showGridLines: false }];

    const COL_DETALLE = 11;
    let filaD = insertarCabeceraHoja(hojaDetalle, 'DETALLE DE VENTAS', desde, hasta, COL_DETALLE);

    hojaDetalle.columns = [
        { key: 'id_venta', width: 8 },
        { key: 'fecha_registro', width: 20 },
        { key: 'numero_documento', width: 16 },
        { key: 'tipo_documento', width: 16 },
        { key: 'nombre_cliente', width: 30 },
        { key: 'medio_pago', width: 18 },
        { key: 'tipo_comprobante', width: 18 },
        { key: 'numero_comprobante', width: 20 },
        { key: 'total_gravada', width: 16 },
        { key: 'total_igv', width: 14 },
        { key: 'total_venta', width: 16 },
    ];

    const encDetalle = hojaDetalle.getRow(filaD);
    encDetalle.values = [
        'ID Venta', 'Fecha', 'N° Documento', 'Tipo Doc.',
        'Cliente', 'Medio de pago', 'Comprobante',
        'N° Comprobante', 'Gravada (S/)', 'IGV (S/)', 'Total (S/)',
    ];
    aplicarEstiloEncabezado(encDetalle);
    filaD++;

    if (detalle.length === 0) {
        hojaDetalle.mergeCells(filaD, 1, filaD, COL_DETALLE);
        const celdaVacia = hojaDetalle.getCell(filaD, 1);
        celdaVacia.value = 'No hay ventas registradas en el período seleccionado.';
        celdaVacia.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF888888' } };
        celdaVacia.alignment = { horizontal: 'center', vertical: 'middle' };
    } else {
        detalle.forEach((row, i) => {
            const r = hojaDetalle.getRow(filaD);
            r.values = [
                row.id_venta,
                formatearFecha(row.fecha_registro),
                row.numero_documento_cliente,
                row.nombre_tipo_documento || '-',
                row.nombre_cliente || '-',
                row.nombre_medio_pago || '-',
                row.nombre_tipo_comprobante || '-',
                row.numero_comprobante || '-',
                formatearDecimal(row.total_gravada),
                formatearDecimal(row.total_igv),
                formatearDecimal(row.total_venta),
            ];
            r.height = 16;
            aplicarEstiloFila(r, i % 2 === 0, [
                'center', 'center', 'center', 'center',
                'left', 'center', 'center', 'center',
                'right', 'right', 'right',
            ]);
            filaD++;
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};

// REPORTE 2: CLIENTES
const generarReporteClientesService = async (desde, hasta) => {
    validarFechas(desde, hasta);

    const [resumen, detalle] = await Promise.all([
        reporteClientesResumenModel(desde, hasta),
        reporteClientesDetalleModel(desde, hasta),
    ]);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Super Pollo';
    workbook.created = new Date();

    // ----- HOJA 1: RESUMEN -----
    const hojaResumen = workbook.addWorksheet('Resumen');
    hojaResumen.views = [{ showGridLines: false }];

    const COL_RESUMEN = 4;
    let fila = insertarCabeceraHoja(hojaResumen, 'REPORTE DE CLIENTES', desde, hasta, COL_RESUMEN);

    hojaResumen.getColumn(1).width = 35;
    hojaResumen.getColumn(2).width = 20;
    hojaResumen.getColumn(3).width = 35;
    hojaResumen.getColumn(4).width = 20;

    const r = resumen[0] || {};

    const kpis = [
        ['Clientes únicos', Number(r.total_clientes_unicos || 0), 'Total de compras', Number(r.total_compras || 0)],
        ['Monto total (S/)', formatearDecimal(r.monto_total), 'Ticket promedio (S/)', formatearDecimal(r.ticket_promedio)],
        ['Compra máxima (S/)', formatearDecimal(r.compra_maxima), 'Compra mínima (S/)', formatearDecimal(r.compra_minima)],
    ];

    kpis.forEach(([label1, val1, label2, val2]) => {
        const row = hojaResumen.getRow(fila);
        row.height = 22;
        const c1 = row.getCell(1); c1.value = label1; c1.font = ESTILO_KPI_LABEL.font; c1.fill = ESTILO_KPI_LABEL.fill; c1.alignment = ESTILO_KPI_LABEL.alignment; c1.border = ESTILO_KPI_LABEL.border;
        const c2 = row.getCell(2); c2.value = val1; c2.font = ESTILO_KPI_VALOR.font; c2.alignment = { horizontal: 'center', vertical: 'middle' }; c2.border = ESTILO_KPI_VALOR.border;
        const c3 = row.getCell(3); c3.value = label2; c3.font = ESTILO_KPI_LABEL.font; c3.fill = ESTILO_KPI_LABEL.fill; c3.alignment = ESTILO_KPI_LABEL.alignment; c3.border = ESTILO_KPI_LABEL.border;
        const c4 = row.getCell(4); c4.value = val2; c4.font = ESTILO_KPI_VALOR.font; c4.alignment = { horizontal: 'center', vertical: 'middle' }; c4.border = ESTILO_KPI_VALOR.border;
        fila++;
    });

    // ----- HOJA 2: DETALLE -----
    const hojaDetalle = workbook.addWorksheet('Detalle');
    hojaDetalle.views = [{ showGridLines: false }];

    const COL_DETALLE = 7;
    let filaD = insertarCabeceraHoja(hojaDetalle, 'DETALLE DE CLIENTES', desde, hasta, COL_DETALLE);

    hojaDetalle.columns = [
        { key: 'numero_documento', width: 18 },
        { key: 'tipo_documento', width: 16 },
        { key: 'nombre_cliente', width: 30 },
        { key: 'cantidad_compras', width: 16 },
        { key: 'total_gastado', width: 18 },
        { key: 'ticket_promedio', width: 18 },
        { key: 'ultima_compra', width: 20 },
    ];

    const encDetalle = hojaDetalle.getRow(filaD);
    encDetalle.values = [
        'N° Documento', 'Tipo Doc.', 'Cliente',
        'N° Compras', 'Total gastado (S/)', 'Ticket prom. (S/)', 'Última compra',
    ];
    aplicarEstiloEncabezado(encDetalle);
    filaD++;

    if (detalle.length === 0) {
        hojaDetalle.mergeCells(filaD, 1, filaD, COL_DETALLE);
        const celdaVacia = hojaDetalle.getCell(filaD, 1);
        celdaVacia.value = 'No hay clientes registrados en el período seleccionado.';
        celdaVacia.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF888888' } };
        celdaVacia.alignment = { horizontal: 'center', vertical: 'middle' };
    } else {
        detalle.forEach((row, i) => {
            const r = hojaDetalle.getRow(filaD);
            r.values = [
                row.numero_documento_cliente,
                row.nombre_tipo_documento || '-',
                row.nombre_cliente || '-',
                Number(row.cantidad_compras || 0),
                formatearDecimal(row.total_gastado),
                formatearDecimal(row.ticket_promedio),
                formatearFecha(row.ultima_compra),
            ];
            r.height = 16;
            aplicarEstiloFila(r, i % 2 === 0, [
                'center', 'center', 'left',
                'center', 'right', 'right', 'center',
            ]);
            filaD++;
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};

// REPORTE 3: INVENTARIO
const generarReporteInventarioService = async (desde, hasta) => {
    validarFechas(desde, hasta);

    const [resumen, detalle] = await Promise.all([
        reporteInventarioResumenModel(desde, hasta),
        reporteInventarioDetalleModel(desde, hasta),
    ]);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Super Pollo';
    workbook.created = new Date();

    // ----- HOJA 1: RESUMEN -----
    const hojaResumen = workbook.addWorksheet('Resumen');
    hojaResumen.views = [{ showGridLines: false }];

    const COL_RESUMEN = 4;
    let fila = insertarCabeceraHoja(hojaResumen, 'REPORTE DE INVENTARIO', desde, hasta, COL_RESUMEN);

    hojaResumen.getColumn(1).width = 35;
    hojaResumen.getColumn(2).width = 20;
    hojaResumen.getColumn(3).width = 35;
    hojaResumen.getColumn(4).width = 20;

    const r = resumen[0] || {};

    const kpis = [
        ['Total de insumos', Number(r.total_insumos || 0), 'Insumos con stock bajo', Number(r.insumos_stock_bajo || 0)],
        ['Insumos inactivos', Number(r.insumos_inactivos || 0), 'Entradas en el período', formatearDecimal(r.total_entradas_periodo)],
        ['Salidas en el período', formatearDecimal(r.total_salidas_periodo), '', ''],
    ];

    kpis.forEach(([label1, val1, label2, val2]) => {
        const row = hojaResumen.getRow(fila);
        row.height = 22;
        const c1 = row.getCell(1); c1.value = label1; c1.font = ESTILO_KPI_LABEL.font; c1.fill = ESTILO_KPI_LABEL.fill; c1.alignment = ESTILO_KPI_LABEL.alignment; c1.border = ESTILO_KPI_LABEL.border;
        const c2 = row.getCell(2); c2.value = val1; c2.font = ESTILO_KPI_VALOR.font; c2.alignment = { horizontal: 'center', vertical: 'middle' }; c2.border = ESTILO_KPI_VALOR.border;
        const c3 = row.getCell(3); c3.value = label2; c3.font = ESTILO_KPI_LABEL.font; c3.fill = ESTILO_KPI_LABEL.fill; c3.alignment = ESTILO_KPI_LABEL.alignment; c3.border = ESTILO_KPI_LABEL.border;
        const c4 = row.getCell(4); c4.value = val2; c4.font = ESTILO_KPI_VALOR.font; c4.alignment = { horizontal: 'center', vertical: 'middle' }; c4.border = ESTILO_KPI_VALOR.border;
        fila++;
    });

    // ----- HOJA 2: DETALLE -----
    const hojaDetalle = workbook.addWorksheet('Detalle');
    hojaDetalle.views = [{ showGridLines: false }];

    const COL_DETALLE = 7;
    let filaD = insertarCabeceraHoja(hojaDetalle, 'DETALLE DE INVENTARIO', desde, hasta, COL_DETALLE);

    hojaDetalle.columns = [
        { key: 'id_insumo', width: 10 },
        { key: 'nombre_insumo', width: 30 },
        { key: 'unidad_medida', width: 16 },
        { key: 'stock_actual', width: 14 },
        { key: 'estado_stock', width: 14 },
        { key: 'entradas_periodo', width: 18 },
        { key: 'salidas_periodo', width: 18 },
    ];

    const encDetalle = hojaDetalle.getRow(filaD);
    encDetalle.values = [
        'ID', 'Insumo', 'Unidad', 'Stock actual',
        'Estado stock', 'Entradas período', 'Salidas período',
    ];
    aplicarEstiloEncabezado(encDetalle);
    filaD++;

    if (detalle.length === 0) {
        hojaDetalle.mergeCells(filaD, 1, filaD, COL_DETALLE);
        const celdaVacia = hojaDetalle.getCell(filaD, 1);
        celdaVacia.value = 'No hay insumos registrados.';
        celdaVacia.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF888888' } };
        celdaVacia.alignment = { horizontal: 'center', vertical: 'middle' };
    } else {
        detalle.forEach((row, i) => {
            const r = hojaDetalle.getRow(filaD);

            // Resaltar en rojo los insumos con stock bajo
            const esBajo = row.estado_stock === 'BAJO';

            r.values = [
                row.id_insumo,
                row.nombre_insumo,
                row.unidad_medida,
                formatearDecimal(row.stock_actual),
                row.estado_stock,
                formatearDecimal(row.entradas_periodo),
                formatearDecimal(row.salidas_periodo),
            ];
            r.height = 16;
            aplicarEstiloFila(r, i % 2 === 0, [
                'center', 'left', 'center',
                'center', 'center', 'center', 'center',
            ]);

            // Si stock bajo → pintar celda estado en rojo suave
            if (esBajo) {
                const celdaEstado = r.getCell(5);
                celdaEstado.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD7D7' } };
                celdaEstado.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FFCC0000' } };
            }

            filaD++;
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};

// REPORTE 4: CAJA
const generarReporteCajaService = async (desde, hasta) => {
    validarFechas(desde, hasta);

    const [resumen, detalle] = await Promise.all([
        reporteCajaResumenModel(desde, hasta),
        reporteCajaDetalleModel(desde, hasta),
    ]);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Super Pollo';
    workbook.created = new Date();

    // ----- HOJA 1: RESUMEN -----
    const hojaResumen = workbook.addWorksheet('Resumen');
    hojaResumen.views = [{ showGridLines: false }];

    const COL_RESUMEN = 4;
    let fila = insertarCabeceraHoja(hojaResumen, 'REPORTE DE CAJA', desde, hasta, COL_RESUMEN);

    hojaResumen.getColumn(1).width = 35;
    hojaResumen.getColumn(2).width = 20;
    hojaResumen.getColumn(3).width = 35;
    hojaResumen.getColumn(4).width = 20;

    const r = resumen[0] || {};

    const balance = formatearDecimal(
        Number(r.total_ingresos || 0) - Number(r.total_egresos || 0)
    );

    const kpis = [
        ['Total de cajas', Number(r.total_cajas || 0), 'Total ingresos (S/)', formatearDecimal(r.total_ingresos)],
        ['Total egresos (S/)', formatearDecimal(r.total_egresos), 'Balance neto (S/)', balance],
        ['Sobrante arqueos (S/)', formatearDecimal(r.total_sobrante_arqueos), 'Faltante arqueos (S/)', formatearDecimal(r.total_faltante_arqueos)],
    ];

    kpis.forEach(([label1, val1, label2, val2]) => {
        const row = hojaResumen.getRow(fila);
        row.height = 22;
        const c1 = row.getCell(1); c1.value = label1; c1.font = ESTILO_KPI_LABEL.font; c1.fill = ESTILO_KPI_LABEL.fill; c1.alignment = ESTILO_KPI_LABEL.alignment; c1.border = ESTILO_KPI_LABEL.border;
        const c2 = row.getCell(2); c2.value = val1; c2.font = ESTILO_KPI_VALOR.font; c2.alignment = { horizontal: 'center', vertical: 'middle' }; c2.border = ESTILO_KPI_VALOR.border;
        const c3 = row.getCell(3); c3.value = label2; c3.font = ESTILO_KPI_LABEL.font; c3.fill = ESTILO_KPI_LABEL.fill; c3.alignment = ESTILO_KPI_LABEL.alignment; c3.border = ESTILO_KPI_LABEL.border;
        const c4 = row.getCell(4); c4.value = val2; c4.font = ESTILO_KPI_VALOR.font; c4.alignment = { horizontal: 'center', vertical: 'middle' }; c4.border = ESTILO_KPI_VALOR.border;
        fila++;
    });

    // ----- HOJA 2: DETALLE -----
    const hojaDetalle = workbook.addWorksheet('Detalle');
    hojaDetalle.views = [{ showGridLines: false }];

    const COL_DETALLE = 6;
    let filaD = insertarCabeceraHoja(hojaDetalle, 'DETALLE DE CAJA', desde, hasta, COL_DETALLE);

    hojaDetalle.columns = [
        { key: 'id_movimiento', width: 12 },
        { key: 'fecha_movimiento', width: 20 },
        { key: 'tipo_movimiento', width: 14 },
        { key: 'monto', width: 16 },
        { key: 'descripcion', width: 40 },
        { key: 'usuario', width: 25 },
    ];

    const encDetalle = hojaDetalle.getRow(filaD);
    encDetalle.values = [
        'ID Mov.', 'Fecha', 'Tipo', 'Monto (S/)', 'Descripción', 'Responsable',
    ];
    aplicarEstiloEncabezado(encDetalle);
    filaD++;

    if (detalle.length === 0) {
        hojaDetalle.mergeCells(filaD, 1, filaD, COL_DETALLE);
        const celdaVacia = hojaDetalle.getCell(filaD, 1);
        celdaVacia.value = 'No hay movimientos de caja en el período seleccionado.';
        celdaVacia.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF888888' } };
        celdaVacia.alignment = { horizontal: 'center', vertical: 'middle' };
    } else {
        detalle.forEach((row, i) => {
            const r = hojaDetalle.getRow(filaD);
            const esIngreso = row.tipo_movimiento === 'ingreso';

            r.values = [
                row.id_movimiento_caja,
                formatearFecha(row.fecha_movimiento),
                row.tipo_movimiento,
                formatearDecimal(row.monto_movimiento),
                row.descripcion_mov_caja || '-',
                row.usuario_responsable || '-',
            ];
            r.height = 16;
            aplicarEstiloFila(r, i % 2 === 0, [
                'center', 'center', 'center',
                'right', 'left', 'left',
            ]);

            // Verde para ingresos, rojo para egresos en la celda "Tipo"
            const celdaTipo = r.getCell(3);
            if (esIngreso) {
                celdaTipo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD7F0D7' } };
                celdaTipo.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FF276227' } };
            } else {
                celdaTipo.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFD7D7' } };
                celdaTipo.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FFCC0000' } };
            }

            filaD++;
        });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
};

module.exports = {
    generarReporteVentasService,
    generarReporteClientesService,
    generarReporteInventarioService,
    generarReporteCajaService,
};