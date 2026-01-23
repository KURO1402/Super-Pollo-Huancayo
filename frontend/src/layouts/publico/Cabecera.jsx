import { useState } from "react";
import { BsPerson } from "react-icons/bs";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useAutenticacionStore } from "../../store/useAutenticacionStore";
import BarraNavegacion from "../../componentes/BarraNavegacion";
import BotonIniciarSesion from "../../componentes/ui/botones/BotonIniciarSesion";
import BotonRegistro from "../../componentes/ui/botones/BotonRegistro";
import DropdownUsuario from "../../componentes/DropdownUsuario";
import DropdownAdmin from "../../componentes/DropdowmAdmin";
import NombreEmpresa from "../../assets/imagenes/Nombre_Empresa.png";
import Logo from "../../assets/imagenes/Logo.svg";
import { ROLES } from "../../constantes/roles";

const Cabecera = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const usuario = useAutenticacionStore((state) => state.usuario);
  const location = useLocation();

  const esAreaUsuario = location.pathname.startsWith('/usuario');
  const esAreaAdmin = location.pathname.startsWith('/admin');

  const getLogoLink = () => {
    if (esAreaUsuario) return "/usuario";
    if (esAreaAdmin) return "/admin";
    return "/";
  };

  const renderSeccionUsuario = () => {
    if (usuario && usuario.id_rol === ROLES.USUARIO) {
      return <DropdownUsuario usuario={usuario} />;
    }

    if (usuario && usuario.id_rol !== ROLES.USUARIO) {
      return <DropdownAdmin usuario={usuario} />;
    }

    if (!esAreaAdmin && !esAreaUsuario) {
      return (
        <>
          <BsPerson className="text-3xl text-gray-100" />
          <BotonIniciarSesion />
          <p className="flex items-center text-gray-100">/</p>
          <BotonRegistro />
        </>
      );
    }

    return null;
  };

  const renderSeccionUsuarioMobile = () => {
  if (usuario && usuario.idRol === ROLES.USUARIO) {
    return (
      <div className="flex flex-col items-center space-y-3">
        <span className="text-gray-100 font-medium">
          Hola, {usuario.nombresUsuario}
        </span>
        <DropdownUsuario usuario={usuario} mobile />
      </div>
    );
  }

  if (usuario && usuario.idRol !== ROLES.USUARIO) {
    return <DropdownAdmin usuario={usuario} mobile />;
  }

  if (!esAreaAdmin && !esAreaUsuario) {
    return (
      <div className="flex items-center justify-center space-x-2">
        <BsPerson className="text-3xl text-gray-100" />
        <div className="flex space-x-3">
          <BotonIniciarSesion />
          <p className="flex items-center text-gray-100">/</p>
          <BotonRegistro />
        </div>
      </div>
    );
  }

  return null;
};

  return (
    <header className="bg-azul-secundario shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to={getLogoLink()} className="flex items-center space-x-3">
            <img
              src={NombreEmpresa}
              alt="SUPER POLLO"
              className="h-8 md:h-10 w-auto"
            />
            <img src={Logo} alt="logo" className="w-10 h-10 md:w-12 md:h-12" />
          </Link>

          <div className="hidden lg:block flex-1 mx-8">
            <BarraNavegacion />
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            {renderSeccionUsuario()}
          </div>

          <button
            className="lg:hidden p-2 rounded-md text-gray-100 hover:bg-azul-primario focus:outline-none"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label="Abrir menú de navegación"
            aria-expanded={menuAbierto}
          >
            {menuAbierto ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${menuAbierto
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
            }`}
        >
          <div className="py-4 px-2 space-y-4 bg-azul-secundario border-t border-azul-primario">

            <BarraNavegacion />

            <div className="flex flex-col space-y-3 pt-2">
              {renderSeccionUsuarioMobile()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Cabecera;