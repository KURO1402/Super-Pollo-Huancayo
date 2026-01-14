export const Paginacion = ({ 
  paginaActual, 
  totalPaginas, 
  alCambiarPagina,
  itemsPorPagina,
  alCambiarItemsPorPagina,
  mostrarSiempre = false
}) => {
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
  const opcionesItems = [5, 10, 15, 20];

  if (!alCambiarItemsPorPagina || typeof alCambiarItemsPorPagina !== 'function') {
    return null;
  }

  if (totalPaginas <= 1 && !mostrarSiempre) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 gap-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
          Mostrar:
        </label>
        <select
          value={itemsPorPagina}
          onChange={(e) => alCambiarItemsPorPagina(Number(e.target.value))}
          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {opcionesItems.map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
          registros
        </span>
      </div>

      {totalPaginas > 1 && (
        <>
          <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Página <span className="font-medium">{paginaActual}</span> de{" "}
            <span className="font-medium">{totalPaginas}</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => alCambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>

            {paginas.map((num) => (
              <button
                key={num}
                onClick={() => alCambiarPagina(num)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  num === paginaActual
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              onClick={() => alCambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};