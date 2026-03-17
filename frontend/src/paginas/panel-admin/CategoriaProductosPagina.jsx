import { useEffect, useState } from "react";
import { FiPlus, FiGrid } from "react-icons/fi";
import { useCategoriaStore } from "../../store/useCategoriaStore";
import { useModal } from "../../hooks/useModal";
import { useConfirmacion } from "../../hooks/useConfirmacion";
import Modal from "../../componentes/ui/modal/Modal";
import { ModalConfirmacion } from "../../componentes/ui/modal/ModalConfirmacion";
import GridCategorias from "../../componentes/panel-admin/configuracion/GridCategorias";
import FormularioCategoria from "../../componentes/panel-admin/configuracion/FormularioCategoria";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const CategoriaProductosPagina = () => {
  const {
    categorias, cargando, cargarCategorias,
    crearCategoria, actualizarCategoria, eliminarCategoria, limpiarError,
  } = useCategoriaStore();

  const { estaAbierto, abrir, cerrar } = useModal();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const {
    confirmacionVisible, mensajeConfirmacion, tituloConfirmacion,
    tipoConfirmacion, textoConfirmar, textoCancelar,
    solicitarConfirmacion, ocultarConfirmacion, confirmarAccion,
  } = useConfirmacion();

  useEffect(() => {
    cargarCategorias();
  }, []);

  const handleAbrir = (categoria = null) => {
    setCategoriaSeleccionada(categoria);
    abrir();
  };

  const handleCerrar = () => {
    setCategoriaSeleccionada(null);
    limpiarError();
    cerrar();
  };

  const handleSubmit = async (payload) => {
    try {
      if (categoriaSeleccionada) {
        await actualizarCategoria(categoriaSeleccionada.id_categoria, payload);
        mostrarAlerta.exito("Categoría actualizada correctamente");
      } else {
        await crearCategoria(payload);
        mostrarAlerta.exito("Categoría creada correctamente");
      }
      handleCerrar();
    } catch (err) {
      mostrarAlerta.error(err.message || "Ocurrió un error al guardar");
    }
  };

  const handleSolicitarEliminacion = (categoria) => {
    solicitarConfirmacion(
      `¿Estás seguro de eliminar la categoría "${categoria.nombre_categoria}"?`,
      async () => {
        try {
          await eliminarCategoria(categoria.id_categoria);
          mostrarAlerta.exito("Categoría eliminada correctamente");
        } catch (err) {
          mostrarAlerta.error(err.message || "Error al eliminar la categoría");
        }
      },
      {
        titulo: "Eliminar categoría",
        tipo: "peligro",
        textoConfirmar: "Eliminar",
        textoCancelar: "Cancelar",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Categorías de Productos
              </h1>
              <FiGrid size={28} className="text-gray-700 dark:text-gray-300" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {categorias.length > 0
                ? `${categorias.length} categoría${categorias.length !== 1 ? "s" : ""} registrada${categorias.length !== 1 ? "s" : ""}`
                : "Sin categorías registradas"}
            </p>
          </div>
          <button
            onClick={() => handleAbrir()}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
          >
            <FiPlus size={16} />
            Nueva
          </button>
        </div>

        <GridCategorias
          categorias={categorias}
          cargando={cargando}
          onEditar={handleAbrir}
          onEliminar={handleSolicitarEliminacion}
        />
      </div>

      <Modal
        estaAbierto={estaAbierto}
        onCerrar={handleCerrar}
        titulo={categoriaSeleccionada ? "Editar categoría" : "Nueva categoría"}
        tamaño="sm"
        mostrarHeader
        mostrarFooter={false}
      >
        <FormularioCategoria
          categoria={categoriaSeleccionada}
          onSubmit={handleSubmit}
          onCancelar={handleCerrar}
          cargando={cargando}
        />
      </Modal>

      <ModalConfirmacion
        visible={confirmacionVisible}
        onCerrar={ocultarConfirmacion}
        onConfirmar={confirmarAccion}
        titulo={tituloConfirmacion}
        mensaje={mensajeConfirmacion}
        textoConfirmar={textoConfirmar}
        textoCancelar={textoCancelar}
        tipo={tipoConfirmacion}
      />
    </div>
  );
};

export default CategoriaProductosPagina;