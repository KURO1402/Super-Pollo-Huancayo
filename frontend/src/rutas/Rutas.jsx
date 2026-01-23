import { useRoutes } from "react-router-dom";

import RutaPrivadaConRol from "./RutaPrivadaConRol";

import useScrollAlInicio from "../hooks/useScrollAlInicio";
import { ROLES } from "../constantes/roles";

import EstructuraBase from "../layouts/publico/EstructuraBase";
import Inicio from "../paginas/publico/Inicio";
import Registro from "../paginas/publico/Registro";
import InicioSesion from "../paginas/publico/InicioSesion";
import NotFound from "../paginas/publico/NotFound";

import EstructuraBaseUsuario from "../layouts/publico/EstructuraBaseUsuario";
import InicioUsuario from "../paginas/usuario/InicioUsuario";
import NuevaReservacion from "../paginas/usuario/NuevaReservacion";
import MisReservaciones from "../paginas/usuario/MisReservaciones";
import PerfilUsuario from "../paginas/usuario/PerfilUsuario";

import EstructuraBaseAdmin from "../layouts/panel-admin/EstructuraBaseAdmin";
import PanelControlPagina from "../paginas/panel-admin/PanelControlPagina";

import GenerarVentaPagina from "../paginas/panel-admin/GenerarVentaPagina";
import RegistroVentasPagina from "../paginas/panel-admin/RegistroVentasPagina";

import GestionProductosPagina from "../paginas/panel-admin/GestionProductosPagina";
import GestionImagenesPagina from "../paginas/panel-admin/GestionImagenesPagina";

import StockInsumosPagina from "../paginas/panel-admin/StockInsumosPagina";
import HistorialEntradasPagina from "../paginas/panel-admin/HistorialEntradasPagina";
import HistorialSalidasPagina from "../paginas/panel-admin/HistorialSalidasPagina";

import CajaActualPagina from "../paginas/panel-admin/CajaActualPagina";
import HistorialCajasPagina from "../paginas/panel-admin/HistorialCajasPagina";

import CalendarioReservasPagina from "../paginas/panel-admin/CalendarioReservasPagina";
import HistorialReservasPagina from "../paginas/panel-admin/HistorialReservasPagina";

import Usuarios from "../paginas/panel-admin/Usuarios";
import Perfil from "../paginas/panel-admin/Perfil";
import PagoExitoso from "../paginas/usuario/PagoExitoso";
import PagoFallido from "../paginas/usuario/PagoFallido";
import PagoPendiente from "../paginas/usuario/PagoPendiente";
import TerminosCondiciones from "../paginas/publico/TerminosCondiciones";
import PoliticasPrivacidad from "../paginas/publico/PoliticasPrivacidad";

const AppRutas = () => {
    useScrollAlInicio();
    const rutas = useRoutes([
        {    
            path: '/', element: <EstructuraBase />, 

            children: [
                { index: true, element: <Inicio /> },
                { path: '/registro', element: <Registro /> },
                { path: '/inicio-sesion', element: <InicioSesion /> },
                { path: 'pago-pendiente', element: <PagoPendiente /> },
                { path: 'terminos-condiciones', element: <TerminosCondiciones /> },
                { path: 'politicas-privacidad', element: <PoliticasPrivacidad /> },
            ]
        },

        {
            path: '/usuario',
            element: <RutaPrivadaConRol rolesPermitidos={[ROLES.USUARIO]} redirectTo="/" />,
            children: [
                {
                element: <EstructuraBaseUsuario />,
                children: [
                    { index: true, element: <InicioUsuario /> },
                    { path:'mis-reservaciones', element: <MisReservaciones /> },
                    { path: 'nueva-reservacion', element: <NuevaReservacion /> },
                    { path: 'reservaciones', element: <MisReservaciones /> },
                    { path: 'perfil', element: <PerfilUsuario /> },
                    { path: 'pago-exitoso', element: <PagoExitoso /> },
                    { path: 'pago-fallido', element: <PagoFallido /> },
                ]
                }
            ]
        },

        {
            path: '/admin',
            element: <RutaPrivadaConRol rolesPermitidos={[ROLES.COLABORADOR, ROLES.ADMINISTRADOR]} redirectTo="/" />,
            children: [
                {
                element: <EstructuraBaseAdmin />,
                children: [
                    { index: true, element: <PanelControlPagina /> },
                    { path: 'generar-venta', element: <GenerarVentaPagina/> },
                    { path: 'registro-ventas', element: <RegistroVentasPagina/> },
                    { path: 'stock-insumos', element: <StockInsumosPagina/> },
                    { path: 'historial-entradas', element: <HistorialEntradasPagina/> },
                    { path: 'historial-salidas', element: <HistorialSalidasPagina/> },
                    { path: 'gestion-productos', element: <GestionProductosPagina/> },
                    { path: 'gestion-imagenes', element: <GestionImagenesPagina/> },
                    { path: 'calendario-reservas', element: <CalendarioReservasPagina/> },
                    { path: 'historial-reservas', element: <HistorialReservasPagina/> },
                    { path: 'caja-actual', element: <CajaActualPagina/> },
                    { path: 'historial-cajas', element: <HistorialCajasPagina/> },
                    { path: 'usuarios', element: <Usuarios/> },
                    { path: 'perfil', element: <Perfil/> },
                ]
                }
            ]
        },

        {
            path: '/no-autorizado',
            element: (
                <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="text-center max-w-md px-4">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Acceso No Autorizado
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                    No tienes permisos para acceder a esta sección.
                    </p>
                    <a
                    href="/"
                    className="inline-block px-6 py-3 bg-rojo text-white rounded-lg hover:bg-rojo/90 transition-colors"
                    >
                    Volver al Inicio
                    </a>
                </div>
                </div>
            )
        },

        { path: '*', element: <NotFound /> },
    ])
    
    return rutas;
}

export default AppRutas;
