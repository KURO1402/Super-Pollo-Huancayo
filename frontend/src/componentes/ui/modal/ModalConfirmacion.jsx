import Modal from "./Modal";

export const ModalConfirmacion = ({
  visible,
  onCerrar,
  onConfirmar,
  titulo = "Confirmar acción",
  mensaje,
  textoConfirmar = "Confirmar",
  textoCancelar = "Cancelar",
  tipo = "default",
}) => {
  const getColorBoton = () => {
    switch (tipo) {
      case "peligro":
        return "bg-red-500 hover:bg-red-600";
      case "exito":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-blue-500 hover:bg-blue-600";
    }
  };

  return (
    <Modal
      estaAbierto={visible}
      onCerrar={onCerrar}
      titulo={titulo}
      tamaño="sm"
      mostrarHeader={true}
      mostrarFooter={true}
      accionesFooter={
        <>
          <button
            onClick={onCerrar}
            className="px-4 py-2 text-gray-700 bg-gray-200 cursor-pointer hover:bg-gray-300 dark:text-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-lg transition-colors"
          >
            {textoCancelar}
          </button>
          <button
            onClick={onConfirmar}
            className={`px-4 py-2 text-white cursor-pointer rounded-lg transition-colors ${getColorBoton()}`}
          >
            {textoConfirmar}
          </button>
        </>
      }
    >
      <div className="text-gray-700 dark:text-gray-300 py-2">
        {mensaje}
      </div>
    </Modal>
  );
};