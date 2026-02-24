import { useState, useEffect, useCallback } from 'react';
import { obtenerImagenesProductoServicio } from '../servicios/productoServicios';

export const useProductos = () => {
  const [imagenesProductos, setImagenesProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const obtenerImagenesProductos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const respuesta = await obtenerImagenesProductoServicio();
      setImagenesProductos(respuesta.imagenes || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await obtenerImagenesProductos();
  }, [obtenerImagenesProductos]);

  useEffect(() => {
    obtenerImagenesProductos();
  }, [obtenerImagenesProductos]);

  return {
    imagenesProductos,
    cargando,
    error,
    refetch,
    setImagenesProductos
  };
};