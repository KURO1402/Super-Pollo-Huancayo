import { FiCheck, FiDownload, FiX, FiEye, FiAlertTriangle, FiClock, FiPrinter, FiArrowLeft } from "react-icons/fi";
import { useState, useEffect, useCallback } from "react";
import Modal from "../../ui/modal/Modal";
import { anularVentaServicio } from "../../../servicios/ventasServicio";
import mostrarAlerta from "../../../utilidades/toastUtilidades";

const VENTANA_SEGUNDOS = 5 * 60;

export const ModalComprobanteGenerado = ({
  estaAbierto,
  onCerrar,
  datosComprobante,
  onDescargarPDF,
}) => {
  const [mostrarPDF, setMostrarPDF]               = useState(false);
  const [segundosRestantes, setSegundosRestantes] = useState(VENTANA_SEGUNDOS);
  const [anulando, setAnulando]                   = useState(false);
  const [anulada, setAnulada]                     = useState(false);
  const [confirmarAnular, setConfirmarAnular]     = useState(false);

  useEffect(() => {
    if (!estaAbierto || !datosComprobante) return;
    setSegundosRestantes(VENTANA_SEGUNDOS);
    setAnulada(false);
    setConfirmarAnular(false);

    const intervalo = setInterval(() => {
      setSegundosRestantes((prev) => {
        if (prev <= 1) { clearInterval(intervalo); return 0; }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [estaAbierto, datosComprobante]);

  const formatearTiempo = (seg) => {
    const m = Math.floor(seg / 60).toString().padStart(2, "0");
    const s = (seg % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const puedeAnular     = segundosRestantes > 0 && !anulada;
  const porcentajeTiempo = (segundosRestantes / VENTANA_SEGUNDOS) * 100;
  const colorTiempo =
    segundosRestantes > 120 ? "text-green-600 dark:text-green-400" :
    segundosRestantes > 30  ? "text-amber-500 dark:text-amber-400" :
                              "text-red-500 dark:text-red-400";
  const colorBarra =
    segundosRestantes > 120 ? "bg-green-500" :
    segundosRestantes > 30  ? "bg-amber-500" :
                              "bg-red-500";

  const handleAnular = useCallback(async () => {
    if (!datosComprobante?.venta?.id_venta) return;
    setAnulando(true);
    try {
      await anularVentaServicio(datosComprobante.venta.id_venta);
      setAnulada(true);
      setConfirmarAnular(false);
      mostrarAlerta.exito("Venta anulada correctamente. Caja e inventario revertidos.");
    } catch (error) {
      mostrarAlerta.error(error.message || "Error al anular la venta");
    } finally {
      setAnulando(false);
    }
  }, [datosComprobante]);

  const handleImprimir = () => {
    if (!datosComprobante?.urlPdf) return;
    const ventana = window.open(datosComprobante.urlPdf, '_blank');
    ventana?.addEventListener('load', () => ventana.print());
  };

  if (!datosComprobante) return null;

  const { tipoComprobanteTexto, venta, urlPdf, mensaje } = datosComprobante;
  const esNotaVenta  = datosComprobante.tipoComprobante === 3;
  const totalVenta   = parseFloat(venta?.total_venta   || 0).toFixed(2);
  const totalIgv     = parseFloat(venta?.total_igv     || 0).toFixed(2);
  const totalGravada = parseFloat(venta?.total_gravada || 0).toFixed(2);

  // ── Vista previa PDF ──────────────────────────────────────────────────────
  if (mostrarPDF && urlPdf) {
    return (
      <Modal
        estaAbierto={estaAbierto}
        onCerrar={() => setMostrarPDF(false)}
        titulo={`Vista Previa — ${tipoComprobanteTexto}`}
        tamaño="full"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <div className="flex flex-col gap-3 h-[80vh]">
          {/* Barra de acciones sobre el PDF */}
          <div className="flex items-center justify-between px-1">
            <button
              onClick={() => setMostrarPDF(false)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <FiArrowLeft size={15} /> Volver
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={handleImprimir}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <FiPrinter size={15} /> Imprimir
              </button>
              <a
                href={urlPdf}
                target="_blank"
                rel="noreferrer"
                download
                className="flex items-center gap-1.5 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <FiDownload size={15} /> Descargar
              </a>
            </div>
          </div>

          {/* iframe con sombra y bordes */}
          <div className="flex-1 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner bg-gray-100 dark:bg-gray-900">
            <iframe
              src={urlPdf}
              className="w-full h-full"
              title="Vista previa comprobante"
            />
          </div>
        </div>
      </Modal>
    );
  }

  // ── Modal principal ───────────────────────────────────────────────────────
  return (
    <Modal
      estaAbierto={estaAbierto}
      onCerrar={onCerrar}
      titulo={`${tipoComprobanteTexto} Generada`}
      tamaño="lg"
      mostrarHeader={true}
      mostrarFooter={false}
    >
      <div className="space-y-5">

        {/* Estado comprobante */}
        {anulada ? (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <FiX className="text-red-600 dark:text-red-400 shrink-0 mt-0.5 text-xl" />
            <div>
              <p className="font-semibold text-red-800 dark:text-red-200">Venta anulada</p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-0.5">
                La venta fue anulada exitosamente. Caja e inventario han sido revertidos.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <FiCheck className="text-green-600 dark:text-green-400 shrink-0 mt-0.5 text-xl" />
            <div>
              <p className="font-semibold text-green-800 dark:text-green-200">
                {esNotaVenta ? "Nota de venta generada" : "Venta registrada correctamente"}
              </p>
              <p className="text-sm text-green-700 dark:text-green-300 mt-0.5">
                {mensaje || (esNotaVenta
                  ? "Documento generado. No se envía a SUNAT."
                  : "Será enviada a SUNAT en los próximos minutos.")}
              </p>
            </div>
          </div>
        )}

        {/* Ventana de anulación */}
        {!esNotaVenta && !anulada && (
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/60">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FiClock className={`shrink-0 ${colorTiempo}`} />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {puedeAnular ? "Ventana de corrección" : "Ventana expirada"}
                </span>
              </div>
              <span className={`text-lg font-bold tabular-nums ${colorTiempo}`}>
                {formatearTiempo(segundosRestantes)}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${colorBarra}`}
                style={{ width: `${porcentajeTiempo}%` }}
              />
            </div>
            {puedeAnular && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Puedes anular esta venta antes de que sea enviada a SUNAT.
              </p>
            )}
          </div>
        )}

        {/* Resumen de la venta */}
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
          <div className="px-4 py-3 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              Resumen — Venta #{venta?.id_venta}
            </p>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Base Imponible</p>
                <p className="font-bold text-gray-900 dark:text-white">S/ {totalGravada}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">IGV (18%)</p>
                <p className="font-bold text-gray-900 dark:text-white">S/ {totalIgv}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg text-center">
                <p className="text-xs text-blue-500 dark:text-blue-400 mb-0.5">Total</p>
                <p className="font-bold text-blue-600 dark:text-blue-400">S/ {totalVenta}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Método de pago:{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {venta?.nombre_medio_pago}
              </span>
            </p>

            {venta?.detalles?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                  Productos
                </p>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {venta.detalles.map((d, i) => (
                    <div key={i} className="flex justify-between text-sm px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded">
                      <span className="text-gray-700 dark:text-gray-300">
                        {d.cantidad_producto}× {d.nombre_producto}
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        S/ {parseFloat(d.total_producto).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirmación anular */}
        {confirmarAnular && (
          <div className="p-4 border border-red-200 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20 space-y-3">
            <div className="flex items-start gap-2">
              <FiAlertTriangle className="text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-800 dark:text-red-200">¿Confirmar anulación?</p>
                <p className="text-xs text-red-700 dark:text-red-300 mt-0.5">
                  Se revertirá el movimiento de caja y el stock de insumos. Esta acción no se puede deshacer.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAnular}
                disabled={anulando}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
              >
                {anulando ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Anulando...
                  </>
                ) : "Sí, anular"}
              </button>
              <button
                onClick={() => setConfirmarAnular(false)}
                disabled={anulando}
                className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Botones principales */}
        <div className="flex flex-wrap gap-2 pt-1">
          {urlPdf && !anulada && (
            <button
              onClick={() => setMostrarPDF(true)}
              className="flex-1 min-w-[120px] px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FiEye /> Ver PDF
            </button>
          )}
          {urlPdf && !anulada && (
            <button
              onClick={handleImprimir}
              className="flex-1 min-w-[120px] px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FiPrinter /> Imprimir
            </button>
          )}
          {urlPdf && !anulada && (
            <button
              onClick={onDescargarPDF}
              className="flex-1 min-w-[120px] px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FiDownload /> Descargar
            </button>
          )}
          {!esNotaVenta && puedeAnular && !anulada && !confirmarAnular && (
            <button
              onClick={() => setConfirmarAnular(true)}
              className="flex-1 min-w-[120px] px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FiX /> Anular Venta
            </button>
          )}
          <button
            onClick={onCerrar}
            className="flex-1 min-w-[120px] px-4 py-2.5 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <FiX /> Cerrar
          </button>
        </div>

      </div>
    </Modal>
  );
};