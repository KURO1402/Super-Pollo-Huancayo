import { useCallback, useEffect, useRef, useState } from "react";
import { FiGrid, FiShoppingCart, FiArchive, FiCalendar, FiUsers, FiUser, FiChevronDown, FiMoreHorizontal,} from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";
import { FaCashRegister } from "react-icons/fa";
import { IoFastFoodOutline } from "react-icons/io5";
import Nombre from "../../assets/imagenes/Nombre_Empresa.png";
import Logo from "../../assets/imagenes/Logo.svg";

import { useSidebar } from "../../context/SidebarContext";
import { useAutenticacionStore } from "../../store/useAutenticacionStore";
import { ROLES } from "../../constantes/roles";

const navItems = [
  {
    icon: <FiGrid size={20} />,
    name: "Dashboard",
    path: "/admin",
    rolesPermitidos: [ROLES.ADMINISTRADOR],
  },
  {
    icon: <FiShoppingCart size={20} />,
    name: "Ventas",
    rolesPermitidos: [ROLES.ADMINISTRADOR, ROLES.COLABORADOR],
    subItems: [
      { name: "Generar Venta", path: "/admin/generar-venta" },
      { name: "Historial de Comprobantes", path: "/admin/registro-ventas" },
    ],
  },
  {
    icon: <IoFastFoodOutline size={22} />,
    name: "Productos",
    rolesPermitidos: [ROLES.ADMINISTRADOR, ROLES.COLABORADOR],
    subItems: [
      { name: "Gestión Productos", path: "/admin/gestion-productos" },
      { name: "Gestión Imagenes", path: "/admin/gestion-imagenes" },
    ],
  },
  {
    icon: <FiArchive size={20} />,
    name: "Stock",
    rolesPermitidos: [ROLES.ADMINISTRADOR, ROLES.COLABORADOR],
    subItems: [
      { name: "Stock Insumos", path: "/admin/stock-insumos" },
      { name: "Historial Entradas", path: "/admin/historial-entradas" },
      { name: "Historial Salidas", path: "/admin/historial-salidas" },
    ]
  },
  {
    icon: <FaCashRegister size={20} />,
    name: "Caja",
    rolesPermitidos: [ROLES.ADMINISTRADOR, ROLES.COLABORADOR],
    subItems: [
      { name: "Caja Actual", path: "/admin/caja-actual" },
      { name: "Historial", path: "/admin/historial-cajas" }
    ]
  },
  {
    icon: <FiCalendar size={20} />,
    name: "Reservas",
    path: "/admin/calendario-reservas",
    rolesPermitidos: [ROLES.ADMINISTRADOR, ROLES.COLABORADOR],
  },
  {
    icon: <FiUsers size={20} />,
    name: "Usuarios",
    path: "/admin/usuarios",
    rolesPermitidos: [ROLES.ADMINISTRADOR],
  },
  {
    icon: <FiUser size={20} />,
    name: "Perfil",
    path: "/admin/perfil",
    rolesPermitidos: [ROLES.ADMINISTRADOR, ROLES.COLABORADOR],
  },
];

const MenuLateral = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const usuario = useAutenticacionStore((state) => state.usuario);

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const menuItemsFiltrados = navItems.filter((item) => {
    if (!item.rolesPermitidos) return true;
    return item.rolesPermitidos.includes(usuario?.id_rol);
  });

  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );
  useEffect(() => {
    let submenuMatched = false;
    menuItemsFiltrados.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu(index);
            submenuMatched = true;
          }
        });
      }
    });
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      if (subMenuRefs.current[openSubmenu]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [openSubmenu]: subMenuRefs.current[openSubmenu]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index) => {
    setOpenSubmenu((prevOpenSubmenu) => (prevOpenSubmenu === index ? null : index));
  };

  const renderMenuItems = (items) => (
    <ul className="flex flex-col gap-1">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <>
              <button
                onClick={() => handleSubmenuToggle(index)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 group ${
                  openSubmenu === index || nav.subItems.some(subItem => isActive(subItem.path))
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                } ${
                  !isExpanded && !isHovered
                    ? "justify-center"
                    : "justify-start"
                }`}
              >
                <span
                  className={`flex items-center justify-center transition-colors duration-300 ${
                    openSubmenu === index || nav.subItems.some(subItem => isActive(subItem.path))
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="ml-3 font-medium text-sm">{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <FiChevronDown
                    className={`ml-auto w-4 h-4 transition-transform duration-300 ${
                      openSubmenu === index
                        ? "rotate-180 text-blue-500 dark:text-blue-400"
                        : "text-gray-400"
                    }`}
                  />
                )}
              </button>
              
              {(isExpanded || isHovered || isMobileOpen) && (
                <div
                  ref={(el) => {
                    subMenuRefs.current[index] = el;
                  }}
                  className="overflow-hidden transition-all duration-300"
                  style={{
                    height:
                      openSubmenu === index
                        ? `${subMenuHeight[index] || 0}px`
                        : "0px",
                  }}
                >
                  <ul className="pl-14 pt-1 space-y-1">
                    {nav.subItems.map((subItem) => (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          className={`block px-3 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                            isActive(subItem.path)
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 group ${
                  isActive(nav.path)
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                } ${
                  !isExpanded && !isHovered
                    ? "justify-center"
                    : "justify-start"
                }`}
              >
                <span
                  className={`flex items-center justify-center transition-colors duration-300 ${
                    isActive(nav.path)
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="ml-3 font-medium text-sm">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 dark:border-gray-800
        ${
          isExpanded || isMobileOpen
            ? "w-72.5" //"w-[290px.]"
            : isHovered
            ? "w-72.5" //w-[290px]"
            : "w-[90px]"  
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src={Nombre}
                alt="Logo"
                width={160}
                height={50}
              />
              <img
                className="hidden dark:block"
                src={Nombre}
                alt="Logo"
                width={160}
                height={50}
              />
            </>
          ) : (
            <img
              src={Logo}
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-5 text-gray-500 dark:text-gray-400 font-semibold tracking-wider ${
                  !isExpanded && !isHovered
                    ? "justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menú Principal"
                ) : (
                  <FiMoreHorizontal className="size-6" />
                )}
              </h2>
              {renderMenuItems(menuItemsFiltrados)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default MenuLateral;