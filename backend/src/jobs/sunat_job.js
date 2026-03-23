const {
  reconstruirPayloadApisPeru,
  enviarComprobanteApisPeru,
  subirArchivoCloudinary,
} = require('../modules/ventas/venta_helpers');

const {
  obtenerComprobantesVencidosModel,
  obtenerComprobantePendientePorIdModel,
  actualizarEstadoSunatModel,
} = require('../modules/ventas/ventas_model');

const MAX_INTENTOS = 3;
const INTERVALO_MS = 30 * 1000;

// ─── Procesar un comprobante pendiente ────────────────────────────────────────
const procesarComprobante = async (idComprobante) => {
  let comprobante;

  try {
    const resultado = await obtenerComprobantePendientePorIdModel(idComprobante);
    comprobante = resultado.comprobante;

    if (!comprobante) {
      console.warn(`Comprobante ${idComprobante} no encontrado`);
      return;
    }

    // ─── Verificar límite de intentos antes de procesar ───────────────────────
    if (comprobante.intentos_reenvio >= MAX_INTENTOS) {
      console.warn(
        `Comprobante ${comprobante.serie}-${comprobante.numero_correlativo} alcanzó el límite de ${MAX_INTENTOS} intentos. Se omite.`
      );
      return;
    }

    const detalles = resultado.detalles;

    await actualizarEstadoSunatModel(idComprobante, 'enviado_sunat', null, null, null, null, null, null);

    const payload = reconstruirPayloadApisPeru(comprobante, detalles);
    const respuesta = await enviarComprobanteApisPeru(payload);
    const { xml, hash, sunatResponse } = respuesta;

    const aceptado = sunatResponse?.cdrResponse?.code === '0';
    const estado = aceptado ? 'aceptado' : 'rechazado';

    const nombreArchivo = `${comprobante.serie}-${comprobante.numero_correlativo}`;

    // ─── Subir XML y CDR en paralelo ──────────────────────────────────────────
    const [resultadoXml, resultadoCdr] = await Promise.all([
      subirArchivoCloudinary(Buffer.from(xml), `${nombreArchivo}-xml`, 'xml'),
      subirArchivoCloudinary(Buffer.from(sunatResponse.cdrZip, 'base64'), `${nombreArchivo}-cdr`, 'zip'),
    ]);

    await actualizarEstadoSunatModel(
      idComprobante,
      estado,
      resultadoXml.url,
      resultadoXml.publicId,
      new Date(),
      resultadoCdr.url,
      resultadoCdr.publicId,
      hash
    );

    if (aceptado) {
      console.log(`Comprobante ${comprobante.serie}-${comprobante.numero_correlativo} ACEPTADO por SUNAT`);
    } else {
      console.error(`Comprobante ${comprobante.serie}-${comprobante.numero_correlativo} RECHAZADO:`, {
        code: sunatResponse?.error?.code,
        message: sunatResponse?.error?.message,
        detail: sunatResponse?.error?.message,
      });
    }

  } catch (error) {
    console.error(`Error procesando comprobante ${idComprobante}:`, error.message);

    // ─── Revertir a pendiente para que el job reintente en la próxima vuelta ──
    try {
      await actualizarEstadoSunatModel(idComprobante, 'pendiente', null, null, null, null, null, null);
      console.warn(`Comprobante ${idComprobante} revertido a "pendiente" para reintento`);
    } catch (errorRevert) {
      console.error(`No se pudo revertir el comprobante ${idComprobante}:`, errorRevert.message);
    }
  }
};

// ─── Ciclo principal del job ──────────────────────────────────────────────────
const ejecutarJob = async () => {
  try {
    const pendientes = await obtenerComprobantesVencidosModel();

    if (!pendientes || pendientes.length === 0) return;

    console.log(`Job SUNAT: procesando ${pendientes.length} comprobante(s)...`);

    for (const { id_comprobante } of pendientes) {
      await procesarComprobante(id_comprobante);
    }

  } catch (error) {
    console.error('Error en job SUNAT al obtener pendientes:', error.message);
  }
};

// ─── Loop recursivo con setTimeout — evita solapamiento de ciclos ─────────────
const loopJob = async () => {
  await ejecutarJob();
  setTimeout(loopJob, INTERVALO_MS);
};

// ─── Iniciar job ──────────────────────────────────────────────────────────────
const iniciarJobSunat = () => {
  console.log(`Job SUNAT iniciado — intervalo: ${INTERVALO_MS / 1000}s, máx intentos: ${MAX_INTENTOS}`);
  loopJob();
};

module.exports = iniciarJobSunat;