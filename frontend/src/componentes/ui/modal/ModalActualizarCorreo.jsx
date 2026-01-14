import { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { BotonSimple } from "../botones/BotonSimple";
import mostrarAlerta from "../../../utilidades/toastUtilidades";

const ModalActualizarCorreo = ({ usuario, onClose, onCorreoActualizado }) => {
  const [formData, setFormData] = useState({
    nuevoCorreo: "",
    clave: ""
  });
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nuevoCorreo || !formData.clave) {
      mostrarAlerta.error("Todos los campos son obligatorios");
      return;
    }

    if (formData.nuevoCorreo === usuario.correo) {
      mostrarAlerta.error("El nuevo correo debe ser diferente al actual");
      return;
    }

    setCargando(true);

    try {
      await onCorreoActualizado(formData);
    } catch (error) {
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Correo actual
          </label>
          <div className="p-3 bg-gray-700 rounded-lg border border-gray-600">
            <p className="text-white font-medium">{usuario.correo}</p>
          </div>
        </div>

        <div>
          <label htmlFor="nuevoCorreo" className="block text-sm font-medium text-gray-300 mb-2">
            Nuevo correo electrónico
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              id="nuevoCorreo"
              name="nuevoCorreo"
              value={formData.nuevoCorreo}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-primario focus:border-transparent"
              placeholder="nuevo@ejemplo.com"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="clave" className="block text-sm font-medium text-gray-300 mb-2">
            Contraseña actual
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              id="clave"
              name="clave"
              value={formData.clave}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-primario focus:border-transparent"
              placeholder="Ingresa tu contraseña actual"
              required
            />
          </div>
        </div>

        <div className="bg-azul-primario/10 border border-azul-primario/30 rounded-lg p-4">
          <p className="text-sm text-azul-primario">
            <strong>Importante:</strong> Debes verificar el nuevo correo electrónico antes de que sea activado.
          </p>
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
            etiqueta={cargando ? "Actualizando..." : "Actualizar Correo"}
            variante="primario"
            disabled={cargando}
          />
        </div>
      </form>
    </div>
  );
};

export default ModalActualizarCorreo;