const TarjetaCompacta = ({ titulo, descripcion }) => {
  return (
    <div className="
      group relative
      bg-white/5 hover:bg-white/10
      border border-white/10 hover:border-rojo/40
      backdrop-blur-sm rounded-xl
      px-5 py-4 text-center
      min-w-32.5
      transition-all duration-300
      hover:shadow-[0_4px_20px_rgba(230,57,70,0.15)]
      hover:-translate-y-0.5
    ">
      {/* Acento superior */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-rojo rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="text-2xl md:text-3xl font-extrabold text-rojo leading-none mb-1">
        {titulo}
      </div>
      <div className="text-gray-400 text-xs uppercase tracking-wider leading-snug">
        {descripcion}
      </div>
    </div>
  );
};

export default TarjetaCompacta;