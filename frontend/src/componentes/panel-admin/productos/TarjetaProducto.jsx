import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';

export const TarjetaProducto = ({ producto, onModificarImagen }) => {
  const [mostrarBoton, setMostrarBoton] = useState(false);

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
      onMouseEnter={() => setMostrarBoton(true)}
      onMouseLeave={() => setMostrarBoton(false)}
    >
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
        <img
          src={producto.urlImagen}
          alt={producto.nombreProducto}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
          }}
        />
        
        {mostrarBoton && (
          <div className="absolute inset-0 bg-gray-300/80 bg-opacity-40 dark:bg-gray-900/50 flex items-center justify-center">
            <button
              onClick={() => onModificarImagen(producto)}
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
          {producto.nombreProducto}
        </h3>
        <p className="text-green-600 dark:text-green-400 font-medium text-sm">
          S/ {parseFloat(producto.precio).toFixed(2)}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {producto.nombreCategoria}
          </span>
          <span className={`text-xs px-2 py-1 rounded-full ${
            producto.usaInsumos === 1 
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
          }`}>
            {producto.usaInsumos === 1 ? 'Con insumos' : 'Sin insumos'}
          </span>
        </div>
      </div>
    </div>
  );
};