import { useState, useEffect } from 'react';
import { FiTrash2, FiEdit, FiX, FiPlusCircle } from 'react-icons/fi';
import { agregarInsumoProductoServicio, eliminarInsumoProductoServicio, modificarCantidadInsumoServicio, obtenerInsumosProductoServicio } from '../../../servicios/productoServicios';
import mostrarAlerta from '../../../utilidades/toastUtilidades';
import { useConfirmacion } from '../../../hooks/useConfirmacion';
import { ModalConfirmacion } from '../../ui/modal/ModalConfirmacion';
import BuscadorInsumo from './BuscadorInsumo';

export const ModalReceta = ({ producto, onClose, onGuardar }) => {
  const [insumosProducto, setInsumosProducto] = useState([]);
  const [nuevoInsumo, setNuevoInsumo] = useState({ insumo: null, cantidadUso: "" });
  const [editandoInsumo, setEditandoInsumo] = useState(null);
  const [nuevaCantidad, setNuevaCantidad] = useState(0);
  const [cargando, setCargando] = useState(true);

  const usaInsumos = producto.usa_insumos === 'Sí' || producto.usa_insumos === 1;

  const confirmacionEliminar = useConfirmacion();

  useEffect(() => {
    if (usaInsumos) {
      cargarInsumosProducto();
    } else {
      setCargando(false);
    }
  }, [producto.id_producto]);

  const cargarInsumosProducto = async () => {
    try {
      const respuesta = await obtenerInsumosProductoServicio(producto.id_producto);
      setInsumosProducto(respuesta?.insumos ?? []);
    } catch {
      setInsumosProducto([]);
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarInsumo = async () => {
    const cantidad = parseFloat(nuevoInsumo.cantidadUso);
    if (!nuevoInsumo.insumo || !cantidad || cantidad <= 0) {
      mostrarAlerta.advertencia('Seleccione un insumo e ingrese una cantidad válida');
      return;
    }
    try {
      await agregarInsumoProductoServicio(producto.id_producto, {
        idInsumo: nuevoInsumo.insumo.id_insumo,
        cantidadUso: cantidad
      });
      await cargarInsumosProducto();
      setNuevoInsumo({ insumo: null, cantidadUso: "" });
      mostrarAlerta.exito('Insumo agregado correctamente');
    } catch (error) {
      mostrarAlerta.error(error.message || "No se pudo agregar el insumo");
    }
  };

  const iniciarEdicion = (insumo) => {
    setEditandoInsumo(insumo.id_insumo);
    setNuevaCantidad(insumo.cantidad_uso);
  };

  const guardarCantidad = async (idInsumo) => {
    if (nuevaCantidad <= 0) {
      mostrarAlerta.advertencia('La cantidad debe ser mayor a 0');
      return;
    }
    try {
      await modificarCantidadInsumoServicio(producto.id_producto, {
        idInsumo,
        cantidadUso: parseFloat(nuevaCantidad)
      });
      await cargarInsumosProducto();
      setEditandoInsumo(null);
      setNuevaCantidad(0);
      mostrarAlerta.exito('Cantidad actualizada correctamente');
    } catch (error) {
      mostrarAlerta.error(error.message || 'Error al modificar cantidad');
    }
  };

  const cancelarEdicion = () => {
    setEditandoInsumo(null);
    setNuevaCantidad(0);
  };

  const solicitarEliminarInsumo = (insumo) => {
    confirmacionEliminar.solicitarConfirmacion(
      `¿Estás seguro de eliminar "${insumo.nombre_insumo}" de este producto?`,
      () => handleEliminarInsumo(insumo.id_insumo),
      {
        titulo: "Eliminar Insumo del Producto",
        tipo: "peligro",
        textoConfirmar: "Sí, eliminar",
        textoCancelar: "Cancelar"
      }
    );
  };

  const handleEliminarInsumo = async (idInsumo) => {
    try {
      await eliminarInsumoProductoServicio(producto.id_producto, { idInsumo });

      const insumosRestantes = insumosProducto.filter(i => i.id_insumo !== idInsumo);

      if (insumosRestantes.length === 0) {
        setInsumosProducto([]);
      } else {
        await cargarInsumosProducto();
      }
      mostrarAlerta.exito('Insumo eliminado correctamente');
    } catch (error) {
      mostrarAlerta.error(error.message || 'Error al eliminar insumo');
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-600 dark:text-gray-400">
        Gestiona los insumos necesarios para preparar "{producto.nombre_producto}"
      </p>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Agregar Insumo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seleccionar insumo
            </label>
            <BuscadorInsumo
              value={nuevoInsumo.insumo}
              onChange={(insumo) => setNuevoInsumo(prev => ({ ...prev, insumo }))}
              placeholder="Buscar insumo..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cantidad de uso
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={nuevoInsumo.cantidadUso}
              onChange={(e) => setNuevoInsumo(prev => ({ ...prev, cantidadUso: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAgregarInsumo}
              className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <FiPlusCircle size={16} />
              Agregar
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
          Insumos del Producto ({insumosProducto.length})
        </h4>

        {insumosProducto.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {usaInsumos ? (
              <>
                <p>No hay insumos agregados a este producto</p>
                <p className="text-sm mt-1">Agrega insumos usando el formulario superior</p>
              </>
            ) : (
              <p className="text-sm">
                Este producto no tiene inventario de insumos activado.
                Al agregar el primer insumo se activará automáticamente.
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">INSUMO</th>
                  <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">CANTIDAD</th>
                  <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {insumosProducto.map((insumo) => (
                  <tr key={insumo.id_insumo} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {insumo.nombre_insumo}
                    </td>
                    <td className="px-4 py-3">
                      {editandoInsumo === insumo.id_insumo ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={nuevaCantidad}
                            onChange={(e) => setNuevaCantidad(e.target.value || 0)}
                            className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:text-gray-100 text-sm"
                          />
                          <button
                            onClick={() => guardarCantidad(insumo.id_insumo)}
                            className="text-green-600 hover:text-green-800 cursor-pointer"
                            title="Guardar"
                          >
                            <FiPlusCircle size={20} />
                          </button>
                          <button
                            onClick={cancelarEdicion}
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                            title="Cancelar"
                          >
                            <FiX size={20} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 dark:text-gray-400">
                            {insumo.cantidad_uso}
                          </span>
                          <button
                            onClick={() => iniciarEdicion(insumo)}
                            className="text-blue-600 hover:text-blue-800 cursor-pointer"
                            title="Editar cantidad"
                          >
                            <FiEdit size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => solicitarEliminarInsumo(insumo)}
                        className="cursor-pointer text-red-600 hover:text-red-800 dark:text-red-600 dark:hover:text-red-500 transition-colors"
                        title="Eliminar insumo"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          Cerrar
        </button>
      </div>

      <ModalConfirmacion
        visible={confirmacionEliminar.confirmacionVisible}
        onCerrar={confirmacionEliminar.ocultarConfirmacion}
        onConfirmar={confirmacionEliminar.confirmarAccion}
        titulo={confirmacionEliminar.tituloConfirmacion}
        mensaje={confirmacionEliminar.mensajeConfirmacion}
        tipo={confirmacionEliminar.tipoConfirmacion}
        textoConfirmar={confirmacionEliminar.textoConfirmar}
        textoCancelar={confirmacionEliminar.textoCancelar}
      />
    </div>
  );
};