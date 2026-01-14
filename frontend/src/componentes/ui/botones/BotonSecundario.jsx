const BotonSecundario = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-8 py-4 border-2 border-amarillo text-amarillo hover:bg-amarillo hover:text-gray-900 font-bold rounded-full transition-all duration-300"
    >
      {children}
    </button>
  );
};

export default BotonSecundario;
