import { create } from 'zustand'; 
import { persist } from 'zustand/middleware';
import { loginUsuario, registrarUsuario, generarCodigoVerificacion, validarCodigoVerificacion } from '../servicios/autenticacionServicio';

export const useAutenticacionStore = create(
    persist(
        (set) => ({
            usuario: null, 
            accessToken: null,
            error: null, 
            carga: false, 

            registrar: async (datos) => {
                try {
                    set({ carga: true, error: null }); 
                    const respuesta = await registrarUsuario(datos); 
                    set({ usuario: respuesta.usuario, accessToken: respuesta.accessToken, }); 
                    return respuesta.usuario;
                } catch (err) {
                    set({ error: err.response?.data?.mensaje || 'Error al registrar usuario' });
                } finally {
                    set({ carga: false }); 
                }
            },

            login: async (datos) => {
                try {
                    set({ carga: true, error: null }); 
                    const respuesta = await loginUsuario(datos); 
                    set({ usuario: respuesta.usuario, accessToken: respuesta.accessToken, }); 
                    return respuesta.usuario;
                } catch (err) {
                    set({ error: err.response?.data?.mensaje || 'Error al iniciar sesión' });
                } finally {
                    set({ carga: false });
                }
            },

            verificarCorreo: async (correo) => {
                try {
                    set({ carga: true, error: null });
                    const respuesta = await generarCodigoVerificacion(correo);
                    return respuesta;
                } catch (err) {
                    set({ error: err.response?.data?.mensaje || 'Error al enviar código de verificación' });
                    throw err;
                } finally {
                    set({ carga: false });
                }
            },

            validarCodigo: async (datos) => {
                try {
                    set({ carga: true, error: null });
                    const respuesta = await validarCodigoVerificacion(datos);
                    return respuesta;
                } catch (err) {
                    set({ error: err.response?.data?.mensaje || 'Error al validar código' });
                    throw err;
                } finally {
                    set({ carga: false });
                }
            },

            logout: () => {
                set({ usuario: null, accessToken: null });
            },

            setAccessToken: (token) => {
                set({ accessToken: token });
            },
            limpiarError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',

            partialize: (state) => ({
                usuario: state.usuario,
                accessToken: state.accessToken,
            }),
        }
    )
);