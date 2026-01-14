export const BotonSimple = ({ icono: Icono, funcion, etiqueta, variante = "primario", tamaño = "md", disabled = false, tipo = "button" }) => {
    
    const clasesBase = {
        primario: "bg-blue-600 text-white hover:bg-blue-700 border-blue-600",
        secundario: "bg-white text-gray-800 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700",
        peligro: "bg-red-600 text-white hover:bg-red-700 border-red-600"
    };

    const tamanos = {
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm", 
        lg: "px-6 py-3 text-base"
    };

    const clases = `
        inline-flex items-center justify-center space-x-2
        rounded-lg border font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        shadow-sm
        ${tamanos[tamaño]}
        ${clasesBase[variante]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `.trim();

    return ( 
        <button
            type={tipo}
            onClick={funcion}
            className={clases}
            disabled={disabled}
        >
            {Icono && <Icono className={`${tamaño === 'sm' ? 'w-4 h-4' : 'w-5 h-5'}`} />}
            <span>{etiqueta}</span>
        </button>
    );
}