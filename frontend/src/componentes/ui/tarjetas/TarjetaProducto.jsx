const TarjetaProducto = ({ producto }) => {
  
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio);
  };

  return (
    <div className="bg-azul-secundario rounded-2xl border border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-500 group relative flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={producto.urlImagen || producto.imagen || 'https://via.placeholder.com/300x200?text=Sin+Imagen'}
          alt={producto.nombreProducto}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Imagen+No+Disponible';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute top-0 right-0 w-20 h-20 bg-red-600 opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500"></div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="w-12 h-1 bg-red-600 mb-3 transform group-hover:scale-x-125 transition-transform duration-500"></div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors duration-300 line-clamp-2">
          {producto.nombreProducto}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 leading-relaxed border-l-2 border-red-600 pl-3 line-clamp-3 flex-1">
          {producto.descripcionProducto || 'Sin descripción disponible'}
        </p>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-800 mt-auto">
          <span className="text-rojo font-bold text-2xl tracking-wide">
            {formatearPrecio(producto.precio || producto.precioProducto || 0)}
          </span>
          
          <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
            {producto.nombreCategoria}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TarjetaProducto;