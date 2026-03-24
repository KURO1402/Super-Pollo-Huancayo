import { useState, useEffect, useRef, useCallback } from 'react';
import { FiSearch, FiChevronDown, FiX } from 'react-icons/fi';
import { useDebounce } from '../../../hooks/useDebounce';
import { listarInsumoServicio } from '../../../servicios/insumosServicios';

const LIMIT = 10;

const BuscadorInsumo = ({ value, onChange, placeholder = "Buscar insumo..." }) => {
    const [abierto, setAbierto] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [insumos, setInsumos] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hayMas, setHayMas] = useState(true);
    const [cargando, setCargando] = useState(false);
    const [insumoSeleccionado, setInsumoSeleccionado] = useState(null);

    const busquedaDebounced = useDebounce(busqueda, 400);
    const contenedorRef = useRef(null);
    const listaRef = useRef(null);
    const esPrimeraBusqueda = useRef(true);

    useEffect(() => {
        const handleClickFuera = (e) => {
            if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
                setAbierto(false);
            }
        };
        document.addEventListener('mousedown', handleClickFuera);
        return () => document.removeEventListener('mousedown', handleClickFuera);
    }, []);

    const cargarInsumos = useCallback(async (nuevaBusqueda, nuevoOffset, reemplazar = false) => {
        setCargando(true);
        try {
            const respuesta = await listarInsumoServicio({
                limit: LIMIT,
                offset: nuevoOffset,
                insumo: nuevaBusqueda || null,
            });
            const nuevos = respuesta.insumos || [];
            const total = respuesta.cantidad_filas || 0;

            setInsumos(prev => reemplazar ? nuevos : [...prev, ...nuevos]);
            setHayMas(nuevoOffset + LIMIT < total);
            setOffset(nuevoOffset + LIMIT);
        } catch {
            if (reemplazar) setInsumos([]);
            setHayMas(false);
        } finally {
            setCargando(false);
        }
    }, []);

    useEffect(() => {
        if (!abierto) return;
        cargarInsumos(busquedaDebounced, 0, true);
    }, [busquedaDebounced, abierto]);

    const handleScroll = () => {
        if (!listaRef.current || cargando || !hayMas) return;
        const { scrollTop, scrollHeight, clientHeight } = listaRef.current;
        if (scrollHeight - scrollTop - clientHeight < 40) {
            cargarInsumos(busquedaDebounced, offset, false);
        }
    };

    const handleSeleccionar = (insumo) => {
        setInsumoSeleccionado(insumo);
        onChange(insumo);
        setAbierto(false);
        setBusqueda('');
    };

    const handleLimpiar = (e) => {
        e.stopPropagation();
        setInsumoSeleccionado(null);
        onChange(null);
    };

    const handleAbrir = () => {
        setAbierto(true);
        cargarInsumos('', 0, true);
    };

    return (
        <div ref={contenedorRef} className="relative w-full">
            <div
                onClick={handleAbrir}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm cursor-pointer flex items-center justify-between gap-2 focus:ring-2 focus:ring-blue-500"
            >
                <span className={insumoSeleccionado ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                    {insumoSeleccionado ? insumoSeleccionado.nombre_insumo : placeholder}
                </span>
                <div className="flex items-center gap-1">
                    {insumoSeleccionado && (
                        <button onClick={handleLimpiar} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <FiX size={14} />
                        </button>
                    )}
                    <FiChevronDown size={14} className={`text-gray-400 transition-transform ${abierto ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {abierto && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
                    <div className="p-2 border-b border-gray-200 dark:border-gray-600">
                        <div className="relative">
                            <FiSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                autoFocus
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Escribir para buscar..."
                                className="w-full pl-7 pr-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <ul
                        ref={listaRef}
                        onScroll={handleScroll}
                        className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent"
                    >
                        {insumos.length === 0 && !cargando && (
                            <li className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No se encontraron insumos
                            </li>
                        )}
                        {insumos.map((insumo) => (
                            <li
                                key={insumo.id_insumo}
                                onClick={() => handleSeleccionar(insumo)}
                                className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/30 ${value?.id_insumo === insumo.id_insumo
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                        : 'text-gray-900 dark:text-white'
                                    }`}
                            >
                                {insumo.nombre_insumo}
                            </li>
                        ))}
                        {cargando && (
                            <li className="px-3 py-2 text-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mx-auto"></div>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default BuscadorInsumo;