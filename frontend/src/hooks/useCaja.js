import mostrarAlerta from "../utilidades/toastUtilidades";
import { useCajaStore } from "../store/useCajaStore";
import { 
  abrirCajaServicio,
  cerrarCajaServicio,
  registrarIngresoServicio,
  registrarEgresoServicio,
  registrarArqueoServicio,
  obtenerMovimientosPorCajaServicio
} from '../servicios/gestionCajaServicio';

export const useCaja = () => {
  const { 
    caja,
    loading,
    error,
    setCajaCompleta,
    setMovimientos,
    abrirCaja,
    cerrarCaja,
    setLoading,
    setError,
    limpiarError,
  } = useCajaStore();

    const cargarDatosCaja = async (idCajaParam) => {
    try {
      setLoading(true);
      limpiarError();

      const idCajaActual = idCajaParam || caja.idCaja;

      if (idCajaActual && caja.estado === "abierta") {
        const movimientosResponse = await obtenerMovimientosPorCajaServicio(idCajaActual);

        const movimientosData = Array.isArray(movimientosResponse)
          ? movimientosResponse
          : [];

        setMovimientos(movimientosData);
      } else {
        setMovimientos([]);
      }
    } catch (error) {
      setError("Error al cargar movimientos: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAbrirCaja = async (montoInicial) => {
    try {
      setLoading(true);
      limpiarError();

      const monto = Number(montoInicial);
      if (isNaN(monto) || monto < 0) {
        throw new Error("El monto inicial debe ser un número válido y positivo");
      }

      const response = await abrirCajaServicio({ montoInicial: monto });

      const { idCaja } = response;

      abrirCaja({
        idCaja,
        saldoInicial: monto,
        saldoActual: monto,
      });

      await cargarDatosCaja();

      return response;
    } catch (error) {
      setError(error.message || "Error al abrir caja");
    } finally {
      setLoading(false);
    }
  };

  const handleCerrarCaja = async () => {
    try {
      setLoading(true);
      limpiarError();

      const response = await cerrarCajaServicio();
      
      if (response.ok) {
        cerrarCaja();
        return response;
      }

    } catch (error) {
      mostrarAlerta.error('Arqueo requerido antes de cerrar');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarIngreso = async (data) => {
    try {
      setLoading(true);
      limpiarError();

      const movimientoData = {
        monto: Number(data.monto),
        descripcion: data.descripcion,
      };

      const response = await registrarIngresoServicio(movimientoData);
      
      if (response.ok) {
        await cargarDatosCaja(caja.idCaja);
        return response;
      } else {
        throw new Error(response.mensaje || response.message || 'Error al registrar ingreso');
      }

    } catch (error) {
      setError(error.message || 'Error al registrar ingreso');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarEgreso = async (data) => {
    try {
      setLoading(true);
      limpiarError();

      const movimientoData = {
        monto: Number(data.monto),
        descripcion: data.descripcion,
      };

      const response = await registrarEgresoServicio(movimientoData);
      
      if (response.ok) {
         await cargarDatosCaja(caja.idCaja); 
        return response;
      }

    } catch (error) {
      setError(error.message || 'Error al registrar egreso');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleRegistrarArqueo = async (data) => {
    try {
      setLoading(true);
      limpiarError();

      const response = await registrarArqueoServicio(data);
      
      if (response.ok) { 
        await cargarDatosCaja();
        return response;
      }

    } catch (error) {
      setError(error.message || 'Error al registrar arqueo');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    caja,
    loading,
    error,
    cargarDatosCaja,
    handleAbrirCaja,
    handleCerrarCaja,
    handleRegistrarIngreso,
    handleRegistrarEgreso,
    handleRegistrarArqueo,
    limpiarError,
    cajaAbierta: caja.estado === "abierta"
  };
};