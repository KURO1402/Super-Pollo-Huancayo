const verificarClienteMovil = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const userAgent = req.headers['user-agent'] || '';

  // Verificar API Key
  if (!apiKey) {
    return res.status(401).json({ ok: false, mensaje: 'Se requiere API Key' });
  }

  if (apiKey !== process.env.MOBILE_API_KEY) {
    return res.status(403).json({ ok: false, mensaje: 'API Key inválida' });
  }

  /*const esNavegador = /Mozilla|Chrome|Safari|Firefox|Edge|Opera/i.test(userAgent);
  if (esNavegador) {
    return res.status(403).json({ ok: false, mensaje: 'Acceso no permitido' });
  }*/

  next();
};

module.exports = verificarClienteMovil;