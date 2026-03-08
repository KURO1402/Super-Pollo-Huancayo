import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTemaParaGraficos } from "../../hooks/useTemaParaGraficos";
import { obtenerVentasPorMesServicio } from "../../servicios/graficosServicio";

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
          totalVentas: parseFloat(item.total_ventas)
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
    <div className="w-full pt-15">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.1} />
              <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={themeColors.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="mes"
            stroke={themeColors.textSecondary}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            stroke={themeColors.textSecondary}
            tick={{ fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.background,
              border: `1px solid ${themeColors.border}`,
              color: themeColors.text,
              borderRadius: '10px',
              fontSize: '13px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
            formatter={(value) => [`${value} ventas`, "Cantidad"]}
          />
          <Line
            type="monotone"
            dataKey="totalVentas"
            stroke={themeColors.primary}
            strokeWidth={4}
            dot={{ r: 4, fill: themeColors.primary, strokeWidth: 2, stroke: themeColors.background }}
            activeDot={{ r: 7, fill: themeColors.primary, stroke: themeColors.background, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoVentasMes;
