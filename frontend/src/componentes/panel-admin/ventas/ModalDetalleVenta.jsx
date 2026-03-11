import Modal from "../../../componentes/ui/modal/Modal"

export const ModalDetalleVenta = ({ estaAbierto, onCerrar, detalleVenta, cargandoDetalle }) => (
    <Modal estaAbierto={estaAbierto} onCerrar={onCerrar} titulo="Detalle de Venta" tamaño="lg" mostrarHeader={true} mostrarFooter={false}>
        {cargandoDetalle ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Cargando detalle...</p>
            </div>
        ) : detalleVenta.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">Sin productos.</p>
        ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            {["Producto", "Cant.", "V. Unit.", "Subtotal", "IGV", "Total"].map((h) => (
                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {detalleVenta.map((d) => (
                            <tr key={d.id_detalle_venta} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{d.nombre_producto}</td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-300">{d.cantidad_producto}</td>
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">S/ {Number(d.valor_unitario).toFixed(2)}</td>
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">S/ {Number(d.subtotal).toFixed(2)}</td>
                                <td className="px-4 py-3 text-gray-700 dark:text-gray-300">S/ {Number(d.igv).toFixed(2)}</td>
                                <td className="px-4 py-3 font-bold text-gray-900 dark:text-white">S/ {Number(d.total_producto).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
    </Modal>
);