import { useEffect, useState } from "react";
import { FaChartLine } from "react-icons/fa";
import { obtenerVentasHoyComparacionServicio } from "../../servicios/datosServicio";

const TarjetaVentasHoy = () => {
  const [ventasHoy, setVentasHoy] = useState(0);
  const [ventasAyer, setVentasAyer] = useState(0);
  const [porcentaje, setPorcentaje] = useState(0);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setCargando(true);
        const resultado = await obtenerVentasHoyComparacionServicio();
        setVentasHoy(parseFloat(resultado.totalVentasHoy));
        setVentasAyer(parseFloat(resultado.totalVentasAyer));
        setPorcentaje(parseFloat(resultado.porcentajeComparacion));
      } catch (error) {

      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) {
    return (
      <div className="text-right">
        <div className="text-2xl font-bold text-gray-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="text-right">
      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
        S/ {ventasHoy.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
      <div
        className={`text-sm flex items-center gap-1 ${
          porcentaje >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
        }`}
      >
        <FaChartLine size={12} />
        {porcentaje >= 0 ? "+" : ""}
        {porcentaje.toFixed(2)}% vs ayer
      </div>
    </div>
  );
};

export default TarjetaVentasHoy;
