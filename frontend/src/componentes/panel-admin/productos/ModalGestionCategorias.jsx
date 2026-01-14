import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { useCategorias } from "../../../hooks/useCategorias";
import { useModal } from "../../../hooks/useModal";
import TablaCategorias from "./TablaCategorias";
import ModalCategoria from "./ModalCategoria";

const ModalGestionCategorias = () => {
  const {
    categorias,
    loading,
    error,
    cargarCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
  } = useCategorias();

  const modalCategoria = useModal();
  const modalConfirmacion = useModal();

  const [categoriaEditar, setCategoriaEditar] = useState(null);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const handleAbrirCrear = () => {
    setCategoriaEditar(null);
    modalCategoria.abrir();
  };

  const handleAbrirEditar = (categoria) => {
    setCategoriaEditar(categoria);
    modalCategoria.abrir();
  };

  const handleGuardarCategoria = async (nombreCategoria) => {
    try {
      if (categoriaEditar) {
        await actualizarCategoria(categoriaEditar.idCategoria, nombreCategoria);
      } else {
        await crearCategoria(nombreCategoria);
      }
      modalCategoria.cerrar();
    } catch (error) {
    }
  };

  const handleEliminarCategoria = async (idCategoria) => {
    try {
      await eliminarCategoria(idCategoria);
      modalConfirmacion.cerrar();
    } catch (error) {
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {categorias.length} categorías registradas
          </p>
        </div>
        <button
          onClick={handleAbrirCrear}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          disabled={loading}
        >
          <FiPlus className="w-4 h-4" />
          Nueva Categoría
        </button>
      </div>

      <TablaCategorias
        categorias={categorias}
        loading={loading}
        error={error}
        onEditar={handleAbrirEditar}
      />

      <ModalCategoria
        estaAbierto={modalCategoria.estaAbierto}
        onCerrar={modalCategoria.cerrar}
        onGuardar={handleGuardarCategoria}
        categoriaEditar={categoriaEditar}
        loading={loading}
        categoriasExistentes={categorias}
      />
    </div>
  );
};

export default ModalGestionCategorias;