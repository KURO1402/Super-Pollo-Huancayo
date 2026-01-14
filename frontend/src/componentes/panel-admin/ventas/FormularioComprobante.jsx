import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { obtenerTiposComprobantes } from "../../../servicios/comprobantesService";
import Modal from "../../ui/modal/Modal";
import { useModal } from "../../../hooks/useModal";
import { FormularioCliente } from "./FormularioCliente";
import { obtenerFechaActual } from "../../../utilidades/fechaActualUtils";

export const FormularioComprobante = ({ alEnviar, onClienteAgregado  }) => {
  const { estaAbierto, abrir, cerrar } = useModal();
  const [clienteCompleto, setClienteCompleto] = useState(null);
  const [ tiposComprobantes, setTiposComprobantes ] = useState([]);

  useEffect(() => {
    const cargarTiposDocumento = async () => {
      try {
        const tipos = await obtenerTiposComprobantes();
        setTiposComprobantes(tipos);
      } catch (error) {
      }
    };
    cargarTiposDocumento();
  }, []);

  const fechaActual = obtenerFechaActual() 

  const {
    register, handleSubmit, watch, reset, setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipoComprobante: 1,
      serie: "F001",
      clienteDenominacion: "Cliente Varios",
      observaciones: "",
      fechaDeEmision: fechaActual,
      fechaDeVencimiento: fechaActual,
      moneda: 1,
      tipoOperacion: 1,
      condicionPago: 1,
      metodoPago: 1,
    },
  });

  const manejarEnvioFormulario = async (datos) => {
  try {
    const datosParaEnviar = {
      ...datos,
      ...(clienteCompleto && { datosCliente: clienteCompleto })
    };
    
    await alEnviar(datosParaEnviar); 
    reset(); 
    setClienteCompleto(null);
  } catch (error) {
  }
};

  const tipo = watch("tipoComprobante");

  const manejarAbrirModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    abrir();
  };

  const manejarGuardarCliente = (datosCliente) => {
    setValue("clienteDenominacion", datosCliente.nombre);
    setClienteCompleto(datosCliente);
    if (onClienteAgregado) {
      onClienteAgregado(datosCliente);
    }

    cerrar();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(manejarEnvioFormulario)}
        className="w-full bg-white dark:bg-gray-900 p-2"
      >
        <div className="mb-4 flex items-center space-x-2">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Nuevo Comprobante 
          </h1>
        </div>
        <div className="mx-auto bg-gray-100 dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Comprobante
                  </label>
                  <select
                    {...register("tipoComprobante", { required: true })}
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    {tiposComprobantes.map((comprobante) =>(
                      <option key={comprobante.idTipoComprobante} value={comprobante.idTipoComprobante}>
                        {comprobante.nombreTipoComprobante}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Serie
                  </label>
                  <input
                    className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-not-allowed"
                    value={tipo == 1 ? "F001" : "B001"}
                    disabled
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cliente Denominación
                  </label>
                  <button
                    onClick={manejarAbrirModal}
                    className="ml-2 text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 font-medium text-sm transition-colors duration-200"
                    type="button"
                  >
                    [ Cliente + ]
                  </button>
                </div>
                <input
                  {...register("clienteDenominacion", { required: true })}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Observaciones
                </label>
                <textarea
                  {...register("observaciones")}
                  className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows="3"
                  placeholder="Agregar observaciones..."
                />
              </div>
            </div>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha de emisión
                    </label>
                    <input
                      type="date"
                      {...register("fechaDeEmision", { required: true })}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fecha de Vencimiento
                    </label>
                    <input
                      type="date"
                      {...register("fechaDeVencimiento")}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Moneda
                    </label>
                    <select
                      {...register("moneda")}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value={1}>Soles</option>
                      <option value={2}>Dólares</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tipo de Operación
                    </label>
                    <select
                      {...register("tipoOperacion")}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value={1}>Venta Interna</option>
                      <option value={2}>Venta Externa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Condición de pago
                    </label>
                    <select
                      {...register("condicionPago")}
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value={1}>Contado</option>
                      <option value={2}>Crédito</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Método de Pago
                    </label>
                    <select
                      {...register("metodoPago")} 
                      className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value={1}>Efectivo</option>
                      <option value={2}>Tarjeta</option>
                      <option value={3}>Yape</option>
                      <option value={4}>Plin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors duration-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Guardar Comprobante
          </button>
        </div>
      </form>
      {estaAbierto && (
        <Modal
          estaAbierto={estaAbierto}
          onCerrar={cerrar}
          titulo="Nuevo Cliente"
          tamaño={"xl"}
          mostrarHeader={true}
          mostrarFooter={false}
        >
          <FormularioCliente 
           onSubmit={manejarGuardarCliente}
            onCancelar={cerrar}
          />
        </Modal>
      )}
    </>
  );
};
