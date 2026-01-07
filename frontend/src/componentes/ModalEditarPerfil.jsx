// componentes/usuario/ModalEditarPerfil.jsx - VERSIÓN SIMPLIFICADA
import { useState } from "react";
import { FiUser, FiPhone, FiFileText } from "react-icons/fi";
import { BotonSimple } from "./ui/botones/BotonSimple";
import mostrarAlerta from "../utilidades/toastUtilidades";

const ModalEditarPerfil = ({ usuario, onClose, onPerfilActualizado }) => {
  const [formData, setFormData] = useState({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    telefono: usuario.telefono || "",
    tipoDocumento: usuario.tipoDocumento,
    numeroDocumento: usuario.numeroDocumento
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
    
    if (!formData.nombre || !formData.apellido) {
      mostrarAlerta.error("Nombre y apellido son obligatorios");
      return;
    }

    setCargando(true);

    try {
      await onPerfilActualizado(formData);
    } catch (error) {
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-300">
              Nombre <span className="text-rojo">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-primario focus:border-transparent"
                placeholder="Ingresa tu nombre"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="apellido" className="block text-sm font-medium text-gray-300">
              Apellido <span className="text-rojo">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-primario focus:border-transparent"
                placeholder="Ingresa tu apellido"
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-300">
            Teléfono
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiPhone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="block w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-primario focus:border-transparent"
              placeholder="Ingresa tu teléfono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2">
            <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-300">
              Tipo de Documento
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFileText className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className="block w-full pl-10 pr-10 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-amarillo focus:border-transparent appearance-none cursor-pointer"
              >
                <option value="DNI">DNI</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Carné de Extranjería">Carné de Extranjería</option>
                <option value="RUC">RUC</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-300">
              Número de Documento
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFileText className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="numeroDocumento"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleChange}
                className="block w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-azul-primario focus:border-transparent"
                placeholder="Número de documento"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
          <BotonSimple
            funcion={onClose}
            etiqueta="Cancelar"
            variante="secundario"
            disabled={cargando}
          />
          <BotonSimple
            tipo="submit"
            etiqueta={cargando ? "Actualizando..." : "Guardar Cambios"}
            variante="primario"
            disabled={cargando}
          />
        </div>
      </form>
    </div>
  );
};

export default ModalEditarPerfil;