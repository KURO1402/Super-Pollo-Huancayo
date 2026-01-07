import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTemaParaGraficos } from "../../hooks/useTemaParaGraficos";
import { obtenerPorcentajeMediosPagoServicio } from "../../servicios/graficosServicio";


const GraficoMediosPago = () => {
  const { themeColors } = useTemaParaGraficos();
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(true);

  const COLORS = [
    themeColors.primary,
    themeColors.primaryLight,
    themeColors.info,
    themeColors.success,
    themeColors.warning
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resultado = await obtenerPorcentajeMediosPagoServicio();

        const datosFormateados = resultado.map(item => ({
          name: item.nombreMedioPago,
          value: parseFloat(item.porcentaje)
        }));
        setData(datosFormateados);
      } catch (error) {
        
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, []);

  if (cargando) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
        Cargando gráfico...
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: themeColors.background,
              border: `1px solid ${themeColors.border}`,
              color: themeColors.text,
              borderRadius: '8px',
              fontSize: '12px'
            }}
            formatter={(value, name) => [`${value.toFixed(2)}%`, name]}
          />
          <Legend 
            iconSize={8}
            wrapperStyle={{
              fontSize: '12px',
              color: themeColors.textSecondary
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoMediosPago;
