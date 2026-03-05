import { FiCheck, FiDownload, FiX, FiFileText, FiEye } from "react-icons/fi";
import { useState } from "react";
import Modal from "../../ui/modal/Modal";

export const ModalComprobanteGenerado = ({ 
  estaAbierto, 
  onCerrar, 
  datosComprobante,
  onDescargarPDF,
  onDescargarXML
}) => {
  const [mostrarPDF, setMostrarPDF] = useState(false);
  
  if (!datosComprobante) return null;

  const {
    tipoComprobanteTexto,
    venta,
    urlPdf,
    urlXml,
    aceptadoPorSunat,
    mensaje
  } = datosComprobante;

  const totalVenta = parseFloat(venta?.total_venta || 0).toFixed(2);
  const totalIgv = parseFloat(venta?.total_igv || 0).toFixed(2);
  const totalGravada = parseFloat(venta?.total_gravada || 0).toFixed(2);

  if (mostrarPDF && urlPdf) {
    return (
      <Modal
        estaAbierto={estaAbierto}
        onCerrar={() => setMostrarPDF(false)}
        titulo={`Vista Previa - ${tipoComprobanteTexto}`}
        tamaño="full"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <div className="h-[80vh] flex flex-col">
          <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <iframe
              src={urlPdf}
              className="w-full h-full"
              title={`Vista previa ${tipoComprobanteTexto}`}
            />
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setMostrarPDF(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors"
            >
              Volver
            </button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      estaAbierto={estaAbierto}
      onCerrar={onCerrar}
      titulo={`Comprobante Generado - ${tipoComprobanteTexto}`}
      tamaño="lg"
      mostrarHeader={true}
      mostrarFooter={false}
    >
      <div className="space-y-6">
        <div className={`rounded-lg p-4 border ${
          aceptadoPorSunat 
            ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' 
            : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'
        }`}>
          <div className="flex items-start gap-3">
            <FiCheck className={`text-2xl shrink-0 mt-0.5 ${
              aceptadoPorSunat 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-yellow-600 dark:text-yellow-400'
            }`} />
            <div>
              <h3 className={`font-semibold ${
                aceptadoPorSunat 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-yellow-800 dark:text-yellow-200'
              }`}>
                {aceptadoPorSunat ? '¡Comprobante aceptado por SUNAT!' : 'Comprobante generado pero no aceptado por SUNAT'}
              </h3>
              <p className={`text-sm mt-1 ${
                aceptadoPorSunat 
                  ? 'text-green-700 dark:text-green-300' 
                  : 'text-yellow-700 dark:text-yellow-300'
              }`}>
                {mensaje || 'La venta se ha registrado correctamente'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Resumen de Venta #{venta?.id_venta}
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Gravado</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                S/ {totalGravada}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">IGV (18%)</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                S/ {totalIgv}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total Venta</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                S/ {totalVenta}
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Método de pago: <span className="font-medium">{venta?.nombre_medio_pago}</span>
          </p>

          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Productos:
            </h5>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {venta?.detalles?.map((detalle, index) => (
                <div key={index} className="flex justify-between text-sm bg-white dark:bg-gray-700 p-2 rounded">
                  <span className="text-gray-700 dark:text-gray-300">
                    {detalle.cantidad_producto}x {detalle.nombre_producto}
                  </span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    S/ {parseFloat(detalle.total_producto).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {urlPdf && (
            <button
              onClick={() => setMostrarPDF(true)}
              className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <FiEye className="text-lg" />
              Ver PDF
            </button>
          )}
          
          <button
            onClick={onDescargarPDF}
            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FiDownload className="text-lg" />
            Descargar PDF
          </button>
          
          <button
            onClick={onDescargarXML}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FiFileText className="text-lg" />
            XML
          </button>
          
          <button
            onClick={onCerrar}
            className="flex-1 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <FiX className="text-lg" />
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};