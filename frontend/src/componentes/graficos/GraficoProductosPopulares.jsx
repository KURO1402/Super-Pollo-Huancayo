import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useTemaParaGraficos } from "../../hooks/useTemaParaGraficos";
import { obtenerTopProductosMasVendidosServicio } from "../../servicios/graficosServicio";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const GraficoProductosPopulares = () => {
  const { themeColors } = useTemaParaGraficos();
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: ""
  });

  const obtenerFechaInicioPorDefecto = () => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() - 30);
    return fecha.toISOString().split('T')[0];
  };

  const obtenerFechaFinPorDefecto = () => {
    return new Date().toISOString().split('T')[0];
  };

  const cargarDatos = async (fechaInicio = null, fechaFin = null) => {
    setCargando(true);
    try {
      const respuesta = await obtenerTopProductosMasVendidosServicio(fechaInicio, fechaFin);
      const formateo = respuesta.map(item => ({
        producto: item.nombre_producto,
        ventas: Number(item.total_vendido)
      }));
      setData(formateo);
    } catch (error) {
      setData([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const fechaInicioDefault = obtenerFechaInicioPorDefecto();
    const fechaFinDefault = obtenerFechaFinPorDefecto();

    setFiltros({
      fechaInicio: fechaInicioDefault,
      fechaFin: fechaFinDefault
    });

    cargarDatos(fechaInicioDefault, fechaFinDefault);
  }, []);

  const manejarCambioFiltro = (campo, valor) => {
    const nuevosFiltros = {
      ...filtros,
      [campo]: valor
    };
    setFiltros(nuevosFiltros);
  };

  const aplicarFiltros = () => {
    if (!filtros.fechaInicio || !filtros.fechaFin) {
      mostrarAlerta.advertencia("Selecciona ambas fechas para filtrar");
      return;
    }
    if (filtros.fechaInicio > filtros.fechaFin) {
      mostrarAlerta.advertencia("La fecha de inicio no puede ser mayor a la fecha fin");
      return;
    }
    cargarDatos(filtros.fechaInicio, filtros.fechaFin);
  };

  const limpiarFiltros = () => {
    const fechaInicioDefault = obtenerFechaInicioPorDefecto();
    const fechaFinDefault = obtenerFechaFinPorDefecto();

    setFiltros({
      fechaInicio: fechaInicioDefault,
      fechaFin: fechaFinDefault
    });

    cargarDatos(fechaInicioDefault, fechaFinDefault);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha Inicio
          </label>
          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => manejarCambioFiltro('fechaInicio', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>

        <div className="flex-1 min-w-[180px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Fecha Fin
          </label>
          <input
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => manejarCambioFiltro('fechaFin', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm"
          />
        </div>

        <div className="flex flex-row sm:flex-col md:flex-row flex-wrap items-end gap-2">
          <button
            onClick={aplicarFiltros}
            disabled={cargando || !filtros.fechaInicio || !filtros.fechaFin}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors duration-200 text-sm font-medium w-full sm:w-auto"
          >
            {cargando ? "Cargando..." : "Aplicar"}
          </button>
          <button
            onClick={limpiarFiltros}
            disabled={cargando}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-md transition-colors duration-200 text-sm font-medium w-full sm:w-auto"
          >
            Limpiar
          </button>
        </div>
      </div>
      <div className="h-64">
        {cargando ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 dark:text-gray-400">Cargando datos...</div>
          </div>
        ) : data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 dark:text-gray-400">No hay datos para mostrar</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid
                stroke={themeColors.grid}
                strokeDasharray="3 3"
                horizontal={false}
              />
              <XAxis
                type="number"
                stroke={themeColors.textSecondary}
                fontSize={11}
                tickFormatter={(value) => `${value} Ventas`}
              />
              <YAxis
                type="category"
                dataKey="producto"
                stroke={themeColors.textSecondary}
                width={80}
                fontSize={11}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: themeColors.background,
                  border: `1px solid ${themeColors.border}`,
                  color: themeColors.text,
                  borderRadius: '8px',
                  fontSize: '11px'
                }}
                formatter={(value) => [`${value} salidas`, '']}
              />
              <Bar
                dataKey="ventas"
                fill={themeColors.primary}
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default GraficoProductosPopulares;