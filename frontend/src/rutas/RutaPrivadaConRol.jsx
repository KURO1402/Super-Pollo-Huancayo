import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAutenticacionStore } from "../store/useAutenticacionStore";
import { obtenerRutaRedireccion } from "../constantes/roles";

const RutaPrivadaConRol = ({ rolesPermitidos, redirectTo }) => {
  const usuario = useAutenticacionStore((state) => state.usuario);
  const location = useLocation();

  if ( usuario === undefined){
    return <div>Loading ...</div>
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

  return <Outlet />;
};

export default RutaPrivadaConRol;