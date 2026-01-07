import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTemaParaGraficos } from "../../hooks/useTemaParaGraficos";
import { obtenerVentasPorMesServicio } from "../../servicios//graficosServicio";

const GraficoVentasMes = ({ cantidadMeses }) => {
  const { themeColors } = useTemaParaGraficos();
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resultado = await obtenerVentasPorMesServicio(cantidadMeses);
        const datosFormateados = resultado.map(item => ({
          mes: item.mes,
          totalVentas: parseFloat(item.totalVentas)
        }));
        setData(datosFormateados);
      } catch (error) {
        
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [cantidadMeses]);

  if (cargando) {
    return (
      <div className="w-full h-80 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Cargando gráfico...
      </div>
    );
  }

  return (
    <div className="w-full h-80 p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Ventas por Mes
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={data}>
          <CartesianGrid stroke={themeColors.grid} strokeDasharray="3 3" />
          <XAxis dataKey="mes" stroke={themeColors.text} />
          <YAxis stroke={themeColors.text} />
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.background,
              border: `1px solid ${themeColors.grid}`,
              color: themeColors.text,
              borderRadius: '8px'
            }}
            formatter={(value) => [`S/ ${value.toFixed(2)}`, "Ventas"]}
          />
          <Line
            type="monotone"
            dataKey="totalVentas"
            stroke={themeColors.primary}
            strokeWidth={3}
            dot={{ r: 5, fill: themeColors.primary }}
            activeDot={{ r: 8, fill: themeColors.accent }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoVentasMes;
