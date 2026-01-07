import { useState, useEffect } from "react";
import MenuCategorias from "../componentes/MenuCategorias";
import MenuListado from "../componentes/MenuListado";
import { obtenerProductosServicio } from "../servicios/fuenteDatosServicio";

const MenuSeccion = () => {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");
  const [todosLosProductos, setTodosLosProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargando(true);
        setError(null);
        
        const respuesta = await obtenerProductosServicio();
        
        let productosData = [];
        
        if (respuesta && respuesta.productos) {
          productosData = respuesta.productos;
        } else if (respuesta && Array.isArray(respuesta)) {
          productosData = respuesta;
        } else {
          throw new Error("Formato de respuesta inválido");
        }
        setTodosLosProductos(productosData);
        
      } catch (error) {
        setError(error.message || "Error al cargar los productos");
        setTodosLosProductos([]);
      } finally {
        setCargando(false);
      }
    };

    cargarProductos();
  }, []);

  useEffect(() => {
    if (categoriaSeleccionada === "Todos") {
      setProductosFiltrados(todosLosProductos);
    } else {
      const filtrados = todosLosProductos.filter(producto => {
        const categoriaProducto = producto.nombreCategoria?.toLowerCase() || '';

        const mapeoEspecifico = {
          "Pollos": (cat) => cat.includes("pollo"),
          "Bebidas": (cat) => cat.includes("bebida") || cat.includes("gaseosa"),
          "Extras": (cat) => cat.includes("porcion") || cat.includes("extra"),
          "Postres": (cat) => cat.includes("postre")
        };

        const filtro = mapeoEspecifico[categoriaSeleccionada];
        const resultado = filtro ? filtro(categoriaProducto) : false;
        
        return resultado;
      });

      setProductosFiltrados(filtrados);
    }
  }, [categoriaSeleccionada, todosLosProductos]);

  const handleCategoriaChange = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };


  return (
    <section
      id="menu"
      className="bg-azul-primario py-16 px-6"
      aria-labelledby="menu-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            id="menu-heading"
            className="text-4xl font-bold text-rojo mb-4"
          >
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
          productos={productosFiltrados}
          cargando={cargando}
          error={error}
          categoriaSeleccionada={categoriaSeleccionada}
        />
      </div>
    </section>
  );
}

export default MenuSeccion;