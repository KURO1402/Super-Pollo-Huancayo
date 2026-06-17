import { useState } from 'react';
import BotonChatbotFlotante from './BotonChatbotFlotante';
import VentanaChatbot from './VentanaChatbot';
import PaginaChatbot from './PaginaChatbot';

const ControladorChatbot = () => {
  const [ventanaAbierta, setVentanaAbierta] = useState(false);
  const [expandida, setExpandida] = useState(false);

  const abrirChatbot = () => {
    setVentanaAbierta(true);
  };

  const cerrarChatbot = () => {
    setVentanaAbierta(false);
  };

  const expandirChatbot = () => {
    setExpandida(true);
    setVentanaAbierta(false);
  };

  const volverDelChatbot = () => {
    setExpandida(false);
  };

  // Si está expandido, mostrar la página completa
  if (expandida) {
    return <PaginaChatbot onVolver={volverDelChatbot} />;
  }

  // Si no está expandido, mostrar botón flotante + ventana
  return (
    <>
      {/* Botón flotante */}
      <BotonChatbotFlotante 
        onClick={abrirChatbot}
        tieneNotificacion={false}
      />

      {/* Ventana flotante */}
      <VentanaChatbot 
        abierta={ventanaAbierta}
        onCerrar={cerrarChatbot}
        onExpandir={expandirChatbot}
      />
    </>
  );
};

export default ControladorChatbot;