const rateLimit = require('express-rate-limit');

const limitador = rateLimit({
  windowMs: 1 * 60 * 1000, 
  max: 25, 
  message: {
    ok: false,
    mensaje: 'Demasiadas peticiones. Intenta de nuevo en 1 minuto.'
  }
});

module.exports = limitador;