const crearError = (mensaje, status = 400) => {
  const error = new Error(mensaje);
  error.status = status;
  return error;
};

module.exports = crearError;