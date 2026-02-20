import { useCallback } from "react";

export const usePaginacion = ({ paginaActual, limite, total, onPagina, onLimite }) => { 

  const offset = (paginaActual -1) * limite; 
  const totalPaginas = Math.max(Math.ceil(total / limite), 1);
  const hayAnterior    = paginaActual > 1;
  const haySiguiente   = paginaActual < totalPaginas;
  const irAPagina     = useCallback((n) => { if (n >= 1 && n <= totalPaginas) onPagina(n); }, [totalPaginas, onPagina]);
  const siguiente     = useCallback(() => { if (haySiguiente) onPagina(paginaActual + 1); }, [haySiguiente, paginaActual, onPagina]);
  const anterior      = useCallback(() => { if (hayAnterior)  onPagina(paginaActual - 1); }, [hayAnterior,  paginaActual, onPagina]);
  const cambiarLimite = useCallback((n) => onLimite(n),           [onLimite]);

  const paginas = (() => {
    if (totalPaginas <= 7) return Array.from({ length: totalPaginas }, (_, i) => i + 1);
    const rango  = 2;
    const inicio = Math.max(2, paginaActual - rango);
    const fin    = Math.min(totalPaginas - 1, paginaActual + rango);
    const arr    = [1];
    if (inicio > 2) arr.push('...');
    for (let i = inicio; i <= fin; i++) arr.push(i);
    if (fin < totalPaginas - 1) arr.push('...');
    arr.push(totalPaginas);
    return arr;
  })();

  return { 
    paginaActual, limite, total, totalPaginas,
    offset, hayAnterior, haySiguiente, paginas,
    irAPagina, siguiente, anterior, cambiarLimite,
  };
};
