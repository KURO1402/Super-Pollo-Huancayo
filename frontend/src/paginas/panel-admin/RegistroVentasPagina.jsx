import { useEffect, useState, useCallback, useRef } from 'react';
import { MdHistory } from "react-icons/md";
import { FiCalendar } from "react-icons/fi";
import { useVentaStore } from '../../store/useVentaStore';
import { usePaginacion } from '../../hooks/usePaginacion';
import { Paginacion } from "../../componentes/ui/tabla/Paginacion";
import { FilaVenta } from '../../componentes/panel-admin/ventas/FilaVenta';
import { ModalDetalleVenta } from '../../componentes/panel-admin/ventas/ModalDetalleVenta';
import { ModalComprobante } from '../../componentes/panel-admin/ventas/ModalComprobante';
import { useModal } from "../../hooks/useModal";
import { anularVentaServicio } from '../../servicios/ventasServicio';
import mostrarAlerta from "../../utilidades/toastUtilidades";

const RegistroVentasPagina = () => {
    const {
        ventas, total, cargando, error,
        paginaActual, limit,
        cargarVentas, setPagina, setLimite, limpiarError,
        detalleVenta, cargandoDetalle, obtenerDetalleVenta,
        comprobante, cargandoComprobante, obtenerComprobante,
    } = useVentaStore();

    const modalDetalle = useModal();
    const modalComprobante = useModal();

    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [cargandoInicial, setCargandoInicial] = useState(true);
    const cargaInicialRef = useRef(true);

    const paginacion = usePaginacion({
        paginaActual,
        limite: limit,
        total,
        onPagina: setPagina,
        onLimite: setLimite,
    });

    // Cargar ventas solo la primera vez
    useEffect(() => {
        if (cargaInicialRef.current) {
            cargarVentas();
            cargaInicialRef.current = false;
        }
        const timer = setTimeout(() => setCargandoInicial(false), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => { if (error) limpiarError(); }, [error]);

    const puedeFiltrar = fechaInicio && fechaFin;

    const handleFiltrar = () => {
        if (!puedeFiltrar) {
            mostrarAlerta.advertencia("Selecciona ambas fechas para filtrar");
            return;
        }
        cargarVentas({ fechaInicio, fechaFin });
    };

    const handleLimpiarFiltro = () => {
        setFechaInicio('');
        setFechaFin('');
        cargarVentas();
    };

    const handleVerDetalle = async (idVenta) => {
        await obtenerDetalleVenta(idVenta);
        modalDetalle.abrir();
    };

    const handleVerComprobante = async (idVenta) => {
        try {
            await obtenerComprobante(idVenta);
            modalComprobante.abrir();
        } catch (err) {
            mostrarAlerta.error(err.message || "Error al obtener el comprobante");
        }
    };

    const handleAnular = useCallback(async (idVenta) => {
        try {
            await anularVentaServicio(idVenta);
            mostrarAlerta.exito("Venta anulada. Caja e inventario revertidos.");
            cargarVentas({ fechaInicio: fechaInicio || undefined, fechaFin: fechaFin || undefined });
        } catch (err) {
            mostrarAlerta.error(err.message || "Error al anular la venta");
            throw err;
        }
    }, [cargarVentas, fechaInicio, fechaFin]);

    const ENCABEZADOS = ["N° Venta / Comprobante", "Fecha", "Hora", "Total", "Metodo de Pago", "Estado SUNAT", "Acciones"];

    // Mostrar cargando solo en la carga inicial o si hay cambio de página
    const mostrarCargando = cargandoInicial || (cargando && ventas.length === 0);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="mx-w-full p-4">
                <div className="mb-6 flex items-center gap-2">
                    <MdHistory className="text-3xl text-blue-500 dark:text-blue-400" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Historial de Ventas
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {total > 0
                                ? `${total} venta${total !== 1 ? 's' : ''} registrada${total !== 1 ? 's' : ''}`
                                : 'Sin ventas registradas'}
                        </p>
                    </div>
                </div>

                {/* Filtro de fechas */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-5">
                    <div className="flex flex-col sm:flex-row items-end gap-3">
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Fecha inicio
                            </label>
                            <div className="relative">
                                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="date"
                                    value={fechaInicio}
                                    onChange={(e) => setFechaInicio(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Fecha fin
                            </label>
                            <div className="relative">
                                <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                <input
                                    type="date"
                                    value={fechaFin}
                                    onChange={(e) => setFechaFin(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleFiltrar}
                            disabled={!puedeFiltrar}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Filtrar
                        </button>
                        {(fechaInicio || fechaFin) && (
                            <button
                                onClick={handleLimpiarFiltro}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg transition-colors"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>
                </div>

                {/* Tabla */}
                {mostrarCargando ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Cargando ventas...</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                        <tr>
                                            {ENCABEZADOS.map((h) => (
                                                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {ventas.map((venta) => (
                                            <FilaVenta
                                                key={venta.id_venta}
                                                venta={venta}
                                                onVerDetalle={handleVerDetalle}
                                                onVerComprobante={handleVerComprobante}
                                                onAnular={handleAnular}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {ventas.length === 0 && !cargando && (
                                <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400 dark:text-gray-600">
                                    <MdHistory className="text-5xl" />
                                    <p className="text-sm">
                                        {(fechaInicio || fechaFin)
                                            ? "No se encontraron ventas en ese rango de fechas"
                                            : "No hay ventas registradas aun"}
                                    </p>
                                </div>
                            )}
                        </div>

                        {total > 0 && (
                            <div className="mt-5">
                                <Paginacion {...paginacion} />
                            </div>
                        )}
                    </>
                )}

                {/* Indicador de cargando en background (sin parpadeo) */}
                {cargando && ventas.length > 0 && (
                    <div className="fixed bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg shadow-lg">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Actualizando...</span>
                    </div>
                )}
            </div>

            <ModalDetalleVenta
                estaAbierto={modalDetalle.estaAbierto}
                onCerrar={modalDetalle.cerrar}
                detalleVenta={detalleVenta}
                cargandoDetalle={cargandoDetalle}
            />

            <ModalComprobante
                estaAbierto={modalComprobante.estaAbierto}
                onCerrar={() => { modalComprobante.cerrar(); }}
                comprobante={comprobante}
                cargando={cargandoComprobante}
            />
        </div>
    );
};

export default RegistroVentasPagina;