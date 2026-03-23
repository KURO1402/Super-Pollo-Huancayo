import { useEffect, useState } from "react";
import { FiPlus, FiFileText } from "react-icons/fi";
import { useTipoComprobanteStore } from "../../store/useTipoComprobanteStore";
import { useModal } from "../../hooks/useModal";
import { useConfirmacion } from "../../hooks/useConfirmacion";
import Modal from "../../componentes/ui/modal/Modal";
import { ModalConfirmacion } from "../../componentes/ui/modal/ModalConfirmacion";
import GridTiposComprobante from "../../componentes/panel-admin/configuracion/GridTiposComprobante";
import FormularioTipoComprobante from "../../componentes/panel-admin/configuracion/FormularioTipoComprobante";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const TiposComprobantePagina = () => {
  const {
    tiposComprobante, cargando, cargarTiposComprobante,
    crearTipoComprobante, actualizarTipoComprobante, eliminarTipoComprobante, limpiarError,
  } = useTipoComprobanteStore();

  const { estaAbierto, abrir, cerrar } = useModal();
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

  const {
    confirmacionVisible, mensajeConfirmacion, tituloConfirmacion,
    tipoConfirmacion, textoConfirmar, textoCancelar,
    solicitarConfirmacion, ocultarConfirmacion, confirmarAccion,
  } = useConfirmacion();

  useEffect(() => {
    cargarTiposComprobante();
  }, []);

  const handleAbrir = (tipo = null) => {
    setTipoSeleccionado(tipo);
    abrir();
  };

  const handleCerrar = () => {
    setTipoSeleccionado(null);
    limpiarError();
    cerrar();
  };

  const handleSubmit = async (payload) => {
    try {
      if (tipoSeleccionado) {
        await actualizarTipoComprobante(tipoSeleccionado.id_tipo_comprobante, payload);
        mostrarAlerta.exito("Tipo de comprobante actualizado correctamente");
      } else {
        await crearTipoComprobante(payload);
        mostrarAlerta.exito("Tipo de comprobante creado correctamente");
      }
      handleCerrar();
    } catch(err) {
      mostrarAlerta.error(err.message || "Ocurrió un error al guardar");
    }
  };

  const handleSolicitarEliminacion = (tipo) => {
    solicitarConfirmacion(
      `¿Estás seguro de eliminar el tipo de comprobante "${tipo.nombre_tipo_comprobante}"?`,
      async () => {
        await eliminarTipoComprobante(tipo.id_tipo_comprobante);
        mostrarAlerta.exito("Tipo de comprobante eliminado correctamente");
      },
      {
        titulo: "Eliminar tipo de comprobante",
        tipo: "peligro",
        textoConfirmar: "Eliminar",
        textoCancelar: "Cancelar",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full p-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Tipos de Comprobante
              </h1>
              <FiFileText size={32} className="text-gray-700 dark:text-gray-300"/>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {tiposComprobante.length > 0
                ? `${tiposComprobante.length} tipo${tiposComprobante.length !== 1 ? "s" : ""} registrado${tiposComprobante.length !== 1 ? "s" : ""}`
                : "Sin tipos de comprobante registrados"}
            </p>
          </div>
          <button
            onClick={() => handleAbrir()}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm"
          >
            <FiPlus size={16} />
            Nuevo
          </button>
        </div>

        <GridTiposComprobante
          tiposComprobante={tiposComprobante}
          cargando={cargando}
          onEditar={handleAbrir}
          onEliminar={handleSolicitarEliminacion}
        />
      </div>

      <Modal
        estaAbierto={estaAbierto}
        onCerrar={handleCerrar}
        titulo={tipoSeleccionado ? "Editar tipo de comprobante" : "Nuevo tipo de comprobante"}
        tamaño="sm"
        mostrarHeader
        mostrarFooter={false}
      >
        <FormularioTipoComprobante
          tipoComprobante={tipoSeleccionado}
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

export default TiposComprobantePagina;