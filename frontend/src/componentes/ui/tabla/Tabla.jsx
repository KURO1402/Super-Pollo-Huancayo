export const Tabla = ({ encabezados, registros, cargando }) => {
  
  if (cargando) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-6 py-4 border-b last:border-0 border-gray-100 dark:border-gray-800 animate-pulse">
            <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-gray-200 dark:bg-gray-700 rounded w-36" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-48" />
            </div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 hidden sm:block" />
            <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!registros.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 py-16 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">No se encontraron registros</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
            {encabezados.map((encabezado, index) => (
              <th key={index} comprobante={encabezado} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {encabezado}
              </th>
            ))} 
            </tr>
          </thead>
           <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {registros} 
          </tbody>
        </table>
      </div>
    </div>
  );
};