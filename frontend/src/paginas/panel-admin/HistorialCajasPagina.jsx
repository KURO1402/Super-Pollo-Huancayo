import { useEffect, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { useModal } from "../../hooks/useModal";
import { useHistorialCajas } from "../../hooks/useHistorialCaja";
import TablasCajasCerradas from "../../componentes/panel-admin/caja/TablaCajasCerradas";
import ModalDetalleArqueos from "../../componentes/panel-admin/caja/ModalDetalleArqueos";
import { FiltroBusqueda } from "../../componentes/busqueda-filtros/FiltroBusqueda";

const HistorialCajasPagina = () => {
  const {
    cajasCerradas,
    totalRegistros,
    paginaActual,
    itemsPorPagina,
    loadingCajas,
    arqueosCaja,
    movimientosCaja,
    loadingArqueos,
    loadingMovimientos,
    obtenerCajasCerradas,
    cambiarPagina,
    cambiarItemsPorPagina,
    aplicarFiltros,
    cargarDetallesCompletosCaja,
    formatDate,
    formatCurrency,
    formatHora,
  } = useHistorialCajas();

  const { estaAbierto, abrir, cerrar } = useModal();

  const [filtrosLocales, setFiltrosLocales] = useState({
    fechaInicio: "",
    fechaFin: "",
    estado: "todos",
  });
  useEffect(() => {
    obtenerCajasCerradas({
      fechaInicio: filtrosLocales.fechaInicio || undefined,
      fechaFin: filtrosLocales.fechaFin || undefined,
      estado: filtrosLocales.estado !== "todos" ? filtrosLocales.estado : undefined,
    });
  }, [paginaActual, itemsPorPagina, filtrosLocales]);

  /* ===============================
     FILTROS
  =============================== */
  const handleFiltroChange = (campo, valor) => {
    setFiltrosLocales(prev => ({ ...prev, [campo]: valor }));
  };

  const handleAplicarFiltros = () => {
    aplicarFiltros({
      fechaInicio: filtrosLocales.fechaInicio || undefined,
      fechaFin: filtrosLocales.fechaFin || undefined,
      estado: filtrosLocales.estado !== "todos" ? filtrosLocales.estado : undefined,
    });
  };

  const handleLimpiarFiltros = () => {
    setFiltrosLocales({
      fechaInicio: "",
      fechaFin: "",
      estado: "todos",
    });
    aplicarFiltros({});
  };

  const handleVerDetalle = async (idCaja) => {
    await cargarDetallesCompletosCaja(idCaja);
    abrir();
  };

  const totalPaginas = Math.ceil(totalRegistros / itemsPorPagina);

  if (loadingCajas && cajasCerradas.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border p-6">
        <h1 className="text-2xl font-bold dark:text-white">Historial de Cajas</h1>
        <div className="flex items-end gap-4 my-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
            <input 
              type="date" 
              value={filtrosLocales.fechaInicio}
              onChange={(e) => handleFiltroChange("fechaInicio", e.target.value)} 
              className="h-11 rounded-lg border px-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 w-full"
            />

            <input 
              type="date" 
              value={filtrosLocales.fechaFin}
              onChange={(e) => handleFiltroChange("fechaFin", e.target.value)} 
              className="h-11 rounded-lg border px-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 w-full"
            />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleAplicarFiltros}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Aplicar filtros
            </button>
            
            <button 
              onClick={handleLimpiarFiltros} 
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <FiRefreshCw className="inline" />
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
      <TablasCajasCerradas
        cajasCerradas={cajasCerradas}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={cambiarPagina}
        itemsPorPagina={itemsPorPagina}
        onCambiarItemsPorPagina={cambiarItemsPorPagina}
        onVerDetalle={handleVerDetalle}
        loading={loadingCajas}
        totalRegistros={totalRegistros}
      />
      <ModalDetalleArqueos
        estaAbierto={estaAbierto}
        onCerrar={cerrar}
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