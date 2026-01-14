import { Outlet } from "react-router-dom";
import Cabecera from "./Cabecera";
import PiePagina from "./PiePagina";

const EstructuraBaseUsuario = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Cabecera />
      <main className="pt-20">
        <Outlet />
      </main>
      <PiePagina/>
    </div>
  );
};

export default EstructuraBaseUsuario;