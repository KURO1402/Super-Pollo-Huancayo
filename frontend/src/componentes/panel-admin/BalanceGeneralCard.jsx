import { useEffect, useState } from "react";
import { obtenerBalanceAnualServicio } from "../../servicios/datosServicio";

export const BalanceGeneralCard = () => {
  const [balance, setBalance] = useState({
    ingresosTotales: "0.00",
    egresosTotales: "0.00",
    gananciaNeta: "0.00"
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const resultado = await obtenerBalanceAnualServicio();
        setBalance(resultado);
      } catch (error) {

      } finally {
        setCargando(false);
      }
    };

    fetchBalance();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Balance General Anual
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Ingresos Totales</span>
          <span className="text-green-600 dark:text-green-400 font-semibold">
            {cargando ? "Cargando..." : `S/ ${balance.ingresosTotales}`}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Egresos Totales</span>
          <span className="text-red-600 dark:text-red-400 font-semibold">
            {cargando ? "Cargando..." : `S/ ${balance.egresosTotales}`}
          </span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-900 dark:text-white font-semibold">Ganancia Neta</span>
            <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
              {cargando ? "Cargando..." : `S/ ${balance.gananciaNeta}`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
