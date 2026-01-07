import { FiCheck } from 'react-icons/fi';

const Mesa4Personas = ({ 
  numero, 
  id, 
  seleccionada = false, 
  disponible = true,
  onClick 
}) => {
  const handleClick = () => {
    if (disponible && onClick) {
      onClick({ id, numero, capacidad: 4 });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!disponible}
      className="relative w-45 h-35 group"
    >
      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 transform
        ${seleccionada 
          ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-xl shadow-red-500/30' 
          : disponible 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-gray-700 group-hover:to-gray-800' 
            : 'bg-gradient-to-br from-gray-900 to-gray-950 opacity-50'
        } 
        ${seleccionada ? 'scale-105 ring-4 ring-red-400/50' : ''}
        ${disponible && !seleccionada ? 'group-hover:scale-102' : ''}`}
      />
      
      {/* Marco de la mesa */}
      <div className={`absolute inset-3 rounded-xl border-2 transition-all duration-300
        ${seleccionada 
          ? 'border-red-300 shadow-inner shadow-red-300/20' 
          : disponible 
            ? 'border-gray-600 group-hover:border-gray-500' 
            : 'border-gray-700'
        }`}>
        
        {/* Silla superior izquierda*/}
        <div className="absolute -top-4 left-4"> {/* Posición fija en lugar de porcentaje */}
          <div className={`w-6 h-5 rounded-md transition-all duration-300 relative
            ${seleccionada 
              ? 'bg-gradient-to-b from-red-300 to-red-400 shadow-md shadow-red-300/30' 
              : 'bg-gradient-to-b from-gray-600 to-gray-700'
            }`}>
            {/* Respaldo de la silla */}
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 rounded-t-md bg-gradient-to-b from-gray-800 to-gray-700"></div>
            {/* Patas de la silla */}
            <div className="absolute -bottom-0.5 left-1/4 w-1 h-0.5 rounded-b bg-gray-800"></div>
            <div className="absolute -bottom-0.5 right-1/4 w-1 h-0.5 rounded-b bg-gray-800"></div>
          </div>
        </div>
        
        {/* Silla superior derecha */}
        <div className="absolute -top-4 right-4">
          <div className={`w-6 h-5 rounded-md transition-all duration-300 relative
            ${seleccionada 
              ? 'bg-gradient-to-b from-red-300 to-red-400 shadow-md shadow-red-300/30' 
              : 'bg-gradient-to-b from-gray-600 to-gray-700'
            }`}>
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 rounded-t-md bg-gradient-to-b from-gray-800 to-gray-700"></div>
            <div className="absolute -bottom-0.5 left-1/4 w-1 h-0.5 rounded-b bg-gray-800"></div>
            <div className="absolute -bottom-0.5 right-1/4 w-1 h-0.5 rounded-b bg-gray-800"></div>
          </div>
        </div>
        
        {/* Silla inferior izquierda */}
        <div className="absolute -bottom-4 left-4"> 
          <div className={`w-6 h-5 rounded-md transition-all duration-300 relative
            ${seleccionada 
              ? 'bg-gradient-to-t from-red-300 to-red-400 shadow-md shadow-red-300/30' 
              : 'bg-gradient-to-t from-gray-600 to-gray-700'
            }`}>
            {/* Respaldo de la silla */}
            <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 rounded-b-md bg-gradient-to-t from-gray-800 to-gray-700"></div>
            <div className="absolute -top-0.5 left-1/4 w-1 h-0.5 rounded-t bg-gray-800"></div>
            <div className="absolute -top-0.5 right-1/4 w-1 h-0.5 rounded-t bg-gray-800"></div>
          </div>
        </div>
        
        {/* Silla inferior derecha */}
        <div className="absolute -bottom-4 right-4">
          <div className={`w-6 h-5 rounded-md transition-all duration-300 relative
            ${seleccionada 
              ? 'bg-gradient-to-t from-red-300 to-red-400 shadow-md shadow-red-300/30' 
              : 'bg-gradient-to-t from-gray-600 to-gray-700'
            }`}>
            <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 rounded-b-md bg-gradient-to-t from-gray-800 to-gray-700"></div>
            <div className="absolute -top-0.5 left-1/4 w-1 h-0.5 rounded-t bg-gray-800"></div>
            <div className="absolute -top-0.5 right-1/4 w-1 h-0.5 rounded-t bg-gray-800"></div>
          </div>
        </div>
        
        <div className={`absolute inset-4 flex items-center justify-center rounded-lg
          ${seleccionada ? 'bg-gradient-to-br from-red-400/90 to-red-500/90' : 'bg-gradient-to-br from-gray-700 to-gray-800'}`}>
          
          {/* Detalles de la mesa */}
          <div className={`absolute inset-0.5 rounded-md border ${
            seleccionada ? 'border-red-300/30' : 'border-gray-600/30'
          }`}></div>
          
          {/* Patas de la mesa */}
          <div className="absolute -left-1 bottom-0 w-0.5 h-1.5 bg-gradient-to-t from-gray-800 to-gray-900 rounded-t"></div>
          <div className="absolute -right-1 bottom-0 w-0.5 h-1.5 bg-gradient-to-t from-gray-800 to-gray-900 rounded-t"></div>
          
          {/* Número de mesa */}
          <div className="relative z-10">
            <div className={`text-xl font-bold drop-shadow-lg
              ${seleccionada 
                ? 'text-white' 
                : 'text-gray-200'
              }`}>
              {numero}
            </div>
            <div className="text-[8px] font-semibold text-gray-400 mt-0.5 text-center">
              MESA
            </div>
          </div>
          
          {/* Efecto de brillo */}
          <div className={`absolute top-0 left-0 w-full h-1/2 rounded-t-lg bg-gradient-to-b from-white/10 to-transparent
            ${seleccionada ? 'from-red-300/20' : 'from-white/5'}`}></div>
        </div>
      </div>
      
      {/* Indicador de selección */}
      {seleccionada && (
        <div className="absolute -top-1 -right-1 z-20 animate-pulse">
          <div className="bg-gradient-to-br from-white to-gray-100 rounded-full p-1 shadow-xl">
            <FiCheck className="w-3 h-3 text-red-600" />
          </div>
        </div>
      )}
      
      {/* Indicador de no disponible */}
      {!disponible && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-gray-900/80 rounded-full p-1">
            <div className="w-4 h-0.5 bg-gray-500 rotate-45"></div>
          </div>
        </div>
      )}
      
      {/* Info flotante simplificada */}
      <div className={`absolute -bottom-5 left-1/2 transform -translate-x-1/2
        transition-all duration-300 opacity-0 group-hover:opacity-100
        ${seleccionada ? 'opacity-100' : ''}`}>
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-full px-2 py-1 shadow-lg">
          <span className="text-[10px] font-semibold text-gray-300">
            Mesa {numero}
          </span>
        </div>
      </div>
      
      {/* Efecto de hover */}
      {disponible && !seleccionada && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent animate-shimmer"></div>
        </div>
      )}
    </button>
  );
};
export default Mesa4Personas;