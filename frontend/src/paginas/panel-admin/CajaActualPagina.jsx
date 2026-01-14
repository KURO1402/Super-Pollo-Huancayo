import { useEffect } from "react";
import { usePaginacion } from "../../hooks/usePaginacion";
import { useModal } from "../../hooks/useModal";
import { useCaja } from "../../hooks/useCaja";
import ResumenCaja from "../../componentes/panel-admin/caja/ResumenCaja";
import AccionesCaja from "../../componentes/panel-admin/caja/AccionesCaja";
import TablaMovimientos from "../../componentes/panel-admin/caja/TablaMovimientos";
import ModalAbrirCaja from "../../componentes/panel-admin/caja/ModalAbrirCaja";
import ModalIngreso from "../../componentes/panel-admin/caja/ModalIngreso";
import ModalEgreso from "../../componentes/panel-admin/caja/ModalEgreso";
import ModalArqueo from "../../componentes/panel-admin/caja/ModalArqueo";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const CajaActualPagina = () => {
  const {
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
    cajaAbierta
  } = useCaja();

  const { paginaActual, setPaginaActual, paginar } = usePaginacion(5);
  const modalAbrirCaja = useModal();
  const modalIngreso = useModal();
  const modalEgreso = useModal();
  const modalArqueo = useModal();

  useEffect(() => {
    if (cajaAbierta && caja.idCaja) {
      cargarDatosCaja();
    }
  }, [cajaAbierta, caja.idCaja]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const onAbrirCaja = async (data) => {
    try {
      await handleAbrirCaja(data.montoInicial);
      modalAbrirCaja.cerrar();
    } catch (error) {

    }
  };

  const onCerrarCaja = async () => {
    try {
      await handleCerrarCaja();
      mostrarAlerta.exito("Caja cerrada con éxito")
    } catch (error) {

    }
  };

  const onRegistrarIngreso = async (data) => {
    try {
      await handleRegistrarIngreso(data);
      modalIngreso.cerrar();
    } catch (error) {

    }
  };

  const onRegistrarEgreso = async (data) => {
    try {
      await handleRegistrarEgreso(data);
      modalEgreso.cerrar();
    } catch (error) {

    }
  };

  const onRegistrarArqueo = async (data) => {
    try {
      await handleRegistrarArqueo(data);
      modalArqueo.cerrar();
    } catch (error) {

    }
  };

  const { datosPaginados: movimientosPaginados, totalPaginas } = paginar(caja.movimientos);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-2 space-y-6">

      <ResumenCaja
        caja={caja}
        formatCurrency={formatCurrency}
        onAbrirCaja={modalAbrirCaja.abrir}
        onCerrarCaja={onCerrarCaja}
        loading={loading}
      />

      <AccionesCaja
        cajaAbierta={cajaAbierta}
        onIngreso={modalIngreso.abrir}
        onEgreso={modalEgreso.abrir}
        onArqueo={modalArqueo.abrir}
        loading={loading}
      />

      <TablaMovimientos
        movimientos={movimientosPaginados}
        formatCurrency={formatCurrency}
        paginaActual={paginaActual}
        totalPaginas={totalPaginas}
        onCambiarPagina={setPaginaActual}
        loading={loading}
      />

      <ModalAbrirCaja
        estaAbierto={modalAbrirCaja.estaAbierto}
        onCerrar={modalAbrirCaja.cerrar}
        onAbrirCaja={onAbrirCaja}
        loading={loading}
      />

      <ModalIngreso
        estaAbierto={modalIngreso.estaAbierto}
        onCerrar={modalIngreso.cerrar}
        onRegistrarIngreso={onRegistrarIngreso}
        loading={loading}
      />

      <ModalEgreso
        estaAbierto={modalEgreso.estaAbierto}
        onCerrar={modalEgreso.cerrar}
        onRegistrarEgreso={onRegistrarEgreso}
        loading={loading}
      />

      <ModalArqueo
        estaAbierto={modalArqueo.estaAbierto}
        onCerrar={modalArqueo.cerrar}
        onRegistrarArqueo={onRegistrarArqueo}
        saldoActual={caja.saldoActual}
        loading={loading}
      />
    </div>
  );
};

export default CajaActualPagina;