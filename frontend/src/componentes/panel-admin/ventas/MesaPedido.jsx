import { FiCheck, FiClock, FiUsers } from 'react-icons/fi';

const COLORES_ESTADO = {
  disponible: {
    bg: "bg-linear-to-br from-emerald-400 to-emerald-500 dark:from-emerald-600 dark:to-emerald-700",
    bgLight: "bg-emerald-50 dark:bg-transparent",
    border: "border-emerald-300 dark:border-emerald-500",
    borderLight: "border-emerald-200 dark:border-transparent",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-white",
    shadow: "shadow-emerald-200 dark:shadow-emerald-900/30",
    ring: "ring-emerald-400 dark:ring-emerald-500"
  },
  ocupado: {
    bg: "bg-linear-to-br from-red-400 to-red-500 dark:from-red-600 dark:to-red-700",
    bgLight: "bg-red-50 dark:bg-transparent",
    border: "border-red-300 dark:border-red-500",
    borderLight: "border-red-200 dark:border-transparent",
    badge: "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
    text: "text-red-700 dark:text-white",
    shadow: "shadow-red-200 dark:shadow-red-900/30",
    ring: "ring-red-400 dark:ring-red-500"
  },
  reservada: {
    bg: "bg-linear-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700",
    bgLight: "bg-amber-50 dark:bg-transparent",
    border: "border-amber-300 dark:border-amber-500",
    borderLight: "border-amber-200 dark:border-transparent",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
    text: "text-amber-700 dark:text-white",
    shadow: "shadow-amber-200 dark:shadow-amber-900/30",
    ring: "ring-amber-400 dark:ring-amber-500"
  },
  bloqueada: {
    bg: "bg-linear-to-br from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-700",
    bgLight: "bg-slate-50 dark:bg-transparent",
    border: "border-slate-300 dark:border-slate-500",
    borderLight: "border-slate-200 dark:border-transparent",
    badge: "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300",
    text: "text-slate-700 dark:text-white",
    shadow: "shadow-slate-200 dark:shadow-slate-900/30",
    ring: "ring-slate-400 dark:ring-slate-500"
  }
};

const ETIQUETAS_ESTADO = {
  disponible: "Disponible",
  ocupada: "Ocupada",
  reservada: "Reservada",
  bloqueada: "Bloqueada"
};

const MesaPedido = ({
  numero,
  id,
  capacidad = 4,
  estado = "disponible",
  tienePedidoActivo = false,
  onClick
}) => {
  const estadoValido = COLORES_ESTADO[estado] ? estado : "disponible";
  const colores = COLORES_ESTADO[estadoValido];

  const handleClick = () => {
    if (onClick) {
      onClick({ id, numero, capacidad, estado });
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative w-32 h-28 group transition-all duration-300 outline-none hover:scale-105 focus:scale-105 active:scale-95"
    >
      <div className={`absolute inset-0 rounded-xl ${colores.bgLight} border ${colores.borderLight} dark:hidden shadow-sm ${colores.shadow}`} />
      
      <div className={`absolute inset-0 rounded-xl ${colores.bg} hidden dark:block shadow-lg ${colores.shadow}`} />
      
      <div className="absolute inset-0 rounded-xl bg-linear-to-b from-white/15 to-transparent opacity-0 dark:opacity-100" />
      
      <div className={`absolute inset-0 rounded-xl border-2 ${colores.border} opacity-0 dark:opacity-0 group-hover:opacity-100 transition-opacity duration-200`} />
      
      <div className="relative h-full flex flex-col items-center justify-center p-2">
        <div className={`text-xl font-black ${colores.text} dark:text-white drop-shadow-sm transition-all duration-200 group-hover:scale-110`}>
          {numero}
        </div>
        
        <div className="flex items-center gap-1 mt-1">
          <FiUsers className={`w-3 h-3 ${colores.text} dark:text-white/80`} />
          <span className={`text-xs font-semibold ${colores.text} dark:text-white/80`}>{capacidad}p</span>
        </div>
        
        <div className={`mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${colores.badge} backdrop-blur-sm border ${colores.border} shadow-sm transition-all duration-200 group-hover:scale-105 group-hover:shadow-md`}>
          {ETIQUETAS_ESTADO[estado] || estado}
        </div>
        
        {tienePedidoActivo && estado === "ocupada" && (
          <div className="absolute -top-1.5 -right-1.5 animate-bounce">
            <div className="bg-linear-to-br from-red-500 to-red-600 dark:from-red-500 dark:to-red-600 rounded-full p-1 shadow-lg ring-2 ring-white dark:ring-gray-800">
              <FiCheck className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
        
        {estado === "reservada" && (
          <div className="absolute -top-1.5 -right-1.5 animate-pulse">
            <div className="bg-linear-to-br from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600 rounded-full p-1 shadow-lg ring-2 ring-white dark:ring-gray-800">
              <FiClock className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </div>
      
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
        <div className={`absolute inset-0 rounded-xl ring-2 ${colores.ring} ring-offset-2 ring-offset-white dark:ring-offset-gray-900`} />
      </div>
      
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-10/12 h-2 bg-black/20 dark:bg-black/40 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-all duration-300" />
      
      <div className="absolute inset-0 rounded-xl opacity-0 active:opacity-100 transition-opacity duration-100">
        <div className="absolute inset-0 bg-black/5 dark:bg-black/30 rounded-xl" />
      </div>
    </button>
  );
};

export default MesaPedido;