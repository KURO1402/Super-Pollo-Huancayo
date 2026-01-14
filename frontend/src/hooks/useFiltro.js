import { useState } from "react";

export const useFiltro = (valorInicial = "todos") => {
  const [filtro, setFiltro] = useState(valorInicial);

  const aplicarFiltros = (items, campo = "estado") => {
    if (filtro === "todos") return items;
    return items.filter(item => String(item[campo]) === String(filtro));
  };

  return { filtro, setFiltro, aplicarFiltros };
};