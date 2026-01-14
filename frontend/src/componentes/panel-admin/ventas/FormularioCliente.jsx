import { useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { obtenerTiposDocumento } from "../../../servicios/tiposDocService";
import { buscarPorDNI, buscarPorRUC } from "../../../servicios/consultarClienteService";
import useConfiguracionDocumento from "../../../hooks/useConfiguracionDocumento";

export const FormularioCliente = ({ onSubmit, onCancelar }) => {
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [mensajeBusqueda, setMensajeBusqueda] = useState("");
  
  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const cargarTipos = async () => { 
      try {
        const data = await obtenerTiposDocumento(); 
        setTiposDocumento(data); 
      } catch (error) { 
        setErrorCarga(error.message); 
      } finally {
        setCargando(false);
      }
    };
    cargarTipos();
  }, []);
  
  const tipo = watch("tipoDocumento"); 
  const numeroDoc = watch("numeroDocumento")

  const { placeholder, busquedaHabilitada } = useConfiguracionDocumento(tipo, setValue);

  const handleBuscar = async () => {
    if (!busquedaHabilitada) return;
    
    setBuscando(true);
    setMensajeBusqueda("");
    
    try {
      let data; 
      let nombreCompleto = "";
      let datosFormateados = ""

      if (tipo === "1") { 
        data = await buscarPorDNI(numeroDoc);
        
        if (data.success === true) {
          nombreCompleto = data.apellidoPaterno + " " + data.apellidoMaterno + " " + data.nombres;
          datosFormateados = nombreCompleto.replace(/\b\w/g, char => char.toUpperCase()).replace(/\B\w/g, char => char.toLowerCase());
          setValue("nombre", datosFormateados);
          setMensajeBusqueda("Datos encontrados correctamente");
        } else {
          setMensajeBusqueda("No se encontraron resultados");
          setValue("nombre", ""); 
        }
        
      } else if (tipo === "3") {
        data = await buscarPorRUC(numeroDoc);
        
        if (data && data.ruc) {
          setValue("nombre", data.razonSocial);
          
          if (data.direccion) {
            setValue("direccion", data.direccion);
          }
          
          if (data.nombreComercial) {
            setValue("nombreComercial", data.nombreComercial);
          }
          
          setMensajeBusqueda("Datos encontrados correctamente");
        } else {
          setMensajeBusqueda("No se encontraron resultados");
          setValue("nombre", "");
          setValue("direccion", "");
          setValue("nombreComercial", "");
        }
        
      } else {
        setMensajeBusqueda("Búsqueda solo disponible para DNI y RUC");
        return;
      }
    } catch (err) {
      setMensajeBusqueda("Error en la búsqueda: " + err.message);
      setValue("nombre", "");
      setValue("direccion", ""); 
      setValue("nombreComercial", "");
    } finally {
      setBuscando(false);
    }
  };

  const manejarEnviar = (data) => {
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(manejarEnviar)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tipo de Documento *
          </label>
          {cargando ? (
            <p className="text-sm text-gray-500">Cargando...</p>
          ) : errorCarga ? (
            <p className="text-sm text-red-500">{errorCarga}</p>
          ) : (
            <select
              {...register("tipoDocumento", { required: "Este campo es obligatorio" })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="" disabled>Selecciona un tipo</option>
              {tiposDocumento.map((doc) => (
                <option key={doc.idTipoDocumento} value={doc.idTipoDocumento}>
                  {doc.nombreTipoDocumento}
                </option>
              ))}
            </select>
          )}

          {errors.tipoDocumento && (
            <span className="text-xs text-red-500">{errors.tipoDocumento.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Número de Documento *
          </label>
          <div className="relative flex rounded-lg shadow-sm">
            <input
              type="text"
              placeholder={placeholder}
              {...register("numeroDocumento", {
                required: "Este campo es obligatorio",
                validate: (value) => {
                  if (tipo === "1" && value.length !== 8) {
                    return "El DNI debe tener 8 dígitos";
                  }
                  if (tipo === "3" && value.length !== 11) {
                    return "El RUC debe tener 11 dígitos";
                  }
                  if (tipo === "2" && !/^[A-Z0-9]{6,12}$/i.test(value)) {
                    return "Carné de extranjería inválido";
                  }
                  return true;
                },
              })}
              className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-l-lg dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleBuscar}
              type="button"
              disabled={!busquedaHabilitada || buscando}
              className={`px-3 flex items-center justify-center rounded-r-lg transition-colors duration-200 ${
                busquedaHabilitada && !buscando
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {buscando ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <FiSearch size={18} />
              )}
            </button>
          </div>
          {errors.numeroDocumento && (
            <span className="text-xs text-red-500">{errors.numeroDocumento.message}</span>
          )}
          
          {buscando && (
            <p className="text-xs text-blue-500 mt-1">Buscando información...</p>
          )}
          {mensajeBusqueda && !buscando && (
            <p className={`text-xs mt-1 ${
              mensajeBusqueda.includes("encontrados") 
                ? "text-green-500" 
                : mensajeBusqueda.includes("No se encontraron")
                ? "text-yellow-500"
                : "text-red-500"
            }`}>
              {mensajeBusqueda}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre / Razón Social *
          </label>
          <input
            type="text"
            {...register("nombre", { required: "Este campo es obligatorio" })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre completo o razón social"
          />
          {errors.nombre && (
            <span className="text-xs text-red-500">{errors.nombre.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Nombre Comercial
          </label>
          <input
            type="text"
            {...register("nombreComercial")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nombre comercial (opcional)"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Dirección *
        </label>
        <input
          type="text"
          {...register("direccion", { 
            required: tipo === "3" ? "Este campo es obligatorio para RUC" : false 
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={tipo === "3" ? "Dirección fiscal (obligatoria)" : "Dirección completa"}
        />
        {errors.direccion && (
          <span className="text-xs text-red-500">{errors.direccion.message}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Teléfono
          </label>
          <input
            type="tel"
            {...register("telefono", {
              pattern: {
                value: /^[0-9+-\s]+$/,
                message: "Formato de teléfono inválido"
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Número de teléfono"
          />
          {errors.telefono && (
            <span className="text-xs text-red-500">{errors.telefono.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            {...register("email", {
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Formato de email inválido"
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="correo@ejemplo.com"
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email.message}</span>
          )}
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
          Requisitos para Factura:
        </h4>
        <ul className="text-xs text-blue-700 dark:text-blue-300 list-disc list-inside space-y-1">
          <li>RUC obligatorio (11 dígitos)</li>
          <li>Dirección fiscal requerida</li>
          <li>Razón social de la empresa</li>
        </ul>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors duration-200"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200"
        >
          Guardar Cliente
        </button>
      </div>
    </form>
  );
};