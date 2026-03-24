import { useState, useEffect } from "react";
import { obtenerReservasMesComparacionServicio } from "../servicios/datosServicio";

export const useReservasMesComparacion = () => {
  const [reservas, setReservas] = useState({
    total_reservas_mes: 0,
    total_reservas_mes_anterior: 0,
    porcentaje_comparacion: 0,
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const resultado = await obtenerReservasMesComparacionServicio();
        setReservas(resultado);
      } catch (error) {
        setReservas({
          total_reservas_mes: 0,
          total_reservas_mes_anterior: 0,
          porcentaje_comparacion: 0,
        });
      } finally {
        setCargando(false);
      }
    };

    fetchReservas();
  }, []);

  return { reservas, cargando };
};