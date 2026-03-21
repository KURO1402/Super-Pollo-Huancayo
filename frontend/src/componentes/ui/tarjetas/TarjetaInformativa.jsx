const TarjetaInformativa = ({ icono, titulo, descripcion, detalles }) => {
  return (
    <div className="
      mt-5
      bg-white/5 hover:bg-white/8
      border border-white/10 hover:border-rojo/30
      backdrop-blur-sm rounded-xl
      px-5 py-5
      flex items-start gap-4
      transition-all duration-300
      group
    ">
      <div className="
        shrink-0
        w-11 h-11 rounded-lg
        bg-rojo/15 group-hover:bg-rojo/25
        flex items-center justify-center
        transition-colors duration-300
        text-rojo text-xl
      ">
        {icono}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">
          {titulo}
        </h3>
        <div className="w-8 h-px bg-rojo/50 mb-2 rounded-full" />
        <p className="text-gray-200 text-sm leading-relaxed">{descripcion}</p>
        {detalles && (
          <p className="text-gray-400 text-xs mt-1.5 flex items-center gap-1.5">
            <span className="inline-block w-3 h-px bg-amarillo rounded-full" />
            {detalles}
          </p>
        )}
      </div>
    </div>
  );
};

export default TarjetaInformativa;