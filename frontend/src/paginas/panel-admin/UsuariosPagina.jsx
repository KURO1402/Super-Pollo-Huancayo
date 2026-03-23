import { useEffect, useState } from 'react';
import { useUsuariosStore } from '../../store/useUsuarioStore';
import { usePaginacion } from '../../hooks/usePaginacion';
import { useModal } from '../../hooks/useModal';
import FiltrosUsuarios from '../../componentes/panel-admin/usuario/FiltrosUsuarios';
import TablaUsuarios from '../../componentes/panel-admin/usuario/TablaUsuarios';
import { Paginacion } from '../../componentes/ui/tabla/Paginacion';
import Modal from '../../componentes/ui/modal/Modal';
import ModalEditarUsuario from '../../componentes/panel-admin/usuario/ModalEditarUsuario';
import { useConfirmacion } from '../../hooks/useConfirmacion';
import { ModalConfirmacion } from '../../componentes/ui/modal/ModalConfirmacion';
import mostrarAlerta from '../../utilidades/toastUtilidades';
import { FiUsers } from 'react-icons/fi';

const UsuariosPagina = () => {
  const {
    usuarios, total, cargando, error,
    paginaActual, limite, filtros,
    cargarUsuarios, setPagina, setLimite,
    setFiltros, limpiarFiltros, limpiarError, eliminarUsuario,
  } = useUsuariosStore();

  const { estaAbierto, abrir, cerrar } = useModal();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarSpinner, setMostrarSpinner] = useState(false);

  const paginacion = usePaginacion({
    paginaActual,
    limite,
    total,
    onPagina: setPagina,
    onLimite: setLimite,
  });

  const {
    confirmacionVisible, mensajeConfirmacion, tituloConfirmacion,
    tipoConfirmacion, textoConfirmar, textoCancelar,
    solicitarConfirmacion, ocultarConfirmacion, confirmarAccion,
  } = useConfirmacion();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    if (error) limpiarError();
  }, [error]);

  useEffect(() => {
    let timer;
    if (cargando) {
      timer = setTimeout(() => setMostrarSpinner(true), 300);
    } else {
      setMostrarSpinner(false);
    }
    return () => clearTimeout(timer);
  }, [cargando]);

  const handleEditarRol = (usuario) => {
    setUsuarioSeleccionado(usuario);
    abrir();
  };

  const handleCerrarModal = () => {
    setUsuarioSeleccionado(null);
    cerrar();
  };

  const handleSolicitarEliminacion = (usuario) => {
    solicitarConfirmacion(
      `¿Estás seguro de eliminar al usuario ${usuario.nombre_usuario} ${usuario.apellido_usuario}?`,
      async () => {
        try {
          await eliminarUsuario(usuario.id_usuario);
          mostrarAlerta.exito('Usuario eliminado correctamente');
        } catch (err) {
          mostrarAlerta.error(err.message || 'Error al eliminar usuario');
        }
      },
      {
        titulo: 'Eliminar Usuario',
        tipo: 'peligro',
        textoConfirmar: 'Eliminar',
        textoCancelar: 'Cancelar',
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-full p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {total > 0
              ? `${total} usuario${total !== 1 ? 's' : ''} registrado${total !== 1 ? 's' : ''}`
              : 'Sin usuarios registrados'}
          </p>
        </div>

        <FiltrosUsuarios
          filtros={filtros}
          onCambio={setFiltros}
          onLimpiar={limpiarFiltros}
        />

        {mostrarSpinner ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">Cargando usuarios...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <FiUsers className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              {filtros.valorBusqueda || filtros.rol
                ? 'No se encontraron usuarios con esos filtros'
                : 'No hay usuarios registrados'}
            </p>
          </div>
        ) : (
          <>
            <TablaUsuarios
              usuarios={usuarios}
              cargando={false}
              onEditarRol={handleEditarRol}
              onEliminarUsuario={handleSolicitarEliminacion}
            />
            {total > 0 && (
              <div className="mt-4">
                <Paginacion {...paginacion} />
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        estaAbierto={estaAbierto}
        onCerrar={handleCerrarModal}
        titulo="Editar rol del usuario"
        tamaño="md"
        mostrarHeader
        mostrarFooter={false}
      >
        {usuarioSeleccionado && (
          <ModalEditarUsuario
            usuario={usuarioSeleccionado}
            onClose={handleCerrarModal}
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

export default UsuariosPagina;