import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { FiCalendar, FiClock, FiUsers, FiBox, FiSave, FiX, FiPlus, FiTrash2, FiLoader } from "react-icons/fi";
import { horariosDisponibles } from "../../../mocks/mockReservas";
import { obtenerMesasDisponiblesServicio } from "../../../servicios/reservacionesServicio";
import { useAutenticacionStore } from "../../../store/useAutenticacionStore";
import { registrarReservacionServicio } from "../../../servicios/reservacionesServicio";
import { obtenerProductosServicio } from "../../../servicios/productoServicios";
import { mostrarAlerta } from "../../../utilidades/toastUtilidades";

const FormularioReserva = ({ reservaInicial, onCancelar, guardando }) => {
  const { usuario } = useAutenticacionStore();
  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);
  const [cargandoMesas, setCargandoMesas] = useState(false);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [productosSeleccionados, setProductosSeleccionados] = useState([]);
  const [mostrarAgregarProducto, setMostrarAgregarProducto] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    idProducto: '',
    cantidadProductoReservacion: 1,
    precioUnitario: 0
  });

  const fechaMinima = new Date().toISOString().split("T")[0];
  const {
    control, handleSubmit, watch, reset, formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      cantidadPersonas: 2,
      fechaReservacion: "",
      horaReservacion: "",
      idMesa: "",
    },
  });

  const fechaReservaWatch = watch("fechaReservacion");
  const horaReservacionWatch = watch("horaReservacion");

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setCargandoProductos(true);
        const respuesta = await obtenerProductosServicio();
        setProductosDisponibles(respuesta.productos);
      } catch (error) {
        mostrarAlerta.error('Error al cargar los productos disponibles');
        setProductosDisponibles([]);
      } finally {
        setCargandoProductos(false);
      }
    };

    cargarProductos();
  }, []);

  useEffect(() => {
    if (reservaInicial) {
      reset({
        cantidadPersonas: reservaInicial.cantidadPersonas || 2,
        fechaReservacion: reservaInicial.fechaReservacion?.split('T')[0] || "",
        horaReservacion: reservaInicial.horaReservacion?.substring(0, 5) || "",
        idMesa: reservaInicial.numeroMesa || "",
        comentarios: "",
        idUsuario: reservaInicial.idUsuario,
      });
    } else {
      reset({
        cantidadPersonas: 2,
        fechaReservacion: "",
        horaReservacion: "",
        idMesa: "",
        estadoReservacion: "pendiente",
        idUsuario: 1,
      });
    }
  }, [reservaInicial, reset]);

  useEffect(() => {
    const cargarMesasDisponibles = async () => {
      if (fechaReservaWatch && horaReservacionWatch) {
        try {
          setCargandoMesas(true);
          const mesas = await obtenerMesasDisponiblesServicio(
            fechaReservaWatch,
            horaReservacionWatch + ':00'
          );
          setMesasDisponibles(mesas.mesas || []);
        } catch (error) {
          mostrarAlerta.error('Error al cargar las mesas disponibles');
          setMesasDisponibles([]);
        } finally {
          setCargandoMesas(false);
        }
      } else {
        setMesasDisponibles([]);
      }
    };

    cargarMesasDisponibles();
  }, [fechaReservaWatch, horaReservacionWatch]);

  const handleSeleccionarProducto = (e) => {
    const idProducto = parseInt(e.target.value);
    const productoSeleccionado = productosDisponibles.find(p => p.idProducto === idProducto);
    
    if (productoSeleccionado) {
      setNuevoProducto({
        idProducto: productoSeleccionado.idProducto,
        cantidadProductoReservacion: 1, 
        precioUnitario: productoSeleccionado.precio
      });
    } else {
      setNuevoProducto({
        idProducto: '',
        cantidadProductoReservacion: 1,
        precioUnitario: 0
      });
    }
  };

  const handleAgregarProducto = () => {
    if (!nuevoProducto.idProducto) {
      mostrarAlerta.advertencia('Por favor, seleccione un producto');
      return;
    }

    if (nuevoProducto.cantidadProductoReservacion <= 0) {
      mostrarAlerta.advertencia('La cantidad debe ser mayor a 0');
      return;
    }

    const productoExistente = productosSeleccionados.find(p => p.idProducto === nuevoProducto.idProducto);
    
    if (productoExistente) {
      setProductosSeleccionados(prev => prev.map(p => 
        p.idProducto === nuevoProducto.idProducto 
          ? { ...p, cantidadProductoReservacion: p.cantidadProductoReservacion + nuevoProducto.cantidadProductoReservacion }
          : p
      ));
      mostrarAlerta.exito('Cantidad actualizada correctamente');
    } else {
      const productoCompleto = {
        ...nuevoProducto,
        nombreProducto: productosDisponibles.find(p => p.idProducto === nuevoProducto.idProducto)?.nombreProducto || 'Producto'
      };
      setProductosSeleccionados(prev => [...prev, productoCompleto]);
      mostrarAlerta.exito('Producto agregado correctamente');
    }

    setNuevoProducto({
      idProducto: '',
      cantidadProductoReservacion: 1, 
      precioUnitario: 1
    });
    setMostrarAgregarProducto(false);
  };

  const handleEliminarProducto = (index) => {
    const producto = productosSeleccionados[index];
    setProductosSeleccionados(prev => prev.filter((_, i) => i !== index));
    mostrarAlerta.exito(`${producto.nombreProducto} eliminado de la reserva`);
  };

  const handleActualizarCantidad = (index, nuevaCantidad) => {
    if (nuevaCantidad < 0) return;
    
    setProductosSeleccionados(prev => prev.map((producto, i) => 
      i === index ? { ...producto, cantidadProductoReservacion: nuevaCantidad } : producto
    ));
  };

  const calcularTotal = () => {
    return productosSeleccionados.reduce((total, producto) => 
      total + (producto.precioUnitario * producto.cantidadProductoReservacion), 0
    );
  };

  const validaciones = {
    cantidadPersonas: {
      required: "Campo requerido",
      min: { value: 1, message: "Mínimo 1 persona" },
      max: { value: 20, message: "Máximo 20 personas" },
    },
    fechaReservacion: {
      required: "La fecha es requerida",
      validate: {
        noEsPasada: (value) => {
          const fechaSel = new Date(value);
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          return fechaSel >= hoy || "No se pueden reservar fechas pasadas";
        },
      },
    },
    horaReservacion: {
      required: "La hora es requerida",
    },
    idMesa: {
      required: "Debe seleccionar una mesa",
    },
  };

  const procesarEnvio = async (data) => {
    try {
      if (productosSeleccionados.length === 0) {
        mostrarAlerta.advertencia('Debe agregar al menos un producto a la reserva');
        return;
      }

      const productosInvalidos = productosSeleccionados.some(producto => producto.cantidadProductoReservacion <= 0);
      if (productosInvalidos) {
        mostrarAlerta.advertencia('Todos los productos deben tener una cantidad mayor a 0');
        return;
      }

      const datosParaBackend = {
        fechaReservacion: data.fechaReservacion,
        horaReservacion: data.horaReservacion + ':00',
        cantidadPersonas: parseInt(data.cantidadPersonas),
        idMesa: parseInt(data.idMesa),
        idUsuario: usuario.idUsuario,
        detalles: productosSeleccionados.map(producto => ({
          idProducto: producto.idProducto,
          cantidadProductoReservacion: producto.cantidadProductoReservacion,
          precioUnitario: producto.precioUnitario
        }))
      };

      await registrarReservacionServicio(datosParaBackend);
      mostrarAlerta.exito('Reserva creada exitosamente');
      onCancelar();
    } catch (error) {
      const mensajeError = error.response?.data?.message || error.response?.data?.mensaje || 'Error al crear la reserva';
      mostrarAlerta.error(mensajeError);
    }
  };

  return (
    <form onSubmit={handleSubmit(procesarEnvio)} className="space-y-4">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FiCalendar size={16} className="text-blue-600 dark:text-blue-400" />
              Fecha de Reserva <span className="text-red-500">*</span>
            </div>
          </label>
          <Controller
            name="fechaReservacion"
            control={control}
            rules={validaciones.fechaReservacion}
            render={({ field }) => (
              <>
                <input
                  {...field}
                  type="date"
                  min={fechaMinima}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:[color-scheme:dark]"
                />
                {errors.fechaReservacion && (
                  <p className="text-xs text-red-500 mt-1">{errors.fechaReservacion.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FiClock size={16} className="text-blue-600 dark:text-blue-400" />
              Hora de Reserva <span className="text-red-500">*</span>
            </div>
          </label>
          <Controller
            name="horaReservacion"
            control={control}
            rules={validaciones.horaReservacion}
            render={({ field }) => (
              <>
                <select
                  {...field}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccione</option>
                  <optgroup label="Almuerzo">
                    {horariosDisponibles.filter((h) => h >= "12:00" && h <= "15:00").map((hora) => (
                      <option key={hora} value={hora}>{hora}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Cena">
                    {horariosDisponibles.filter((h) => h >= "18:00" && h <= "22:00").map((hora) => (
                      <option key={hora} value={hora}>{hora}</option>
                    ))}
                  </optgroup>
                </select>
                {errors.horaReservacion && (
                  <p className="text-xs text-red-500 mt-1"> {errors.horaReservacion.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FiUsers size={16} className="text-green-600 dark:text-green-400" />
              Cantidad de Personas <span className="text-red-500">*</span>
            </div>
          </label>
          <Controller
            name="cantidadPersonas"
            control={control}
            rules={validaciones.cantidadPersonas}
            render={({ field: { onChange, value, ...field } }) => (
              <>
                <input
                  {...field}
                  type="number"
                  value={value}
                  onChange={(e) => onChange(parseInt(e.target.value) || "")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white"
                  min="1"
                  max="20"
                />
                {errors.cantidadPersonas && (
                  <p className="text-xs text-red-500 mt-1">{errors.cantidadPersonas.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <div className="flex items-center gap-2">
              <FiBox size={16} className="text-amber-600 dark:text-amber-400" />
              Número de Mesa <span className="text-red-500">*</span>
            </div>
          </label>
          <Controller
            name="idMesa"
            control={control}
            rules={validaciones.idMesa}
            render={({ field: { onChange, value, ...field } }) => (
              <>
                <select
                  {...field}
                  value={value}
                  onChange={(e) => onChange(parseInt(e.target.value) || "")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                  disabled={!fechaReservaWatch || !horaReservacionWatch || cargandoMesas}
                >
                  <option value="">
                    {cargandoMesas 
                      ? "Cargando mesas disponibles..." 
                      : !fechaReservaWatch || !horaReservacionWatch
                      ? "Seleccione fecha y hora primero"
                      : mesasDisponibles.length > 0
                      ? "Seleccione una mesa"
                      : "No hay mesas disponibles"}
                  </option>
                  {mesasDisponibles.map((mesa) => (
                    <option key={mesa.idMesa} value={mesa.idMesa}>
                      Mesa {mesa.numeroMesa} ({mesa.capacidad || 4}p)
                    </option>
                  ))}
                </select>
                {errors.idMesa && (
                  <p className="text-xs text-red-500 mt-1">{errors.idMesa.message}</p>
                )}
                {fechaReservaWatch && horaReservacionWatch && mesasDisponibles.length === 0 && !cargandoMesas && (
                  <p className="text-xs text-orange-500 mt-1">No hay mesas disponibles en este horario</p>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            Productos Reservados
          </h4>
          <button
            type="button"
            onClick={() => setMostrarAgregarProducto(!mostrarAgregarProducto)}
            disabled={cargandoProductos}
            className="flex items-center gap-2 px-3 py-1 text-sm cursor-pointer text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus size={14} />
            Agregar Producto
          </button>
        </div>

        {cargandoProductos && (
          <div className="flex items-center justify-center py-4">
            <FiLoader className="animate-spin h-5 w-5 text-blue-600 mr-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">Cargando productos...</p>
          </div>
        )}

        {mostrarAgregarProducto && !cargandoProductos && (
          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg mb-3 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Producto
                </label>
                <select
                  value={nuevoProducto.idProducto}
                  onChange={handleSeleccionarProducto}
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Seleccionar producto</option>
                  {productosDisponibles.map(producto => (
                    <option key={producto.idProducto} value={producto.idProducto}>
                      {producto.nombreProducto} - S/ {producto.precio}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  value={nuevoProducto.cantidadProductoReservacion}
                  onChange={(e) => setNuevoProducto(prev => ({
                    ...prev,
                    cantidadProductoReservacion: parseInt(e.target.value) || 0
                  }))}
                  min="0"
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            {nuevoProducto.idProducto && (
              <div className="text-xs text-gray-600 dark:text-gray-400 p-2 bg-white dark:bg-gray-700 rounded border">
                <strong>Precio unitario:</strong> S/ {nuevoProducto.precioUnitario}
                <br />
                <strong>Subtotal:</strong> S/ {(nuevoProducto.precioUnitario * nuevoProducto.cantidadProductoReservacion)}.00
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAgregarProducto}
                disabled={nuevoProducto.cantidadProductoReservacion <= 0}
                className="px-3 py-1 text-xs cursor-pointer bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Agregar Producto
              </button>
              <button
                type="button"
                onClick={() => setMostrarAgregarProducto(false)}
                className="px-3 py-1 text-xs bg-gray-500 cursor-pointer text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        <div className="space-y-2 max-h-48 overflow-y-auto">
          {productosSeleccionados.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              {cargandoProductos ? "Cargando productos..." : "No hay productos agregados"}
            </p>
          ) : (
            productosSeleccionados.map((producto, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {producto.nombreProducto}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    S/ {producto.precioUnitario} c/u
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleActualizarCantidad(index, producto.cantidadProductoReservacion - 1)}
                      disabled={producto.cantidadProductoReservacion <= 0}
                      className="w-6 h-6 flex items-center justify-center text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium w-8 text-center text-gray-800 dark:text-gray-200">
                      {producto.cantidadProductoReservacion}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleActualizarCantidad(index, producto.cantidadProductoReservacion + 1)}
                      className="w-6 h-6 flex items-center justify-center text-gray-800 dark:text-gray-200 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white w-20 text-right">
                    S/ {(producto.precioUnitario * producto.cantidadProductoReservacion)}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleEliminarProducto(index)}
                    className="p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {productosSeleccionados.length > 0 && (
          <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-200 dark:border-gray-600">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Total:</span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              S/ {calcularTotal()}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiX size={16} />
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando}
          className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors font-medium flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave size={16} />
          {guardando ? "Guardando..." : reservaInicial?.idReservacion ? "Actualizar Reserva" : "Guardar Reserva"}
        </button>
      </div>
    </form>
  );
};

export default FormularioReserva;