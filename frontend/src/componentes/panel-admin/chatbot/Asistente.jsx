import { useState } from 'react';
import BotonFlotanteChat from './BotonFlotanteChat';
import VentanaChat from './VentanaChat';

const Asistente = () => {
  const [abierto, setAbierto] = useState(false);
 
  return (
    <>
      <BotonFlotanteChat abierto={abierto} alClick={() => setAbierto((v) => !v)} />
      <VentanaChat abierto={abierto} alCerrar={() => setAbierto(false)} />
    </>
  );
};

export default Asistente;