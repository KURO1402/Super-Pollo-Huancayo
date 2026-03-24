import { useState, useCallback, useEffect, useRef } from 'react';
import { obtenerCajasCerradasServicio, obtenerArqueosPorCajaServicio, obtenerMovimientosPorCajaServicio } from '../servicios/gestionCajaServicio';

export const useHistorialCajas = () => {
  const [cajasCerradas, setCajasCerradas] = useState([]);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const [paginaActual, setPaginaActual] = useState(1);
  const [itemsPorPagina, setItemsPorPagina] = useState(5);
  const [loadingCajas, setLoadingCajas] = useState(false);
  const [filtrosActivos, setFiltrosActivos] = useState({});
  
  const [arqueosCaja, setArqueosCaja] = useState([]);
  const [movimientosCaja, setMovimientosCaja] = useState([]);
  const [loadingArqueos, setLoadingArqueos] = useState(false);
  const [loadingMovimientos, setLoadingMovimientos] = useState(false);

  const isMounted = useRef(true);
  const llamadaEnProceso = useRef(false);

  const obtenerCajasCerradas = useCallback(async (filtros = {}) => {
    if (llamadaEnProceso.current) return;
    
    llamadaEnProceso.current = true;
    setLoadingCajas(true);
    
    try {
      const offset = (paginaActual - 1) * itemsPorPagina;

      const respuesta = await obtenerCajasCerradasServicio({
        limit: itemsPorPagina,
        offset,
        fechaInicio: filtros.fechaInicio,
        fechaFin: filtros.fechaFin,
        estado: filtros.estado
      });

      if (isMounted.current) {
        setCajasCerradas(respuesta.cajas || []);
        setTotalRegistros(respuesta.total || 0);
      }
    } catch (error) {
      if (isMounted.current) {
        setCajasCerradas([]);
        setTotalRegistros(0);
      }
    } finally {
      if (isMounted.current) {
        setLoadingCajas(false);
      }
      llamadaEnProceso.current = false;
    }
  }, [paginaActual, itemsPorPagina]);

  useEffect(() => {
    let timeoutId;
    
    timeoutId = setTimeout(() => {
      obtenerCajasCerradas(filtrosActivos);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [paginaActual, itemsPorPagina, filtrosActivos, obtenerCajasCerradas]);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const cambiarPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
  };

  const cambiarItemsPorPagina = (nuevosItems) => {
    setItemsPorPagina(nuevosItems);
    setPaginaActual(1);
  };

  const aplicarFiltros = (nuevosFiltros) => {
    setFiltrosActivos(nuevosFiltros);
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    setFiltrosActivos({});
    setPaginaActual(1);
  };

  const cargarArqueosCaja = async (idCaja) => {
    if (!idCaja) return [];
    
    setLoadingArqueos(true);
    try {
      const respuesta = await obtenerArqueosPorCajaServicio(idCaja);
      setArqueosCaja(respuesta || []);
      return respuesta;
    } catch (error) {
      setArqueosCaja([]);
      return [];
    } finally {
      setLoadingArqueos(false);
    }
  };

  const cargarMovimientosCaja = async (idCaja) => {
    if (!idCaja) return [];
    
    setLoadingMovimientos(true);
    try {
      const respuesta = await obtenerMovimientosPorCajaServicio(idCaja);
      setMovimientosCaja(respuesta || []);
      return respuesta;
    } catch (error) {
      setMovimientosCaja([]);
      return [];
    } finally {
      setLoadingMovimientos(false);
    }
  };
  const cargarDetallesCompletosCaja = async (idCaja) => {
    await Promise.all([
      cargarArqueosCaja(idCaja),
      cargarMovimientosCaja(idCaja)
    ]);
  };

  const formatDate = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    try {
      return new Date(fecha).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    } catch {
      return 'Fecha inválida';
    }
  };

  const formatCurrency = (monto) => {
    if (monto === undefined || monto === null) return 'S/ 0.00';
    try {
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2
      }).format(monto);
    } catch {
      return `S/ ${monto.toFixed(2)}`;
    }
  };

  const formatHora = (hora) => {
  if (!hora) return "—";
  try {
    const [hh, mm] = hora.split(":");
    const horas = parseInt(hh);
    const ampm = horas >= 12 ? "PM" : "AM";
    const hora12 = horas % 12 || 12;
    return `${hora12}:${mm} ${ampm}`;
  } catch {
    return hora;
  }
};

  return {
    cajasCerradas,
    totalRegistros,
    paginaActual,
    itemsPorPagina,
    loadingCajas,
    arqueosCaja,
    movimientosCaja,
    loadingArqueos,
    loadingMovimientos,
    filtrosActivos,
    cambiarPagina,
    cambiarItemsPorPagina,
    obtenerCajasCerradas,
    aplicarFiltros,
    limpiarFiltros,
    cargarArqueosCaja,
    cargarMovimientosCaja,
    cargarDetallesCompletosCaja,
    formatDate,
    formatCurrency,
    formatHora
  };
};