import { FiFileText, FiCheckCircle, FiXCircle, FiEye, FiDownload, FiUser } from "react-icons/fi";

export const FilaComprobante = ({ venta, onVerDetalle, onDescargarComprobante }) => {
  const getColorComprobante = () => {
    if (venta.nombreTipoComprobante === "Factura") {
      return {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-600 dark:text-blue-400"
      };
    } else if (venta.nombreTipoComprobante === "Boleta") {
      return {
        bg: "bg-green-100 dark:bg-green-900/30", 
        text: "text-green-600 dark:text-green-400"
      };
    } else {
      return {
        bg: "bg-gray-100 dark:bg-gray-900/30",
        text: "text-gray-600 dark:text-gray-400"
      };
    }
  };

  const getEstadoSunat = () => {
    if (venta.aceptadaPorSunat === 1) {
      return {
        texto: "ACEPTADO",
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-800 dark:text-green-400",
        icono: <FiCheckCircle size={14} />
      };
    } else {
      return {
        texto: "DENEGADO", 
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-800 dark:text-red-400",
        icono: <FiXCircle size={14} />
      };
    }
  };

  const getColorMetodoPago = () => {
    const metodo = venta.nombreMedioPago?.toLowerCase() || '';
    if (metodo.includes('efectivo')) {
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    } else if (metodo.includes('tarjeta')) {
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"; 
    } else if (metodo.includes('transferencia')) {
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    } else if (metodo.includes('yape') || metodo.includes('plin')) {
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
  };

  const colorComprobante = getColorComprobante();
  const estado = getEstadoSunat();
  const colorMetodoPago = getColorMetodoPago();

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${colorComprobante.bg} ${colorComprobante.text}`}>
            <FiFileText size={16} />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {venta.comprobante}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              {venta.nombreTipoComprobante}
            </div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400">
          <FiUser size={16} />
        </div>
        <div className="max-w-[160px] overflow-hidden text-ellipsis whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            {venta.nombreCliente}
          </div>
        </div>
      </div>
    </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {venta.usuarioRegistro}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          S/ {parseFloat(venta.totalVenta).toFixed(2)}  
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorMetodoPago}`}>
          {venta.nombreMedioPago}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 dark:text-white">
          {venta.fechaEmision}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Vence: {venta.fechaVencimiento}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${estado.bg} ${estado.text}`}>
          {estado.icono}
          {estado.texto}
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <button 
            onClick={onVerDetalle}
            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
            title="Ver detalle"
          >
            <FiEye size={16} />
          </button>
          <button 
            onClick={onDescargarComprobante}
            className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors cursor-pointer"
            title="Descargar comprobante"
          >
            <FiDownload size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};