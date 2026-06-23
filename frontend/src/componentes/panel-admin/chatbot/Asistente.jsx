import { useState } from 'react';
import BotonFlotanteChat from './BotonFlotanteChat';
import VentanaChat from './VentanaChat';
import { useLocation } from 'react-router-dom';

/**
 * AsistentePollobot
 *
 * Componente raíz del chatbot flotante. Se monta una sola vez en
 * EstructuraBaseAdmin.jsx para que persista entre todas las secciones
 * del panel admin (no se desmonta al cambiar de ruta).
 *
 * Aún no consume ningún store ni servicio — toda la lógica de IA,
 * historial y persistencia se conectará después.
 */
const Asistente = () => {
  const location = useLocation();
  const [abierto, setAbierto] = useState(false);

  if (location.pathname === '/admin/asistente-pollobot') return null;
  
  return (
    <>
      <BotonFlotanteChat abierto={abierto} alClick={() => setAbierto((v) => !v)} />
      <VentanaChat abierto={abierto} alCerrar={() => setAbierto(false)} />
    </>
  );
};

export default Asistente;