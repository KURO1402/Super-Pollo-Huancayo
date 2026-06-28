import { useState, useEffect, useRef } from 'react';
import { FaEnvelope, FaClock, FaCheck, FaRedo } from 'react-icons/fa';

const VerificacionCorreo = ({ 
  correo, 
  onCodigoValidado, 
  onReenviarCodigo, 
  estaCargando = false 
}) => {
  const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
  const [tiempoRestante, setTiempoRestante] = useState(300);
  const [puedeReenviar, setPuedeReenviar] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (tiempoRestante > 0) {
      const timer = setTimeout(() => setTiempoRestante(tiempoRestante - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setPuedeReenviar(true);
    }
  }, [tiempoRestante]);

  useEffect(() => {
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  }, []);

  const manejarCambioCodigo = (index, valor) => {
    if (!/^\d?$/.test(valor)) return;
    
    const nuevoCodigo = [...codigo];
    nuevoCodigo[index] = valor;
    setCodigo(nuevoCodigo);

    if (valor && index < 5) {
      inputsRef.current[index + 1].focus();
    }

    if (nuevoCodigo.every(digito => digito !== '') && index === 5) {
      handleSubmit();
    }
  };

  const manejarKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !codigo[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
    
    if (e.key === 'Enter' && codigo.every(digito => digito !== '')) {
      handleSubmit();
    }
  };

  const manejarPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const numeros = pastedData.replace(/\D/g, '').slice(0, 6);
    
    const nuevoCodigo = [...codigo];
    numeros.split('').forEach((num, index) => {
      if (index < 6) {
        nuevoCodigo[index] = num;
      }
    });
    
    setCodigo(nuevoCodigo);
    
    const ultimoIndex = Math.min(numeros.length, 5);
    if (inputsRef.current[ultimoIndex]) {
      inputsRef.current[ultimoIndex].focus();
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const codigoCompleto = codigo.join('');
    if (codigoCompleto.length === 6) {
      onCodigoValidado(codigoCompleto);
    }
  };

  const manejarReenviar = async () => {
    await onReenviarCodigo();
    setTiempoRestante(300);
    setPuedeReenviar(false);
    setCodigo(['', '', '', '', '', '']);
    if (inputsRef.current[0]) {
      inputsRef.current[0].focus();
    }
  };

  const codigoCompleto = codigo.join('');
  const minutos = Math.floor(tiempoRestante / 60);
  const segundos = tiempoRestante % 60;

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 md:p-8 bg-white/5 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border border-white/10">
      <div className="text-center mb-6 sm:mb-8">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <FaEnvelope className="text-red-500 text-2xl sm:text-3xl" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">Verifica tu correo</h2>
        <p className="text-gray-400 mb-2 text-base sm:text-lg">
          Enviamos un código de 6 dígitos a:
        </p>
        <p className="text-red-500 font-semibold text-lg sm:text-xl break-all px-2">{correo}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3 mb-2">
          {codigo.map((digito, index) => (
            <input
              key={index}
              ref={el => inputsRef.current[index] = el}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digito}
              onChange={(e) => manejarCambioCodigo(index, e.target.value)}
              onKeyDown={(e) => manejarKeyDown(index, e)}
              onPaste={manejarPaste}
              className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-bold bg-neutral-900 text-white border-2 border-white/10 rounded-lg sm:rounded-xl focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30 transition-colors"
              disabled={estaCargando}
            />
          ))}
        </div>

        <div className="text-center text-sm text-gray-400 mb-2">
          <FaClock className="inline mr-2 mb-1" />
          El código expira en:
          <span className={`font-mono ml-1 ${tiempoRestante < 60 ? 'text-red-500 font-bold' : 'text-gray-300'}`}>
            {minutos}:{segundos.toString().padStart(2, '0')}
          </span>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <button
            type="submit"
            disabled={codigoCompleto.length !== 6 || estaCargando}
            className="w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg disabled:bg-neutral-800 disabled:bg-none disabled:text-gray-500 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
          >
            {estaCargando ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-white mr-2 sm:mr-3"></div>
                Verificando...
              </div>
            ) : (
              <>
                <FaCheck className="mr-2 sm:mr-3" />
                Verificar Código
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={manejarReenviar}
              disabled={!puedeReenviar || estaCargando}
              className="text-red-500 hover:text-red-400 font-medium disabled:text-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center mx-auto text-sm sm:text-base"
            >
              <FaRedo className="mr-2" />
              Reenviar código
            </button>
          </div>
        </div>
        <div className="text-center text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
          <p>¿No recibiste el código? Revisa tu carpeta de spam</p>
        </div>
      </form>
    </div>
  );
};

export default VerificacionCorreo;