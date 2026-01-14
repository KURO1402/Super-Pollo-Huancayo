import { useState, useEffect } from "react";
import { obtenerReservasHoyComparacionServicio } from "../servicios/datosServicio";

export const useReservasHoyComparacion = () => {
  const [reservas, setReservas] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const resultado = await obtenerReservasHoyComparacionServicio();
        setReservas(resultado);
      } catch (error) {
        
      } finally {
        setCargando(false);
      }
    };
    obtenerDatos();
  }, []);

  return { reservas, cargando };
};
