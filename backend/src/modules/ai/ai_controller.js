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

    if (!mensaje || typeof mensaje !== 'string' || !mensaje.trim()) {
        return res.status(400).json({ error: 'El mensaje es requerido y debe ser texto.' });
    }
    
    if (!esHistorialValido(historial)) {
        return res.status(400).json({ error: 'Formato de historial inválido.' });
    }

    const historialLimitado = historial.slice(-20);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    try {
        const resultado = await procesarMensaje(mensaje.trim(), historialLimitado, (chunkTexto) => {
            res.write(`data: ${JSON.stringify({ tipo: 'texto', contenido: chunkTexto })}\n\n`);
        });

        if (resultado && resultado.tipo === 'grafico') {
            res.write(`data: ${JSON.stringify(resultado)}\n\n`);
        }

        res.end();

    } catch (err) {
        const esErrorServicio = err.status === 503 || err.message?.includes('503') || err.message?.includes('overloaded');
        const mensajeUsuario = esErrorServicio
            ? 'El servidor de IA de Google está temporalmente saturado (503). Inténtalo de nuevo en unos segundos.'
            : 'Ocurrió un error inesperado al procesar tu solicitud con el asistente.';

        res.write(`data: ${JSON.stringify({ tipo: 'texto', contenido: mensajeUsuario })}\n\n`);
        res.end();
    }
};

module.exports = { consultarChatbot };