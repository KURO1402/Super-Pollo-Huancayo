const obtenerFechaActual = () => {
  const ahora = new Date();
  const offset = '-05:00';
  const fecha = ahora.toISOString().split('.')[0] + offset;
  return fecha;
};

module.exports = obtenerFechaActual;