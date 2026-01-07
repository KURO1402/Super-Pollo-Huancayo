import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import IntroduccionSeccion from "../../secciones/IntroduccionSeccion";
import MenuSeccion from "../../secciones/MenuSeccion";
import NosotrosSeccion from "../../secciones/NosotrosSeccion";
import ReservaSeccion from "../../secciones/ReservaSeccion";
import TrabajaNosotrosSeccion from "../../secciones/TrabajaNosotrosSeccion";
import useScrollParaSecciones from "../../hooks/useScrollParaSecciones";

const Inicio = () => {
  const locacionRuta = useLocation();
  const { scrollToSection } = useScrollParaSecciones();
  useEffect(() => {
    const section = locacionRuta.state?.scrollTo;
    if (section) {
      scrollToSection(section);
    }
  }, [locacionRuta, scrollToSection]);

  return (
    <>
      <IntroduccionSeccion />
      <NosotrosSeccion />
      <MenuSeccion />
      <ReservaSeccion />
      <TrabajaNosotrosSeccion />
    </>
  );
};

export default Inicio;
