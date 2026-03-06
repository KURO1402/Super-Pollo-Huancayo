import { FaChartLine } from "react-icons/fa";

const TarjetaVentasHoy = ({ ventasHoy = 0, porcentaje = 0, cargando }) => {
  const esPositivo = parseFloat(porcentaje) >= 0;

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
        {ventasHoy} ventas
      </div>
      <div className={`text-sm flex items-center gap-1 ${esPositivo ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
        <FaChartLine size={12} />
        {esPositivo ? "+" : ""}{parseFloat(porcentaje).toFixed(2)}% vs ayer
      </div>
    </div>
  );
};

export default TarjetaVentasHoy;