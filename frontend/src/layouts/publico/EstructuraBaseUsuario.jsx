import { useCallback, useRef } from 'react';
import { Outlet, useNavigate } from "react-router-dom";
import Cabecera from "./Cabecera";
import PiePagina from "./PiePagina";
import { useAutenticacionStore } from '../../store/useAutenticacionStore';
import useInactividad from '../../hooks/useInactividad';

const EstructuraBaseUsuario = () => {
  const { logout } = useAutenticacionStore();
  const navigate = useNavigate();
  const cuentaAtrasRef = useRef(null);

  const handleLogout = useCallback(async () => {
    clearInterval(cuentaAtrasRef.current);
    await logout();
    navigate('/inicio-sesion', { replace: true,  state: { sesionExpirada: true } });
  }, [logout, navigate]);

  useInactividad({
    onAviso: handleLogout,
    onLogout: handleLogout,
    tiempoAviso: 1 * 60 * 60 * 1000,
    tiempoLogout: 1 * 60 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Cabecera />
      <main className="pt-20">
        <Outlet />
      </main>
      <PiePagina />
    </div>
  );
};

export default EstructuraBaseUsuario;