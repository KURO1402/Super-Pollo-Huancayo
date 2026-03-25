const CampoEntrada = ({ 
  id,                  
  nombre,              
  tipo = 'text',     
  etiqueta,           
  marcadorPosicion,   
  icono: Icono,     
  registro,        
  error,        
  className = ''  
}) => {
  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {etiqueta}
      </label>

      <div className="relative">
        {Icono && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icono className="text-gray-400" />
          </div>
        )}
        <input
          type={tipo}
          id={id}
          {...registro(nombre)} 
          className={`
            ${Icono ? 'pl-10' : 'pl-4'} 
            w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-azul-primario focus:border-transparent
            ${error ? 'border-red-500' : 'border-gray-300'}
          `}
          placeholder={marcadorPosicion} 
        />
      </div>
      <div className="min-h-[20px]">
        {error && (
          <p className=" text-sm text-red-600 transition-all duration-200">
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default CampoEntrada;