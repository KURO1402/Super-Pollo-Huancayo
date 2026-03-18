import { MdOutlineTimer } from 'react-icons/md';

const ModalInactividad = ({ visible, segundosRestantes, onSeguir, onCerrarSesion }) => {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-gray-200 dark:border-gray-700">
                <div className="text-center">
                    <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MdOutlineTimer className="text-3xl text-yellow-500 dark:text-yellow-400" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        ¿Sigues ahí?
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
                        Tu sesión cerrará por inactividad en
                    </p>
                    <p className="text-4xl font-bold text-yellow-500 mb-6">
                        {segundosRestantes}s
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onCerrarSesion}
                            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Cerrar sesión
                        </button>
                        <button
                            onClick={onSeguir}
                            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalInactividad;