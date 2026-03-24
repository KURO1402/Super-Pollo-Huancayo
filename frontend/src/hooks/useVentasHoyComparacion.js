import { useEffect, useState } from "react";
import { obtenerVentasHoyComparacionServicio } from "../servicios/datosServicio";

export const useVentasHoyComparacion = () => {
  const [ventas, setVentas] = useState({
    total_ventas_hoy: 0,
    total_ventas_ayer: 0,
    porcentaje_comparacion: 0,
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const resultado = await obtenerVentasHoyComparacionServicio();
        setVentas(resultado);
      } catch (error) {
         setVentas({
          total_ventas_hoy: 0,
          total_ventas_ayer: 0,
          porcentaje_comparacion: 0,
        });
      } finally {
        setCargando(false);
      }
    };

    fetchVentas();
  }, []);

  return { ventas, cargando };
};