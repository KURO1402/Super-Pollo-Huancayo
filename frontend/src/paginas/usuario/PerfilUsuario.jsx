import { useState, useEffect } from "react";
import { FiMail, FiPhone, FiUser, FiFileText, FiShield } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import Modal from "../../componentes/ui/modal/Modal"
import { useModal } from "../../hooks/useModal"

import { BotonSimple } from "../../componentes/ui/botones/BotonSimple"
import mostrarAlerta from "../../utilidades/toastUtilidades";
import ModalEditarPerfil from "../../componentes/ModalEditarPerfil";
import ModalActualizarCorreo from "../../componentes/ModalActualizarCorreo";
import ModalCambiarClave from "../../componentes/ModalCambiarClave";
import { useAutenticacionStore } from "../../store/useAutenticacionStore";

import { 
  obtenerUsuarioActualServicio,
  actualizarPerfilUsuarioServicio,
  actualizarCorreoUsuarioServicio,
  actualizarClaveUsuarioServicio } from "../../servicios/usuarioServicio"

const PerfilUsuario = () => {
  const [perfilUsuario, setPerfilUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
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
        const respuesta = await obtenerUsuarioActualServicio(usuario.idUsuario);
        
        if (respuesta.ok && respuesta.usuario) {
          const usuarioMapeado = {
            idUsuario: usuario.idUsuario,
            nombre: respuesta.usuario.nombresUsuario,
            apellido: respuesta.usuario.apellidosUsuario,
            tipoDocumento: obtenerTipoDocumentoTexto(respuesta.usuario.idTipoDocumento),
            numeroDocumento: respuesta.usuario.numeroDocumentoUsuario,
            correo: respuesta.usuario.correoUsuario,
            telefono: respuesta.usuario.telefonoUsuario,
            idRol: respuesta.usuario.idRol
          };
          setPerfilUsuario(usuarioMapeado);
        } else {
          throw new Error("No se pudieron cargar los datos del perfilUsuario");
        }
      } catch (error) {
        
        setPerfilUsuario({
          idUsuario: 1,
          nombre: "Usuario",
          apellido: "Demo",
          tipoDocumento: "DNI",
          numeroDocumento: "00000000",
          correo: "perfilUsuario@demo.com",
          telefono: "000000000",
          idRol: 3,
          estado: "activo"
        });
      } finally {
        setCargando(false);
      }
    };

    cargarUsuario();
  }, []);

  const obtenerTipoDocumentoTexto = (idTipoDocumento) => {
    const tipos = {
      1: "DNI",
      2: "Pasaporte",
      3: "Carné de Extranjería", 
      4: "RUC"
    };
    return tipos[idTipoDocumento] || "DNI";
  };

  const obtenerIdTipoDocumento = (tipoDocumento) => {
    const tipos = {
      "DNI": 1,
      "Pasaporte": 2,
      "Carné de Extranjería": 3,
      "RUC": 4
    };
    return tipos[tipoDocumento] || 1;
  };

  const handlePerfilActualizado = async (datosActualizados) => {
    try {
      const datosParaBackend = {
        nombresUsuario: datosActualizados.nombre,
        apellidosUsuario: datosActualizados.apellido,
        telefonoUsuario: datosActualizados.telefono,
        idTipoDocumento: obtenerIdTipoDocumento(datosActualizados.tipoDocumento),
        numeroDocumentoUsuario: datosActualizados.numeroDocumento
      };

      const respuesta = await actualizarPerfilUsuarioServicio(perfilUsuario.idUsuario, datosParaBackend);
      
      if (respuesta.ok) {
        setPerfilUsuario(prev => ({
          ...prev,
          ...datosActualizados
        }));
        cerrarEditar();
        mostrarAlerta.exito(respuesta.mensaje || "Perfil actualizado exitosamente");
      }
    } catch (error) {
      mostrarAlerta.error(error.message || "Error al actualizar el perfil");
    }
  };

  const handleCorreoActualizado = async (datosCorreo) => {
    try {
      const respuesta = await actualizarCorreoUsuarioServicio(perfilUsuario.idUsuario, datosCorreo);
      
      if (respuesta.ok) {
        setPerfilUsuario(prev => ({
          ...prev,
          correo: datosCorreo.nuevoCorreo
        }));
        cerrarCorreo();
        mostrarAlerta.exito(respuesta.mensaje || "Correo actualizado exitosamente");
      }
    } catch (error) {
      mostrarAlerta.error(error.message || "Error al actualizar el correo");
      throw error;
    }
  };

  const handleClaveActualizada = async (datosClave) => {
    try {
      const respuesta = await actualizarClaveUsuarioServicio(perfilUsuario.idUsuario, datosClave);
      
      if (respuesta.ok) {
        cerrarClave();
        mostrarAlerta.exito(respuesta.mensaje || "Contraseña actualizada exitosamente");
      }
    } catch (error) {
      mostrarAlerta.error("Error al actualizar la contraseña");
      throw error;
    }
  };

  const getIniciales = (nombre, apellido) => {
    return `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
  };

  const obtenerRolTexto = (idRol) => {
    const roles = {
      1: "Superadministrador",
      2: "Administrador", 
      3: "Usuario"
    };
    return roles[idRol] || "Usuario";
  };

  if (cargando) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rojo"></div>
        </div>
      </section>
    );
  }

  if (!perfilUsuario) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-96">
          <p className="text-white text-lg">No se pudo cargar la información del perfilUsuario</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
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
              
              <div className="bg-gradient-to-r from-azul-secundario to-azul-primario py-8 px-6 text-center">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30">
                    <span className="text-4xl font-bold text-white">
                      {getIniciales(perfilUsuario.nombre, perfilUsuario.apellido)}
                    </span>
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-amarillo rounded-full p-2 shadow-lg">
                    <FaCrown className="w-5 h-5 text-gray-800" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mt-6 mb-2">
                  {perfilUsuario.nombre} {perfilUsuario.apellido}
                </h2>
                <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
                  <FiShield className="w-4 h-4 text-white" />
                  <span className="text-white font-medium text-sm">{obtenerRolTexto(perfilUsuario.idRol)}</span>
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
                      {perfilUsuario.correo}
                    </p>
                  </div>
                  <GoPencil className="w-4 h-4 text-gray-400" />
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-2xl hover:bg-gray-600 transition-colors">
                  <div className="w-12 h-12 bg-azul-primario/10 rounded-xl flex items-center justify-center">
                    <FiPhone className="w-6 h-6 text-azul-primario" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">Teléfono</p>
                    <p className="font-semibold text-white">
                      {perfilUsuario.telefono || 'No especificado'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-3xl shadow-2xl border border-gray-700 overflow-hidden">
              
              <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-8 py-6 border-b border-gray-600">
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
                          {perfilUsuario.nombre}
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
                          {perfilUsuario.apellido}
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
                        {perfilUsuario.correo}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-amarillo/20 rounded-lg flex items-center justify-center">
                            <FiFileText className="w-5 h-5 text-yellow-600" />
                          </div>
                          <label className="text-sm font-semibold text-gray-400">
                            Tipo Doc.
                          </label>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {perfilUsuario.tipoDocumento}
                        </p>
                      </div>

                      <div className="bg-gray-700 rounded-2xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-amarillo/20 rounded-lg flex items-center justify-center">
                            <FiFileText className="w-5 h-5 text-yellow-600" />
                          </div>
                          <label className="text-sm font-semibold text-gray-400">
                            N° Documento
                          </label>
                        </div>
                        <p className="text-lg font-bold text-white">
                          {perfilUsuario.numeroDocumento}
                        </p>
                      </div>
                    </div>

                    <div 
                      className="bg-gradient-to-r from-azul-primario/5 to-azul-secundario/5 rounded-2xl p-6 border border-gray-700 cursor-pointer hover:from-azul-primario/10 hover:to-azul-secundario/10 transition-all"
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
        tamaño="lg"
        mostrarHeader
        mostrarFooter={false}
      >
        <ModalEditarPerfil 
          usuario={perfilUsuario}
          onClose={cerrarEditar}
          onPerfilActualizado={handlePerfilActualizado}
        />
      </Modal>

      <Modal
        estaAbierto={modalCorreoAbierto}
        onCerrar={cerrarCorreo}
        titulo="Actualizar Correo Electrónico"
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        <ModalActualizarCorreo
          usuario={perfilUsuario}
          onClose={cerrarCorreo}
          onCorreoActualizado={handleCorreoActualizado}
        />
      </Modal>

      <Modal
        estaAbierto={modalClaveAbierto}
        onCerrar={cerrarClave}
        titulo="Cambiar Contraseña"
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        <ModalCambiarClave
          usuario={perfilUsuario}
          onClose={cerrarClave}
          onClaveActualizada={handleClaveActualizada}
        />
      </Modal>
    </section>
  );
};

export default PerfilUsuario;