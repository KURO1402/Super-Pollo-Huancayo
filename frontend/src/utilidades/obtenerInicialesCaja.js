export const obtenerIniciales = (nombre) => {
  if (!nombre) return "?";
  return nombre
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
};