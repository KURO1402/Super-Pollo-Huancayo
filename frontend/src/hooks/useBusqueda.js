import { useState } from "react";

export const useBusqueda = (claveBusqueda = "") => {
    const [terminoBusqueda, setTerminoBusqueda] = useState(claveBusqueda);
    
    const filtrarPorBusqueda = (items, campos) => {
        return items.filter((item) => 
            campos.some((campo) =>
                String(item[campo]).toLowerCase().includes(terminoBusqueda.toLowerCase())
            )
        );
    };
  return { terminoBusqueda, setTerminoBusqueda, filtrarPorBusqueda };
};
