import { useState } from "react";

export const useModal = (estadoInicial = false) => { 
  const [estaAbierto, setEstaAbierto] = useState(estadoInicial);

  const abrir = () => setEstaAbierto(true);
  const cerrar = () => setEstaAbierto(false);
  const alternar = () => setEstaAbierto(!estaAbierto);

  return {estaAbierto, abrir, cerrar, alternar};
};