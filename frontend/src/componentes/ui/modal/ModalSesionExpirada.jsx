import { MdOutlineTimer } from 'react-icons/md';

const ModalSesionExpirada = ({ visible, onCerrar }) => {
  if (!visible) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-gray-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MdOutlineTimer className="text-3xl text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Sesión expirada
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Tu sesión fue cerrada automáticamente por inactividad. Por favor inicia sesión nuevamente.
          </p>
          <button
            onClick={onCerrar}
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSesionExpirada;