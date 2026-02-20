import { useState, useEffect }    from 'react';
import { useUsuariosStore }        from '../../store/useUsuarioStore';
import { usePaginacion }           from '../../hooks/usePaginacion';
    
import FiltrosUsuarios   from '../../componentes/panel-admin/usuario/FiltrosUsuarios';
import TablaUsuarios     from '../../componentes/panel-admin/usuario/TablaUsuarios';
import { Paginacion } from '../../componentes/ui/tabla/Paginacion';
/* import ModalEditarRol    from './ModalEditarRol';
import ModalConfirmacion from './ModalConfirmacion'; */

const UsuariosPagina = () => {
  const {
    usuarios, total, cargando, error,
    paginaActual, limite, filtros,
    cargarUsuarios,
    setPagina, setLimite, setFiltros, limpiarFiltros,
    limpiarError,
  } = useUsuariosStore();

  const paginacion = usePaginacion({
    paginaActual,
    limite,
    total,
    onPagina: setPagina,
    onLimite: setLimite,
  });

  const [modalRol, setModalRol]     = useState({ visible: false, usuario: null });
  const [guardando, setGuardando]   = useState(false);
  const [toast, setToast]           = useState(null);  // { mensaje, tipo }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    if (error) {
      limpiarError();
    }
  }, [error]);

/*   const handleEditarRol = (usuario) =>
    setModalRol({ visible: true, usuario });

  const handleCerrarModal = () => {
    if (guardando) return;
    setModalRol({ visible: false, usuario: null });
  };

  const handleGuardarRol = async (id_usuario, id_rol) => {
    setGuardando(true);
    try {
      await actualizarRol(id_usuario, id_rol);
      mostrarToast('Rol actualizado ✓');
      setModalRol({ visible: false, usuario: null });
    } catch {
      mostrarToast('No se pudo actualizar el rol', 'error');
    } finally {
      setGuardando(false);
    }
  };

  const handleToggleEstado = async (id_usuario, activo) => {
    try {
      await toggleEstado(id_usuario, activo);
      mostrarToast(activo ? 'Usuario activado ✓' : 'Usuario desactivado ✓');
    } catch {
      mostrarToast('No se pudo cambiar el estado', 'error');
    }
  };

  const handleEliminar = (usuario) => {
    confirmar({
      titulo:   'Eliminar usuario',
      mensaje:  `¿Eliminar a ${usuario.nombre_usuario} ${usuario.apellido_usuario}? Esta acción no se puede deshacer.`,
      tipo:     'danger',
      onAceptar: async () => {
        await eliminarUsuario(usuario.id_usuario);
        mostrarToast('Usuario eliminado ✓');
      },
    });
  }; */

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            Gestión de Usuarios
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {total > 0
              ? `${total} usuario${total !== 1 ? 's' : ''} registrado${total !== 1 ? 's' : ''}`
              : 'Sin usuarios'}
          </p>
        </div>

        {/* Filtros */}
        <FiltrosUsuarios
          filtros={filtros}
          onCambio={setFiltros}
          onLimpiar={limpiarFiltros}
        />

        {/* Tabla */}
        <TablaUsuarios
          usuarios={usuarios}
          cargando={cargando}
          /* onEditarRol={handleEditarRol}
          onEliminar={handleEliminar}
          onToggleEstado={handleToggleEstado} */
        />

        {/* Paginación */}
        {total > 0 && (
          <div className="mt-4">
            <Paginacion {...paginacion} />
          </div>
        )}
      </div>

      {/* Modal editar rol */}
      {/* {modalRol.visible && (
        <ModalEditarRol
          usuario={modalRol.usuario}
          onGuardar={handleGuardarRol}
          onCerrar={handleCerrarModal}
          cargando={guardando}
        />
      )} */}

      {/* Modal confirmación */}
      {/* <ModalConfirmacion
        estado={modalConfirm}
        onAceptar={aceptar}
        onCancelar={cancelar}
      /> */}
    </div>
  );
};

export default UsuariosPagina;