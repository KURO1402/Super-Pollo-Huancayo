export const formatMoneda = (valor) => {
  const numero = Number(valor);
  if (isNaN(numero)) return "---";
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN", 
    minimumFractionDigits: 2,
  }).format(numero);
};

export const calcularDiferencia = (inicial, final) => {
  const i = Number(inicial);
  const f = Number(final);
  if (isNaN(i) || isNaN(f)) return null;
  return f - i;
};