import axios from "axios";

const token = import.meta.env.VITE_TOKEN_APIS_PERU;

export const buscarPorDNI = async (dni) => { 
  if (!/^\d{8}$/.test(dni)) { 
    throw new Error("El DNI debe tener 8 dígitos"); 
  } 
  const url = `https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${token}`; 
  const respuesta = await axios.get(url); 
  return respuesta.data; 
};

export const buscarPorRUC = async (ruc) => {
  if (!/^\d{11}$/.test(ruc)) {
    throw new Error("El RUC debe tener 11 dígitos");
  }
  const url = `https://dniruc.apisperu.com/api/v1/ruc/${ruc}?token=${token}`;
  const respuesta = await axios.get(url);
  return respuesta.data;
};
