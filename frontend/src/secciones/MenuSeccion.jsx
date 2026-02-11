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

        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-rojo mb-4">
            EXPLORA NUESTRA CARTA
          </h2>
          <p className="text-lg text-gray-100">
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
