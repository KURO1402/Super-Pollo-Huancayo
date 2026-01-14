import FormularioReserva from "../componentes/ui/formularios/FormularioReserva";

const ReservaSeccion = () => {
  return (
    <section id="reservaciones" className="relative overflow-hidden fondo-cortando-pollo">
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 lg:py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:min-h-[75vh]">
            <div className="text-white text-center lg:text-left mb-10 lg:mb-0 lg:pr-12 lg:w-1/2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                EL SABOR DE LOS MEJORES<br />
                <span className="text-amarillo">POLLOS A LA BRASA</span><br /> 
                TE ESPERA
              </h2>
              <p className="text-xl md:text-2xl text-rojo mb-8">
                HAZ TU RESERVA HOY
              </p>
              <div className="hidden lg:block">
                <div className="w-24 h-1 bg-red-500 mb-6"></div>
                <p className="text-lg pb-8  text-gray-400 max-w-md">
                  Disfruta de una experiencia culinaria única con nuestro pollo a la brasa 
                  preparado con la receta tradicional que nos caracteriza.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <FormularioReserva />
            </div>
          </div>
        </div>
      <div className="lg:hidden bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="w-24 h-1 bg-red-500 mb-6 mx-auto lg:mx-0"></div>
          <p className="text-lg text-gray-400 text-center">
            Disfruta de una experiencia culinaria única con nuestro pollo a la brasa 
            preparado con la receta tradicional que nos caracteriza.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReservaSeccion;