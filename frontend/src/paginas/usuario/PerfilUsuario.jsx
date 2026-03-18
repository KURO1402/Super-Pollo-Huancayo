import { useState, useEffect } from "react";
import { FiMail, FiPhone, FiUser, FiShield } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import Modal from "../../componentes/ui/modal/Modal"
import { useModal } from "../../hooks/useModal"
import { BotonSimple } from "../../componentes/ui/botones/BotonSimple"

import { obtenerUsuarioPorIdServicio } from "../../servicios/usuariosServicios";

import ModalActualizarCorreo from "../../componentes/panel-admin/usuario/ModalActualizarCorreo"; 
import ModalActualizarClave from "../../componentes/panel-admin/usuario/ModalActualizarClave";
import FormularioEditUsuario from "../../componentes/panel-admin/usuario/FormularioEditUsuario";

import { useAutenticacionStore } from "../../store/useAutenticacionStore";

import mostrarAlerta from "../../utilidades/toastUtilidades";

import {
  actualizarPerfilUsuarioServicio,
  actualizarClaveUsuarioServicio 
} from "../../servicios/usuarioServicio"

const PerfilUsuario = () => {
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);
  const { usuario } = useAutenticacionStore();
  
  const { 
    estaAbierto: modalEditarAbierto, 
    abrir: abrirEditar, 
    cerrar: cerrarEditar 
  } = useModal();
  
  const { 
    estaAbierto: modalCorreoAbierto, 
    abrir: abrirCorreo, 
    cerrar: cerrarCorreo 
  } = useModal();
  
  const { 
    estaAbierto: modalClaveAbierto, 
    abrir: abrirClave, 
    cerrar: cerrarClave 
  } = useModal();


  useEffect(() => {
    const cargarUsuario = async () => {
      try {
        setCargando(true);
        const respuesta = await obtenerUsuarioPorIdServicio(usuario.id_usuario);
        if (respuesta.ok && respuesta.usuario) {
          setPerfilUsuario(respuesta.usuario);
        } else {
          throw new Error("No se pudieron cargar los datos del perfilUsuario");
        }
      } catch (error) {
        mostrarAlerta.error('Error al cargar los datos del perfil');
        setPerfilUsuario({  
          id_usuario: usuario?.id_usuario || 1,
          nombre_usuario: "Usuario",
          apellido_usuario: "Demo",
          correo_usuario: "perfilUsuario@demo.com",
          telefono_usuario: "000000000",
          nombre_rol: "Usuario",
          estado_usuario: "activo"
        });
      } finally {
        setCargando(false);
      }
    };

    if (usuario?.id_usuario) {
      cargarUsuario();
    }
  }, [usuario]);

  const handlePerfilActualizado = async (datosActualizados) => {
    try {
      setActualizando(true);
      
      const datosParaBackend = {
        nombresUsuario: datosActualizados.nombre_usuario || datosActualizados.nombre,
        apellidosUsuario: datosActualizados.apellido_usuario || datosActualizados.apellido,
        telefonoUsuario: datosActualizados.telefono_usuario || datosActualizados.telefono,
        idTipoDocumento: datosActualizados.id_tipo_documento || datosActualizados.idTipoDocumento,
        numeroDocumentoUsuario: datosActualizados.numero_documento_usuario || datosActualizados.numeroDocumento
      };

      const respuesta = await actualizarPerfilUsuarioServicio(perfilUsuario.id_usuario, datosParaBackend);
      
      if (respuesta.ok) {
        setPerfilUsuario(prev => ({
          ...prev,
          ...datosActualizados
        }));
        cerrarEditar();
        mostrarAlerta.exito(respuesta.mensaje || "Perfil actualizado exitosamente");
        
        // Recargar datos actualizados
        const datosActualizados = await obtenerUsuarioPorIdServicio(perfilUsuario.id_usuario);
        if (datosActualizados.ok && datosActualizados.usuario) {
          setPerfilUsuario(datosActualizados.usuario);
        }
      } else {
        throw new Error(respuesta.mensaje || 'Error al actualizar el perfil');
      }
    } catch (error) {
      mostrarAlerta.error(error.message || "Error al actualizar el perfil");
    } finally {
      setActualizando(false);
    }
  };

  const handleCorreoActualizado = (nuevoCorreo) => {
    setPerfilUsuario(prev => ({
      ...prev,
      correo_usuario: nuevoCorreo
    }));
    cerrarCorreo();
  };

  const handleClaveActualizada = async (datosClave) => {
    try {
      const respuesta = await actualizarClaveUsuarioServicio(perfilUsuario.id_usuario, datosClave);
      
      if (respuesta.ok) {
        cerrarClave();
        mostrarAlerta.exito(respuesta.mensaje || "Contraseña actualizada exitosamente");
      } else {
        throw new Error(respuesta.mensaje || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      mostrarAlerta.error(error.message || "Error al actualizar la contraseña");
      throw error;
    }
  };

  const getIniciales = (nombre, apellido) => {
    return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
  };

  if (cargando) {
    return (
      <section className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rojo"></div>
        </div>
      </section>
    );
  }

  if (!perfilUsuario) {
    return (
      <section className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-96">
          <p className="text-white text-lg">No se pudo cargar la información del perfilUsuario</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-linear-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            MI <span className="text-rojo">PERFIL</span>
          </h1>
          <div className="w-32 h-1 bg-rojo mx-auto mb-6"></div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Gestiona tu información personal y mantén tus datos actualizados
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
              
              <div className="bg-linear-to-r from-azul-secundario to-azul-primario py-8 px-6 text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30">
                    <span className="text-4xl font-bold text-white">
                      {getIniciales(perfilUsuario.nombre_usuario, perfilUsuario.apellido_usuario)}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amarillo rounded-full p-2 shadow-lg">
                    <FaCrown className="w-5 h-5 text-gray-800" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mt-6 mb-2">
                  {perfilUsuario.nombre_usuario} {perfilUsuario.apellido_usuario}
                </h2>
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <FiShield className="w-4 h-4 text-white" />
                  <span className="text-white font-medium text-sm">{perfilUsuario.nombre_rol}</span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div 
                  className="flex items-center gap-4 p-4 bg-gray-700 rounded-2xl hover:bg-gray-600 transition-colors cursor-pointer"
                  onClick={abrirCorreo}
                >
                  <div className="w-12 h-12 bg-rojo/10 rounded-xl flex items-center justify-center">
                    <FiMail className="w-6 h-6 text-rojo" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold text-white truncate">
                      {perfilUsuario.correo_usuario}
                    </p>
                  </div>
                  <GoPencil className="w-4 h-4 text-gray-400" />
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-2xl">
                  <div className="w-12 h-12 bg-azul-primario/10 rounded-xl flex items-center justify-center">
                    <FiPhone className="w-6 h-6 text-azul-primario" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Teléfono</p>
                    <p className="font-semibold text-white">
                      {perfilUsuario.telefono_usuario || 'No especificado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
              
              <div className="bg-linear-to-r from-gray-700 to-gray-600 px-8 py-6 border-b border-gray-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Información Personal
                    </h2>
                    <p className="text-gray-400 mt-1">
                      Actualiza y gestiona tus datos personales
                    </p>
                  </div>
                  <BotonSimple
                    funcion={abrirEditar}
                    etiqueta="Editar Perfil"
                    icono={GoPencil}
                    variante="primario"
                  />
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-azul-primario/10 rounded-lg flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-azul-primario" />
                          </div>
                          <label className="text-sm font-semibold text-gray-400">
                            Nombre
                          </label>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {perfilUsuario.nombre_usuario}
                        </p>
                      </div>

                      <div className="bg-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-azul-primario/10 rounded-lg flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-azul-primario" />
                          </div>
                          <label className="text-sm font-semibold text-gray-400">
                            Apellido
                          </label>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {perfilUsuario.apellido_usuario}
                        </p>
                      </div>
                    </div>

                    <div 
                      className="bg-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-600"
                      onClick={abrirCorreo}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-rojo/10 rounded-lg flex items-center justify-center">
                            <FiMail className="w-5 h-5 text-rojo" />
                          </div>
                          <label className="text-sm font-semibold text-gray-400">
                            Correo Electrónico
                          </label>
                        </div>
                        <GoPencil className="w-4 h-4 text-gray-400" />
                      </div>
                      <p className="text-lg font-bold text-white">
                        {perfilUsuario.correo_usuario}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div 
                      className="bg-linear-to-r from-azul-primario/5 to-azul-secundario/5 rounded-2xl p-6 border border-gray-700 cursor-pointer hover:from-azul-primario/10 hover:to-azul-secundario/10 transition-all"
                      onClick={abrirClave}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-azul-primario/20 rounded-lg flex items-center justify-center">
                            <FiShield className="w-5 h-5 text-white" />
                          </div>
                          <label className="text-sm font-semibold text-gray-400">
                            Contraseña
                          </label>
                        </div>
                        <GoPencil className="w-4 h-4 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-white">
                          ••••••••••
                        </p>
                        <span className="text-white hover:text-gray-300 font-semibold text-sm transition-colors">
                          Cambiar
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        estaAbierto={modalEditarAbierto}
        onCerrar={cerrarEditar}
        titulo="Editar Perfil"
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        {perfilUsuario && (
          <FormularioEditUsuario 
            usuario={perfilUsuario}
            onSubmit={handlePerfilActualizado}
            cerrar={cerrarEditar}
            cargando={actualizando}
          />
        )}
      </Modal>

      <Modal
        estaAbierto={modalCorreoAbierto}
        onCerrar={cerrarCorreo}
        titulo="Actualizar Correo Electrónico"
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        {perfilUsuario && (
          <ModalActualizarCorreo
            correoActual={perfilUsuario.correo_usuario}
            onClose={cerrarCorreo}
            onCorreoActualizado={handleCorreoActualizado}
          />
        )}
      </Modal>

      {/* Modal para cambiar contraseña */}
      <Modal
        estaAbierto={modalClaveAbierto}
        onCerrar={cerrarClave}
        titulo="Cambiar Contraseña"
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        {perfilUsuario && (
          <ModalActualizarClave
            idUsuario={perfilUsuario.id_usuario}
            onClose={cerrarClave}
            onClaveActualizada={handleClaveActualizada}
          />
        )}
      </Modal>
    </section>
  );
};

export default PerfilUsuario;