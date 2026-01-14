import { useState, useEffect } from "react";
import { FiUsers } from "react-icons/fi";
import { Tabla } from '../../componentes/ui/tabla/Tabla';
import FilaUsuario from "../../componentes/panel-admin/usuario/FilaUsuario";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda";
import { Paginacion } from "../../componentes/ui/tabla/Paginacion";
import { FiltroBusqueda } from "../../componentes/busqueda-filtros/FiltroBusqueda";
import { useBusqueda } from "../../hooks/useBusqueda";
import { useFiltro } from "../../hooks/useFiltro";
import { usePaginacion } from "../../hooks/usePaginacion";
import { useModal } from "../../hooks/useModal";
import { useConfirmacion } from "../../hooks/useConfirmacion";
import Modal from "../../componentes/ui/modal/Modal";
import { ModalConfirmacion } from "../../componentes/ui/modal/ModalConfirmacion";
import ModalEditarUsuario from "../../componentes/panel-admin/usuario/ModalEditarUsuario";
import { obtenerUsuariosServicio, eliminarUsuarioServicio, listarRolesServicio } from "../../servicios/usuariosServicios";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const Usuarios = () => {
  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda();
  const { filtro, setFiltro, aplicarFiltros } = useFiltro();
  const {
    paginaActual,
    setPaginaActual,
    itemsPorPagina,
    setItemsPorPagina,
    paginar
  } = usePaginacion(5);

  const { estaAbierto: modalEditarAbierto, abrir: abrirEditar, cerrar: cerrarEditar } = useModal();
  const {
    confirmacionVisible,
    mensajeConfirmacion,
    tituloConfirmacion,
    tipoConfirmacion,
    textoConfirmar,
    textoCancelar,
    solicitarConfirmacion,
    ocultarConfirmacion,
    confirmarAccion
  } = useConfirmacion();

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarUsuarios();
    cargarRoles();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      const usuariosData = await obtenerUsuariosServicio();
      setUsuarios(usuariosData);
    } catch (error) {
    } finally {
      setCargando(false);
    }
  };

  const cargarRoles = async () => {
    try {
      const respuesta = await listarRolesServicio();
      if (respuesta.ok && respuesta.roles) {
        setRoles(respuesta.roles);
      } else {
        mostrarAlerta.error(respuesta.mensaje || "No se pudieron cargar los roles");
      }
    } catch (error) {
    }
  };


  const handleEliminarUsuario = async (idUsuario) => {
    try {
      const respuesta = await eliminarUsuarioServicio(idUsuario);

      if (respuesta.ok) {
        setUsuarios(prev => prev.filter(usuario => usuario.idUsuario !== idUsuario));
        mostrarAlerta.exito('Usuario eliminado correctamente');
      } else {
        throw new Error(respuesta.mensaje || "Error al eliminar usuario");
      }
    } catch (error) {
      mostrarAlerta.error(error.message || 'Error al eliminar el usuario');
    }
  };

  const handleSolicitarEliminacion = (usuario) => {
    setUsuarioAEliminar(usuario);
    solicitarConfirmacion(
      `¿Estás seguro de eliminar al usuario ${usuario.nombresUsuario} ${usuario.apellidosUsuario}? Esta acción no se puede deshacer.`,
      () => {
        handleEliminarUsuario(usuario.idUsuario);
      },
      {
        titulo: "Eliminar Usuario",
        tipo: "peligro",
        textoConfirmar: "Eliminar",
        textoCancelar: "Cancelar"
      }
    );
  };

  const handleEditarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    abrirEditar();
  };

  const handleUsuarioActualizado = (usuarioActualizado) => {
    setUsuarios(prev => prev.map(usuario =>
      usuario.idUsuario === usuarioActualizado.idUsuario ? usuarioActualizado : usuario
    ));
    cerrarEditar();
  };

  let filtrados = filtrarPorBusqueda(usuarios, [
    "nombresUsuario",
    "apellidosUsuario",
    "correoUsuario",
    "rolUsuario",
    "telefonoUsuario"
  ]);

  filtrados = aplicarFiltros(filtrados, "idRol");

  const { datosPaginados, totalPaginas } = paginar(filtrados);

  const handleCambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  const handleCambiarItemsPorPagina = (nuevoItemsPorPagina) => {
    setItemsPorPagina(nuevoItemsPorPagina);
  };

  const filasUsuarios = datosPaginados.map((usuario) => (
    <FilaUsuario
      key={usuario.idUsuario}
      usuario={usuario}
      onEliminarUsuario={handleSolicitarEliminacion}
      onEditarUsuario={handleEditarUsuario}
    />
  ));

  const opcionesRoles = [
    { value: "todos", label: "Todos los roles" },
    ...roles.map(rol => ({
      value: rol.idRol,
      label: rol.nombreRol
    }))
  ];


  if (cargando) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Cargando usuarios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gestión de Usuarios
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Administración y control de acceso al sistema
            </p>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <BarraBusqueda
                valor={terminoBusqueda}
                onChange={setTerminoBusqueda}
                placeholder="Buscar por nombre, apellido, correo o teléfono..."
              />
            </div>
            <div>
              <FiltroBusqueda
                valor={filtro}
                onChange={setFiltro}
                opciones={opcionesRoles}
                label="Filtrar por rol"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FiUsers className="w-5 h-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Lista de Usuarios
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({filtrados.length} usuarios encontrados)
            </span>
          </div>
        </div>

        {filtrados.length > 0 ? (
          <>
            <Tabla
              encabezados={["Usuario", "Información de Contacto", "Credenciales", "Rol", "Acciones"]}
              registros={filasUsuarios}
            />
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              alCambiarPagina={handleCambiarPagina}
              itemsPorPagina={itemsPorPagina}
              alCambiarItemsPorPagina={handleCambiarItemsPorPagina}
              mostrarSiempre={true}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <FiUsers className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No se encontraron usuarios</p>
          </div>
        )}
      </div>

      <Modal
        estaAbierto={modalEditarAbierto}
        onCerrar={cerrarEditar}
        titulo={`Editar Usuario #${usuarioSeleccionado?.idUsuario || ''}`}
        tamaño="lg"
        mostrarHeader
        mostrarFooter={false}
      >
        {usuarioSeleccionado && (
          <ModalEditarUsuario
            idUsuario={usuarioSeleccionado.idUsuario}
            onClose={cerrarEditar}
            onUsuarioActualizado={handleUsuarioActualizado}
          />
        )}
      </Modal>

      <ModalConfirmacion
        visible={confirmacionVisible}
        onCerrar={ocultarConfirmacion}
        onConfirmar={confirmarAccion}
        titulo={tituloConfirmacion}
        mensaje={mensajeConfirmacion}
        textoConfirmar={textoConfirmar}
        textoCancelar={textoCancelar}
        tipo={tipoConfirmacion}
      />
    </div>
  );
};

export default Usuarios;