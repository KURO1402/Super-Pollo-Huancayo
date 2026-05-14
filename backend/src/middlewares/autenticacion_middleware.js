const jwt = require('jsonwebtoken');

const autenticacionToken = (req, res, next) => {
  const autenticacionHeader = req.headers['authorization'];
  const token = autenticacionHeader && autenticacionHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ ok: false, message: 'Token expirado' });
      }
      return res.status(403).json({ ok: false, message: 'Token inválido o expirado' });
    }
    req.usuario = usuario;
    next();
  });
};

const verificarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    const { id_rol } = req.usuario;

    if (!rolesPermitidos.includes(id_rol)) {
      return res.status(403).json({ ok: false, message: 'Acceso denegado. Rol no autorizado.' });
    }

    next();
  };
};

module.exports = {
  autenticacionToken,
  verificarRoles
};