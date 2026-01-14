import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useTemaParaGraficos } from "../../hooks/useTemaParaGraficos";
import { obtenerResumenVentasEgresosMensualServicio } from "../../servicios/graficosServicio";

const GraficoVentasEgresos = ({ cantidadMeses = 6 }) => {
  const { themeColors } = useTemaParaGraficos();
  const [data, setData] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const respuesta = await obtenerResumenVentasEgresosMensualServicio(cantidadMeses);

        const formateo = respuesta.map(item => ({
          mes: item.mes,
          ingresos: parseFloat(item.ingresos),
          egresos: parseFloat(item.egresos)
        }));

        setData(formateo);
      } catch (error) {

      }
    };

    cargarDatos();
  }, [cantidadMeses]);

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke={themeColors.grid} strokeDasharray="3 3" />
          <XAxis
            dataKey="mes"
            stroke={themeColors.textSecondary}
            fontSize={12}
          />
          <YAxis
            stroke={themeColors.textSecondary}
            fontSize={12}
            tickFormatter={(value) => `S/ ${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.background,
              border: `1px solid ${themeColors.border}`,
              color: themeColors.text,
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value) => [`S/ ${value.toLocaleString()}`, '']}
          />
          <Legend />
          <Bar
            dataKey="ingresos"
            fill={themeColors.primary}
            name="Ingresos"
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="egresos"
            fill={themeColors.danger}
            name="Egresos"
            radius={[2, 2, 0, 0]}
          />

        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoVentasEgresos;
