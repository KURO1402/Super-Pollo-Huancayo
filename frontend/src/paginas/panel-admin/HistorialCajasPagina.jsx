import { useState } from "react";import { FiRefreshCw } from "react-icons/fi";

import { usePaginacion } from "../../hooks/usePaginacion";
import { useModal } from "../../hooks/useModal";
import { useHistorialCajas } from "../../hooks/useHistorialCaja";
import TablasCajasCerradas from "../../componentes/panel-admin/caja/TablaCajasCerradas";
import ModalDetalleArqueos from "../../componentes/panel-admin/caja/ModalDetalleArqueos";
import { FiltroBusqueda } from "../../componentes/busqueda-filtros/FiltroBusqueda";
import { useFiltro } from "../../hooks/useFiltro";

const HistorialCajasPagina = () => {
  const { filtro, setFiltro, aplicarFiltros } = useFiltro("todos");
  const { 
    cajasCerradas,
    loadingCajas,
    arqueosCaja,
    movimientosCaja,
    loadingArqueos,
    loadingMovimientos,
    cargarDetallesCompletosCaja,
    formatDate,
    formatCurrency,
    formatHora
  } = useHistorialCajas();

  const [filtros, setFiltros] = useState({ fechaInicio: "", fechaFin: "",});
  const { 
    paginaActual, 
    setPaginaActual, 
    itemsPorPagina,
    setItemsPorPagina,
    paginar  
  } = usePaginacion(7);

  const { estaAbierto: modalDetalleAbierto, abrir: abrirDetalle, cerrar: cerrarDetalle } = useModal();

  const parseFecha = (fechaStr) => {
    const [dia, mes, anio] = fechaStr.split('/');
    return new Date(`${anio}-${mes}-${dia}`);
  };

  let historialFiltrado = cajasCerradas.filter(caja => {
    const fechaCaja = parseFecha(caja.fecha);

    if (filtros.fechaInicio && fechaCaja < new Date(filtros.fechaInicio)) return false;
    if (filtros.fechaFin && fechaCaja > new Date(filtros.fechaFin)) return false;
    if (filtros.estado && caja.estadoCaja !== filtros.estado) return false;
    return true;
  });

  historialFiltrado = aplicarFiltros(historialFiltrado, "estadoCaja");
  const { datosPaginados: cajasPaginadas, totalPaginas } = paginar(historialFiltrado);

  const handleFiltroChange = (campo, valor) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
    setPaginaActual(1);
  };

  const opcionesFechas = [
    { label: "Esta semana", value: "semana" },
    { label: "Este mes", value: "mes" },
    { label: "Mes anterior", value: "mes-anterior" }
  ];

  const aplicarOpcionFecha = (opcion) => {
    const hoy = new Date();
    let fechaInicio = "";
    let fechaFin = "";

    switch (opcion) {
      case "semana": {  
        const inicioSemana = new Date(hoy);
        inicioSemana.setDate(hoy.getDate() - hoy.getDay());
        fechaInicio = inicioSemana.toISOString().split('T')[0];
        fechaFin = hoy.toISOString().split('T')[0];
        break;
      }
      case "mes": {
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        fechaInicio = inicioMes.toISOString().split('T')[0];
        fechaFin = hoy.toISOString().split('T')[0];
        break;
      }
      case "mes-anterior": { 
        const inicioMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
        const finMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);
        fechaInicio = inicioMesAnterior.toISOString().split('T')[0];
        fechaFin = finMesAnterior.toISOString().split('T')[0];
        break;
      }
      default:
        break;
    }

    setFiltros(prev => ({ ...prev, fechaInicio, fechaFin }));
    setPaginaActual(1);
  };

  const handleVerDetalle = async (idCaja) => {
    try {
      await cargarDetallesCompletosCaja(idCaja);
      abrirDetalle();
    } catch (error) {
    }
  };
  const handleLimpiarFiltros = () => {
    setFiltros({
      fechaInicio: "",
      fechaFin: "",
    });
    setFiltro("todos");
    setPaginaActual(1);
  };

  if (loadingCajas) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Historial de Cajas
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Auditoría y análisis de flujos de efectivo pasados
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rango de Fechas
            </label>
            <select
              onChange={(e) => aplicarOpcionFecha(e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="">Seleccionar opción</option>
              {opcionesFechas.map(opcion => (
                <option key={opcion.value} value={opcion.value}>
                  {opcion.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha Inicio
            </label>
            <input
              type="date"
              value={filtros.fechaInicio}
              onChange={(e) => handleFiltroChange("fechaInicio", e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fecha Fin
            </label>
            <input
              type="date"
              value={filtros.fechaFin}
              onChange={(e) => handleFiltroChange("fechaFin", e.target.value)}
              className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            />
          </div>
        </div>

        {/* Filtros Adicionales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Estado de Cuadre */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Estado de Cuadre
          </label>
          <FiltroBusqueda
            valor={filtro}
            onChange={setFiltro}
            opciones={[
              { value: "todos", label: "Todos" },
              { value: "cuadra", label: "Cuadrada" },
              { value: "sobra", label: "Sobrante" },
              { value: "falta", label: "Faltante" },
            ]}
          />
        </div>
        
        <button
          onClick={handleLimpiarFiltros}
          className="inline-flex items-center justify-center bg-blue-500 text-white px-2.5 py-1.5 rounded-lg hover:bg-blue-600 transition-colors text-xs sm:px-3 sm:py-2 sm:text-sm h-8 sm:h-9"
        >
          <FiRefreshCw className="w-4 mr-2 h-4 sm:w-4 sm:h-4" />
          Limpiar filtros
        </button>
      </div>
      </div>

      {/* Tabla de Historial */}
      <TablasCajasCerradas
        cajasCerradas={cajasPaginadas}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
        loading={loadingCajas}
        onVerDetalle={handleVerDetalle}
        itemsPorPagina={itemsPorPagina}
        onCambiarItemsPorPagina={setItemsPorPagina}
      />

      {/* Modal de Detalle */}
      <ModalDetalleArqueos
        estaAbierto={modalDetalleAbierto}
        onCerrar={cerrarDetalle}
        arqueosCaja={arqueosCaja}
        movimientosCaja={movimientosCaja}
        loadingArqueos={loadingArqueos}
        loadingMovimientos={loadingMovimientos}
        formatCurrency={formatCurrency}
        formatHora={formatHora}
      />
    </div>
  );
};

export default HistorialCajasPagina;