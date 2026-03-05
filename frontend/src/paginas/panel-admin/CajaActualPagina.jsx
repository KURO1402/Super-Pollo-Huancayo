import { useEffect } from "react";
import { useCajaStore } from "../../store/useCajaStore";
import { useModal } from "../../hooks/useModal";
import { useConfirmacion } from "../../hooks/useConfirmacion";
import ResumenCaja from "../../componentes/panel-admin/caja/ResumenCaja";
import AccionesCaja from "../../componentes/panel-admin/caja/AccionesCaja";
import TablaMovimientos from "../../componentes/panel-admin/caja/TablaMovimientos";
import ModalAbrirCaja from "../../componentes/panel-admin/caja/ModalAbrirCaja";
import ModalIngreso from "../../componentes/panel-admin/caja/ModalIngreso";
import ModalEgreso from "../../componentes/panel-admin/caja/ModalEgreso";
import ModalArqueo from "../../componentes/panel-admin/caja/ModalArqueo";
import { ModalConfirmacion } from "../../componentes/ui/modal/ModalConfirmacion";
import mostrarAlerta from "../../utilidades/toastUtilidades";

const CajaActualPagina = () => {
  const {
    cajaActual,
    movimientos,
    totalMovimientos,
    cargando,
    rehidratando, // ✅ NUEVO
    error,
    cargarMovimientos,
    abrirCaja,
    cerrarCaja,
    registrarIngreso,
    registrarEgreso,
    registrarArqueo,
    paginaActual,
    setPagina,
    limite,
    setLimite,
    filtros,
    setFiltros,
    limpiarFiltros,
    limpiarError,
    rehidratarCaja
  } = useCajaStore();

  const modalAbrirCaja = useModal();
  const modalIngreso = useModal();
  const modalEgreso = useModal();
  const modalArqueo = useModal();

  const {
    confirmacionVisible,
    mensajeConfirmacion,
    tituloConfirmacion,
    tipoConfirmacion,
    textoConfirmar,
    textoCancelar,
    solicitarConfirmacion,
    ocultarConfirmacion,
    confirmarAccion
  } = useConfirmacion();

  const cajaAbierta = cajaActual.estado === 'abierta';

  useEffect(() => {
    rehidratarCaja();
  }, []);

  useEffect(() => {
    if (cajaAbierta) {
      cargarMovimientos();
    }
  }, [cajaAbierta, cajaActual.id_caja, paginaActual, limite, filtros]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount || 0);
  };

  const onAbrirCaja = async (data) => {
    try {
      await abrirCaja({
        montoInicial: data.montoInicial,
      });
      modalAbrirCaja.cerrar();
      mostrarAlerta.exito("Caja abierta con éxito");
    } catch (error) {
      mostrarAlerta.error("Error al abrir caja");
    }
  };

  const onSolicitarCerrarCaja = () => {
    solicitarConfirmacion(
      `¿Estás seguro de cerrar la caja? El saldo actual es ${formatCurrency(cajaActual.saldoActual)}`,
      async () => {
        try {
          await cerrarCaja();
          mostrarAlerta.exito("Caja cerrada con éxito");
        } catch (error) {
          console.error("Error al cerrar caja:", error);
          mostrarAlerta.error("Primero debe hacer al menos un arqueo de caja");
        }
      },
      {
        titulo: 'Cerrar Caja',
        tipo: 'advertencia',
        textoConfirmar: 'Cerrar',
        textoCancelar: 'Cancelar',
      }
    );
  };

  const onRegistrarIngreso = async (data) => {
    try {
      await registrarIngreso({
        ...data,
        usuario: 'Usuario Actual'
      });
      modalIngreso.cerrar();
      mostrarAlerta.exito("Ingreso registrado con éxito");
    } catch (error) {
      mostrarAlerta.error("Error al registrar ingreso");
    }
  };

  const onRegistrarEgreso = async (data) => {
    try {
      await registrarEgreso({
        ...data,
        usuario: 'Usuario Actual'
      });
      modalEgreso.cerrar();
      mostrarAlerta.exito("Egreso registrado con éxito");
    } catch (error) {
      mostrarAlerta.error("Error al registrar egreso");
    }
  };

  const onRegistrarArqueo = async (data) => {
    try {
      await registrarArqueo(data);
      modalArqueo.cerrar();
      mostrarAlerta.exito("Arqueo registrado con éxito");
    } catch (error) {
      mostrarAlerta.error(error.message || "Error al registrar arqueo");
    }
  };

  const onCambiarPagina = (nuevaPagina) => {
    setPagina(nuevaPagina);
  };

  const onCambiarLimite = (nuevoLimite) => {
    setLimite(nuevoLimite);
  };

  const onAplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
  };

  const onLimpiarFiltros = () => {
    limpiarFiltros();
  };

  // ✅ Bloquea la UI mientras se verifica el estado real con el backend
  if (rehidratando) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-2 space-y-6">
      <ResumenCaja
        caja={cajaActual}
        formatCurrency={formatCurrency}
        onAbrirCaja={modalAbrirCaja.abrir}
        onCerrarCaja={onSolicitarCerrarCaja}
        cargando={cargando}
      />

      <AccionesCaja
        cajaAbierta={cajaAbierta}
        onIngreso={modalIngreso.abrir}
        onEgreso={modalEgreso.abrir}
        onArqueo={modalArqueo.abrir}
        cargando={cargando}
      />

      <TablaMovimientos
        movimientos={movimientos}
        totalMovimientos={totalMovimientos}
        cargando={cargando}
        formatCurrency={formatCurrency}
        paginaActual={paginaActual}
        limite={limite}
        totalPaginas={Math.ceil(totalMovimientos / limite)}
        onCambiarPagina={onCambiarPagina}
        onCambiarLimite={onCambiarLimite}
        filtros={filtros}
        onAplicarFiltros={onAplicarFiltros}
        onLimpiarFiltros={onLimpiarFiltros}
        cajaAbierta={cajaAbierta}
        cajaEstado={cajaActual.estado}
      />

      <ModalAbrirCaja
        estaAbierto={modalAbrirCaja.estaAbierto}
        onCerrar={modalAbrirCaja.cerrar}
        onAbrirCaja={onAbrirCaja}
        cargando={cargando}
      />

      <ModalIngreso
        estaAbierto={modalIngreso.estaAbierto}
        onCerrar={modalIngreso.cerrar}
        onRegistrarIngreso={onRegistrarIngreso}
        cargando={cargando}
      />

      <ModalEgreso
        estaAbierto={modalEgreso.estaAbierto}
        onCerrar={modalEgreso.cerrar}
        onRegistrarEgreso={onRegistrarEgreso}
        cargando={cargando}
      />

      <ModalArqueo
        estaAbierto={modalArqueo.estaAbierto}
        onCerrar={modalArqueo.cerrar}
        onRegistrarArqueo={onRegistrarArqueo}
        saldoActual={cajaActual.saldoActual}
        cargando={cargando}
      />

      <ModalConfirmacion
        visible={confirmacionVisible}
        onCerrar={ocultarConfirmacion}
        onConfirmar={confirmarAccion}
        titulo={tituloConfirmacion}
        mensaje={mensajeConfirmacion}
        textoConfirmar={textoConfirmar}
        textoCancelar={textoCancelar}
        tipo={tipoConfirmacion}
      />
    </div>
  );
};

export default CajaActualPagina;