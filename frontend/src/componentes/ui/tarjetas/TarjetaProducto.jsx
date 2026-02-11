import { useState, useRef, useEffect } from 'react';

const TarjetaProducto = ({ producto }) => {
  const [imagenActual, setImagenActual] = useState(0);
  const [touchInicio, setTouchInicio] = useState(null);
  const intervaloRef = useRef(null);
  
  const imagenes = producto.imagenes || [];
  const tieneMultiplesImagenes = imagenes.length >= 2;
  const primeraImagen = imagenes[0]?.url_imagen || 'https://via.placeholder.com/300x200?text=Sin+Imagen';
  const imagenPorDefecto = 'https://via.placeholder.com/300x200?text=Sin+Imagen';

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(precio);
  };

  useEffect(() => {
    if (tieneMultiplesImagenes) {
      intervaloRef.current = setInterval(() => {
        setImagenActual((prev) => (prev + 1) % imagenes.length);
      }, 4000);
    }
    return () => {
      if (intervaloRef.current) clearInterval(intervaloRef.current);
    };
  }, [tieneMultiplesImagenes, imagenes.length]);

  const handleTouchStart = (e) => {
    setTouchInicio(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchInicio || !tieneMultiplesImagenes) return;
    
    const touchFin = e.touches[0].clientX;
    const diferencia = touchInicio - touchFin;
    
    if (Math.abs(diferencia) > 50) {
      if (diferencia > 0) {
        setImagenActual((prev) => (prev + 1) % imagenes.length);
      } else {
        setImagenActual((prev) => (prev - 1 + imagenes.length) % imagenes.length);
      }
      setTouchInicio(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchInicio(null);
  };

  const cambiarImagen = (direccion, e) => {
    e?.stopPropagation();
    if (!tieneMultiplesImagenes) return;
    
    if (direccion === 'siguiente') {
      setImagenActual((prev) => (prev + 1) % imagenes.length);
    } else {
      setImagenActual((prev) => (prev - 1 + imagenes.length) % imagenes.length);
    }
  };

  return (
    <div className="bg-azul-secundario rounded-2xl border border-gray-800 overflow-hidden hover:shadow-2xl transition-all duration-500 group relative flex flex-col h-full">
      <div 
        className="relative h-48 overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full">
          {imagenes.map((img, idx) => (
            <img
              key={img.id_imagen_producto}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                idx === imagenActual 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-105'
              }`}
              src={img.url_imagen}
              alt={`${producto.nombre_producto} - Imagen ${idx + 1}`}
              onError={(e) => {
                e.target.src = imagenPorDefecto;
              }}
            />
          ))}
          
          {!imagenes.length && (
            <img
              className="w-full h-full object-cover"
              src={imagenPorDefecto}
              alt="Sin imagen disponible"
            />
          )}
        </div>

        {tieneMultiplesImagenes && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-10">
            {imagenes.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setImagenActual(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  idx === imagenActual 
                    ? 'w-4 bg-red-500' 
                    : 'bg-white/60 hover:bg-white'
                }`}
                aria-label={`Ir a imagen ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {tieneMultiplesImagenes && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 z-10">
            <span className="text-red-500 font-bold">{imagenActual + 1}</span>
            <span className="text-white/60">/</span>
            <span className="text-white/80">{imagenes.length}</span>
          </div>
        )}

        {tieneMultiplesImagenes && (
          <>
            <button
              onClick={(e) => cambiarImagen('anterior', e)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-red-600 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-20"
              aria-label="Imagen anterior"
            >
              <span className="text-white text-lg">←</span>
            </button>
            <button
              onClick={(e) => cambiarImagen('siguiente', e)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-red-600 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-20"
              aria-label="Siguiente imagen"
            >
              <span className="text-white text-lg">→</span>
            </button>
          </>
        )}
-
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="w-12 h-1 bg-red-600 mb-3 transform group-hover:scale-x-125 transition-transform duration-500"></div>
        
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-red-500 transition-colors duration-300 line-clamp-2">
          {producto.nombre_producto}
        </h3>
        
        <p className="text-gray-400 text-sm mb-4 leading-relaxed border-l-2 border-red-600 pl-3 line-clamp-3 flex-1">
          {producto.descripcion_producto || 'Sin descripción disponible'}
        </p>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-800 mt-auto">
          <span className="text-rojo font-bold text-2xl tracking-wide">
            {formatearPrecio(producto.precio_producto)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TarjetaProducto;