import IntroduccionSeccion from "../../secciones/IntroduccionSeccion";
import MenuSeccion from "../../secciones/MenuSeccion";
import NosotrosSeccion from "../../secciones/NosotrosSeccion";
import TrabajaNosotrosSeccion from "../../secciones/TrabajaNosotrosSeccion";
import useScrollParaSecciones from "../../hooks/useScrollParaSecciones";

const InicioUsuario = () => {
  useScrollParaSecciones();

  return (
    <>
      <IntroduccionSeccion />
      <NosotrosSeccion />
      <MenuSeccion />
      <TrabajaNosotrosSeccion />
    </>
  );
};

export default InicioUsuario;