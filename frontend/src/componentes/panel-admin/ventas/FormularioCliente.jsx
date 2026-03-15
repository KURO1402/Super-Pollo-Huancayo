import { useForm } from "react-hook-form";
import { FiSearch } from "react-icons/fi";
import { useEffect, useState } from "react";
import { obtenerTiposDocumentoServicio } from "../../../servicios/tiposDocService";
import { buscarPorDNI, buscarPorRUC } from "../../../servicios/consultarClienteService";

const TIPO_DNI = 1;
const TIPO_RUC = 2;

const getPlaceholder = (idTipo) => {
  if (Number(idTipo) === TIPO_DNI) return "12345678";
  if (Number(idTipo) === TIPO_RUC) return "10123456789";
  return "Número de documento";
};

const puedeConsultar = (idTipo) =>
  Number(idTipo) === TIPO_DNI || Number(idTipo) === TIPO_RUC;

export const FormularioCliente = ({ onSubmit, onCancelar, tipoComprobante, soloRuc = false }) => {
  const [tiposDocumento, setTiposDocumento] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [mensajeBusqueda, setMensajeBusqueda] = useState("");

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      tipoDocumento: soloRuc ? String(TIPO_RUC) : String(TIPO_DNI),
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await obtenerTiposDocumentoServicio();
        const lista = soloRuc
          ? data.filter((d) => d.id_tipo_documento === TIPO_RUC)
          : data;
        setTiposDocumento(lista);
      } catch (err) {
        setErrorCarga(err.message);
      } finally {
        setCargando(false);
      }
    })();
  }, [soloRuc]);

  useEffect(() => {
    if (soloRuc) setValue("tipoDocumento", String(TIPO_RUC));
  }, [soloRuc, setValue]);

  const tipo = watch("tipoDocumento");
  const numeroDoc = watch("numeroDocumento");

  useEffect(() => {
    setValue("numeroDocumento", "");
    setMensajeBusqueda("");
  }, [tipo, setValue]);

  const handleBuscar = async () => {
    if (!puedeConsultar(tipo)) return;
    if (!numeroDoc) { setMensajeBusqueda("Ingrese un número de documento"); return; }

    setBuscando(true);
    setMensajeBusqueda("");

    try {
      if (Number(tipo) === TIPO_DNI) {
        if (numeroDoc.length !== 8) { setMensajeBusqueda("El DNI debe tener 8 dígitos"); return; }
        const data = await buscarPorDNI(numeroDoc);
        if (data.success) {
          const nombre = `${data.apellidoPaterno} ${data.apellidoMaterno} ${data.nombres}`
            .replace(/\b\w/g, (c) => c.toUpperCase())
            .replace(/\B\w/g, (c) => c.toLowerCase());
          setValue("nombre", nombre);
          setMensajeBusqueda("Datos encontrados");
        } else {
          setMensajeBusqueda("No se encontraron resultados");
          setValue("nombre", "");
        }
      } else if (Number(tipo) === TIPO_RUC) {
        if (numeroDoc.length !== 11) { setMensajeBusqueda("El RUC debe tener 11 dígitos"); return; }
        const data = await buscarPorRUC(numeroDoc);
        if (data?.ruc) {
          setValue("nombre", data.razonSocial || "");
          setValue("direccion", data.direccion || "");
          setValue("nombreComercial", data.nombreComercial || "");
          setMensajeBusqueda("Datos encontrados");
        } else {
          setMensajeBusqueda("No se encontraron resultados");
          setValue("nombre", "");
          setValue("direccion", "");
        }
      }
    } catch (err) {
      setMensajeBusqueda("Error en la búsqueda: " + err.message);
    } finally {
      setBuscando(false);
    }
  };

  const esConsultable = puedeConsultar(tipo);
  const esRuc = Number(tipo) === TIPO_RUC;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {soloRuc && (
        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg text-sm text-amber-800 dark:text-amber-300">
          ⚠️ La <strong>factura</strong> requiere <strong>RUC</strong>. Solo puedes ingresar clientes con RUC válido.
        </div>
      )}

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
              {...register("tipoDocumento", { required: "Campo obligatorio" })}
              disabled={soloRuc}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${soloRuc
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 border-gray-300 dark:border-gray-600 cursor-not-allowed"
                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                }`}
            >
              <option value="" disabled>Selecciona un tipo</option>
              {tiposDocumento.map((d) => (
                <option key={d.id_tipo_documento} value={d.id_tipo_documento}>
                  {d.nombre_tipo_documento}
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
          <div className="flex rounded-lg shadow-sm">
            <input
              type="text"
              placeholder={getPlaceholder(tipo)}
              {...register("numeroDocumento", {
                required: "Campo obligatorio",
                validate: (v) => {
                  if (Number(tipo) === TIPO_DNI && v.length !== 8)  return "DNI debe tener 8 dígitos";
                  if (Number(tipo) === TIPO_RUC && v.length !== 11) return "RUC debe tener 11 dígitos";
                  return true;
                },
              })}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleBuscar}
              disabled={!esConsultable || buscando}
              title={!esConsultable ? "La consulta automática solo está disponible para DNI y RUC" : "Buscar datos"}
              className={`px-3 flex items-center justify-center rounded-r-lg transition-colors border border-l-0 border-gray-300 dark:border-gray-600 ${
                !esConsultable
                  ? "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                  : buscando
                  ? "bg-gray-300 dark:bg-gray-600 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {buscando
                ? <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full" />
                : <FiSearch size={18} />
              }
            </button>
          </div>
          {errors.numeroDocumento && (
            <span className="text-xs text-red-500">{errors.numeroDocumento.message}</span>
          )}
          {mensajeBusqueda && !buscando && (
            <p className={`text-xs mt-1 ${
              mensajeBusqueda.includes("encontrados") ? "text-green-500" :
              mensajeBusqueda.includes("No se")       ? "text-yellow-500" :
                                                        "text-red-500"
            }`}>
              {mensajeBusqueda}
            </p>
          )}
          {!esConsultable && tipo && (
            <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">
              Consulta automática no disponible para este tipo de documento.
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {esRuc ? "Razón Social *" : "Nombre Completo *"}
          </label>
          <input
            type="text"
            {...register("nombre", { required: "Campo obligatorio" })}
            placeholder={esRuc ? "Razón social de la empresa" : "Nombre completo"}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.nombre && (
            <span className="text-xs text-red-500">{errors.nombre.message}</span>
          )}
        </div>

        {esRuc && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre Comercial
            </label>
            <input
              type="text"
              {...register("nombreComercial")}
              placeholder="Nombre comercial (opcional)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Dirección {esRuc && <span className="text-red-500">*</span>}
        </label>
        <input
          type="text"
          {...register("direccion", {
            required: esRuc ? "La dirección fiscal es obligatoria para RUC" : false,
          })}
          placeholder={esRuc ? "Dirección fiscal (obligatoria)" : "Dirección (opcional)"}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.direccion && (
          <span className="text-xs text-red-500">{errors.direccion.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Correo Electrónico
        </label>
        <input
          type="email"
          {...register("email", {
            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Email inválido" },
          })}
          placeholder="correo@ejemplo.com"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {errors.email && (
          <span className="text-xs text-red-500">{errors.email.message}</span>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={onCancelar}
          className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          Guardar Cliente
        </button>
      </div>
    </form>
  );
};