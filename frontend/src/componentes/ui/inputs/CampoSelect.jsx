const CampoSelect = ({ 
  id, 
  nombre,  
  etiqueta,  
  opciones = [],
  icono: Icono, 
  registro, 
  error, 
  placeholder = "Selecciona una opción", 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {etiqueta} 
      </label>
      <div className="relative">
        {Icono && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Icono className="text-gray-400" />
          </div>
        )}
        <select
          id={id} 
          {...registro(nombre, { valueAsNumber: true })} 
          className={`
            ${Icono ? 'pl-10' : 'pl-4'}
            w-full text-gray-500 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-azul-primario focus:border-transparent
            ${error ? 'border-red-500' : 'border-gray-300'}
            bg-white appearance-none pr-10
          `}
        >
          <option value="" className="text-gray-500" disabled>
            {placeholder}
          </option>
          {opciones.map((opcion) => (
            <option key={opcion.idTipoDocumento} value={opcion.idTipoDocumento} className="absolute text-gray-500">
              {opcion.nombreTipoDocumento}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error.message}
        </p>
      )}
    </div>
  );
};
export default CampoSelect;