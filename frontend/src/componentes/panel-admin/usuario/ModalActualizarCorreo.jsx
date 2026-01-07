import { useState } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { actualizarCorreoUsuarioServicio } from "../../../servicios/usuariosServicios";
import { BotonSimple } from "../../ui/botones/BotonSimple";
import mostrarAlerta from "../../../utilidades/toastUtilidades";

const ModalActualizarCorreo = ({ idUsuario, correoActual, onClose, onCorreoActualizado }) => {
  const [formData, setFormData] = useState({
    nuevoCorreo: "",
    clave: ""
  });
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    setCargando(true);

    try {
      const datosEnvio = {
        nuevoCorreo: formData.nuevoCorreo,
        clave: formData.clave
      };

      const resultado = await actualizarCorreoUsuarioServicio(idUsuario, datosEnvio);

      mostrarAlerta.exito(resultado.mensaje || "Correo actualizado exitosamente");
      onClose();
      if (onCorreoActualizado) {
        onCorreoActualizado(formData.nuevoCorreo);
      }

    } catch (error) {
      const mensajeBackend =
        error.response?.data?.mensaje ||
        error.response?.data?.error ||  
        error.message ||                
        "Error desconocido al actualizar el correo";

      mostrarAlerta.error(mensajeBackend);
    } finally {
      setCargando(false);
    }
  };
  

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Actualizar Correo Electrónico
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Correo actual
          </label>
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">{correoActual}</p>
          </div>
        </div>
        <div>
          <label htmlFor="nuevoCorreo" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="nuevo@ejemplo.com"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="clave" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa tu contraseña actual"
              required
            />
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-sm text-blue-700 dark:text-blue-300">
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