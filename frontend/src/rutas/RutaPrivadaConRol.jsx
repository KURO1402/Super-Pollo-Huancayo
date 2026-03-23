import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAutenticacionStore } from "../store/useAutenticacionStore";
import { obtenerRutaRedireccion, tienePermiso, RUTA_A_PERMISO } from "../constantes/roles";

const RutaPrivadaConRol = ({ rolesPermitidos, redirectTo }) => {
  const usuario = useAutenticacionStore((state) => state.usuario);
  const location = useLocation();

  if (usuario === undefined) {
    return <div>Loading ...</div>;
  }

  if (!usuario) {
    return (
      <Navigate
        to="/inicio-sesion"
        replace
        state={{ from: location }}
      />
    );
  }

  if (!rolesPermitidos.includes(usuario.id_rol)) {
    const rutaCorrecta = redirectTo || obtenerRutaRedireccion(usuario.id_rol);
    return <Navigate to={rutaCorrecta} replace />;
  }

  const permisoRequerido = RUTA_A_PERMISO[location.pathname];
  if (permisoRequerido && !tienePermiso(usuario.id_rol, permisoRequerido)) {
    const rutaCorrecta = redirectTo || obtenerRutaRedireccion(usuario.id_rol);
    return <Navigate to={rutaCorrecta} replace />;
  }

  return <Outlet />;
};

export default RutaPrivadaConRol;