const crearError = require('../../utilidades/crear_error');
// UTILIDADES COMPARTIDAS

//Valida que ambas fechas existan, tengan formato YYYY-MM-DD
//y que fechaInicio no sea mayor que fechaFin.
const validarFechas = (desde, hasta) => {
    if (!desde || !hasta) {
        throw crearError('Se requieren ambas fechas', 400);
    }

    if (typeof desde !== 'string' || typeof hasta !== 'string') {
        throw crearError('Formato de fecha no valido', 400);
    }

    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;

    if (!regexFecha.test(desde)) {
        throw crearError('La fecha de inicio no tiene el formato correcto (YYYY-MM-DD).', 400);
    }

    if (!regexFecha.test(hasta)) {
        throw crearError('La fecha de fin no tiene el formato correcto (YYYY-MM-DD).', 400);
    }

    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);

    if (isNaN(fechaDesde.getTime())) {
        throw crearError('La fecha de inicio no es una fecha válida.', 400);
    }

    if (isNaN(fechaHasta.getTime())) {
        throw crearError('La fecha de fin no es una fecha válida.', 400);
    }

    if (fechaDesde > fechaHasta) {
        throw crearError('La fecha de inicio no puede ser mayor que la fecha de fin.', 400);
    }

    // No permitir rangos mayores a 1 año para evitar queries pesadas
    const unAnioEnMs = 365 * 24 * 60 * 60 * 1000;
    if (fechaHasta - fechaDesde > unAnioEnMs) {
        throw crearError('El rango de fechas no puede superar 1 año.', 400);
    }
};

// Formatea una fecha Date o string a DD/MM/YYYY para mostrar en Excel.
const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    const d = new Date(fecha);
    if (isNaN(d.getTime())) return '-';
    const dia  = String(d.getDate()).padStart(2, '0');
    const mes  = String(d.getMonth() + 1).padStart(2, '0');
    const anio = d.getFullYear();
    return `${dia}/${mes}/${anio}`;
};

//Formatea un número a 2 decimales. Si es null/undefined retorna 0.00.
const formatearDecimal = (valor) => {
    const num = parseFloat(valor);
    return isNaN(num) ? 0.00 : parseFloat(num.toFixed(2));
};

// ESTILOS EXCELJS COMPARTIDOS
const ESTILO_TITULO = {
    font:      { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } },
    fill:      { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
};

const ESTILO_SUBTITULO = {
    font:      { name: 'Arial', size: 10, color: { argb: 'FF595959' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
};

const ESTILO_ENCABEZADO = {
    font:      { name: 'Arial', size: 10, bold: true, color: { argb: 'FFFFFFFF' } },
    fill:      { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E75B6' } },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' },
    },
};

const ESTILO_KPI_LABEL = {
    font:      { name: 'Arial', size: 10, bold: true, color: { argb: 'FF1F4E79' } },
    fill:      { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDEE6F0' } },
    alignment: { horizontal: 'left', vertical: 'middle' },
    border: {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' },
    },
};

const ESTILO_KPI_VALOR = {
    font:      { name: 'Arial', size: 10, bold: true },
    alignment: { horizontal: 'center', vertical: 'middle' },
    border: {
        top:    { style: 'thin' },
        left:   { style: 'thin' },
        bottom: { style: 'thin' },
        right:  { style: 'thin' },
    },
};

const ESTILO_FILA_PAR = {
    font: { name: 'Arial', size: 9 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F7FC' } },
    border: {
        top:    { style: 'thin', color: { argb: 'FFD9D9D9' } },
        left:   { style: 'thin', color: { argb: 'FFD9D9D9' } },
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        right:  { style: 'thin', color: { argb: 'FFD9D9D9' } },
    },
};

const ESTILO_FILA_IMPAR = {
    font: { name: 'Arial', size: 9 },
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFFF' } },
    border: {
        top:    { style: 'thin', color: { argb: 'FFD9D9D9' } },
        left:   { style: 'thin', color: { argb: 'FFD9D9D9' } },
        bottom: { style: 'thin', color: { argb: 'FFD9D9D9' } },
        right:  { style: 'thin', color: { argb: 'FFD9D9D9' } },
    },
};

//Aplica estilos a cada celda de una fila de datos (par o impar).
const aplicarEstiloFila = (fila, esPar, alineaciones = []) => {
    const estilo = esPar ? ESTILO_FILA_PAR : ESTILO_FILA_IMPAR;
    fila.eachCell({ includeEmpty: true }, (celda, colNum) => {
        celda.font      = estilo.font;
        celda.fill      = estilo.fill;
        celda.border    = estilo.border;
        celda.alignment = {
            horizontal: alineaciones[colNum - 1] || 'left',
            vertical: 'middle',
        };
    });
};

//Inserta la cabecera del reporte (título + período) en la hoja.
//Retorna la siguiente fila libre.
const insertarCabeceraHoja = (hoja, titulo, desde, hasta, totalColumnas) => {
    // Fila 1: título
    hoja.mergeCells(1, 1, 1, totalColumnas);
    const celdaTitulo = hoja.getCell(1, 1);
    celdaTitulo.value     = titulo;
    celdaTitulo.font      = ESTILO_TITULO.font;
    celdaTitulo.fill      = ESTILO_TITULO.fill;
    celdaTitulo.alignment = ESTILO_TITULO.alignment;
    hoja.getRow(1).height = 30;

    // Fila 2: período
    hoja.mergeCells(2, 1, 2, totalColumnas);
    const celdaPeriodo = hoja.getCell(2, 1);
    celdaPeriodo.value     = `Período: ${formatearFecha(desde)}  al  ${formatearFecha(hasta)}`;
    celdaPeriodo.font      = ESTILO_SUBTITULO.font;
    celdaPeriodo.alignment = ESTILO_SUBTITULO.alignment;
    hoja.getRow(2).height  = 18;

    // Fila 3: vacía separadora
    hoja.getRow(3).height = 8;

    return 4; // siguiente fila libre
};

//Aplica estilos de encabezado a una fila completa.
const aplicarEstiloEncabezado = (fila) => {
    fila.height = 20;
    fila.eachCell({ includeEmpty: true }, (celda) => {
        celda.font      = ESTILO_ENCABEZADO.font;
        celda.fill      = ESTILO_ENCABEZADO.fill;
        celda.alignment = ESTILO_ENCABEZADO.alignment;
        celda.border    = ESTILO_ENCABEZADO.border;
    });
};

module.exports = {
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
}