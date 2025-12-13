const jwt = require('jsonwebtoken');

const autenticacionToken = (req, res, next) => {
  const autenticacionHeader = req.headers['authorization'];
  const token = autenticacionHeader && autenticacionHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    req.usuario = usuario;
    next();
  });
};

const verificarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    const { idRol } = req.usuario;

    if (!rolesPermitidos.includes(idRol)) {
      return res.status(403).json({ message: 'Acceso denegado. Rol no autorizado.' });
    }

    next();
  };
};

module.exports = {
  autenticacionToken,
  verificarRoles
};