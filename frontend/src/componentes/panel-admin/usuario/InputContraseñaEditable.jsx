import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { GoPencil, GoCheck } from "react-icons/go";

const InputContraseñaEditable = ({ usuario, setUsuario }) => {
  const [mostrarClave, setMostrarClave] = useState(false); 
  const [editandoClave, setEditandoClave] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-2 w-full">
        <div className="relative w-full">
          <input
            type={mostrarClave ? "text" : "password"}
            value={usuario.clave}
            onChange={(e) =>
              setUsuario({ ...usuario, clave: e.target.value })
            }
            readOnly={!editandoClave}
            className={`w-full h-11 rounded-lg border 
                        ${
                          editandoClave
                            ? "border-blue-400 bg-white dark:bg-gray-800"
                            : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50"
                        }
                        px-4 pr-10 text-sm text-gray-900 dark:text-white 
                        placeholder-gray-400 focus:outline-hidden 
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                        transition`}
          />
          <button
            type="button"
            onClick={() => setMostrarClave(!mostrarClave)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            {mostrarClave ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>
        <button
          onClick={() => {
            setEditandoClave(!editandoClave);
          }}
          className={`px-2 py-2 rounded-xl border-transparent transition-colors duration-200 cursor-pointer 
                      ${
                        editandoClave
                          ? "border-1 hover:text-blue-700 hover:border-blue-700 text-white"
                          : "hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                      }`}
        >
          {editandoClave ? (
            <GoCheck className="text-lg" />
          ) : (
            <GoPencil className="text-lg" />
          )}
        </button>
      </div>
    </div>
  );
};

export default InputContraseñaEditable;