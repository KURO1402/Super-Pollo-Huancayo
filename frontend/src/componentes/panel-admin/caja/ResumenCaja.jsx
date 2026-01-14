import { FiDollarSign, FiTrendingUp, FiTrendingDown, FiCheckCircle, FiXCircle } from "react-icons/fi";

const ResumenCaja = ({ caja, formatCurrency, onAbrirCaja, onCerrarCaja, loading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Caja Actual</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Control y gestión de movimientos financieros</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
            caja.estado === "abierta" 
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}>
            {caja.estado === "abierta" ? <FiCheckCircle className="w-5 h-5" /> : <FiXCircle className="w-5 h-5" />}
            <span className="font-medium capitalize">{caja.estado}</span>
          </div>

          {caja.estado === "abierta" ? (
            <button
              onClick={onCerrarCaja}
              disabled = {loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-sm cursor-pointer"
            >
              <FiXCircle className="w-4 h-4" />
              Cerrar Caja
            </button>
          ) : (
            <button
              onClick={onAbrirCaja}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-sm cursor-pointer"
            >
              <FiCheckCircle className="w-4 h-4" />
              Abrir Caja
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Inicial</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {caja.saldoInicial === "-" ? "-" : formatCurrency(caja.saldoInicial)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Ingresos</p>
              <p className="text-xl font-bold text-green-700 dark:text-green-400">
                {caja.ingresos === "-" ? "-" : formatCurrency(caja.ingresos)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <FiTrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Egresos</p>
              <p className="text-xl font-bold text-red-700 dark:text-red-400">
                {caja.egresos === "-" ? "-" : formatCurrency(caja.egresos)}
              </p>
            </div>
          </div>
        </div>

        <div className={`rounded-lg p-4 ${
          caja.saldoActual >= 0 
            ? "bg-emerald-50 dark:bg-emerald-900/20" 
            : "bg-red-50 dark:bg-red-900/20"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
              caja.saldoActual >= 0 
                ? "bg-emerald-100 dark:bg-emerald-900/30" 
                : "bg-red-100 dark:bg-red-900/30"
            }`}>
              <FiDollarSign className={`w-6 h-6 ${
                caja.saldoActual >= 0 
                  ? "text-emerald-600 dark:text-emerald-400" 
                  : "text-red-600 dark:text-red-400"
              }`} />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Saldo Actual</p>
              <p className={`text-xl font-bold ${
                caja.saldoActual >= 0 
                  ? "text-emerald-700 dark:text-emerald-400" 
                  : "text-red-700 dark:text-red-400"
              }`}>
                {formatCurrency(caja.saldoActual)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumenCaja;