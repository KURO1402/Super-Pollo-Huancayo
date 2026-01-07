export const Tabla = ({ encabezados ,registros }) => {
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