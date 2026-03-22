export const BadgeSunat = ({ estado }) => {
    const getEstiloEstado = (estado) => {
        switch (estado) {
            case 'pendiente':
                return {
                    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
                    text: 'text-yellow-800 dark:text-yellow-400',
                    etiqueta: 'Pendiente'
                };
            case 'enviado_sunat':
                return {
                    bg: 'bg-blue-100 dark:bg-blue-900/30',
                    text: 'text-blue-800 dark:text-blue-400',
                    etiqueta: 'Enviando'
                };
            case 'aceptado':
                return {
                    bg: 'bg-green-100 dark:bg-green-900/30',
                    text: 'text-green-800 dark:text-green-400',
                    etiqueta: 'Aceptado'
                };
            case 'rechazado':
                return {
                    bg: 'bg-red-100 dark:bg-red-900/30',
                    text: 'text-red-800 dark:text-red-400',
                    etiqueta: 'Rechazado'
                };
            case 'enviado':
                return {
                    bg: 'bg-green-100 dark:bg-green-900/30',
                    text: 'text-green-800 dark:text-green-400',
                    etiqueta: 'Aceptado'
                };
            default:
                return {
                    bg: 'bg-gray-100 dark:bg-gray-700',
                    text: 'text-gray-700 dark:text-gray-300',
                    etiqueta: 'Desconocido'
                };
        }
    };

    const estilo = getEstiloEstado(estado);

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${estilo.bg} ${estilo.text}`}>
            {estilo.etiqueta}
        </span>
    );
};