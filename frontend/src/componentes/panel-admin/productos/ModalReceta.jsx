import { useState, useEffect } from 'react';
import { FiTrash2, FiEdit, FiX } from 'react-icons/fi';
import { FiPlusCircle } from "react-icons/fi";
import { listarInsumoServicio } from '../../../servicios/insumosServicios';
import { agregarInsumoProductoServicio, eliminarInsumoProductoServicio, modificarCantidadInsumoServicio, obtenerInsumosProductoServicio } from '../../../servicios/productoServicios';
import mostrarAlerta from '../../../utilidades/toastUtilidades';
import { useConfirmacion } from '../../../hooks/useConfirmacion';
import { ModalConfirmacion } from '../../ui/modal/ModalConfirmacion';

export const ModalReceta = ({ producto, onClose, onGuardar }) => {
  const [insumosProducto, setInsumosProducto] = useState([]);
  const [insumosDisponibles, setInsumosDisponibles] = useState([]);
  const [nuevoInsumo, setNuevoInsumo] = useState({
    idInsumo: "",
    cantidadUso: ""
  });
  const [editandoInsumo, setEditandoInsumo] = useState(null);
  const [nuevaCantidad, setNuevaCantidad] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [insumoAEliminar, setInsumoAEliminar] = useState(null);

  const confirmacionEliminar = useConfirmacion();

  useEffect(() => {
    cargarDatos();
  }, [producto.idProducto]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);
      
      const respuestaInsumosProducto = await obtenerInsumosProductoServicio(producto.idProducto);
      setInsumosProducto(respuestaInsumosProducto.insumos || []);
      
      const respuestaInsumosDisponibles = await listarInsumoServicio();
      setInsumosDisponibles(respuestaInsumosDisponibles || []);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarInsumo = async () => {

    const cantidad = parseFloat(nuevoInsumo.cantidadUso);

    if (!nuevoInsumo.idInsumo || !cantidad || cantidad <= 0) {
      mostrarAlerta.advertencia('Seleccione un insumo y ingrese una cantidad válida');
      return;
    }

    try {
      const datos = {
        idProducto: producto.idProducto,
        idInsumo: parseInt(nuevoInsumo.idInsumo),
        cantidadUso: cantidad
      };

      await agregarInsumoProductoServicio(datos);
      
      await cargarDatos();
      
      setNuevoInsumo({ idInsumo: "", cantidadUso: "" });
      
      mostrarAlerta.exito('Insumo agregado correctamente');
      
    } catch (error) {
      mostrarAlerta.error("No se puedo agregar el insumo");
    }
  };

  const iniciarEdicion = (insumo) => {
    setEditandoInsumo(insumo.idInsumo);
    setNuevaCantidad(insumo.cantidaUso || insumo.cantidadUso);
  };

  const guardarCantidad = async (idInsumo) => {
    if (nuevaCantidad <= 0) {
      mostrarAlerta.advertencia('La cantidad debe ser mayor a 0');
      return;
    }

    try {
      const datos = {
        idProducto: producto.idProducto,
        idInsumo: idInsumo,
        nuevaCantidad: parseFloat(nuevaCantidad)
      };
      await modificarCantidadInsumoServicio(datos);
      
      await cargarDatos();
      
      setEditandoInsumo(null);
      setNuevaCantidad(0);
      
      mostrarAlerta.exito('Cantidad actualizada correctamente');
      
    } catch (error) {
      const mensajeError = error.response?.data?.mensaje || error.message || 'Error al modificar cantidad';
      mostrarAlerta.error(mensajeError);
    }
  };

  const cancelarEdicion = () => {
    setEditandoInsumo(null);
    setNuevaCantidad(0);
  };

  const solicitarEliminarInsumo = (insumo) => {
    const nombreInsumo = obtenerNombreInsumo(insumo.idInsumo);
    setInsumoAEliminar(insumo);
    
    confirmacionEliminar.solicitarConfirmacion(
      `¿Estás seguro de eliminar el insumo "${nombreInsumo}" de este producto? Esta acción no se puede deshacer.`,
      () => {
        handleEliminarInsumo(insumo.idInsumo);
      },
      {
        titulo: "Eliminar Insumo del Producto",
        tipo: "peligro",
        textoConfirmar: "Sí, eliminar",
        textoCancelar: "Cancelar"
      }
    );
  };

  const cancelarEliminacion = () => {
    setInsumoAEliminar(null);
    confirmacionEliminar.ocultarConfirmacion();
  };

  const handleEliminarInsumo = async (idInsumo) => {
    try {
      const datos = {
        idProducto: producto.idProducto,
        idInsumo: idInsumo
      };

      await eliminarInsumoProductoServicio(datos);
      
      await cargarDatos();
      
      mostrarAlerta.exito('Insumo eliminado correctamente');
      
    } catch (error) {
      const mensajeError = error.response?.data?.mensaje || error.message || 'Error al eliminar insumo';
      mostrarAlerta.error(mensajeError);
    } finally {
      setInsumoAEliminar(null);
    }
  };

  const obtenerNombreInsumo = (idInsumo) => {
    const insumo = insumosDisponibles.find(ins => ins.idInsumo === idInsumo);
    return insumo ? insumo.nombreInsumo : 'Insumo no encontrado';
  };

  const obtenerUnidadInsumo = (idInsumo) => {
    const insumo = insumosDisponibles.find(ins => ins.idInsumo === idInsumo);
    return insumo ? insumo.unidadMedida : 'N/A';
  };

  if (cargando) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-300">Error: {error}</p>
          <button
            onClick={cargarDatos}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-600 dark:text-gray-400">
        Gestiona los insumos necesarios para preparar "{producto.nombreProducto}"
      </p>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 className="cursor-pointer text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Agregar Insumo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Seleccionar insumo
            </label>
            <select
              value={nuevoInsumo.idInsumo}
              onChange={(e) => setNuevoInsumo({...nuevoInsumo, idInsumo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Seleccione un insumo</option>
              {insumosDisponibles.map(insumo => (
                <option key={insumo.idInsumo} value={insumo.idInsumo}>
                  {insumo.nombreInsumo} ({insumo.unidadMedida})
                </option>
              ))}
            </select>
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
              onChange={(e) => setNuevoInsumo({...nuevoInsumo, cantidadUso: e.target.value})}
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
            <p>No hay insumos agregados a este producto</p>
            <p className="text-sm">Agrega insumos usando el formulario superior</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">INSUMO</th>
                  <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">CANTIDAD</th>
                  <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">UNIDAD</th>
                  <th className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300">ACCIONES</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {insumosProducto.map((insumo) => (
                  <tr key={insumo.idInsumo} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">
                      {obtenerNombreInsumo(insumo.idInsumo)}
                    </td>
                    
                    <td className="px-4 py-3">
                      {editandoInsumo === insumo.idInsumo ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={nuevaCantidad}
                            onChange={(e) => setNuevaCantidad((e.target.value) || 0)}
                            className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded dark:text-gray-100 text-sm"
                          />
                          <button
                            onClick={() => guardarCantidad(insumo.idInsumo)}
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
                            {insumo.cantidaUso || insumo.cantidadUso}
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
                    
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                      {obtenerUnidadInsumo(insumo.idInsumo)}
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

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        >
          Cerrar
        </button>
      </div>

      <ModalConfirmacion
        visible={confirmacionEliminar.confirmacionVisible}
        onCerrar={cancelarEliminacion}
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