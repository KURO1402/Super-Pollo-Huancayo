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
      console.warn(`Comprobante ${idComprobante} no encontrado, saltando...`);
      return;
    }

    // 1. Reconstruir payload y enviar a SUNAT vía ApisPeru
    const payload = reconstruirPayloadApisPeru(comprobante, detalles);
    console.log(JSON.stringify(payload))
    const { xml, sunatResponse } = await enviarComprobanteApisPeru(JSON.stringify(payload));

    const aceptado = sunatResponse?.cdrResponse?.code === '0';
    const estado = aceptado ? 'enviado' : 'rechazado';
    const codigo = sunatResponse?.cdrResponse?.code;
    const descripcion = sunatResponse?.cdrResponse?.description;

    // 2. Subir XML a Cloudinary
    const nombreXml = `${comprobante.serie}-${comprobante.numero_correlativo}-xml`;
    const { url: urlXml, publicId: publicIdXml } = await subirArchivoCloudinary(
      Buffer.from(xml),
      nombreXml,
      'xml'
    );

    // 3. Actualizar estado en BD
    await actualizarEstadoSunatModel(idComprobante, estado, urlXml, publicIdXml, new Date());

    if (aceptado) {
      console.log(`Comprobante ${comprobante.serie}-${comprobante.numero_correlativo} aceptado por SUNAT`);
    } else {
      console.error(`Comprobante ${comprobante.serie}-${comprobante.numero_correlativo} rechazado por SUNAT: [${codigo}] ${descripcion}`);
      // Aquí puedes agregar notificación al admin (correo, slack, etc.)
    }

  } catch (error) {
    // Error controlado por comprobante — no detiene el job
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