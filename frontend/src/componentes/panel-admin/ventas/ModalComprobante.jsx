import { useState } from "react";
import { FiEye, FiDownload, FiExternalLink, FiPrinter } from "react-icons/fi";
import Modal from "../../ui/modal/Modal";
import { BadgeSunat } from "./BadgeSunat";

export const ModalComprobante = ({ estaAbierto, onCerrar, comprobante, cargando }) => {
    const [verPDF, setVerPDF] = useState(false);

    const handleImprimir = () => {
        if (!comprobante?.url_comprobante_pdf) return;
        const ventana = window.open(comprobante.url_comprobante_pdf, '_blank');
        ventana?.addEventListener('load', () => ventana.print());
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
        <Modal estaAbierto={estaAbierto} onCerrar={() => { onCerrar(); setVerPDF(false); }} titulo="Comprobante" tamaño="md" mostrarHeader={true} mostrarFooter={false}>
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
                            <BadgeSunat estado={comprobante.estado_sunat} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Fecha envio</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {comprobante.fecha_envio ? new Date(comprobante.fecha_envio).toLocaleString('es-PE') : '—'}
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
                </div>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-8">No se encontro informacion del comprobante.</p>
            )}
        </Modal>
    );
};