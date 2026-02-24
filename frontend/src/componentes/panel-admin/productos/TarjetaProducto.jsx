import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';

export const TarjetaProducto = ({ imagen, onModificarImagen }) => {
  const [mostrarBoton, setMostrarBoton] = useState(false);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
      onMouseEnter={() => setMostrarBoton(true)}
      onMouseLeave={() => setMostrarBoton(false)}
    >
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        <img
          src={imagen.url_imagen}
          alt={imagen.nombre_producto}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
          }}
        />
        
        {mostrarBoton && (
          <div className="absolute inset-0 bg-gray-300/80 bg-opacity-40 dark:bg-gray-900/50 flex items-center justify-center">
            <button
              onClick={() => onModificarImagen(imagen)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              <FiEdit size={16} />
              Modificar Imagen
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
          {imagen.nombre_producto}
        </h3>
      </div>
    </div>
  );
};