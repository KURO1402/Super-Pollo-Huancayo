import { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';

export const TarjetaProducto = ({ imagen, onModificarImagen, onEliminarImagen }) => {
  const [mostrarBotones, setMostrarBotones] = useState(false);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
      onMouseEnter={() => setMostrarBotones(true)}
      onMouseLeave={() => setMostrarBotones(false)}
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
        
        {mostrarBotones && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3">
            <button
              onClick={() => onModificarImagen(imagen)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-full transition-colors cursor-pointer"
              title="Modificar imagen"
            >
              <FiEdit size={18} />
            </button>
            
            <button
              onClick={() => onEliminarImagen(imagen)}
              className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full transition-colors cursor-pointer"
              title="Eliminar imagen"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate">
          {imagen.nombre_producto}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          ID: {imagen.id_imagen_producto}
        </p>
      </div>
    </div>
  );
};