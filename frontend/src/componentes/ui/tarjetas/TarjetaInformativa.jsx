const TarjetaInformativa = ({icono, titulo, descripcion, detalles}) => {
  return (
    <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center">
        <div className="text-red-500 text-2xl mr-2">
            {icono}
        </div>
        {titulo}
      </h3>
      <p className="text-gray-200 mb-2 pb-2.5">{descripcion}</p>
      <p className="text-gray-200 mb-4">{detalles}</p>
    </div>
  );
};

export default TarjetaInformativa;
