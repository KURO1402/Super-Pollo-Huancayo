import { FiRefreshCw } from "react-icons/fi";
import { useModal } from "../../hooks/useModal";
import { useHistorialCajas } from "../../hooks/useHistorialCaja";
import { useState } from "react";
import TablasCajasCerradas from "../../componentes/panel-admin/caja/TablaCajasCerradas";
import ModalDetalleArqueos from "../../componentes/panel-admin/caja/ModalDetalleArqueos";

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
  });

  const handleFiltroChange = (campo, valor) => {
    setFiltrosLocales((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleAplicarFiltros = () => {
    aplicarFiltros({
      fechaInicio: filtrosLocales.fechaInicio || undefined,
      fechaFin: filtrosLocales.fechaFin || undefined,
    });
  };

  const handleLimpiarFiltros = () => {
    setFiltrosLocales({ fechaInicio: "", fechaFin: "" });
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-full p-4 space-y-6">

      <div className="bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 rounded-2xl p-6">
        <h1 className="text-2xl font-bold dark:text-white mb-6">Historial de Cajas</h1>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Fecha inicio
              </label>
              <input
                type="date"
                value={filtrosLocales.fechaInicio}
                onChange={(e) => handleFiltroChange("fechaInicio", e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Fecha fin
              </label>
              <input
                type="date"
                value={filtrosLocales.fechaFin}
                onChange={(e) => handleFiltroChange("fechaFin", e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleAplicarFiltros}
              className="flex-1 sm:flex-none bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
            >
              Aplicar filtros
            </button>
            <button
              onClick={handleLimpiarFiltros}
              className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <FiRefreshCw className="w-4 h-4 shrink-0" />
              Limpiar
            </button>
          </div>
        </div>
      </div>

      <TablasCajasCerradas
        cajasCerradas={cajasCerradas}
        formatCurrency={formatCurrency}
        formatDate={formatDate}
        formatHora={formatHora}
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