import { FiMinus, FiPlus, FiTrash2, FiShoppingCart } from "react-icons/fi";
import { useVentaStore } from "../../../store/useVentaStore";
import { useState, useEffect } from "react";

export const DetalleVenta = () => {
  const { 
    detalle, 
    removerProducto, 
    actualizarCantidad, 
    obtenerId,
    calcularMontosProducto 
  } = useVentaStore();
  
  const [productoAEliminar, setProductoAEliminar] = useState(null);
  const [inputValues, setInputValues] = useState({});

  useEffect(() => {
    const nuevosInputs = {};
    detalle?.forEach((item) => {
      const itemId = obtenerId(item);
      nuevosInputs[itemId] = item.cantidad.toString();
    });
    setInputValues(nuevosInputs);
  }, [detalle, obtenerId]);

  const handleCantidadChange = (itemId, valor) => {
    setInputValues({ ...inputValues, [itemId]: valor });
    
    const cantidad = parseInt(valor);
    if (!isNaN(cantidad) && cantidad > 0 && cantidad <= 999) {
      actualizarCantidad(itemId, cantidad);
    }
  };

  const handleCantidadBlur = (itemId, cantidadActual) => {
    const valor = inputValues[itemId];
    const cantidad = parseInt(valor);
    
    if (!valor || isNaN(cantidad) || cantidad <= 0) {
      setInputValues({ ...inputValues, [itemId]: cantidadActual.toString() });
    } else if (cantidad > 999) {
      actualizarCantidad(itemId, 999);
      setInputValues({ ...inputValues, [itemId]: "999" });
    }
  };

  const aumentarCantidad = (itemId, cantidadActual) => {
    if (cantidadActual < 999) {
      const nuevaCantidad = cantidadActual + 1;
      actualizarCantidad(itemId, nuevaCantidad);
      setInputValues({ ...inputValues, [itemId]: nuevaCantidad.toString() });
    }
  };

  const disminuirCantidad = (itemId, cantidadActual) => {
    if (cantidadActual > 1) {
      const nuevaCantidad = cantidadActual - 1;
      actualizarCantidad(itemId, nuevaCantidad);
      setInputValues({ ...inputValues, [itemId]: nuevaCantidad.toString() });
    }
  };

  const confirmarEliminacion = (itemId) => {
    setProductoAEliminar(itemId);
  };

  const eliminarProducto = () => {
    if (productoAEliminar) {
      removerProducto(productoAEliminar);
      setProductoAEliminar(null);
    }
  };

  const cancelarEliminacion = () => {
    setProductoAEliminar(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Detalle de Venta
        </h2>
        {detalle?.length > 0 && (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            {detalle.length} {detalle.length === 1 ? 'producto' : 'productos'}
          </span>
        )}
      </div>

      {detalle?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <FiShoppingCart size={48} className="text-gray-400 dark:text-gray-600 mb-4" />
          <p className="text-base font-medium text-gray-600 dark:text-gray-400 mb-2">
            No hay productos agregados
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 text-center">
            Selecciona productos del panel izquierdo para comenzar
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                    Cant.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                    P. Unit.
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {detalle?.map((item, index) => {
                  const itemId = obtenerId(item);
                  
                  const nombre = item.nombre_producto || item.nombre || item.nombreProducto;
                  const precio = item.precio_producto || item.precio;
                  
                  const montosProducto = calcularMontosProducto(item, item.cantidad);
                  
                  return (
                    <tr
                      key={itemId}
                      className={`
                        border-t border-gray-200 dark:border-gray-700 
                        hover:bg-gray-50 dark:hover:bg-gray-750 
                        transition-colors
                        ${productoAEliminar === itemId ? 'bg-red-50 dark:bg-red-900/20' : ''}
                        ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/50 dark:bg-gray-800/50'}
                      `}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => disminuirCantidad(itemId, item.cantidad)}
                            disabled={item.cantidad <= 1}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-l border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Disminuir cantidad"
                          >
                            <FiMinus size={14} />
                          </button>
                          
                          <input
                            type="number"
                            min="1"
                            max="999"
                            value={inputValues[itemId] || item.cantidad}
                            onChange={(e) => handleCantidadChange(itemId, e.target.value)}
                            onBlur={() => handleCantidadBlur(itemId, item.cantidad)}
                            onFocus={(e) => e.target.select()}
                            className="w-14 h-7 text-center border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          
                          <button
                            onClick={() => aumentarCantidad(itemId, item.cantidad)}
                            disabled={item.cantidad >= 999}
                            className="inline-flex items-center justify-center w-7 h-7 rounded-r border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Aumentar cantidad"
                          >
                            <FiPlus size={14} />
                          </button>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-gray-900 dark:text-gray-200 font-medium">
                        {nombre || 'Producto sin nombre'}
                      </td>

                      <td className="px-4 py-3 text-right text-gray-600 dark:text-gray-400">
                        S/ {montosProducto?.valor_unitario?.toFixed(2) || '0.00'}
                      </td>

                      <td className="px-4 py-3 text-right font-bold text-gray-900 dark:text-white">
                        S/ {montosProducto?.total?.toFixed(2) || '0.00'}
                      </td>

                      <td className="px-4 py-3 text-center">
                        {productoAEliminar === itemId ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={eliminarProducto}
                              className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                              title="Confirmar eliminación"
                            >
                              Sí
                            </button>
                            <button
                              onClick={cancelarEliminacion}
                              className="px-2 py-1 text-xs bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
                              title="Cancelar"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => confirmarEliminacion(itemId)}
                            className="inline-flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                            title="Eliminar producto"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-end">
              <div className="flex justify-between items-center gap-8 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Items:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {detalle?.reduce((acc, item) => acc + item.cantidad, 0)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};