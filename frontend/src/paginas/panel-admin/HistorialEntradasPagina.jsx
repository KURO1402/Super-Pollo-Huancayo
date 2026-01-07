import { MdHistory } from "react-icons/md";
import { useEffect, useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { Tabla } from "../../componentes/ui/tabla/Tabla";
import { BarraBusqueda } from "../../componentes/busqueda-filtros/BarraBusqueda"; 
import { Paginacion } from "../../componentes/ui/tabla/Paginacion";
import Modal from "../../componentes/ui/modal/Modal";
import { useBusqueda } from "../../hooks/useBusqueda"; 
import { usePaginacion } from "../../hooks/usePaginacion";
import { useModal } from "../../hooks/useModal";
import { FilaEntrada } from "../../componentes/panel-admin/stock/FilaEntrada";
import { listarMovimientosServicio } from "../../servicios/movientosStockServicio";
import { ModalMovimientoStock } from "../../componentes/panel-admin/stock/ModalMovimientoStock";

const HistorialEntradasPagina = () => {
  const { 
    paginaActual, 
    setPaginaActual, 
    itemsPorPagina, 
    setItemsPorPagina, 
    paginar 
  } = usePaginacion(5);

  const { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda } = useBusqueda(); 
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const modalMovimientoStock = useModal(false);

  const obtenerMovimientos = async () => {
    try {
      setCargando(true);
      const data = await listarMovimientosServicio();
      const movimientosConId = data.map((mov, index) => ({
        ...mov,
        idMovimientoStock: `mov-${index}-${Date.now()}`,
        idMovimiento: `mov-${index}-${Date.now()}`
      }));

      setMovimientos(movimientosConId);
    } catch (error) {

    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerMovimientos();
  }, []);

  const entradas = movimientos.filter(mov => mov.nombreMovimiento === 'entrada');

  const handleMovimientoStock = () => {
    modalMovimientoStock.abrir();
  };

  const handleMovimientoCreado = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await obtenerMovimientos();
      
      modalMovimientoStock.cerrar();
    } catch (error) {
      
    }
  };

  let filtrados = filtrarPorBusqueda(entradas, [
    "nombreInsumo",
    "cantidadMovimiento",
    "detalleMovimiento",
    "nombreUsuario"
  ]);

  const { datosPaginados, totalPaginas } = paginar(filtrados);

  const handleCambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  const handleCambiarItemsPorPagina = (nuevoItemsPorPagina) => {
    setItemsPorPagina(nuevoItemsPorPagina);
  };

  const filasEntradas = datosPaginados.map((entrada) => (
    <FilaEntrada 
      key={entrada.idMovimientoStock} 
      entrada={entrada}
    />
  ));

  return (
    <div className="p-2">
      <div className="mb-4">
        <div className="mb-4 flex items-center">
          <MdHistory className="text-3xl text-green-500 dark:text-green-400 mr-2"/>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Historial de Entradas</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">Registro de compras e ingresos de insumos</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="md:col-span-2">
          <BarraBusqueda
            valor={terminoBusqueda} 
            onChange={setTerminoBusqueda}
            placeholder="Buscar por insumo, ID movimiento o cantidad..."
          />
        </div>
        <button 
          onClick={handleMovimientoStock}
          className="bg-transparent hover:bg-green-500 text-green-600 hover:text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-sm border-2 border-green-500 hover:border-green-600"
        >
          <BsPlusLg className="text-lg flex-shrink-0" />
          <span className="truncate">Nueva entrada</span>
        </button>
      </div>

      {cargando ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Cargando entradas...</p>
        </div>
      ) : (
        <>
          <Tabla
            encabezados={["Insumo", "Cantidad", "Fecha", "Hora", "Usuario", "Detalle"]}
            registros={filasEntradas}
          /> 
          
          {datosPaginados.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {entradas.length === 0 ? "No hay entradas registradas" : "No se encontraron entradas que coincidan con la búsqueda"}
            </div>
          )}
          
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            alCambiarPagina={handleCambiarPagina}
            itemsPorPagina={itemsPorPagina}
            alCambiarItemsPorPagina={handleCambiarItemsPorPagina}
            mostrarSiempre={true}
          />
        </>
      )}
      
      <Modal
        estaAbierto={modalMovimientoStock.estaAbierto}
        onCerrar={modalMovimientoStock.cerrar}
        titulo="Registrar Movimiento de Stock"
        tamaño="md"
        mostrarHeader={true}
        mostrarFooter={false}
      >
        <ModalMovimientoStock 
          onClose={modalMovimientoStock.cerrar}
          onGuardar={handleMovimientoCreado}
        />
      </Modal>
    </div>
  );
};

export default HistorialEntradasPagina;