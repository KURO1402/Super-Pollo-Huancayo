import { useEffect, useRef, useCallback } from 'react';

const EVENTOS = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];

const useInactividad = ({ onAviso, onLogout, tiempoAviso, tiempoLogout }) => {
    const timerAviso = useRef(null);
    const timerLogout = useRef(null);

    const AVISO = tiempoAviso || 14 * 60 * 1000;
    const LOGOUT = tiempoLogout || 15 * 60 * 1000;

    const resetTimers = useCallback(() => {
        clearTimeout(timerAviso.current);
        clearTimeout(timerLogout.current);

        timerAviso.current = setTimeout(() => {
            onAviso();
        }, AVISO);

        timerLogout.current = setTimeout(() => {
            onLogout();
        }, LOGOUT);
    }, [onAviso, onLogout, AVISO, LOGOUT]);

    useEffect(() => {
        resetTimers();
        EVENTOS.forEach(e => window.addEventListener(e, resetTimers));
        return () => {
            clearTimeout(timerAviso.current);
            clearTimeout(timerLogout.current);
            EVENTOS.forEach(e => window.removeEventListener(e, resetTimers));
        };
    }, [resetTimers]);

    const cancelarLogout = useCallback(() => {
        resetTimers();
    }, [resetTimers]);

    return { cancelarLogout };
};

export default useInactividad;