// componente funcional para renderizar un campo tipo checkbox
const CampoCheckbox = ({ id, nombre, etiqueta, registro, error, className = '' }) => { // se envian los props
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={id}
          {...registro(nombre)}
          className={`
            h-4 w-4 text-azul-primario focus:ring-azul-primario border-gray-300 rounded cursor-pointer
            ${error ? 'border-red-500' : ''}
          `}
        />
      </div>
      <div className="ml-2">
        <label htmlFor={id} className="text-sm text-gray-900">
          {etiqueta}
        </label>
        {error && (
          <p className="mt-1 text-sm text-red-600">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CampoCheckbox;