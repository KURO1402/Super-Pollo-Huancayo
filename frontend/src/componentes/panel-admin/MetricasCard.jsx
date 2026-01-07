import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

export const MetricasCard = ({ titulo, valor, cambio, icono: Icono }) => {
  const esPositivo = cambio >= 0;

  return (
    <div className="
      bg-white dark:bg-gray-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700
      transition-all duration-300 hover:shadow-md
    ">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
          {titulo}
        </h3>
        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
          {Icono && <Icono className="text-slate-600 dark:text-slate-400 text-lg" />}
        </div>
      </div>

      <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
        {valor}
      </p>

      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 text-sm font-medium ${
          esPositivo 
            ? 'text-emerald-600 dark:text-emerald-400' 
            : 'text-red-600 dark:text-red-400'
        }`}>
          {esPositivo ? <FiTrendingUp size={14} /> : <FiTrendingDown size={14} />}
          <span>{esPositivo ? `+${cambio}%` : `${cambio}%`}</span>
        </div>
        <span className="text-slate-500 dark:text-slate-400 text-xs">
          vs. ayer
        </span>
      </div>
    </div>
  );
};