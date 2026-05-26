import { useState, useEffect } from "react";
import { FaFileExcel, FaShoppingBag, FaUsers, FaBoxes, FaCashRegister, FaCalendarAlt } from "react-icons/fa";

import { descargarReporteExcelServicio } from "./../../servicios/reportesServicio"; 
import mostrarAlerta from "../../utilidades/toastUtilidades";

const ReportesPagina = () => {
  const [reporteSeleccionado, setReporteSeleccionado] = useState("ventas");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    
    const formatearFecha = (date) => date.toISOString().split('T')[0];

    setFechaDesde(formatearFecha(primerDiaMes));
    setFechaHasta(formatearFecha(hoy));
  }, []);

  const opcionesReportes = [
    { 
      id: "ventas", 
      titulo: "Reporte de Ventas", 
      descripcion: "Consolidado de ingresos, auditoría de comprobantes y análisis de ventas por medios de pago.",
      icono: FaShoppingBag,
      color: "from-blue-500 to-indigo-600"
    },
    { 
      id: "clientes", 
      titulo: "Reporte de Clientes", 
      descripcion: "Métricas de clientes únicos, ticket promedio por persona y frecuencia de visitas.",
      icono: FaUsers,
      color: "from-purple-500 to-pink-600"
    },
    { 
      id: "inventario", 
      titulo: "Reporte de Inventario", 
      descripcion: "Control de insumos totales, alertas de stock bajo y balance de entradas y salidas.",
      icono: FaBoxes,
      color: "from-amber-500 to-orange-600"
    },
    { 
      id: "caja", 
      titulo: "Reporte de Caja", 
      descripcion: "Flujo de caja total, auditoría de saldos iniciales y supervisión de faltantes o sobrantes de dinero.",
      icono: FaCashRegister,
      color: "from-teal-500 to-emerald-600"
    }
  ];

  const handleDescargarReporte = async (e) => {
    e.preventDefault();
    if (!fechaDesde || !fechaHasta) return (
      mostrarAlerta.advertencia("Por favor selecciona ambas fechas.")
    );

    setDescargando(true);

    try {
      const blobData = await descargarReporteExcelServicio(reporteSeleccionado, fechaDesde, fechaHasta);

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blobData);
      link.download = `reporte-${reporteSeleccionado}-${fechaDesde}-al-${fechaHasta}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Error al procesar el reporte en el frontend:", error);
      mostrarAlerta.error(error.message || "Hubo un error inesperado al intentar descargar el reporte.");
    } finally {
      setDescargando(false);
      mostrarAlerta.exito("Reporte generado y descargado correctamente.");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-6 text-gray-800 dark:text-gray-100 transition-colors duration-300">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-blue-600 dark:text-white tracking-tight">
          Centro de Reportes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-base">
          Selecciona un módulo, define el rango de fechas y exporta tus auditorías directamente a archivos Excel.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">
            1. Selecciona el tipo de informe
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {opcionesReportes.map((item) => {
              const IconoComponente = item.icono;
              const estaSeleccionado = reporteSeleccionado === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setReporteSeleccionado(item.id)}
                  className={`text-left p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4 ${
                    estaSeleccionado 
                      ? "bg-white dark:bg-gray-800 border-blue-500 shadow-xl ring-2 ring-blue-500/20 scale-[1.02]" 
                      : "bg-white/60 dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-md"
                  }`}
                >
                  <div className={`p-3 rounded-xl bg-linear-to-br ${item.color} text-white shadow-md`}>
                    <IconoComponente size={22} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">
                      {item.titulo}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                      {item.descripcion}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-2">
            2. Configura los parámetros
          </h2>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-2xl shadow-xl space-y-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 pb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Módulo Activo: <span className="text-blue-500 dark:text-blue-400">{reporteSeleccionado}</span>
              </span>
            </div>

            <form onSubmit={handleDescargarReporte} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-500" />
                  Fecha de Inicio (Desde)
                </label>
                <input 
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FaCalendarAlt className="text-red-500" />
                  Fecha de Cierre (Hasta)
                </label>
                <input 
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-medium text-gray-900 dark:text-white"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={descargando}
                className={`w-full flex items-center justify-center gap-3 text-white font-bold p-4 rounded-xl shadow-lg transition-all transform active:scale-95 text-sm ${
                  descargando 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-600/20 shadow-md"
                }`}
              >
                <FaFileExcel size={18} className={descargando ? "animate-spin" : ""} />
                <span>{descargando ? "Procesando Excel..." : "Generar y Descargar Excel"}</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReportesPagina;