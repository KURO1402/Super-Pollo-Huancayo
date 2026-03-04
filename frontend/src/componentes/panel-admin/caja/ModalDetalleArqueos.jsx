import { useState } from "react";
import { FiAlertCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import Modal from "../../ui/modal/Modal";

const BadgeEstado = ({ estado }) => {
  const estilos = {
    cuadra: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    sobra:  "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    falta:  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${estilos[estado] ?? "bg-gray-100 text-gray-800"}`}>
      {estado}
    </span>
  );
};

const ArqueoItem = ({ arqueo, index, formatCurrency, formatHora }) => {
  const [desgloseAbierto, setDesgloseAbierto] = useState(false);

  const diferencia = parseFloat(arqueo.diferencia) || 0;
  const colorDiferencia = diferencia > 0
    ? "text-green-700 dark:text-green-400"
    : diferencia < 0
    ? "text-red-700 dark:text-red-400"
    : "text-gray-700 dark:text-gray-400";

  const conceptos = [
    { label: "Efectivo Físico",   key: "monto_fisico" },
    { label: "Tarjetas",          key: "monto_tarjeta" },
    { label: "Billetera Digital", key: "monto_billetera_digital" },
    { label: "Otros Medios",      key: "otros" },
  ];

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">

      {/* Cabecera */}
      <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              Arqueo #{index + 1}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {arqueo.fecha_arqueo} — {formatHora(arqueo.hora_arqueo)}
            </span>
            <BadgeEstado estado={arqueo.estado_caja} />
          </div>
          <span className={`text-sm font-semibold ${colorDiferencia}`}>
            {diferencia > 0 ? "+" : ""}{formatCurrency(diferencia)}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
          <span>
            Usuario:{" "}
            <span className="text-gray-700 dark:text-gray-300 font-medium">
              {arqueo.nombre_usuario}
            </span>
          </span>
          {arqueo.descripcion_arqueo && (
            <span>
              Nota:{" "}
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                {arqueo.descripcion_arqueo}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Botón desglose */}
      <button
        type="button"
        onClick={() => setDesgloseAbierto(!desgloseAbierto)}
        className="w-full flex items-center justify-between px-4 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors border-t border-gray-200 dark:border-gray-700"
      >
        <span>{desgloseAbierto ? "Ocultar desglose de montos" : "Ver desglose de montos"}</span>
        {desgloseAbierto
          ? <FiChevronUp className="w-3.5 h-3.5" />
          : <FiChevronDown className="w-3.5 h-3.5" />
        }
      </button>

      {/* Desglose colapsable */}
      {desgloseAbierto && (
        <div className="border-t border-gray-200 dark:border-gray-700">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Concepto</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600 bg-white dark:bg-gray-800">
              {conceptos.map(({ label, key }) => (
                <tr key={key}>
                  <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{label}</td>
                  <td className="px-4 py-3 text-gray-900 dark:text-white">{formatCurrency(arqueo[key])}</td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">Diferencia</td>
                <td className={`px-4 py-3 font-bold ${colorDiferencia}`}>
                  {diferencia > 0 ? "+" : ""}{formatCurrency(diferencia)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ModalDetalleArqueos = ({
  estaAbierto,
  onCerrar,
  arqueosCaja,
  movimientosCaja,
  loadingArqueos,
  loadingMovimientos,
  formatCurrency,
  formatHora,
}) => {
  const tieneArqueos     = Array.isArray(arqueosCaja) && arqueosCaja.length > 0;
  const movimientos      = movimientosCaja?.movimientos || [];
  const totalMovimientos = movimientosCaja?.cantidad_filas ?? movimientos.length;
  const cargando         = loadingArqueos || loadingMovimientos;

  const tituloModal = tieneArqueos
    ? `Detalle de Caja — ${arqueosCaja[0].fecha_arqueo}`
    : "Detalle de Caja";

  return (
    <Modal
      estaAbierto={estaAbierto}
      onCerrar={onCerrar}
      titulo={tituloModal}
      tamaño="xl"
      mostrarHeader
      mostrarFooter={false}
    >
      <div className="p-6 space-y-6">
        {cargando ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
            <p className="text-gray-500 mt-4">Cargando detalles de la caja...</p>
          </div>
        ) : (
          <>
            {/* ══ ARQUEOS ══ */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Arqueos{" "}
                {tieneArqueos && (
                  <span className="text-gray-400 font-normal">({arqueosCaja.length})</span>
                )}
              </h3>

              {tieneArqueos ? (
                <div className="space-y-3">
                  {arqueosCaja.map((arqueo, i) => (
                    <ArqueoItem
                      key={arqueo.id_arqueo ?? i}
                      arqueo={arqueo}
                      index={i}
                      formatCurrency={formatCurrency}
                      formatHora={formatHora}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <FiAlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No hay arqueos registrados para esta caja
                  </p>
                </div>
              )}
            </section>

            {/* ══ MOVIMIENTOS ══ */}
            <section>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                Movimientos{" "}
                <span className="text-gray-400 font-normal">({totalMovimientos})</span>
              </h3>

              {movimientos.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {["Tipo", "Descripción", "Monto", "Fecha/Hora", "Usuario"].map((h) => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {movimientos.map((mov) => {
                        const esIngreso = mov.tipo_movimiento?.toLowerCase() === "ingreso";
                        return (
                          <tr key={mov.id_movimiento_caja} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                esIngreso
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}>
                                {esIngreso ? "Ingreso" : "Egreso"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {mov.descripcion_mov_caja || "Sin descripción"}
                            </td>
                            <td className={`px-6 py-4 text-sm font-medium ${
                              esIngreso ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                            }`}>
                              {esIngreso ? "+" : "-"}{formatCurrency(mov.monto_movimiento)}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                              {mov.fecha} {mov.hora}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                              {mov.nombre_usuario || "Desconocido"}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No hay movimientos disponibles para esta caja
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ModalDetalleArqueos;