const TarjetaImagen = ({ imagen, titulo }) => {
  return (
    <div className="relative group overflow-hidden rounded-xl shadow-lg">
      <img
        src={imagen}
        alt="Interior del restaurante Superpollo"
        className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <span className="text-white font-semibold text-lg">{titulo}</span>
      </div>
    </div>
  );
};

export default TarjetaImagen;
