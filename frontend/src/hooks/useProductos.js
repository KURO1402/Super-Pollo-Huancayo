import { useState, useEffect, useCallback } from 'react';
import { obtenerImagenesProductoServicio, obtenerProductosServicio } from '../servicios/productoServicios';

export const useProductos = () => {
  const [productos, setProductos] = useState([]);
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

  const obtenerProductos = useCallback(async () => {
    try {
      setCargando(true);
      setError(null);
      const respuesta = await obtenerProductosServicio();
      setProductos(respuesta.productos || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await obtenerImagenesProductos();
    await obtenerProductos();
  }, [obtenerImagenesProductos, obtenerProductos]);

  useEffect(() => {
    obtenerImagenesProductos();
      obtenerProductos();
  }, [obtenerImagenesProductos, obtenerProductos]);

  return {
    imagenesProductos,
    productos,
    cargando,
    error,
    refetch,
    setImagenesProductos
  };
};