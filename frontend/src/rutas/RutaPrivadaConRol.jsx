import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAutenticacionStore } from "../store/useAutenticacionStore";
import { obtenerRutaRedireccion } from "../constantes/roles";

const RutaPrivadaConRol = ({ rolesPermitidos, redirectTo }) => {
  const usuario = useAutenticacionStore((state) => state.usuario);
  const location = useLocation();

  if (!usuario) {

    return (
      <Navigate
        to="/inicio-sesion"
        replace
        state={{ from: location }}
        />
    );
  }

  if (!rolesPermitidos.includes(usuario.idRol)) {

    const rutaCorrecta = redirectTo || obtenerRutaRedireccion(usuario.idRol);
    return <Navigate to={rutaCorrecta} replace />;
  }

  return <Outlet />;
};

export default RutaPrivadaConRol;