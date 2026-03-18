import { useState, useCallback, useRef } from 'react';
import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import { Outlet, useNavigate } from "react-router";
import Cabecera from "./Cabecera";
import FondoOscuro from "./FondoOscuro";
import MenuLateral from "./MenuLateral";
import { useAutenticacionStore } from '../../store/useAutenticacionStore';
import useInactividad from '../../hooks/useInactividad';
import ModalInactividad from '../../componentes/ui/modal/ModalInactividad';

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { logout } = useAutenticacionStore();
  const navigate = useNavigate();

  const [mostrarAviso, setMostrarAviso] = useState(false);
  const [segundos, setSegundos] = useState(60);
  const cuentaAtrasRef = useRef(null);

  const iniciarCuentaAtras = useCallback(() => {
    setSegundos(30);
    setMostrarAviso(true);
    let s = 30;
    cuentaAtrasRef.current = setInterval(() => {
      s -= 1;
      setSegundos(s);
      if (s <= 0) clearInterval(cuentaAtrasRef.current);
    }, 1000);
  }, []);

  const handleLogout = useCallback(async () => {
    clearInterval(cuentaAtrasRef.current);
    setMostrarAviso(false);
    await logout();
    navigate('/inicio-sesion', { replace: true,  state: { sesionExpirada: true } });
  }, [logout, navigate]);

  const { cancelarLogout } = useInactividad({
    onAviso: iniciarCuentaAtras,
    onLogout: handleLogout,
    tiempoAviso: 29.5 * 60 * 1000,
    tiempoLogout: 30 * 60 * 1000,
  });

  const handleSeguir = useCallback(() => {
    clearInterval(cuentaAtrasRef.current);
    setMostrarAviso(false);
    cancelarLogout();
  }, [cancelarLogout]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 xl:flex transition-colors duration-300">
      <div>
        <MenuLateral />
        <FondoOscuro />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-72.5" : "lg:ml-22.5"
          } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <Cabecera />
        <div className="p-1 mx-auto max-w-(--breakpoint-2xl) md:p-2">
          <Outlet />
        </div>
      </div>

      <ModalInactividad
        visible={mostrarAviso}
        segundosRestantes={segundos}
        onSeguir={handleSeguir}
        onCerrarSesion={handleLogout}
      />
    </div>
  );
};

const EstructuraBaseAdmin = () => {
  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
};

export default EstructuraBaseAdmin;