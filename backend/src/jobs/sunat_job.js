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

// ─── Procesar un comprobante pendiente ────────────────────────────────────────
const procesarComprobante = async (idComprobante) => {
  try {
    const { comprobante, detalles } = await obtenerComprobantePendientePorIdModel(idComprobante);

    if (!comprobante) {
      console.warn(`Comprobante ${idComprobante} no encontrado`);
      return;
    }

    // NUEVO: Marcar como "enviando_sunat" ANTES de intentar
    await actualizarEstadoSunatModel(
      idComprobante,
      'enviado_sunat',
      null,
      null,
      null
    );

    // Reconstruir y enviar
    const payload = reconstruirPayloadApisPeru(comprobante, detalles);
    const { xml, sunatResponse } = await enviarComprobanteApisPeru(payload);

    // CAMBIAR lógica de estado
    const aceptado = sunatResponse?.cdrResponse?.code === '0';
    const estado = aceptado ? 'aceptado' : 'rechazado';

    const nombreXml = `${comprobante.serie}-${comprobante.numero_correlativo}-xml`;
    const { url: urlXml, publicId: publicIdXml } = await subirArchivoCloudinary(
      Buffer.from(xml),
      nombreXml,
      'xml'
    );

    await actualizarEstadoSunatModel(
      idComprobante,
      estado,
      urlXml,
      publicIdXml,
      new Date()
    );

    if (aceptado) {
      console.log(`Comprobante ${comprobante.serie}-${comprobante.numero_correlativo} ACEPTADO por SUNAT`);
    } else {
      console.error(`Comprobante ${comprobante.serie}-${comprobante.numero_correlativo} RECHAZADO: ${sunatResponse?.cdrResponse?.description}`);
    }

  } catch (error) {
    console.error(`Error procesando comprobante ${idComprobante}:`, error.message);
  }
};

// ─── Ciclo principal del job ──────────────────────────────────────────────────
const ejecutarJob = async () => {
  try {
    const pendientes = await obtenerComprobantesVencidosModel();

    if (!pendientes || pendientes.length === 0) return;

    console.log(`Job SUNAT: procesando ${pendientes.length} comprobante(s)...`);

    // Procesamos en serie para no saturar ApisPeru
    for (const { id_comprobante } of pendientes) {
      await procesarComprobante(id_comprobante);
    }

  } catch (error) {
    console.error('Error en job SUNAT al obtener pendientes:', error.message);
  }
};

// ─── Iniciar job con intervalo de 30 segundos ─────────────────────────────────
const iniciarJobSunat = () => {
  console.log('Job SUNAT iniciado — intervalo: 30s');
  ejecutarJob();
  setInterval(ejecutarJob, 30 * 1000);
};

module.exports = iniciarJobSunat;