import { useState, useEffect } from 'react';
import { useFormContext } from "react-hook-form";
import { FiClock, FiUsers, FiChevronLeft, FiChevronRight, FiCalendar, FiAlertCircle } from "react-icons/fi";
import { horasDisponibles } from '../mocks/horaReserva';

const Paso1DatosBasicos = () => {
  const { register, formState: { errors }, watch, setValue, trigger, setError, clearErrors } = useFormContext();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [diasVisibles, setDiasVisibles] = useState([]);
  const [indiceInicio, setIndiceInicio] = useState(0);
  const [horariosDisponibles, setHorariosDisponibles] = useState([]);
  const [diasAMostrar, setDiasAMostrar] = useState(5);

  const horaForm = watch('hora');
  const personasForm = watch('personas') || 2;
  const fechaForm = watch('fecha');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) { 
        setDiasAMostrar(3);
      } else if (window.innerWidth < 1024) { 
        setDiasAMostrar(4);
      } else { 
        setDiasAMostrar(5);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const hoyEstaDisponible = () => {
    const ahora = new Date();
    const horaActual = ahora.getHours();
    return horaActual < 20;
  };

  const validarDisponibilidadHora = (fecha, hora) => {
    const ahora = new Date();
    const fechaReserva = new Date(`${fecha}T${hora}:00`);
    
    const hoy = new Date();
    const esHoy = fecha === hoy.toISOString().split('T')[0];
    
    if (esHoy) {
      const diferenciaHoras = (fechaReserva - ahora) / (1000 * 60 * 60);
      return diferenciaHoras >= 2;
    }
    
    return true;
  };

  useEffect(() => {
    if (fechaForm) {
      const horariosFiltrados = horasDisponibles.map(horario => ({
        ...horario,
        disponible: validarDisponibilidadHora(fechaForm, horario.value)
      }));

      setHorariosDisponibles(horariosFiltrados);

      if (horaForm && !validarDisponibilidadHora(fechaForm, horaForm)) {
        setValue('hora', '', { shouldValidate: true });
      }
    }
  }, [fechaForm, horaForm, setValue]);

  useEffect(() => {
    const dias = [];
    const hoy = new Date();
    const hoyDisponible = hoyEstaDisponible();
    
    const diaInicial = hoyDisponible ? 0 : 1;
    
    for (let i = diaInicial; i < 14 + diaInicial; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      dias.push({ 
        fecha: fecha,
        dia: fecha.getDate(),
        mes: fecha.toLocaleDateString('es-ES', { month: 'short' }),
        diaSemana: fecha.toLocaleDateString('es-ES', { weekday: 'short' }),
        isoString: fecha.toISOString().split('T')[0],
        esHoy: i === 0
      });
    }
    
    setDiasVisibles(dias);
    
    if (dias.length > 0) {
      const primerDia = dias[0];
      setFechaSeleccionada(primerDia.isoString);
      setValue('fecha', primerDia.isoString, { shouldValidate: true });
    }
  }, [setValue]);

  const diasSlice = diasVisibles.slice(indiceInicio, indiceInicio + diasAMostrar);

  const handleAnterior = () => {
    if (indiceInicio > 0) {
      setIndiceInicio(indiceInicio - 1);
    }
  };

  const handleSiguiente = () => {
    if (indiceInicio < diasVisibles.length - diasAMostrar) {
      setIndiceInicio(indiceInicio + 1);
    }
  };

  const handleSeleccionarFecha = (fecha) => {
    setFechaSeleccionada(fecha.isoString);
    setValue('fecha', fecha.isoString, { shouldValidate: true });
    trigger('fecha');
  };

  const calcularMensajePersonas = (personas) => {
    if (personas <= 4) {
      return {
        tipo: 'info',
        texto: 'Puedes elegir una mesa de 4 personas',
        icono: '✓'
      };
    } else if (personas <= 8) {
      return {
        tipo: 'success',
        texto: 'Puedes elegir una mesa de 8 personas',
        icono: '✓'
      };
    } else if (personas <= 12) {
      const mesasNecesarias = Math.ceil(personas / 8);
      return {
        tipo: 'warning',
        texto: `Necesitarás aproximadamente ${mesasNecesarias} mesas para ${personas} personas`,
        icono: '⚠️'
      };
    } else if (personas <= 16) {
      return {
        tipo: 'warning',
        texto: 'Necesitarás múltiples mesas. Te recomendamos 2 mesas de 8 personas',
        icono: '⚠️'
      };
    } else {
      return {
        tipo: 'error',
        texto: 'Para grupos mayores a 16 personas, contacta directamente con el restaurante',
        icono: '📞'
      };
    }
  };

  const mensajePersonas = calcularMensajePersonas(personasForm);

  const esHoy = () => {
    if (!fechaSeleccionada) return false;
    const hoy = new Date().toISOString().split('T')[0];
    return fechaSeleccionada === hoy;
  };

  const hoyDisponible = hoyEstaDisponible();

  return (
    <div className="space-y-6 lg:space-y-8 max-w-4xl mx-auto px-4 sm:px-6 lg:px-0">
      <div className="text-center mb-6 lg:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Datos de la Reservación
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          Selecciona la fecha, hora y número de personas
        </p>
        {!hoyDisponible && (
          <div className="mt-4 p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg flex items-center gap-2 max-w-2xl mx-auto">
            <FiAlertCircle className="w-4 h-4 text-blue-400 shrink-0" />
            <p className="text-blue-400 text-sm text-left">
              Las reservas para hoy ya no están disponibles. Por favor selecciona una fecha a partir de mañana.
            </p>
          </div>
        )}
      </div>

      <input 
        type="hidden" 
        {...register("fecha", { 
          required: "La fecha es requerida",
          validate: {
            fechaValida: (value) => {
              const fechaSeleccionada = new Date(value);
              const hoy = new Date();
              hoy.setHours(0, 0, 0, 0);
              
              if (!hoyDisponible && fechaSeleccionada <= hoy) {
                return "Las reservas para hoy ya no están disponibles. Por favor selecciona una fecha futura.";
              }
              
              return fechaSeleccionada >= hoy || "No puedes reservar para fechas pasadas";
            }
          }
        })} 
      />
      <input 
        type="hidden" 
        {...register("hora", { 
          required: "La hora es requerida",
          validate: {
            horaValida: (value) => {
              if (!fechaForm || !value) return true;
              
              const ahora = new Date();
              const fechaReserva = new Date(`${fechaForm}T${value}:00`);
              
              if (fechaReserva <= ahora) {
                return "No puedes reservar para horarios pasados";
              }
              
              const esHoySeleccionado = fechaForm === ahora.toISOString().split('T')[0];
              if (esHoySeleccionado) {
                const diferenciaHoras = (fechaReserva - ahora) / (1000 * 60 * 60);
                if (diferenciaHoras < 2) {
                  return "Para reservar hoy, debes hacerlo con al menos 2 horas de anticipación";
                }
              }
              
              return true;
            }
          }
        })} 
      />

      {/* SELECTOR DE FECHA */}
      <div className="bg-gray-800 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-700">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600/10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
              <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">Selecciona una Fecha</h3>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">
            {hoyDisponible 
              ? "Elige el día de tu reserva" 
              : "Las reservas comienzan a partir de mañana"}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleAnterior}
            disabled={indiceInicio === 0}
            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all shrink-0 ${
              indiceInicio === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <FiChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="flex gap-1 sm:gap-2 flex-1 justify-center overflow-hidden">
            {diasSlice.map((dia, index) => {
              const ahora = new Date();
              const fechaDia = new Date(dia.isoString);
              const esPasado = fechaDia < new Date(ahora.toISOString().split('T')[0]);
              
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => !esPasado && handleSeleccionarFecha(dia)}
                  disabled={esPasado}
                  className={`px-3 py-2 sm:px-4 sm:py-3 rounded-xl sm:rounded-full transition-all min-w-17.5 sm:min-w-20 lg:min-w-22.5 flex flex-col items-center ${
                    esPasado
                      ? 'bg-gray-900 text-gray-500 cursor-not-allowed opacity-50'
                      : fechaSeleccionada === dia.isoString
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="text-[10px] sm:text-xs uppercase font-medium opacity-80">
                    {dia.diaSemana}
                  </div>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold">
                    {dia.dia}
                  </div>
                  <div className="text-[10px] sm:text-xs uppercase opacity-80">
                    {dia.mes}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleSiguiente}
            disabled={indiceInicio >= diasVisibles.length - diasAMostrar}
            className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full transition-all shrink-0 ${
              indiceInicio >= diasVisibles.length - diasAMostrar
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <FiChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {esHoy() && (
          <div className="mt-4 p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg flex items-center gap-2 justify-center">
            <FiAlertCircle className="w-4 h-4 text-yellow-400 shrink-0" />
            <p className="text-yellow-400 text-sm text-center sm:text-left">
              Estás reservando para hoy. Recuerda que necesitas al menos 2 horas de anticipación.
            </p>
          </div>
        )}

        {errors.fecha && (
          <p className="text-red-500 text-sm mt-4 text-center">{errors.fecha.message}</p>
        )}
      </div>

      {/* SELECTOR DE HORA */}
      <div className="bg-gray-800 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-700">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600/10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
              <FiClock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">Selecciona el Horario</h3>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">
            {esHoy() 
              ? "Horarios disponibles con al menos 2 horas de anticipación" 
              : "Elige la hora de tu reserva"}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {horariosDisponibles.map((horario) => (
            <button
              key={horario.value}
              type="button"
              onClick={() => {
                if (horario.disponible) {
                  setValue('hora', horario.value, { shouldValidate: true });
                }
              }}
              disabled={!horario.disponible}
              className={`py-3 px-4 sm:py-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold transition-all relative text-sm sm:text-base ${
                !horario.disponible
                  ? 'bg-gray-900 text-gray-500 cursor-not-allowed opacity-50'
                  : horaForm === horario.value
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {horario.label}
              {!horario.disponible && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              )}
            </button>
          ))}
        </div>

        {esHoy() && (
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              Los horarios no disponibles están marcados con un punto rojo
            </p>
          </div>
        )}

        {errors.hora && (
          <p className="text-red-500 text-sm mt-4 text-center">{errors.hora.message}</p>
        )}
      </div>

      {/* SELECTOR DE PERSONAS */}
      <div className="bg-gray-800 rounded-xl lg:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-gray-700">
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-600/10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
              <FiUsers className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">Número de Personas</h3>
          </div>
          <p className="text-gray-400 text-xs sm:text-sm">¿Cuántas personas asistirán?</p>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => {
              if (personasForm > 2) {
                setValue('personas', personasForm - 1, { shouldValidate: true });
              }
            }}
            disabled={personasForm <= 2}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-xl sm:text-2xl transition-all shrink-0 ${
              personasForm <= 2
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 active:scale-95'
            }`}
          >
            -
          </button>

          <div className="bg-gray-700 px-6 py-4 sm:px-12 sm:py-6 rounded-xl sm:rounded-2xl min-w-30 sm:min-w-37.5 text-center">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              {personasForm}
            </div>
            <div className="text-gray-400 text-xs sm:text-sm mt-1 sm:mt-2">
              {personasForm === 1 ? 'persona' : 'personas'}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (personasForm < 20) {
                setValue('personas', personasForm + 1, { shouldValidate: true });
              }
            }}
            disabled={personasForm >= 20}
            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full font-bold text-xl sm:text-2xl transition-all shrink-0 ${
              personasForm >= 20
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 active:scale-95'
            }`}
          >
            +
          </button>
        </div>

        <input
          type="hidden"
          {...register("personas", { 
            required: "El número de personas es requerido",
            min: { value: 2, message: "Mínimo 2 personas" },
            max: { value: 20, message: "Máximo 20 personas para reserva online" },
            valueAsNumber: true
          })}
        />

        {mensajePersonas && (
          <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-lg sm:rounded-xl text-center ${
            mensajePersonas.tipo === 'info' 
              ? 'bg-blue-600/10 border border-blue-600/30' 
              : mensajePersonas.tipo === 'success'
              ? 'bg-green-600/10 border border-green-600/30'
              : mensajePersonas.tipo === 'warning'
              ? 'bg-yellow-600/10 border border-yellow-600/30'
              : 'bg-red-600/10 border border-red-600/30'
          }`}>
            <p className={`text-xs sm:text-sm font-medium ${
              mensajePersonas.tipo === 'info' 
                ? 'text-blue-400' 
                : mensajePersonas.tipo === 'success'
                ? 'text-green-400'
                : mensajePersonas.tipo === 'warning'
                ? 'text-yellow-400'
                : 'text-red-400'
            }`}>
              {mensajePersonas.icono} {mensajePersonas.texto}
            </p>
          </div>
        )}

        {errors.personas && (
          <p className="text-red-500 text-xs sm:text-sm mt-4 text-center">{errors.personas.message}</p>
        )}
      </div>
    </div>
  );
};

export default Paso1DatosBasicos;