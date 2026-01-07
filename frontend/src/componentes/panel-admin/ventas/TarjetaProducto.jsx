import { useVentaStore } from "../../../store/useVentaStore"

export const TarjetaProducto = ({ producto }) => {
  const { agregarProducto } = useVentaStore((state) => state);

  return (
    <button
      onClick={() => {
        agregarProducto(producto);
      }}
      className="cursor-pointer transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-100"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
          {producto.nombreProducto}
        </h3>
        <p className="font-bold text-blue-600 text-sm ">
          S/ {producto.precio}
        </p>
      </div>
    </button>
  );
};
