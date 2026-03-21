const TarjetaImagen = ({ imagen, titulo }) => {
  return (
    <div className="
      relative group overflow-hidden rounded-xl
      shadow-[0_4px_24px_rgba(0,0,0,0.35)]
      ring-1 ring-white/10 hover:ring-rojo/30
      transition-all duration-500
    ">
      <img
        src={imagen}
        alt={titulo}
        className="w-full h-52 object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
        <span className="text-white text-sm font-semibold tracking-wide drop-shadow">
          {titulo}
        </span>
      </div>

      <div className="
        absolute inset-0
        bg-rojo/20 backdrop-blur-[1px]
        opacity-0 group-hover:opacity-100
        transition-opacity duration-400
        flex items-center justify-center
      ">
        <span className="
          text-white font-bold text-base uppercase tracking-widest
          border border-white/60 px-4 py-1.5 rounded-full
          translate-y-2 group-hover:translate-y-0
          transition-transform duration-300
        ">
          {titulo}
        </span>
      </div>
    </div>
  );
};

export default TarjetaImagen;