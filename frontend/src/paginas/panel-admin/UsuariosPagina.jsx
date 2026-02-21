import { useEffect, useState } from 'react';
import { useUsuariosStore } from '../../store/useUsuarioStore';
import { usePaginacion } from '../../hooks/usePaginacion';
import { useModal } from '../../hooks/useModal';

import FiltrosUsuarios from '../../componentes/panel-admin/usuario/FiltrosUsuarios';
import TablaUsuarios from '../../componentes/panel-admin/usuario/TablaUsuarios';
import { Paginacion } from '../../componentes/ui/tabla/Paginacion';
import Modal from '../../componentes/ui/modal/Modal';
import ModalEditarUsuario from '../../componentes/panel-admin/usuario/ModalEditarUsuario';

const UsuariosPagina = () => {
  const {
    usuarios, total, cargando, error, paginaActual, limite, filtros, cargarUsuarios, setPagina, setLimite, setFiltros, limpiarFiltros, limpiarError,
  } = useUsuariosStore();

  const { estaAbierto, abrir, cerrar } = useModal();
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const paginacion = usePaginacion({
    paginaActual,
    limite,
    total,
    onPagina: setPagina,
    onLimite: setLimite,
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  useEffect(() => {
    if (error) limpiarError();
  }, [error]);

  const handleEditarRol = (usuario) => {
    setUsuarioSeleccionado(usuario);
    abrir();
  };

  const handleCerrarModal = () => {
    setUsuarioSeleccionado(null);
    cerrar();
  };

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

        <FiltrosUsuarios
          filtros={filtros}
          onCambio={setFiltros}
          onLimpiar={limpiarFiltros}
        />

        <TablaUsuarios
          usuarios={usuarios}
          cargando={cargando}
          onEditarRol={handleEditarRol}
        />

        {total > 0 && (
          <div className="mt-4">
            <Paginacion {...paginacion} />
          </div>
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
    </div>
  );
};

export default UsuariosPagina;