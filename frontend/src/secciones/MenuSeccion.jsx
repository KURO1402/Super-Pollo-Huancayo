import { useState, useEffect } from "react";
import MenuCategorias from "../componentes/MenuCategorias";
import MenuListado from "../componentes/MenuListado";
import { obtenerProductoCatalogoServicio } from "../servicios/productoServicios";

const MenuSeccion = () => {

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarProductos = async (categoriaId = null) => {
    try {

      setCargando(true);
      setError(null);

      const respuesta = await obtenerProductoCatalogoServicio(categoriaId);

      let productosData = [];

      if (respuesta && respuesta.productos) {
        productosData = respuesta.productos;
      } else if (Array.isArray(respuesta)) {
        productosData = respuesta;
      } else {
        throw new Error("Formato de respuesta inválido");
      }

      setProductos(productosData);

    } catch (error) {
      setError(error.message || "Error al cargar productos");
      setProductos([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  const handleCategoriaChange = (categoria) => {

    setCategoriaSeleccionada(categoria);

    if (categoria.id === "Todos") {
      cargarProductos();
    } else {
      cargarProductos(categoria.id);
    }
  };

  return (
    <section
      id="menu"
      className="bg-azul-primario py-16 px-6"
      aria-labelledby="menu-heading"
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-12 opacity-0 animate-fade-up">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="block w-8 h-px bg-amarillo" />
            <span className="text-amarillo text-xs font-semibold uppercase tracking-[0.2em]">
              Nuestra carta
            </span>
            <span className="block w-8 h-px bg-amarillo" />
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            EXPLORA NUESTRA{" "}
            <span className="text-rojo relative inline-block">
              CARTA
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-rojo rounded-full opacity-50" />
            </span>
          </h2>
          <div className="w-16 h-0.5 bg-amarillo mx-auto mt-5 rounded-full" />
          <p className="text-base text-gray-300 mt-5 max-w-md mx-auto">
            Productos exquisitos, deliciosos y hechos con calidad y cariño.
          </p>
        </div>

        <MenuCategorias
          categoriaSeleccionada={categoriaSeleccionada}
          onCategoriaChange={handleCategoriaChange}
        />

        <MenuListado
          productos={productos}
          cargando={cargando}
          error={error}
          categoriaSeleccionada={categoriaSeleccionada}
        />

      </div>
    </section>
  );
};

export default MenuSeccion;
