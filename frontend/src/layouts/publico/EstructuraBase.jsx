import { Outlet } from "react-router-dom";

import Cabecera from "./Cabecera";
import PiePagina from "./PiePagina";

const EstructuraBase = () => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Cabecera />
      <main className="grow w-full overflow-hidden pt-16 md:pt-20">
        <Outlet /> 
      </main>
      <PiePagina />
    </div>
  );
};

export default EstructuraBase;
