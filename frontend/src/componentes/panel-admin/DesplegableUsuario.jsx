import { FiBox, FiCalendar, FiUser, FiSettings, FiLogOut, FiChevronRight } from "react-icons/fi";
import { useState } from "react";
import { Desplegable } from "../ui/desplegable/Desplegable";
import { DesplegableItem } from "../ui/desplegable/DesplegableItem";
import { useAutenticacionStore } from "../../store/useAutenticacionStore";
import { ROLES } from "../../constantes/roles";

export default function DesplegableUsuario() {
  const [estaAbierto, setEstaAbierto] = useState(false);
  const [configAbierto, setConfigAbierto] = useState(false);
  const { usuario, logout } = useAutenticacionStore();

  const esAdmin = usuario?.id_rol === ROLES.ADMINISTRADOR;
  const iniciales = usuario?.nombre_usuario?.charAt(0).toUpperCase() ?? "";
  const rolTexto = usuario?.id_rol === 2 ? "Colaborador" : "Administrador";

  function alternarDesplegable() {
    setEstaAbierto(!estaAbierto);
    setConfigAbierto(false);
  }

  function cerrarDesplegable() {
    setEstaAbierto(false);
    setConfigAbierto(false);
  }

  return (
    <div className="relative">
      <button
        onClick={alternarDesplegable}
        className="dropdown-toggle flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-colors duration-200"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 bg-red-600 flex items-center justify-center text-white font-bold text-xl">
          {iniciales}
        </span>
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 max-w-25 truncate">
            {usuario?.nombre_usuario}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{rolTexto}</span>
        </div>

        <svg
          className={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform durationshrink-0 ${estaAbierto ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      <Desplegable
        estaAbierto={estaAbierto}
        onClose={cerrarDesplegable}
        className="absolute right-0 mt-2 w-64 flex flex-col rounded-2xl border border-gray-100 bg-white shadow-xl dark:border-gray-700/60 dark:bg-gray-900 overflow-hidden"
      >
        <div className="px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700/60">
          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
            {usuario?.nombre_usuario} {usuario?.apellido_usuario}
          </p>
          <span className="text-xs text-gray-400 dark:text-gray-500">{rolTexto}</span>
        </div>

        <ul className="flex flex-col gap-0.5 p-2">
          <li>
            <DesplegableItem
              onItemClick={cerrarDesplegable}
              tag="a"
              to="/admin/perfil"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl transition-colors duration-150 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FiUser size={16} className="text-gray-400 dark:text-grayshrink-0" />
              Editar Perfil
            </DesplegableItem>
          </li>
          <li>
            <DesplegableItem
              onItemClick={cerrarDesplegable}
              tag="a"
              to="/admin/calendario-reservas"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl transition-colors duration-150 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FiCalendar size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
              Calendario
            </DesplegableItem>
          </li>
          <li>
            <DesplegableItem
              onItemClick={cerrarDesplegable}
              tag="a"
              to="/admin/stock-insumos"
              className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl transition-colors duration-150 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FiBox size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
              Stock
            </DesplegableItem>
          </li>

          {esAdmin && (
            <li>
              <button
                onClick={() => setConfigAbierto((prev) => !prev)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 rounded-xl transition-colors duration-150 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <FiSettings size={16} className="text-gray-400 dark:text-gray-500 shrink-0" />
                <span className="flex-1 text-left">Configuración</span>
                <FiChevronRight
                  size={14}
                  className={`text-gray-400 dark:text-gray-500 transition-transform duration-200 ${configAbierto ? "rotate-90" : ""}`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${configAbierto ? "max-h-48" : "max-h-0"}`}
              >
                <ul className="pl-9 pr-2 pb-1 space-y-0.5">
                  {[
                    { nombre: "Categorías de Productos", ruta: "/admin/categorias-productos" },
                    { nombre: "Tipos de Documento",      ruta: "/admin/tipos-documento" },
                    { nombre: "Medios de Pago",          ruta: "/admin/medios-pago" },
                    { nombre: "Tipos de Comprobante",    ruta: "/admin/tipos-comprobante" },
                  ].map((item) => (
                    <li key={item.ruta}>
                      <DesplegableItem
                        onItemClick={cerrarDesplegable}
                        tag="a"
                        to={item.ruta}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-600 rounded-lg transition-colors duration-150 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
                      >
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0" />
                        {item.nombre}
                      </DesplegableItem>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          )}
        </ul>

        <div className="p-2 border-t border-gray-100 dark:border-gray-700/60">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-500 rounded-xl transition-colors duration-150 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
          >
            <FiLogOut size={16} className="shrink-0" />
            Cerrar Sesión
          </button>
        </div>
      </Desplegable>
    </div>
  );
}