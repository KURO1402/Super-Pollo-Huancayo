import { useState } from "react";
import { FiList, FiFileText, FiX, FiShoppingBag } from "react-icons/fi";
import { BadgeSunat } from "./BadgeSunat";

export const FilaVenta = ({ venta, onVerDetalle, onVerComprobante, onAnular }) => {
    const [anulando, setAnulando] = useState(false);
    const [confirmar, setConfirmar] = useState(false);

    const puedeAnular = venta.estado_sunat === 'pendiente'
        && venta.fecha_limite_correccion
        && new Date() < new Date(venta.fecha_limite_correccion);

    const puedeVerComprobante = venta.estado_sunat === 'aceptado' || venta.estado_sunat === 'rechazado' || venta.estado_sunat === 'enviado_sunat';

    const numeroComprobante = venta.serie && venta.numero_correlativo
        ? `${venta.serie}-${String(venta.numero_correlativo).padStart(8, '0')}`
        : null;

    const colorPago = () => {
        const m = (venta.nombre_medio_pago || '').toLowerCase();
        if (m.includes('efectivo'))        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
        if (m.includes('tarjeta'))         return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
        if (m.includes('transferencia'))   return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
        if (m.includes('yape') || m.includes('plin')) return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400";
        return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
    };

    const handleAnular = async () => {
        setAnulando(true);
        try {
            await onAnular(venta.id_venta);
            setConfirmar(false);
        } finally {
            setAnulando(false);
        }
    };

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">

            {/* N° Venta + Comprobante */}
            <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                        <FiShoppingBag size={14} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">
                            #{venta.id_venta}
                        </p>
                        {numeroComprobante && (
                            <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                {numeroComprobante}
                            </p>
                        )}
                    </div>
                </div>
            </td>

            {/* Fecha */}
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {venta.fecha || '—'}
            </td>

            {/* Hora */}
            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {venta.hora || '—'}
            </td>

            {/* Total */}
            <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm font-bold text-gray-900 dark:text-white">
                    S/ {parseFloat(venta.total_venta || 0).toFixed(2)}
                </span>
            </td>

            {/* Método de pago */}
            <td className="px-4 py-3 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorPago()}`}>
                    {venta.nombre_medio_pago || '—'}
                </span>
            </td>

            {/* Estado SUNAT */}
            <td className="px-4 py-3 whitespace-nowrap">
                <BadgeSunat estado={venta.estado_sunat} />
            </td>

            {/* Acciones */}
            <td className="px-4 py-3 whitespace-nowrap">
                {confirmar ? (
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={handleAnular}
                            disabled={anulando}
                            className="px-2.5 py-1 text-xs bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center gap-1"
                        >
                            {anulando && (
                                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            )}
                            {anulando ? 'Anulando...' : 'Sí, anular'}
                        </button>
                        <button
                            onClick={() => setConfirmar(false)}
                            disabled={anulando}
                            className="px-2.5 py-1 text-xs bg-gray-400 hover:bg-gray-500 text-white rounded-lg transition-colors"
                        >
                            No
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5">
                        <button
                            onClick={() => onVerDetalle(venta.id_venta)}
                            className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors"
                            title="Ver detalle de productos"
                        >
                            <FiList size={15} />
                        </button>
                        {puedeVerComprobante && (
                            <button
                                onClick={() => onVerComprobante(venta.id_venta)}
                                className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-800/50 transition-colors"
                                title="Ver comprobante (PDF y XML)"
                            >
                                <FiFileText size={15} />
                            </button>
                        )}
                        {puedeAnular && (
                            <button
                                onClick={() => setConfirmar(true)}
                                className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-800/50 transition-colors"
                                title="Anular venta"
                            >
                                <FiX size={15} />
                            </button>
                        )}
                    </div>
                )}
            </td>
        </tr>
    );
};