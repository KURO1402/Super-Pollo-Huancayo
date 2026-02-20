import { Tabla } from '../../ui/tabla/Tabla';
import FilaUsuario from './FilaUsuario';

const TablaUsuarios = ({ usuarios, cargando,/*  onEditarRol, onEliminar, onToggleEstado */ }) => {

  return (
    <Tabla encabezados={['Usuario', 'Correo', 'Teléfono', 'Rol', 'Acciones']} 
    registros={usuarios.map(u => <FilaUsuario key={u.id_usuario} usuario={u} />)} cargando={cargando} />
  );

};

export default TablaUsuarios;