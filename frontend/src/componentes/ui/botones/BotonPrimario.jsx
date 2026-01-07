const BotonPrimario = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-8 py-4 bg-rojo hover:bg-rojo text-white font-bold rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/30"
    >
      {children}
    </button>
  );
};

export default BotonPrimario;
