import { useState, useEffect } from 'react';
import { BsBoxSeam } from 'react-icons/bs';
import { MdOutlineInventory2 } from 'react-icons/md';
import { FiRefreshCw } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Tabla } from '../../componentes/ui/tabla/Tabla';
import { BarraBusqueda } from '../../componentes/busqueda-filtros/BarraBusqueda';
import { Paginacion } from '../../componentes/ui/tabla/Paginacion';
import { ModalConfirmacion } from '../../componentes/ui/modal/ModalConfirmacion';
import { useConfirmacion } from '../../hooks/useConfirmacion';
import { usePaginacion } from '../../hooks/usePaginacion';
import { useBusqueda } from '../../hooks/useBusqueda';
import { obtenerProductosDeshabilitadosServicio, habilitarProductoServicio } from '../../servicios/productoServicios';
import mostrarAlerta from '../../utilidades/toastUtilidades';

const ProductosDeshabilitadosPagina = () => {
    const navigate = useNavigate();
    const { terminoBusqueda, setTerminoBusqueda } = useBusqueda();

    const [productos, setProductos] = useState([]);
    const [total, setTotal] = useState(0);
    const [cargando, setCargando] = useState(false);
    const [mostrarSpinner, setMostrarSpinner] = useState(false);
    const [paginaActual, setPaginaActual] = useState(1);
    const [limit, setLimit] = useState(10);

    const confirmacionHabilitar = useConfirmacion();

    const paginacion = usePaginacion({
        paginaActual,
        limite: limit,
        total,
        onPagina: setPaginaActual,
        onLimite: (nuevoLimite) => { setLimit(nuevoLimite); setPaginaActual(1); },
    });

    const cargarProductos = async (nombre = terminoBusqueda) => {
        const offset = (paginaActual - 1) * limit;
        setCargando(true);
        try {
            const respuesta = await obtenerProductosDeshabilitadosServicio({
                limit,
                offset,
                nombre: nombre || undefined,
            });
            setProductos(respuesta.productos || []);
            setTotal(respuesta.cantidad_filas || 0);
        } catch (error) {
            if (error?.status === 404) {
                setProductos([]);
                setTotal(0);
            } else {
                mostrarAlerta.error(error.message || 'Error al cargar productos');
            }
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarProductos();
    }, [paginaActual, limit, terminoBusqueda]);

    // Spinner con delay
    useEffect(() => {
        let timer;
        if (cargando) {
            timer = setTimeout(() => setMostrarSpinner(true), 300);
        } else {
            setMostrarSpinner(false);
        }
        return () => clearTimeout(timer);
    }, [cargando]);

    const handleHabilitar = (producto) => {
        confirmacionHabilitar.solicitarConfirmacion(
            `¿Estás seguro de volver a habilitar "${producto.nombre_producto}"? Aparecerá nuevamente en el menú.`,
            async () => {
                try {
                    await habilitarProductoServicio(producto.id_producto);
                    mostrarAlerta.exito('Producto habilitado correctamente');
                    cargarProductos();
                } catch (error) {
                    mostrarAlerta.error(error.message || 'Error al habilitar el producto');
                }
            },
            {
                titulo: "Habilitar Producto",
                tipo: "info",
                textoConfirmar: "Sí, habilitar",
                textoCancelar: "Cancelar"
            }
        );
    };

    const filasProductos = productos.map((producto) => (
        <tr key={producto.id_producto} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
            <td className="px-4 py-3">
                <div className="font-semibold text-gray-900 dark:text-white">
                    {producto.nombre_producto}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                    {producto.descripcion_producto || 'Sin descripción'}
                </div>
            </td>
            <td className="px-4 py-3">
                <span className="font-semibold text-green-600 dark:text-green-400">
                    S/{parseFloat(producto.precio_producto).toFixed(2)}
                </span>
            </td>
            <td className="px-4 py-3">
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                    {producto.nombre_categoria}
                </span>
            </td>
            <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    producto.usa_insumos === 'Sí'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                    {producto.usa_insumos === 'Sí' ? 'Con insumos' : 'Sin insumos'}
                </span>
            </td>
            <td className="px-4 py-3">
                <button
                    onClick={() => handleHabilitar(producto)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-600 hover:text-white bg-green-50 hover:bg-green-600 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-600 dark:hover:text-white border border-green-200 dark:border-green-800 rounded-lg transition-colors cursor-pointer"
                    title="Habilitar producto"
                >
                    <FiRefreshCw size={14} />
                    Habilitar
                </button>
            </td>
        </tr>
    ));

    return (
        <div className="p-4">
            <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <MdOutlineInventory2 className="text-2xl text-gray-500 dark:text-gray-400" />
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Productos Deshabilitados
                        </h1>
                    </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm ml-8">
                    {total > 0
                        ? `${total} producto${total !== 1 ? 's' : ''} deshabilitado${total !== 1 ? 's' : ''}`
                        : 'Sin productos deshabilitados'}
                </p>
            </div>

            {/* Filtros */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                    <BarraBusqueda
                        valor={terminoBusqueda}
                        onChange={setTerminoBusqueda}
                        placeholder="Buscar por nombre..."
                    />
                </div>
            </div>

            {/* Contenido */}
            {mostrarSpinner ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : productos.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <BsBoxSeam className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                        {terminoBusqueda
                            ? 'No se encontraron productos con ese criterio'
                            : 'No hay productos deshabilitados'}
                    </p>
                </div>
            ) : (
                <>
                    <Tabla
                        encabezados={["PRODUCTO", "PRECIO", "CATEGORÍA", "USA INSUMOS", "ACCIÓN"]}
                        registros={filasProductos}
                    />
                    {total > 0 && (
                        <div className="mt-6">
                            <Paginacion {...paginacion} />
                        </div>
                    )}
                </>
            )}

            <ModalConfirmacion
                visible={confirmacionHabilitar.confirmacionVisible}
                onCerrar={confirmacionHabilitar.ocultarConfirmacion}
                onConfirmar={confirmacionHabilitar.confirmarAccion}
                titulo={confirmacionHabilitar.tituloConfirmacion}
                mensaje={confirmacionHabilitar.mensajeConfirmacion}
                tipo={confirmacionHabilitar.tipoConfirmacion}
                textoConfirmar={confirmacionHabilitar.textoConfirmar}
                textoCancelar={confirmacionHabilitar.textoCancelar}
            />
        </div>
    );
};

export default ProductosDeshabilitadosPagina;