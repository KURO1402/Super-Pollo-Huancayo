import { useEffect, useState } from "react";
import { obtenerCantidadVentasHoyComparacionServicio } from "../servicios/datosServicio";

export const useVentasHoyComparacion = () => {
  const [ventas, setVentas] = useState({
    totalVentasHoy: 0,
    totalVentasAyer: 0,
    porcentajeComparacion: 0,
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const resultado = await obtenerCantidadVentasHoyComparacionServicio();
        setVentas(resultado);
      } catch (error) {
        
      } finally {
        setCargando(false);
      }
    };

    fetchVentas();
  }, []);

  return { ventas, cargando };
};
