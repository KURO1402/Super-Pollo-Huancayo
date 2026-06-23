const { procesarMensajeStream } = require('./ai_service');

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

    // Validar mensaje
    if (!mensaje || typeof mensaje !== 'string' || !mensaje.trim()) {
        return res.status(400).json({ error: 'El mensaje es requerido.' });
    }

    // Validar historial
    if (!esHistorialValido(historial)) {
        return res.status(400).json({ error: 'Formato de historial inválido.' });
    }

    // Limitar historial a los últimos 20 mensajes (10 turnos) para no exceder tokens
    const historialLimitado = historial.slice(-20);

    try {
        await procesarMensajeStream(mensaje.trim(), historialLimitado, res);
    } catch (err) {
        if (res.headersSent) return;
        res.status(500).json({ error: 'Error interno al procesar el mensaje.' });
    }
};

module.exports = { consultarChatbot };