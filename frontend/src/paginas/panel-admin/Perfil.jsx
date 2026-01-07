import { useState, useEffect } from "react";
import { FiMail, FiPhone, FiUser, FiFileText, FiBriefcase, FiShield} from "react-icons/fi";
import { FaRegUser } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import Modal from "../../componentes/ui/modal/Modal";
import { useModal } from "../../hooks/useModal"
import CampoInfo from "../../componentes/panel-admin/CampoInfo";
import { BotonSimple } from "../../componentes/ui/botones/BotonSimple";
import { useAutenticacionStore } from "../../store/useAutenticacionStore";
import { obtenerUsuarioPorIdServicio, actualizarUsuarioServicio } from "../../servicios/usuariosServicios";
import ModalActualizarCorreo from "../../componentes/panel-admin/usuario/ModalActualizarCorreo";
import ModalActualizarClave from "../../componentes/panel-admin/usuario/ModalActualizarClave";
import FormularioEditUsuario from "../../componentes/panel-admin/usuario/FormularioEditUsuario";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const Perfil = () => {
  const { usuario: usuarioGlobal } = useAutenticacionStore();
  const [usuarioPerfil, setUsuarioPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(false);

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
    const cargarPerfilUsuario = async () => {
      try {
        setCargando(true);
        
        if (usuarioGlobal?.idUsuario) {
          const respuesta = await obtenerUsuarioPorIdServicio(usuarioGlobal.idUsuario);
          
          if (respuesta.ok && respuesta.usuario) {
            setUsuarioPerfil(respuesta.usuario);
          } else {
            throw new Error("No se pudieron cargar los datos del perfil");
          }
        } else {
          setUsuarioPerfil({
            idUsuario: 1,
            nombresUsuario: "Juan",
            apellidosUsuario: "Pérez Casas",
            idTipoDocumento: 1,
            numeroDocumentoUsuario: "12345678",
            correoUsuario: "juan@example.com",
            telefonoUsuario: "987654321",
            idRol: 2,
            estadoUsuario: "activo"
          });
        }
      } catch (error) {
        mostrarAlerta.error('Error al cargar los datos del perfil');
        
        setUsuarioPerfil({
          idUsuario: usuarioGlobal?.idUsuario || 1,
          nombresUsuario: "Usuario",
          apellidosUsuario: "Demo",
          idTipoDocumento: 1,
          numeroDocumentoUsuario: "00000000",
          correoUsuario: "usuario@demo.com",
          telefonoUsuario: "000000000",
          idRol: 3,
          estadoUsuario: "activo"
        });
      } finally {
        setCargando(false);
      }
    };

    cargarPerfilUsuario();
  }, [usuarioGlobal]);

  const handleCorreoActualizado = (nuevoCorreo) => {
    setUsuarioPerfil(prev => ({
      ...prev,
      correoUsuario: nuevoCorreo
    }));
  };

  const handleUsuarioActualizado = async (datosActualizados) => {
    try {
      setActualizando(true);
      
      const respuesta = await actualizarUsuarioServicio(
        usuarioPerfil.idUsuario, 
        datosActualizados
      );
      
      if (respuesta.ok) {
        setUsuarioPerfil(prev => ({
          ...prev,
          ...datosActualizados
        }));
        
        mostrarAlerta.exito('Perfil actualizado correctamente');
        cerrarEditar();
        
        const datosCompletos = await obtenerUsuarioPorIdServicio(usuarioPerfil.idUsuario);
        if (datosCompletos.ok && datosCompletos.usuario) {
          setUsuarioPerfil(datosCompletos.usuario);
        }
      } else {
        throw new Error(respuesta.mensaje || 'Error al actualizar el perfil');
      }
    } catch (error) {
      mostrarAlerta.error(error.message || 'Error al actualizar el perfil');
    } finally {
      setActualizando(false);
    }
  };

  const obtenerTipoDocumento = (idTipoDocumento) => {
    const tipos = {
      1: "DNI",
      2: "Pasaporte", 
      3: "Carné de extranjería",
      4: "RUC"
    };
    return tipos[idTipoDocumento] || "No especificado";
  };

  const obtenerRol = (idRol) => {
    const roles = {
      1: "Superadministrador",
      2: "Administrador",
      3: "Usuario"
    };
    return roles[idRol] || "No especificado";
  };

  const getIniciales = (nombres, apellidos) => {
    return `${nombres?.charAt(0) || ''}${apellidos?.charAt(0) || ''}`.toUpperCase();
  };

  if (cargando) {
    return (
      <div className="w-full mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!usuarioPerfil) {
    return (
      <div className="w-full mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500 dark:text-gray-400">No se pudo cargar el perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6">
      <div className="flex items-center space-x-2">
        <h1 className="text-2xl text-gray-800 dark:text-gray-100 font-bold mt-0 mb-1 leading-tight">Perfil</h1>
        <FaRegUser className="text-2xl mb-2 text-gray-800 dark:text-gray-100" />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm mb-6">
        <div className="px-8 py-8 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                <span className="text-3xl font-bold text-white">
                  {getIniciales(usuarioPerfil.nombresUsuario, usuarioPerfil.apellidosUsuario)}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {usuarioPerfil.nombresUsuario} {usuarioPerfil.apellidosUsuario}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                  <FiBriefcase className="w-4 h-4" />
                  <span>{obtenerRol(usuarioPerfil.idRol)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                    Activo
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FiMail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                <p className="font-medium text-gray-900 dark:text-white">{usuarioPerfil.correoUsuario}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FiPhone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Teléfono</p>
                <p className="font-medium text-gray-900 dark:text-white">{usuarioPerfil.telefonoUsuario || 'No especificado'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-left">
            Información personal
          </h2>
          <BotonSimple
            funcion={abrirEditar}
            etiqueta="Editar Perfil"
            icono={GoPencil}
          />
        </div>
        
        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <CampoInfo 
                  icono={FiUser}
                  etiqueta="Nombres"
                  valor={usuarioPerfil.nombresUsuario}
                />
                <CampoInfo 
                  icono={FiUser}
                  etiqueta="Apellidos"
                  valor={usuarioPerfil.apellidosUsuario}
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <FiMail className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</p>
                    <p className="text-gray-900 dark:text-white">{usuarioPerfil.correoUsuario}</p>
                  </div>
                </div>
                <BotonSimple
                  funcion={abrirCorreo}
                  etiqueta="Cambiar"
                  variante="secundario"
                  tamaño="sm"
                />
              </div>
              <CampoInfo 
                icono={FiPhone}
                etiqueta="Teléfono"
                valor={usuarioPerfil.telefonoUsuario || 'No especificado'}
              />
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <CampoInfo 
                  icono={FiFileText}
                  etiqueta="Tipo de documento"
                  valor={obtenerTipoDocumento(usuarioPerfil.idTipoDocumento)}
                />
                <CampoInfo 
                  icono={FiFileText}
                  etiqueta="Número de documento"
                  valor={usuarioPerfil.numeroDocumentoUsuario}
                />
              </div>
              <CampoInfo 
                icono={FiBriefcase}
                etiqueta="Rol Usuario"
                valor={obtenerRol(usuarioPerfil.idRol)}
              />

              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <FiShield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">••••••••</p>
                  </div>
                </div>
                <BotonSimple
                  funcion={abrirClave}
                  etiqueta="Cambiar"
                  variante="secundario"
                  tamaño="sm"
                />
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
        {usuarioPerfil && (
          <FormularioEditUsuario 
            usuario={usuarioPerfil}
            onSubmit={handleUsuarioActualizado}
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
        {usuarioPerfil && (
          <ModalActualizarCorreo
            idUsuario={usuarioPerfil.idUsuario}
            correoActual={usuarioPerfil.correoUsuario}
            onClose={cerrarCorreo}
            onCorreoActualizado={handleCorreoActualizado}
          />
        )}
      </Modal>

      <Modal
        estaAbierto={modalClaveAbierto}
        onCerrar={cerrarClave}
        titulo="Cambiar Contraseña"
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        {usuarioPerfil && (
          <ModalActualizarClave
            idUsuario={usuarioPerfil.idUsuario}
            onClose={cerrarClave}
          />
        )}
      </Modal>
    </div>
  );
};

export default Perfil;