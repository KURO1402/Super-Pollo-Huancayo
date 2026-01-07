import { FaBorderAll } from "react-icons/fa6";
import { GiChickenOven } from "react-icons/gi";
import { RiDrinks2Fill } from "react-icons/ri";
import { LuSalad } from "react-icons/lu";
import { LuDessert } from "react-icons/lu";

const categorias = [
  { nombre: "Todos", icono: <FaBorderAll /> },
  { nombre: "Pollos", icono: <GiChickenOven /> },
  { nombre: "Bebidas", icono: <RiDrinks2Fill /> },
  { nombre: "Extras", icono: <LuSalad /> },
  { nombre: "Postres", icono: <LuDessert /> },
];

const MenuCategorias = ({ categoriaSeleccionada, onCategoriaChange }) => {
  return (
    <div className="flex justify-center gap-4 md:gap-6 mb-10 flex-wrap px-4">
      {categorias.map((cat) => {
        const estaSeleccionada = categoriaSeleccionada === cat.nombre;
        
        return (
          <button
            key={cat.nombre}
            onClick={() => onCategoriaChange(cat.nombre)}
            className={`flex flex-col items-center gap-2 px-4 py-3 md:px-5 md:py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg group relative overflow-hidden ${
              estaSeleccionada 
                ? 'bg-rojo text-white shadow-lg scale-105' 
                : 'hover:bg-rojo text-gray-100'
            }`}
          >
            <div className={`absolute inset-0 bg-rojo rounded-xl transition-opacity duration-300 ${
              estaSeleccionada ? 'opacity-100' : 'opacity-0 group-hover:opacity-10'
            }`}></div>

            <div className={`text-3xl md:text-4xl transition-colors duration-300 transform ${
              estaSeleccionada 
                ? 'text-white scale-110' 
                : 'text-rojo group-hover:text-white group-hover:scale-110'
            }`}>
              {cat.icono}
            </div>

            <span className={`text-xs md:text-sm font-semibold transition-colors duration-300 whitespace-nowrap ${
              estaSeleccionada ? 'text-white' : 'text-gray-100 group-hover:text-white'
            }`}>
              {cat.nombre}
            </span>

            <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 bg-white rounded-t-full transition-all duration-300 ${
              estaSeleccionada ? 'w-8' : 'w-0 group-hover:w-8'
            }`}></div>
          </button>
        );
      })}
    </div>
  );
};

export default MenuCategorias;