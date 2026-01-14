import { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { BotonSimple } from "../../ui/botones/BotonSimple";
import mostrarAlerta from "../../../utilidades/toastUtilidades";

const ModalCambiarClave = ({ usuario, onClose, onClaveActualizada }) => {
  const [formData, setFormData] = useState({
    clave: "",
    nuevaClave: "",
    confirmarClave: ""
  });
  
  const [mostrar, setMostrar] = useState({
    clave: false,
    nuevaClave: false,
    confirmarClave: false
  });
  
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleMostrar = (campo) => {
    setMostrar(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }));
  };

  const validarFormulario = () => {
    if (formData.nuevaClave.length < 8) {
      mostrarAlerta.error("La nueva contraseña debe tener al menos 8 caracteres");
      return false;
    }
    
    if (formData.nuevaClave !== formData.confirmarClave) {
      mostrarAlerta.error("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validarFormulario()) return;

    setCargando(true);

    try {
      const datosParaServicio = {
        clave: formData.clave,
        nuevaClave: formData.nuevaClave
      };

      await onClaveActualizada(datosParaServicio);
    } catch (error) {
    } finally {
      setCargando(false);
    }
  };

  const renderCampoContraseña = (label, name, mostrarCampo) => (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-red-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiLock className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={mostrarCampo ? "text" : "password"}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className="block w-full pl-10 pr-10 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-primario focus:border-transparent"
          placeholder={`Ingresa ${label.toLowerCase()}`}
          required
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => toggleMostrar(name)}
        >
          {mostrarCampo ? (
            <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
          ) : (
            <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderCampoContraseña("Contraseña actual", "clave", mostrar.clave)}
        {renderCampoContraseña("Nueva contraseña", "nuevaClave", mostrar.nuevaClave)}
        {renderCampoContraseña("Confirmar nueva contraseña", "confirmarClave", mostrar.confirmarClave)}

        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
          <p className="text-sm font-medium text-gray-300 mb-2">
            Requisitos de la nueva contraseña:
          </p>
          <ul className="text-sm text-gray-400 space-y-1">
            <li className={formData.nuevaClave.length >= 8 ? "text-green-400" : ""}>
              • Mínimo 8 caracteres
            </li>
            <li className={formData.nuevaClave === formData.confirmarClave && formData.nuevaClave ? "text-green-400" : ""}>
              • Las contraseñas deben coincidir
            </li>
          </ul>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <BotonSimple
            funcion={onClose}
            etiqueta="Cancelar"
            variante="secundario"
            disabled={cargando}
          />
          <BotonSimple
            tipo="submit"
            etiqueta={cargando ? "Actualizando..." : "Cambiar Contraseña"}
            variante="primario"
            disabled={cargando}
          />
        </div>
      </form>
    </div>
  );
};

export default ModalCambiarClave;