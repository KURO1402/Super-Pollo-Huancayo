import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaCalendarPlus, 
  FaCalendarCheck, 
  FaSignOutAlt,
  FaChevronDown
} from 'react-icons/fa';
import { useAutenticacionStore } from '../store/useAutenticacionStore';
import { mostrarAlerta } from '../utilidades/toastUtilidades';
const DropdownUsuario = ({ usuario, mobile = false }) => {
  const [dropdownAbierto, setDropdownAbierto] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const logout = useAutenticacionStore((state) => state.logout);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAbierto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    mostrarAlerta.exito('Sesión cerrada correctamente');
    navigate('/');
    setDropdownAbierto(false);
  };

  const opciones = [
    {
      icono: <FaUser className="w-4 h-4" />,
      texto: 'Mi Perfil',
      ruta: '/usuario/perfil',
      onClick: () => setDropdownAbierto(false)
    },
    {
      icono: <FaCalendarPlus className="w-4 h-4" />,
      texto: 'Nueva Reservación',
      ruta: '/usuario/nueva-reservacion',
      onClick: () => setDropdownAbierto(false)
    },
    {
      icono: <FaCalendarCheck className="w-4 h-4" />,
      texto: 'Mis Reservacines',
      ruta: '/usuario/mis-reservaciones',
      onClick: () => setDropdownAbierto(false)
    },
    {
      icono: <FaSignOutAlt className="w-4 h-4" />,
      texto: 'Cerrar Sesión',
      onClick: handleLogout,
      esCerrarSesion: true
    }
  ];

  if (mobile) {
    return (
      <div className="w-full">
        <div className="text-gray-100 text-center mb-4">
          <p className="font-semibold">{usuario.nombresUsuario} {usuario.apellidosUsuario}</p>
          <p className="text-sm text-gray-300">{usuario.correoUsuario}</p>
        </div>
        <div className="space-y-2">
          {opciones.map((opcion, index) => (
            opcion.ruta ? (
              <Link
                key={index}
                to={opcion.ruta}
                onClick={opcion.onClick}
                className="flex items-center space-x-3 px-4 py-3 text-gray-100 hover:bg-azul-primario rounded-lg transition-colors"
              >
                {opcion.icono}
                <span className="font-medium">{opcion.texto}</span>
              </Link>
            ) : (
              <button
                key={index}
                onClick={opcion.onClick}
                className={`flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg transition-colors ${
                  opcion.esCerrarSesion 
                    ? 'text-red-400 hover:bg-red-500 hover:text-white' 
                    : 'text-gray-100 hover:bg-azul-primario'
                }`}
              >
                {opcion.icono}
                <span className="font-medium">{opcion.texto}</span>
              </button>
            )
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownAbierto(!dropdownAbierto)}
        className="flex items-center cursor-pointer space-x-2 px-4 py-2 text-gray-100 hover:bg-azul-primario rounded-lg transition-colors"
      >
        <div className="flex items-center space-x-2">
          <FaUser className="w-5 h-5" />
          <span className="font-medium max-w-32 truncate">
            {usuario.nombresUsuario}
          </span>
        </div>
        <FaChevronDown 
          className={`w-3 h-3 transition-transform ${
            dropdownAbierto ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {dropdownAbierto && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
          {/* Header del dropdown */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <p className="font-semibold text-gray-900 dark:text-white truncate">
              {usuario.nombresUsuario} {usuario.apellidosUsuario}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {usuario.correoUsuario}
            </p>
          </div>

          <div className="py-1">
            {opciones.map((opcion, index) => (
              opcion.ruta ? (
                <Link
                  key={index}
                  to={opcion.ruta}
                  onClick={opcion.onClick}
                  className="flex items-center space-x-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {opcion.icono}
                  <span>{opcion.texto}</span>
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={opcion.onClick}
                  className={`flex items-center space-x-3 px-4 py-2 w-full text-left transition-colors cursor-pointer ${
                    opcion.esCerrarSesion 
                      ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {opcion.icono}
                  <span>{opcion.texto}</span>
                </button>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownUsuario;