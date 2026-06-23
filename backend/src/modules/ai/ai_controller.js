const { procesarMensaje } = require('./ai_service');

const esHistorialValido = (historial) => {
    if (!Array.isArray(historial)) return false;
    return historial.every(entry =>
        entry &&
        typeof entry === 'object' &&
        ['user', 'model'].includes(entry.role) &&
        Array.isArray(entry.parts) &&
        entry.parts.every(p => typeof p.text === 'string')
    );
};

const consultarChatbot = async (req, res) => {
    const { mensaje, historial = [] } = req.body;

    // 1. Validar mensaje
    if (!mensaje || typeof mensaje !== 'string' || !mensaje.trim()) {
        return res.status(400).json({ error: 'El mensaje es requerido y debe ser texto.' });
    }
    
    // 2. Validar historial
    if (!esHistorialValido(historial)) {
        return res.status(400).json({ error: 'Formato de historial inválido.' });
    }

    // Limitar historial a los últimos 20 mensajes (10 turnos) para no exceder tokens
    const historialLimitado = historial.slice(-20);

    // 3. Configurar cabeceras de streaming (SSE) antes de arrancar el proceso de la IA
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        // 4. Pasar la función anónima (callback) que res.write necesita para enviar fragmentos
        const resultado = await procesarMensaje(mensaje.trim(), historialLimitado, (chunkTexto) => {
            res.write(`data: ${JSON.stringify({ tipo: 'texto', contenido: chunkTexto })}\n\n`);
        });

        // 5. Si la IA interceptó y construyó un gráfico, lo enviamos al final de la transmisión
        if (resultado && resultado.tipo === 'grafico') {
            res.write(`data: ${JSON.stringify(resultado)}\n\n`);
        }

        // Finalizar la conexión HTTP limpia
        res.end();

    } catch (err) {
        console.error("Error en modulo AI de Super Pollo:", err.message);

        // 6. Manejo específico para caídas o saturación (Error 503)
        const esErrorServicio = err.status === 503 || err.message?.includes('503') || err.message?.includes('overloaded');
        const mensajeUsuario = esErrorServicio
            ? 'El servidor de IA de Google está temporalmente saturado (503). Inténtalo de nuevo en unos segundos.'
            : 'Ocurrió un error inesperado al procesar tu solicitud con el asistente.';

        res.write(`data: ${JSON.stringify({ tipo: 'texto', contenido: mensajeUsuario })}\n\n`);
        res.end();
    }
};

module.exports = { consultarChatbot };