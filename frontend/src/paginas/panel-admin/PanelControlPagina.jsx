import { useState } from "react";
import { FaUtensils, FaCalendarAlt } from "react-icons/fa";
import { useVentasHoyComparacion } from "../../hooks/useVentasHoyComparacion";
import { useReservasMesComparacion } from "../../hooks/useReservasMesComparacion";
import { MetricasCard } from "../../componentes/panel-admin/MetricasCard";
import GraficoVentasEgresos from "../../componentes/graficos/GraficoVentasEgresos";
import GraficoMediosPago from "../../componentes/graficos/GraficoMediosPago";
import GraficoProductosPopulares from "../../componentes/graficos/GraficoProductosPopulares";
import GraficoVentasMes from "../../componentes/graficos/GraficoVentasMes";
import TarjetaVentasHoy from "../../componentes/panel-admin/TarjetaVentasHoy";
import { BalanceGeneralCard } from "../../componentes/panel-admin/BalanceGeneralCard";

const PanelControlPagina = () => {
  const { ventas, cargando } = useVentasHoyComparacion();
  const { reservas, cargando: cargandoReservas } = useReservasMesComparacion();
  const [anioMediosPago, setAnioMediosPago] = useState(null); 

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">

      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-blue-500 bg-clip-text ">
              Panel de Control
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Resumen general y métricas del restaurante
            </p>
          </div>
          <TarjetaVentasHoy
            ventasHoy={ventas.total_ventas_hoy}
            porcentaje={ventas.porcentaje_comparacion}
            cargando={cargando}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="transform hover:scale-105 transition-all duration-300">
              <MetricasCard
                titulo="Ventas Realizadas"
                valor={cargando ? "Cargando..." : ventas.total_ventas_hoy}
                cambio={cargando ? 0 : parseFloat(ventas.porcentaje_comparacion)}
                icono={FaUtensils}
              />
            </div>
            <div className="transform hover:scale-105 transition-all duration-300">
              <MetricasCard
                titulo="Reservas Concretadas"
                valor={cargandoReservas ? "Cargando..." : reservas.total_reservas_mes}
                cambio={cargandoReservas ? 0 : parseFloat(reservas.porcentaje_comparacion)}
                icono={FaCalendarAlt}
                comparacion="vs. mes anterior"
              />
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Ingresos y Egresos Mensual
              </h3>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300 font-medium">Ingresos</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600 dark:text-gray-300 font-medium">Egresos</span>
                </div>
              </div>
            </div>
            <GraficoVentasEgresos />
          </div>
        </div>

        <div className="space-y-6">
          <div className="transform hover:scale-105 transition-all duration-300">
            <BalanceGeneralCard />
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Preferencias de Pago de los clientes
              </h3>
              {anioMediosPago && (
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full transition-all duration-200 hover:bg-blue-200 dark:hover:bg-blue-800/50 hover:text-blue-700 dark:hover:text-blue-300 cursor-default">
                  {anioMediosPago}
                </span>
              )}
            </div>
            <GraficoMediosPago onAnioCargado={setAnioMediosPago} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Cantidad de ventas por mes
          </h3>
          <GraficoVentasMes />
        </div>
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
            Productos Populares
          </h3>
          <GraficoProductosPopulares />
        </div>
      </div>
    </div>
  );
};

export default PanelControlPagina;