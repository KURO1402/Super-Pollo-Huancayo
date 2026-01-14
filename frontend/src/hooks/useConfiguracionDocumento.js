import { useEffect, useState } from "react";

const useConfiguracionDocumento = (tipo, setValue) => {
  const [placeholder, setPlaceholder] = useState("Ingrese el número de documento");
  const [busquedaHabilitada, setbusquedaHabilitada] = useState(false);

  useEffect(() => {
    if (tipo === "1") {
      setPlaceholder("Ejemplo: 87654321");
      setbusquedaHabilitada(true);
      setValue("numeroDocumento", ""); 

    } else if (tipo === "2") {
      setPlaceholder("Ejemplo: P1234567");
      setbusquedaHabilitada(false);
      setValue("numeroDocumento", "");
      
    } else if (tipo === "3") {
      setPlaceholder("Ejemplo: 20123456789");
      setbusquedaHabilitada(true);
      setValue("numeroDocumento", ""); 
    }
  }, [tipo, setValue]);

  return { placeholder, busquedaHabilitada };
};

export default useConfiguracionDocumento;

