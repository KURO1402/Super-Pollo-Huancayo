import { useState } from "react";
import { FiEye, FiDownload, FiExternalLink, FiPrinter, FiChevronDown, FiChevronUp, FiCopy, FiCheck } from "react-icons/fi";
import Modal from "../../ui/modal/Modal";
import { BadgeSunat } from "./BadgeSunat";
import { useAutenticacionStore } from "../../../store/useAutenticacionStore";

export const ModalComprobante = ({ estaAbierto, onCerrar, comprobante, cargando }) => {
    const { usuario } = useAutenticacionStore();
    const esAdmin = usuario?.id_rol === 3;

    const [verPDF, setVerPDF] = useState(false);
    const [verDetalles, setVerDetalles] = useState(false);
    const [copiado, setCopiado] = useState(false);

    const handleImprimir = () => {
        if (!comprobante?.url_comprobante_pdf) return;
        const ventana = window.open(comprobante.url_comprobante_pdf, '_blank');
        ventana?.addEventListener('load', () => ventana.print());
    };

    const handleCopiarHash = () => {
        if (!comprobante?.hash_comprobante) return;
        navigator.clipboard.writeText(comprobante.hash_comprobante);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    if (verPDF && comprobante?.url_comprobante_pdf) {
        return (
            <Modal estaAbierto={estaAbierto} onCerrar={() => setVerPDF(false)} titulo="Vista Previa — PDF" tamaño="full" mostrarHeader={true} mostrarFooter={false}>
                <div className="flex flex-col gap-3 h-[80vh]">
                    <div className="flex items-center justify-between px-1">
                        <button
                            onClick={() => setVerPDF(false)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            ← Volver
                        </button>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleImprimir}
                                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <FiPrinter size={14} /> Imprimir
                            </button>
                            <a
                                href={comprobante.url_comprobante_pdf}
                                target="_blank"
                                rel="noreferrer"
                                download
                                className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                <FiDownload size={14} /> Descargar
                            </a>
                        </div>
                    </div>
                    <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner bg-gray-100 dark:bg-gray-900">
                        <iframe src={comprobante.url_comprobante_pdf} className="w-full h-full" title="Vista previa comprobante" />
                    </div>
                </div>
            </Modal>
        );
    }

    return (
        <Modal estaAbierto={estaAbierto} onCerrar={() => { onCerrar(); setVerPDF(false); setVerDetalles(false); }} titulo="Comprobante" tamaño="md" mostrarHeader={true} mostrarFooter={false}>
            {cargando ? (
                <div className="flex flex-col items-center justify-center h-32 gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cargando comprobante...</p>
                </div>
            ) : comprobante ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Serie - Correlativo</p>
                            <p className="font-semibold text-gray-900 dark:text-white font-mono">
                                {comprobante.serie}-{String(comprobante.numero_correlativo).padStart(8, '0')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Fecha emision</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{comprobante.fecha_emision || '—'}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Estado SUNAT</p>
                            <BadgeSunat estado={comprobante.estado_sunat} tipoComprobante={comprobante.nombre_tipo_comprobante} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Fecha envio</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {comprobante.nombre_tipo_comprobante?.toLowerCase().includes('nota')
                                    ? (comprobante.fecha_emision || '—')
                                    : (comprobante.fecha_envio
                                        ? new Date(comprobante.fecha_envio).toLocaleString('es-PE', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/(\d+)\/(\d+)\/(\d+),\s(\d+):(\d+)/, '$1-$2-$3, $4:$5')
                                        : '—')}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {comprobante.url_comprobante_pdf && (
                            <button onClick={() => setVerPDF(true)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-colors">
                                <FiEye /> Ver PDF
                            </button>
                        )}
                        {comprobante.url_comprobante_pdf && (
                            <button onClick={handleImprimir}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors">
                                <FiPrinter /> Imprimir
                            </button>
                        )}
                        {comprobante.url_comprobante_pdf && (
                            <a href={comprobante.url_comprobante_pdf} target="_blank" rel="noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium text-sm transition-colors">
                                <FiDownload /> Descargar
                            </a>
                        )}
                        {comprobante.url_comprobante_xml && (
                            <a href={comprobante.url_comprobante_xml} target="_blank" rel="noreferrer"
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors">
                                <FiExternalLink /> Ver XML
                            </a>
                        )}
                    </div>

                    {esAdmin && (comprobante.url_cdr || comprobante.hash_comprobante) && (
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <button
                                onClick={() => setVerDetalles(!verDetalles)}
                                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <span>Ver más detalles</span>
                                {verDetalles ? <FiChevronUp size={15} /> : <FiChevronDown size={15} />}
                            </button>

                            {verDetalles && (
                                <div className="px-4 pb-4 pt-1 space-y-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                    {comprobante.url_cdr && (
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Constancia de recepción (CDR)</p>
                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Documento oficial emitido por SUNAT</p>
                                            </div>
                                            <a
                                                href={comprobante.url_cdr}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors shrink-0 ml-3"
                                            >
                                                <FiDownload size={12} /> Descargar CDR
                                            </a>
                                        </div>
                                    )}
                                    {comprobante.hash_comprobante && (
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Hash del comprobante</p>
                                            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
                                                <p className="text-xs font-mono text-gray-600 dark:text-gray-400 truncate flex-1">
                                                    {comprobante.hash_comprobante}
                                                </p>
                                                <button
                                                    onClick={handleCopiarHash}
                                                    className="shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                                    title="Copiar hash"
                                                >
                                                    {copiado ? <FiCheck size={14} className="text-green-500" /> : <FiCopy size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No se encontro informacion del comprobante.</p>
            )}
        </Modal>
    );
};