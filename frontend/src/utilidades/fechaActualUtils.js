export const obtenerFechaActual = () => {
    const hoy = new Date(); 
    const fechaFormateada = hoy.toISOString().split("T")[0];
    return fechaFormateada; 
}