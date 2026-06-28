const CampoCheckbox = ({ id, nombre, etiqueta, registro, error, className = '' }) => {
  return (
    <div className={`flex items-start ${className}`}>
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={id}
          {...registro(nombre)}
          className={`
            h-4 w-4 text-gray-200 focus:ring-gray-200 border-gray-300 rounded cursor-pointer
            ${error ? 'border-red-500' : ''}
          `}
        />
      </div>
      <div className="ml-2">
        <label htmlFor={id} className="text-sm text-gray-200">
          {etiqueta}
        </label>
        <div className="min-h-5">
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