import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useTipoDocumentoStore } from "../../store/useTipoDocumentoStore";
import { useModal } from "../../hooks/useModal";
import { useConfirmacion } from "../../hooks/useConfirmacion";
import Modal from "../../componentes/ui/modal/Modal";
import { ModalConfirmacion } from "../../componentes/ui/modal/ModalConfirmacion";
import GridTiposDocumento from "../../componentes/panel-admin/configuracion/GridTiposDocumento";
import FormularioTipoDocumento from "../../componentes/panel-admin/configuracion/FormularioTipoDocumento";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const TiposDocumentoPagina = () => {
  const {
    tiposDocumento, cargando, cargarTiposDocumento,
    crearTipoDocumento, actualizarTipoDocumento, eliminarTipoDocumento, limpiarError,
  } = useTipoDocumentoStore();

  const { estaAbierto, abrir, cerrar } = useModal();
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

  const {
    confirmacionVisible, mensajeConfirmacion, tituloConfirmacion,
    tipoConfirmacion, textoConfirmar, textoCancelar,
    solicitarConfirmacion, ocultarConfirmacion, confirmarAccion,
  } = useConfirmacion();

  useEffect(() => {
    cargarTiposDocumento();
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
        await actualizarTipoDocumento(tipoSeleccionado.id_tipo_documento, payload);
        mostrarAlerta.exito("Tipo de documento actualizado correctamente");
      } else {
        await crearTipoDocumento(payload);
        mostrarAlerta.exito("Tipo de documento creado correctamente");
      }
      handleCerrar();
    } catch {
      mostrarAlerta.error("Ocurrió un error al guardar");
    }
  };

  const handleSolicitarEliminacion = (tipo) => {
    solicitarConfirmacion(
      `¿Estás seguro de eliminar el tipo de documento "${tipo.nombre_tipo_documento}"?`,
      async () => {
        await eliminarTipoDocumento(tipo.id_tipo_documento);
        mostrarAlerta.exito("Tipo de documento eliminado correctamente");
      },
      {
        titulo: "Eliminar tipo de documento",
        tipo: "peligro",
        textoConfirmar: "Eliminar",
        textoCancelar: "Cancelar",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Tipos de Documento
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {tiposDocumento.length > 0
                ? `${tiposDocumento.length} tipo${tiposDocumento.length !== 1 ? "s" : ""} registrado${tiposDocumento.length !== 1 ? "s" : ""}`
                : "Sin tipos de documento registrados"}
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

        <GridTiposDocumento
          tiposDocumento={tiposDocumento}
          cargando={cargando}
          onEditar={handleAbrir}
          onEliminar={handleSolicitarEliminacion}
        />
      </div>

      <Modal
        estaAbierto={estaAbierto}
        onCerrar={handleCerrar}
        titulo={tipoSeleccionado ? "Editar tipo de documento" : "Nuevo tipo de documento"}
        tamaño="sm"
        mostrarHeader
        mostrarFooter={false}
      >
        <FormularioTipoDocumento
          tipoDocumento={tipoSeleccionado}
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

export default TiposDocumentoPagina;