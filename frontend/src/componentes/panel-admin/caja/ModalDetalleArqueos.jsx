import { FiAlertCircle } from "react-icons/fi";
import Modal from "../../ui/modal/Modal";

const ModalDetalleArqueos = ({
  estaAbierto,
  onCerrar,
  arqueosCaja,
  movimientosCaja,
  loadingArqueos,
  loadingMovimientos,
  formatCurrency,
  formatHora
}) => {
  const tieneArqueos = arqueosCaja && arqueosCaja.length > 0;
  const tieneMovimientos = movimientosCaja.cantidad_filas > 0;
  const arqueo = tieneArqueos ? arqueosCaja[0] : null;
  const movimientos = movimientosCaja.movimientos || [];
  return (
    <Modal
      estaAbierto={estaAbierto}
      onCerrar={onCerrar}
      titulo={arqueo ? `Detalle de Arqueo - ${arqueo.fecha_arqueo}` : "Detalle de Caja"}
      tamaño="xl"
      mostrarHeader
      mostrarFooter={false}
    >
      <div className="p-6 space-y-6">
        {loadingArqueos || loadingMovimientos ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-500 mt-4">Cargando detalles de la caja...</p>
          </div>
        ) : (
          <>
            {tieneArqueos && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Resumen del Arqueo
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Usuario</p>
                    <p className="font-medium text-gray-900 dark:text-white">{arqueo.nombre_usuario}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fecha</p>
                    <p className="font-medium text-gray-900 dark:text-white">{arqueo.fecha_arqueo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hora</p>
                    <p className="font-medium text-gray-900 dark:text-white">{formatHora(arqueo.hora_arqueo)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Estado</p>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      arqueo.estado_caja === "cuadra"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                        : arqueo.estado_caja === "sobra"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      {arqueo.estado_caja}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {tieneArqueos && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Desglose de Montos
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Concepto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Monto
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          Efectivo Físico
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {formatCurrency(arqueo.monto_fisico)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          Tarjetas
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {formatCurrency(arqueo.monto_tarjeta)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          Billetera Digital
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {formatCurrency(arqueo.monto_billetera_digital)}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                          Otros Medios
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                          {formatCurrency(arqueo.otros)}
                        </td>
                      </tr>
                      <tr className="bg-gray-50 dark:bg-gray-700/50">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                          Diferencia
                        </td>
                        <td className={`px-6 py-4 text-sm font-bold ${
                          parseFloat(arqueo.diferencia) > 0 
                            ? "text-green-700 dark:text-green-400" 
                            : parseFloat(arqueo.diferencia) < 0 
                            ? "text-red-700 dark:text-red-400" 
                            : "text-gray-700 dark:text-gray-400"
                        }`}>
                          {parseFloat(arqueo.diferencia) > 0 ? '+' : ''}{formatCurrency(arqueo.diferencia)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tieneMovimientos ? (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Movimientos de Caja ({movimientosCaja.cantidad_filas})
                </h3>
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Tipo
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Descripción
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Monto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Fecha/Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Usuario
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {movimientos.map((movimiento) => (
                        <tr key={movimiento.id_movimiento_caja}>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              movimiento.tipo_movimiento?.toLowerCase() === "ingreso" 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}>
                              {movimiento.tipo_movimiento === "Ingreso" ? "Ingreso" : "Egreso"}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {movimiento.descripcion_mov_caja || "Sin descripción"}
                          </td>
                          <td className={`px-6 py-4 text-sm font-medium ${
                            movimiento.tipo_movimiento?.toLowerCase() === "ingreso" 
                              ? "text-green-700 dark:text-green-400" 
                              : "text-red-700 dark:text-red-400"
                          }`}>
                            {movimiento.tipo_movimiento?.toLowerCase() === "ingreso" ? "+" : "-"}{formatCurrency(movimiento.monto_movimiento)}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {movimiento.fecha} {movimiento.hora}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                            {movimiento.nombre_usuario || "Desconocido"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No hay movimientos disponibles para esta caja</p>
                </div>
              )
            }
          </>
        )}
      </div>
    </Modal>
  );
};

export default ModalDetalleArqueos;