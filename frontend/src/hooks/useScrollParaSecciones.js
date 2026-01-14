import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scroller } from "react-scroll";

const useScrollParaSecciones = () => {
  const locacionRuta = useLocation();

  useEffect(() => {
    const section = locacionRuta.state?.scrollTo;
    
    if (section) {
      const timer = setTimeout(() => {
        scroller.scrollTo(section, {
          smooth: true,
          duration: 500,
          offset: -70,
          ignoreCancelEvents: false,
        });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [locacionRuta]);

  const scrollToSection = (section) => {
    scroller.scrollTo(section, {
      smooth: true,
      duration: 500,
      offset: -70,
    });
  };

  return { scrollToSection };
};

export default useScrollParaSecciones;