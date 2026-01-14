import { useEffect } from "react";

function useAnimacionesIntro(referencias) {
  const { textoReferencia, polloReferencia, papasReferencia, ensaladaReferencia, lechugaReferencia } = referencias;

  useEffect(() => {
    if (textoReferencia.current) {
      textoReferencia.current.classList.add("animate-fadeInUp");
    }
    const timers = [
      setTimeout(() => polloReferencia.current?.classList.add("animate-float"), 300),
      setTimeout(() => papasReferencia.current?.classList.add("animate-float-slow"), 600),
      setTimeout(() => ensaladaReferencia.current?.classList.add("animate-float-slower"), 900),
      setTimeout(() => lechugaReferencia.current?.classList.add("animate-swing"), 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, [textoReferencia, polloReferencia, papasReferencia, ensaladaReferencia, lechugaReferencia]);
}

export default useAnimacionesIntro;