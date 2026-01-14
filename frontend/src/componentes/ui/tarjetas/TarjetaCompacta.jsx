const TarjetaCompacta = ({ titulo, descripcion }) => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center min-w-[140px]">
      <div className="text-3xl font-bold text-red-500">{titulo}</div>
      <div className="text-white text-sm">{descripcion}</div>
    </div>
  );
};

export default TarjetaCompacta;
