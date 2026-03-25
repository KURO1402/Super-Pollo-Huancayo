const CampoCheckbox = ({ id, nombre, etiqueta, registro, error, className = '' }) => {
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
        <div className="min-h-[20px]">
          {error && (
            <p className="text-sm text-red-600">
              {error.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampoCheckbox;