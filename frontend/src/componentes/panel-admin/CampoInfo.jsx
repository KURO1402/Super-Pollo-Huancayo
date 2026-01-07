const CampoInfo = ({ icono: Icono, etiqueta, valor }) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {etiqueta}
    </label>
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
      <Icono className="w-4 h-4 text-gray-400" />
      <p className="text-gray-900 dark:text-white font-medium">{valor}</p>
    </div>
  </div>
);

export default CampoInfo;