import { FiCheck, FiUsers } from 'react-icons/fi';

const Mesa8Personas = ({ 
    numero, 
    id, 
    seleccionada = false, 
    disponible = true,
    onClick 
  }) => {
    const handleClick = () => {
      if (disponible && onClick) {
        onClick({ id, numero, capacidad: 8 });
      }
    };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!disponible}
      className="relative w-85 h-35 group" 
    >
      <div className={`absolute inset-0 rounded-2xl transition-all duration-300 transform
        ${seleccionada 
          ? 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-xl shadow-amber-500/30' 
          : disponible 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 group-hover:from-gray-700 group-hover:to-gray-800' 
            : 'bg-gradient-to-br from-gray-900 to-gray-950 opacity-50'
        } 
        ${seleccionada ? 'scale-105 ring-4 ring-amber-400/50' : ''}
        ${disponible && !seleccionada ? 'group-hover:scale-102' : ''}`}
      />
      
      {/* Marco de la mesa rectangular */}
      <div className={`absolute inset-3 rounded-xl border-2 transition-all duration-300
        ${seleccionada 
          ? 'border-amber-300 shadow-inner shadow-amber-300/20' 
          : disponible 
            ? 'border-gray-600 group-hover:border-gray-500' 
            : 'border-gray-700'
        }`}>
        
        {/* Silla superior izquierda  */}
        <div className="absolute -top-6 left-8">
          <div className={`w-6 h-5 rounded-md transition-all duration-300 relative
            ${seleccionada 
              ? 'bg-gradient-to-b from-amber-300 to-amber-400 shadow-md shadow-amber-300/30' 
              : 'bg-gradient-to-b from-gray-600 to-gray-700'
            }`}>
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 rounded-t-md bg-gradient-to-b from-gray-800 to-gray-700"></div>
            <div className="absolute -bottom-0.5 left-1/4 w-1 h-0.5 rounded-b bg-gray-800"></div>
            <div className="absolute -bottom-0.5 right-1/4 w-1 h-0.5 rounded-b bg-gray-800"></div>
          </div>
        </div>
        
        {/* Silla superior derech */}
        <div className="absolute -top-6 left-24">
          <div className={`w-6 h-5 rounded-md transition-all duration-300 relative
            ${seleccionada 
              ? 'bg-gradient-to-b from-amber-300 to-amber-400 shadow-md shadow-amber-300/30' 
              : 'bg-gradient-to-b from-gray-600 to-gray-700'
            }`}>
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 rounded-t-md bg-gradient-to-b from-gray-800 to-gray-700"></div>
            <div className="absolute -bottom-0.5 left-1/4 w-1 h-0.5 rounded-b bg-gray-800"></div>
            <div className="absolute -bottom-0.5 right-1/4 w-1 h-0.5 rounded-b bg-gray-800"></div>
          </div>
        </div>
        
        {/* Silla superior derecha */}
        <div className="absolute -top-6 right-24">
          <div className={`w-6 h-5 rounded-md transition-all duration-300 relative
            ${seleccionada 
              ? 'bg-gradient-to-b from-amber-300 to-amber-400 shadow-md shadow-amber-300/30' 
              : 'bg-gradient-to-b from-gray-600 to-gray-700'
            }`}>
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 rounded-t-md bg-gradient-to-b from-gray-800 to-gray-700"></div>
            <div className="absolute -bottom-0.5 left-1/4 w-1 h-0.5 rounded-b bg-gray-800"></div>
            <div className="absolute -bottom-0.5 right-1/4 w-1 h-0.5 rounded-b bg-gray-800"></div>
          </div>
        </div>
        
        {/* Silla superior derecha */}
        <div className="absolute -top-6 right-8">
          <div className={`w-6 h-5 rounded-md transition-all duration-300 relative
            ${seleccionada 
              ? 'bg-gradient-to-b from-amber-300 to-amber-400 shadow-md shadow-amber-300/30' 
              : 'bg-gradient-to-b from-gray-600 to-gray-700'
            }`}>
            <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 rounded-t-md bg-gradient-to-b from-gray-800 to-gray-700"></div>
            <div className="absolute -bottom-0.5 left-1/4 w-1 h-0.5 rounded-b bg-gray-800"></div>
            <div className="absolute -bottom-0.5 right-1/4 w-1 h-0.5 rounded-b bg-gray-800"></div>
          </div>
        </div>
        
        {/* Sillas inferiores (4 sillas) - POSICIONES FIJAS Y MEJOR DISTRIBUIDAS */}
        {/* Silla inferior izquierda 1 */}
        <div className="absolute -bottom-6 left-8">
          <div className={`w-6 h-5 rounded-md transition-all duration-300 relative
            ${seleccionada 
              ? 'bg-gradient-to-t from-amber-300 to-amber-400 shadow-md shadow-amber-300/30' 
              : 'bg-gradient-to-t from-gray-600 to-gray-700'
            }`}>
            <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 rounded-b-md bg-gradient-to-t from-gray-800 to-gray-700"></div>
            <div className="absolute -top-0.5 left-1/4 w-1 h-0.5 rounded-t bg-gray-800"></div>
            <div className="absolute -top-0.5 right-1/4 w-1 h-0.5 rounded-t bg-gray-800"></div>
          </div>
        </div>
        
        {/* Silla inferior izquierda 2 */}
        <div className="absolute -bottom-6 left-24">
          <div className={`w-6 h-5 rounded-md transition-all duration-300 relative
            ${seleccionada 
              ? 'bg-gradient-to-t from-amber-300 to-amber-400 shadow-md shadow-amber-300/30' 
              : 'bg-gradient-to-t from-gray-600 to-gray-700'
            }`}>
            <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 rounded-b-md bg-gradient-to-t from-gray-800 to-gray-700"></div>
            <div className="absolute -top-0.5 left-1/4 w-1 h-0.5 rounded-t bg-gray-800"></div>
            <div className="absolute -top-0.5 right-1/4 w-1 h-0.5 rounded-t bg-gray-800"></div>
          </div>
        </div>
        
        {/* Silla inferior derecha 1 */}
        <div className="absolute -bottom-6 right-24">
          <div className={`w-6 h-5 rounded-md transition-all duration-300 relative
            ${seleccionada 
              ? 'bg-gradient-to-t from-amber-300 to-amber-400 shadow-md shadow-amber-300/30' 
              : 'bg-gradient-to-t from-gray-600 to-gray-700'
            }`}>
            <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 rounded-b-md bg-gradient-to-t from-gray-800 to-gray-700"></div>
            <div className="absolute -top-0.5 left-1/4 w-1 h-0.5 rounded-t bg-gray-800"></div>
            <div className="absolute -top-0.5 right-1/4 w-1 h-0.5 rounded-t bg-gray-800"></div>
          </div>
        </div>
        
        {/* Silla inferior derecha 2 */}
        <div className="absolute -bottom-6 right-8">
          <div className={`w-6 h-5 rounded-md transition-all duration-300 relative
            ${seleccionada 
              ? 'bg-gradient-to-t from-amber-300 to-amber-400 shadow-md shadow-amber-300/30' 
              : 'bg-gradient-to-t from-gray-600 to-gray-700'
            }`}>
            <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-4 h-1.5 rounded-b-md bg-gradient-to-t from-gray-800 to-gray-700"></div>
            <div className="absolute -top-0.5 left-1/4 w-1 h-0.5 rounded-t bg-gray-800"></div>
            <div className="absolute -top-0.5 right-1/4 w-1 h-0.5 rounded-t bg-gray-800"></div>
          </div>
        </div>
        
        {/* Mesa central rectangular */}
        <div className={`absolute inset-4 flex items-center justify-center rounded-lg
          ${seleccionada ? 'bg-gradient-to-br from-amber-400/90 to-orange-500/90' : 'bg-gradient-to-br from-gray-700 to-gray-800'}`}>
          
          {/* Patas de la mesa */}
          <div className="absolute -left-2 bottom-0 w-1 h-3 bg-gradient-to-t from-gray-800 to-gray-900 rounded-t"></div>
          <div className="absolute -right-2 bottom-0 w-1 h-3 bg-gradient-to-t from-gray-800 to-gray-900 rounded-t"></div>
          
          {/* Número de mesa */}
          <div className="relative z-10 flex flex-col items-center">
            <div className={`text-2xl font-bold tracking-wider
              ${seleccionada 
                ? 'text-white' 
                : 'text-gray-200'
              }`}>
              {numero}
            </div>
            <div className="text-[9px] font-semibold text-gray-400 mt-0.5 text-center">
              8 PERSONAS
            </div>
          </div>
          
          {/* Efecto de brillo */}
          <div className={`absolute top-0 left-0 w-full h-1/3 rounded-t-lg bg-gradient-to-b from-white/10 to-transparent
            ${seleccionada ? 'from-amber-300/20' : 'from-white/5'}`}></div>
        </div>
      </div>
      
      {/* Indicador de selección */}
      {seleccionada && (
        <div className="absolute -top-2 -right-2 z-20 animate-pulse">
          <div className="bg-gradient-to-br from-white to-gray-100 rounded-full p-1 shadow-xl">
            <FiCheck className="w-3 h-3 text-amber-600" />
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
      <div className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2
        transition-all duration-300 opacity-0 group-hover:opacity-100
        ${seleccionada ? 'opacity-100' : ''}`}>
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-lg">
          <div className="flex items-center gap-2">
            <FiUsers className="w-3 h-3 text-amber-400" />
            <span className="text-xs font-semibold text-gray-300 whitespace-nowrap">
              Mesa {numero} • 8 personas
            </span>
          </div>
        </div>
      </div>
      
      {/* Efecto de hover */}
      {disponible && !seleccionada && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/8 to-transparent animate-shimmer"></div>
        </div>
      )}
    </button>
  );
};

export default Mesa8Personas;