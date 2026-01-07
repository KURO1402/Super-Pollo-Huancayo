import { useState } from "react";

export const usePaginacion = (itemsPorPaginaInicial = 5) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(itemsPorPaginaInicial);

  const paginar = (items) => {
    const totalPaginas = Math.ceil(items.length / itemsPorPagina);
    const inicio = (paginaActual - 1) * itemsPorPagina;
    const datosPaginados = items.slice(inicio, inicio + itemsPorPagina);

    return { datosPaginados, totalPaginas };
  };

  const cambiarItemsPorPagina = (nuevoItemsPorPagina) => {
    setItemsPorPagina(nuevoItemsPorPagina);
    setPaginaActual(1);
  };

  return { 
    paginaActual, 
    setPaginaActual, 
    itemsPorPagina,
    setItemsPorPagina: cambiarItemsPorPagina,
    paginar 
  };
};
