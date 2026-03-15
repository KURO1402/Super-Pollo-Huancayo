import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useMedioPagoStore } from "../../store/useMedioPagoStore";
import { useModal } from "../../hooks/useModal";
import { useConfirmacion } from "../../hooks/useConfirmacion";
import Modal from "../../componentes/ui/modal/Modal";
import { ModalConfirmacion } from "../../componentes/ui/modal/ModalConfirmacion";
import GridMediosPago from "../../componentes/panel-admin/configuracion/GridMediosPago";
import FormularioMedioPago from "../../componentes/panel-admin/configuracion/FormularioMedioPago";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const MediosPagoPagina = () => {
  const {
    mediosPago, cargando, cargarMediosPago,
    crearMedioPago, actualizarMedioPago, eliminarMedioPago, limpiarError,
  } = useMedioPagoStore();

  const { estaAbierto, abrir, cerrar } = useModal();
  const [medioPagoSeleccionado, setMedioPagoSeleccionado] = useState(null);

  const {
    confirmacionVisible, mensajeConfirmacion, tituloConfirmacion,
    tipoConfirmacion, textoConfirmar, textoCancelar,
    solicitarConfirmacion, ocultarConfirmacion, confirmarAccion,
  } = useConfirmacion();

  useEffect(() => {
    cargarMediosPago();
  }, []);

  const handleAbrir = (medio = null) => {
    setMedioPagoSeleccionado(medio);
    abrir();
  };

  const handleCerrar = () => {
    setMedioPagoSeleccionado(null);
    limpiarError();
    cerrar();
  };

  const handleSubmit = async (payload) => {
    try {
      if (medioPagoSeleccionado) {
        await actualizarMedioPago(medioPagoSeleccionado.id_medio_pago, payload);
        mostrarAlerta.exito("Medio de pago actualizado correctamente");
      } else {
        await crearMedioPago(payload);
        mostrarAlerta.exito("Medio de pago creado correctamente");
      }
      handleCerrar();
    } catch {
      mostrarAlerta.error("Ocurrió un error al guardar");
    }
  };

  const handleSolicitarEliminacion = (medio) => {
    solicitarConfirmacion(
      `¿Estás seguro de eliminar "${medio.nombre_medio_pago}"?`,
      async () => {
        await eliminarMedioPago(medio.id_medio_pago);
        mostrarAlerta.exito("Medio de pago eliminado correctamente");
      },
      {
        titulo: "Eliminar medio de pago",
        tipo: "peligro",
        textoConfirmar: "Eliminar",
        textoCancelar: "Cancelar",
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-5xl mx-auto py-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              Medios de Pago
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {mediosPago.length > 0
                ? `${mediosPago.length} medio${mediosPago.length !== 1 ? "s" : ""} registrado${mediosPago.length !== 1 ? "s" : ""}`
                : "Sin medios de pago registrados"}
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

        <GridMediosPago
          mediosPago={mediosPago}
          cargando={cargando}
          onEditar={handleAbrir}
          onEliminar={handleSolicitarEliminacion}
        />
      </div>

      <Modal
        estaAbierto={estaAbierto}
        onCerrar={handleCerrar}
        titulo={medioPagoSeleccionado ? "Editar medio de pago" : "Nuevo medio de pago"}
        tamaño="sm"
        mostrarHeader
        mostrarFooter={false}
      >
        <FormularioMedioPago
          medioPago={medioPagoSeleccionado}
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

export default MediosPagoPagina;