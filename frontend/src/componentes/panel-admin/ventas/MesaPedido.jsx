import { FiCheck, FiClock, FiUsers } from 'react-icons/fi';

const COLORES_ESTADO = {
  disponible: {
    bg: "from-emerald-500 to-emerald-600",
    border: "border-emerald-400",
    badge: "bg-emerald-500/20 text-emerald-300",
    hover: "hover:from-emerald-400 hover:to-emerald-500"
  },
  ocupado: {
    bg: "from-red-500 to-red-600",
    border: "border-red-400",
    badge: "bg-red-500/20 text-red-300",
    hover: "hover:from-red-400 hover:to-red-500"
  },
  reservada: {
    bg: "from-yellow-500 to-yellow-600",
    border: "border-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-300",
    hover: "hover:from-yellow-400 hover:to-yellow-500"
  },
  bloqueada: {
    bg: "from-gray-500 to-gray-600",
    border: "border-gray-400",
    badge: "bg-gray-500/20 text-gray-300",
    hover: "hover:from-gray-400 hover:to-gray-500"
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
      className="relative w-32 h-28 group transition-all duration-200 outline-none hover:scale-102"
    >
      <div className={`absolute inset-0 rounded-xl bg-linear-to-br ${colores.bg}
        ${colores.hover} transition-all duration-200`}
      />
     
      <div className="absolute inset-0 rounded-xl bg-linear-to-b from-white/10 to-transparent opacity-50" />
     
      <div className={`absolute inset-1 rounded-lg border ${colores.border} opacity-30`} />
     
      <div className="relative h-full flex flex-col items-center justify-center p-2">
        <div className="text-lg font-bold text-white drop-shadow-lg">
          {numero}
        </div>
       
        <div className="flex items-center gap-1 mt-0.5">
          <FiUsers className="w-2.5 h-2.5 text-white/70" />
          <span className="text-[10px] font-medium text-white/80">{capacidad}p</span>
        </div>
       
        <div className={`mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-medium ${colores.badge} backdrop-blur-sm`}>
          {ETIQUETAS_ESTADO[estado] || estado}
        </div>
       
        {tienePedidoActivo && estado === "ocupada" && (
          <div className="absolute -top-1 -right-1">
            <div className="bg-red-500 rounded-full p-0.5 shadow-lg animate-pulse">
              <FiCheck className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        )}
       
        {/* Indicador de reserva */}
        {estado === "reservada" && (
          <div className="absolute -top-1 -right-1">
            <div className="bg-yellow-500 rounded-full p-0.5 shadow-lg">
              <FiClock className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        )}
      </div>
     
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="absolute inset-0 rounded-xl ring-1 ring-white/30" />
      </div>
     
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-10">
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-lg whitespace-nowrap">
          <span className="text-[9px] font-medium text-gray-300">
            Mesa {numero} • {capacidad} personas
            {tienePedidoActivo && estado === "ocupada" && " • Con pedido"}
          </span>
        </div>
      </div>
     
      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3/4 h-1 bg-black/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-all duration-200" />
    </button>
  );
};


export default MesaPedido;