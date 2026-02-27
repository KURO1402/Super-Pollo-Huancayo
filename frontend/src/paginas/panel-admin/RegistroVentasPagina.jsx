import { useEffect } from 'react';
import { MdHistory } from "react-icons/md";
import { FiShoppingCart } from "react-icons/fi";
import { useVentaStore } from '../../store/useVentaStore';
import { usePaginacion } from '../../hooks/usePaginacion';
import { useBusqueda } from '../../hooks/useBusqueda';
import { Tabla } from "../../componentes/ui/tabla/Tabla";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda";
import { Paginacion } from "../../componentes/ui/tabla/Paginacion";
import {FilaComprobante} from "../../componentes/panel-admin/ventas/FilaComprobante";

const HistorialVentasPagina = () => {
    const {
        ventas,
        total,
        cargando,
        error,
        paginaActual,
        limit,
        cargarVentas,
        setPagina,
        setLimite,
        limpiarError,
    } = useVentaStore();

    const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();

    const paginacion = usePaginacion({
        paginaActual,
        limite: limit,
        total,
        onPagina: setPagina,
        onLimite: setLimite,
    });

    useEffect(() => {
        cargarVentas();
    }, []);

    useEffect(() => {
        if (error) limpiarError();
    }, [error]);

    const ventasFiltradas = filtrarPorBusqueda(ventas, [
        "id_venta",
        "nombre_medio_pago",
        "fecha",
        "hora",
        "total_venta"
    ]);

    const filasVentas = ventasFiltradas.map((venta) => (
        <FilaComprobante 
            key={venta.id_venta} 
            venta={venta}
        />
    ));

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <MdHistory className="text-3xl text-blue-500 dark:text-blue-400 mr-2" />
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                                Historial de Ventas
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <FiShoppingCart className="text-xl text-gray-500" />
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {total > 0
                                    ? `${total} venta${total !== 1 ? 's' : ''} registrada${total !== 1 ? 's' : ''}`
                                    : 'Sin ventas registradas'}
                            </p>
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Listado completo de todas las ventas realizadas
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
                    <BarraBusqueda
                        valor={terminoBusqueda}
                        onChange={setTerminoBusqueda}
                        placeholder="Buscar por ID, método de pago, fecha o monto..."
                    />
                </div>

                {cargando ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando ventas...</p>
                    </div>
                ) : (
                    <>
                      <Tabla
                        encabezados={[
                            "Comprobante",
                            "Cliente",
                            "Total / Pago",
                            "Fecha / Hora",
                            "Acciones"
                        ]}
                        registros={filasVentas}
                      />

                        {ventasFiltradas.length === 0 && (
                            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                <MdHistory className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500 dark:text-gray-400">
                                    {terminoBusqueda
                                        ? "No se encontraron ventas que coincidan con la búsqueda"
                                        : "No hay ventas registradas aún"}
                                </p>
                            </div>
                        )}

                        {total > 0 && (
                            <div className="mt-6">
                                <Paginacion {...paginacion} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default HistorialVentasPagina;