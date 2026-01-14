import { useState } from "react";

export const useConfirmacion = () => {
  const [estadoConfirmacion, setEstadoConfirmacion] = useState({
    visible: false,
    mensaje: "",
    onConfirmar: null,
    titulo: "Confirmar acción",
    tipo: "default",
    textoConfirmar: "Confirmar",
    textoCancelar: "Cancelar",
  });

  const solicitarConfirmacion = (mensaje, onConfirmar, config = {}) => {
    setEstadoConfirmacion({
      visible: true,
      mensaje,
      onConfirmar,
      titulo: config.titulo || "Confirmar acción",
      tipo: config.tipo || "default",
      textoConfirmar: config.textoConfirmar || "Confirmar",
      textoCancelar: config.textoCancelar || "Cancelar",
    });
  };

  const ocultarConfirmacion = () => {
    setEstadoConfirmacion(prev => ({
      ...prev,
      visible: false
    }));
  };

  const confirmarAccion = () => {
    if (estadoConfirmacion.onConfirmar) {
      estadoConfirmacion.onConfirmar();
    }
    ocultarConfirmacion();
  };

  return {
    confirmacionVisible: estadoConfirmacion.visible,
    mensajeConfirmacion: estadoConfirmacion.mensaje,
    tituloConfirmacion: estadoConfirmacion.titulo,
    tipoConfirmacion: estadoConfirmacion.tipo,
    textoConfirmar: estadoConfirmacion.textoConfirmar,
    textoCancelar: estadoConfirmacion.textoCancelar,
    
    solicitarConfirmacion,
    ocultarConfirmacion,
    confirmarAccion,
  };
};