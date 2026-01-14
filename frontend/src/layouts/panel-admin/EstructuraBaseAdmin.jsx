import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import { Outlet } from "react-router";
import Cabecera from "./Cabecera";
import FondoOscuro from "./FondoOscuro";
import MenuLateral from "./MenuLateral";

const LayoutContent = () => {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 xl:flex transition-colors duration-300">
      <div>
        <MenuLateral />
        <FondoOscuro />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-72.5" : "lg:ml-22.5"
        } ${isMobileOpen ? "ml-0" : ""}`}
      >
        <Cabecera />
        <div className="p-1 mx-auto max-w-(--breakpoint-2xl) md:p-2">
          <Outlet />
        </div>
      </div>
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