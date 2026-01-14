import { useAutenticacionStore } from "../../store/useAutenticacionStore";
import { tienePermiso } from '../../constantes/roles';

const ProtegerPorPermiso = ({ permiso, children, fallback }) => {
  const usuario = useAutenticacionStore((state) => state.usuario);

  const tieneAcceso = tienePermiso(usuario?.idRol, permiso);

  if (!tieneAcceso) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md px-4">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            Acceso Restringido
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No tienes permisos para acceder a esta sección.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Contacta al administrador si crees que esto es un error.
          </p>
        </div>
      </div>
    );
  }
  return <>{children}</>;
};

export default ProtegerPorPermiso;