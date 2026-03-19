import { useState, useEffect } from 'react';
import { BiMaleFemale } from "react-icons/bi";
import { MdTableBar, MdDoorFront, MdStairs, MdTv, MdLocalAtm } from "react-icons/md";
import { GiStairs, GiKitchenKnives } from "react-icons/gi";
import { PiOven } from "react-icons/pi";
import { RiBookShelfLine } from "react-icons/ri";
import { BiFridge } from "react-icons/bi";
import { HiMiniArrowTurnLeftUp } from "react-icons/hi2";
import { FaArrowUp, FaToilet } from 'react-icons/fa';
import { FiLoader, FiAlertCircle } from 'react-icons/fi';
import { useReservacionStore } from "../store/useReservacionStore";
import Mesa4Personas from './Mesa4Personas';
import Mesa8Personas from './Mesa8Personas';

const Paso2SeleccionMesas = () => {
  const {
    datos,
    updateDatos,
    mesasDisponibles,
    cargandoMesas,
    errorMesas,
    buscarMesasDisponibles,
    iniciarPolling, 
    detenerPolling,
  } = useReservacionStore();

  const [pisoActual, setPisoActual] = useState(1);
  const [mesasSeleccionadas, setMesasSeleccionadas] = useState([]);
  const [error, setError] = useState('');

  const personasForm = datos.personas || 2;

  useEffect(() => {
    if (datos.fecha && datos.hora) {
      buscarMesasDisponibles(datos.fecha, datos.hora);
      iniciarPolling();
    }
    return () => detenerPolling();
  }, [datos.fecha, datos.hora]);

  useEffect(() => {
    if (datos.mesas && datos.mesas.length > 0) {
      setMesasSeleccionadas(datos.mesas);
    }
  }, []);

  useEffect(() => {
    const capacidadTotal = mesasSeleccionadas.reduce((total, mesa) => total + mesa.capacidad, 0);
    if (mesasSeleccionadas.length === 0) {
      setError('Debes seleccionar al menos una mesa');
    } else if (capacidadTotal < personasForm) {
      const faltante = personasForm - capacidadTotal;
      setError(`Capacidad insuficiente. Faltan ${faltante} ${faltante === 1 ? 'persona' : 'personas'}`);
    } else {
      setError('');
    }
  }, [mesasSeleccionadas, personasForm]);

  const getMesaInfo = (mesaId) => {
    const mesaBackend = mesasDisponibles.find(m => m.id === mesaId);
    return mesaBackend ?? { id: mesaId, numero: mesaId.toString(), capacidad: 4, disponible: false };
  };

  const handleSeleccionarMesa = (mesaId) => {
    const mesa = getMesaInfo(mesaId);
    if (!mesa.disponible) return;

    const estaSeleccionada = mesasSeleccionadas.some(m => m.id === mesaId);
    const nuevaSeleccion = estaSeleccionada
      ? mesasSeleccionadas.filter(m => m.id !== mesaId)
      : [...mesasSeleccionadas, { ...mesa, piso: pisoActual }];

    setMesasSeleccionadas(nuevaSeleccion);
    updateDatos({ mesas: nuevaSeleccion });
  };

  const esMesaSeleccionada = (mesaId) => mesasSeleccionadas.some(m => m.id === mesaId);
  const esMesaDisponible = (mesaId) => getMesaInfo(mesaId).disponible;

  const capacidadTotal = mesasSeleccionadas.reduce((total, mesa) => total + mesa.capacidad, 0);

  if (cargandoMesas) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <FiLoader className="animate-spin w-12 h-12 text-red-500" />
        <p className="text-gray-400 text-lg">Cargando disponibilidad de mesas...</p>
      </div>
    );
  }

  if (errorMesas) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <FiAlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-red-400 text-lg">{errorMesas}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 max-w-6xl mx-auto px-4 md:px-0">
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Selecciona tus Mesas
        </h2>
        <p className="text-sm md:text-base text-gray-400">
          Elige las mesas para tu reserva de {personasForm} {personasForm === 1 ? 'persona' : 'personas'}
        </p>
      </div>

      {/* Panel de control */}
      <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MdTableBar className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
              <h3 className="text-lg md:text-xl font-semibold text-white">
                Capacidad: {capacidadTotal} / {personasForm} personas
              </h3>
            </div>
            <p className="text-xs md:text-sm text-gray-400">
              Mesas seleccionadas: {mesasSeleccionadas.length}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-gray-700 rounded-full p-1 w-full md:w-auto">
            <button
              type="button"
              onClick={() => setPisoActual(1)}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all flex-1 md:flex-initial justify-center ${
                pisoActual === 1 ? 'bg-red-600 text-white shadow-lg' : 'text-gray-300 hover:text-white'
              }`}
            >
              <MdDoorFront className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Piso 1</span>
            </button>
            <button
              type="button"
              onClick={() => setPisoActual(2)}
              className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold transition-all flex-1 md:flex-initial justify-center ${
                pisoActual === 2 ? 'bg-red-600 text-white shadow-lg' : 'text-gray-300 hover:text-white'
              }`}
            >
              <MdStairs className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-sm md:text-base">Piso 2</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 border-2 border-gray-500 rounded-lg"></div>
            <span className="text-gray-300">Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-600 border-2 border-red-500 rounded-lg"></div>
            <span className="text-gray-300">Seleccionada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-900 border-2 border-gray-600 rounded-lg opacity-50"></div>
            <span className="text-gray-300">No disponible</span>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-700 overflow-x-auto">
        <div className="min-w-250">
          {pisoActual === 1 ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full px-8 py-3">
                  <h2 className="text-2xl font-bold text-white">PRIMER PISO</h2>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3">
                  <div className="border-2 border-gray-600 rounded-xl p-6 h-150"></div>
                  <div className="bg-linear-to-b from-gray-800 to-gray-900 border-2 border-gray-600 rounded-xl p-6">
                    <div className="flex flex-col items-center justify-center h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <BiMaleFemale className="w-10 h-10 text-gray-400" />
                        <FaToilet className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-blue-300 font-bold text-xl mb-1">Baño</h3>
                    </div>
                  </div>
                  <div className="bg-linear-to-r from-green-900/30 to-green-800/20 border-2 mt-6 border-green-500/60 rounded-xl p-4">
                    <div className="flex items-center justify-center gap-4">
                      <FaArrowUp className="w-8 h-8 text-green-300" />
                      <GiStairs className="w-10 h-10 text-green-300" />
                      <div>
                        <h3 className="text-green-200 font-bold text-lg">A PISO 2</h3>
                        <p className="text-green-300/70 text-sm">Escalera principal</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 bg-linear-to-b from-orange-900/20 to-orange-800/10 border-2 border-orange-600 rounded-xl p-6 h-100 relative">
                    <div className="absolute top-0 left-0 right-0 h-20 bg-linear-to-r from-orange-800/40 to-orange-900/30 border-b-2 border-orange-500/50 rounded-t-xl">
                      <div className="flex items-center justify-center h-full">
                        <RiBookShelfLine className="w-10 h-10 text-orange-300 mr-3" />
                        <div>
                          <h4 className="text-orange-200 font-semibold">ESTANTES</h4>
                          <p className="text-orange-400/70 text-xs">Almacenamiento</p>
                        </div>
                      </div>
                    </div>
                    <div className="absolute top-20 left-0 right-0 h-40 flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-orange-300 font-bold text-2xl mb-2">COCINA</h3>
                        <p className="text-orange-400/70 text-sm">Área de preparación</p>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-r from-orange-900/40 to-orange-800/30 border-t-2 border-orange-500/50 rounded-b-xl">
                      <div className="flex items-center justify-center h-full gap-4">
                        <GiKitchenKnives className="w-8 h-8 text-orange-300" />
                        <PiOven className="w-8 h-8 text-orange-300" />
                        <BiFridge className="w-8 h-8 text-orange-300" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className='col-span-2 space-y-8'>
                  <div className='mt-17'>
                    <Mesa4Personas id={10} numero="10" seleccionada={esMesaSeleccionada(10)} disponible={esMesaDisponible(10)} onClick={() => handleSeleccionarMesa(10)} />
                  </div>
                  <Mesa4Personas id={8} numero="8" seleccionada={esMesaSeleccionada(8)} disponible={esMesaDisponible(8)} onClick={() => handleSeleccionarMesa(8)} />
                </div>

                <div className="col-span-5 space-y-8">
                  <div className="bg-linear-to-r from-purple-900/30 to-purple-800/20 border-2 border-purple-500/60 rounded-xl p-4 h-10">
                    <div className="flex items-center justify-center gap-4 h-full">
                      <MdTv className="w-10 h-10 text-purple-300" />
                      <h3 className="text-purple-200 font-bold text-lg">TV PRINCIPAL</h3>
                    </div>
                  </div>
                  <div className='ml-70'>
                    <Mesa8Personas id={11} numero="11" seleccionada={esMesaSeleccionada(11)} disponible={esMesaDisponible(11)} onClick={() => handleSeleccionarMesa(11)} />
                  </div>
                  <div className='ml-30 mt-97'>
                    <Mesa4Personas id={5} numero="5" seleccionada={esMesaSeleccionada(5)} disponible={esMesaDisponible(5)} onClick={() => handleSeleccionarMesa(5)} />
                  </div>
                  <div className='ml-30'>
                    <Mesa4Personas id={3} numero="3" seleccionada={esMesaSeleccionada(3)} disponible={esMesaDisponible(3)} onClick={() => handleSeleccionarMesa(3)} />
                  </div>
                  <div className='ml-30'>
                    <Mesa4Personas id={1} numero="1" seleccionada={esMesaSeleccionada(1)} disponible={esMesaDisponible(1)} onClick={() => handleSeleccionarMesa(1)} />
                  </div>
                  <div className="bg-linear-to-b from-blue-900/30 to-blue-800/20 border-2 border-blue-500/60 rounded-xl p-6 h-20 mt-26">
                    <div className="flex items-center justify-center h-full">
                      <div className="w-16 h-16 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-4">
                        <MdDoorFront className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-blue-200 font-bold text-xl">ENTRADA</h3>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 space-y-6">
                  <div className='mt-62'>
                    <Mesa4Personas id={9} numero="9" seleccionada={esMesaSeleccionada(9)} disponible={esMesaDisponible(9)} onClick={() => handleSeleccionarMesa(9)} />
                  </div>
                  <div className='mt-8'>
                    <Mesa4Personas id={7} numero="7" seleccionada={esMesaSeleccionada(7)} disponible={esMesaDisponible(7)} onClick={() => handleSeleccionarMesa(7)} />
                  </div>
                  <div className='mt-8'>
                    <Mesa4Personas id={6} numero="6" seleccionada={esMesaSeleccionada(6)} disponible={esMesaDisponible(6)} onClick={() => handleSeleccionarMesa(6)} />
                  </div>
                  <div className='mt-8'>
                    <Mesa4Personas id={4} numero="4" seleccionada={esMesaSeleccionada(4)} disponible={esMesaDisponible(4)} onClick={() => handleSeleccionarMesa(4)} />
                  </div>
                  <div className='mt-8'>
                    <Mesa4Personas id={2} numero="2" seleccionada={esMesaSeleccionada(2)} disponible={esMesaDisponible(2)} onClick={() => handleSeleccionarMesa(2)} />
                  </div>
                  <div className="bg-linear-to-b from-yellow-900/30 to-yellow-800/20 border-2 border-yellow-500/60 rounded-xl p-6 h-40">
                    <div className="flex flex-col items-center justify-center h-full">
                      <MdLocalAtm className="w-12 h-12 text-yellow-300 mb-3" />
                      <h3 className="text-yellow-200 font-bold text-lg">CAJA</h3>
                      <p className="text-yellow-300/70 text-sm">Punto de pago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-3 bg-gray-800/50 border border-gray-700 rounded-full px-8 py-3">
                  <h2 className="text-2xl font-bold text-white">SEGUNDO PISO</h2>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-5">
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                    <div className='mt-10'>
                      <Mesa8Personas id={15} numero="15" seleccionada={esMesaSeleccionada(15)} disponible={esMesaDisponible(15)} onClick={() => handleSeleccionarMesa(15)} />
                      <div className='mt-15'>
                        <Mesa8Personas id={12} numero="12" seleccionada={esMesaSeleccionada(12)} disponible={esMesaDisponible(12)} onClick={() => handleSeleccionarMesa(12)} />
                      </div>
                    </div>
                  </div>
                  <div className='border-2 border-gray-700 h-3 p-6 my-6'/>
                  <div className="flex bg-linear-to-r from-cyan-400/30 to-sky-500/20 border-2 border-cyan-500/60 rounded-xl p-4 w-1/2 h-10 mb-7 items-center justify-center">
                    <h3 className="text-sky-200 font-bold text-lg">INGRESO</h3>
                  </div>
                  <div className="bg-linear-to-b from-gray-800 to-gray-900 border-2 border-gray-600 rounded-xl p-6 h-64">
                    <div className="flex items-center gap-6 h-full">
                      <div className="relative">
                        <GiStairs className="w-24 h-24 text-gray-400" />
                        <div className="absolute -top-2 -right-2 bg-blue-500 rounded-full p-2">
                          <HiMiniArrowTurnLeftUp className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-blue-300 font-bold text-xl mb-2">ESCALERA</h3>
                        <p className="text-gray-400 text-sm">Desde primer piso</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-3">
                  <div className="absolute bg-linear-to-r from-purple-900/30 to-purple-800/20 border-2 border-purple-500/60 rounded-xl p-4 w-65 h-10 ml-50">
                    <div className="flex items-center justify-center gap-4 h-full">
                      <MdTv className="w-10 h-10 text-purple-300" />
                      <h3 className="text-purple-200 font-bold text-lg">TV SEGUNDO PISO</h3>
                    </div>
                  </div>
                  <div className='mt-16'>
                    <Mesa4Personas id={16} numero="16" seleccionada={esMesaSeleccionada(16)} disponible={esMesaDisponible(16)} onClick={() => handleSeleccionarMesa(16)} />
                    <div className='mt-15'>
                      <Mesa4Personas id={13} numero="13" seleccionada={esMesaSeleccionada(13)} disponible={esMesaDisponible(13)} onClick={() => handleSeleccionarMesa(13)} />
                    </div>
                  </div>
                  <div className="w-150 h-px bg-gray-400 mt-48"></div>
                </div>
                <div className="col-span-4 mr-0">
                  <div className='mt-16'>
                    <Mesa8Personas id={17} numero="17" seleccionada={esMesaSeleccionada(17)} disponible={esMesaDisponible(17)} onClick={() => handleSeleccionarMesa(17)} />
                  </div>
                  <div className='mt-15'>
                    <Mesa8Personas id={14} numero="14" seleccionada={esMesaSeleccionada(14)} disponible={esMesaDisponible(14)} onClick={() => handleSeleccionarMesa(14)} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RESUMEN DE SELECCIÓN */}
      {mesasSeleccionadas.length > 0 && (
        <div className="bg-gray-800 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center">
              <MdTableBar className="w-5 h-5 text-red-600" />
            </div>
            <h4 className="text-lg md:text-xl font-semibold text-white">Mesas Seleccionadas</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                {mesasSeleccionadas.map((mesa) => (
                  <div key={mesa.id} className="flex items-center gap-2 bg-red-600/10 border border-red-600/30 rounded-lg px-3 py-2">
                    <MdTableBar className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-medium text-white">Mesa {mesa.numero} (Piso {mesa.piso})</span>
                    <span className="text-xs text-gray-400 ml-2">{mesa.capacidad}p</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-700/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Capacidad total:</span>
                <span className="text-xl font-bold text-white">{capacidadTotal} personas</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Requieres:</span>
                <span className="text-xl font-bold text-white">{personasForm} personas</span>
              </div>
              {capacidadTotal >= personasForm && (
                <div className="mt-4 bg-green-600/10 border border-green-600/30 rounded-lg p-3">
                  <p className="text-green-400 text-center font-medium">✓ Perfecto! Capacidad suficiente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {error && capacidadTotal < personasForm && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">!</span>
            </div>
            <p className="text-red-400 font-medium">{error}</p>
          </div>
          <p className="text-red-400/70 text-sm mt-2">Por favor selecciona más mesas o mesas con mayor capacidad</p>
        </div>
      )}
    </div>
  );
};

export default Paso2SeleccionMesas;