import TarjetaProducto from "./ui/tarjetas/TarjetaProducto";

const MenuListado = ({ productos, cargando, error, categoriaSeleccionada }) => {

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-100">Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <p className="text-gray-100">No se encontraron los productos</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!productos || productos.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-4">🛒</div>
          <p className="text-gray-100">
            {categoriaSeleccionada === "Todos" 
              ? "No hay productos disponibles" 
              : `No hay productos en la categoría ${categoriaSeleccionada}`
            }
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {productos.map((producto) => (
        <TarjetaProducto 
          key={producto.idProducto || producto.id} 
          producto={producto} 
        />
      ))}
    </div>
  );
};

export default MenuListado;