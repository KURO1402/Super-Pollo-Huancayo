import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { SiMercadopago } from "react-icons/si";

initMercadoPago(import.meta.env.VITE_PUBLIC_KEY_MERCADOPAGO);

const MercadoPagoButton = ({ 
  monto, 
  datosReserva, 
  onPaymentSuccess, 
  onPaymentError,
  disabled,
  preferenceId
}) => {
  const customization = {
    visual: {
      buttonBackground: "black",
      borderRadius: "8px"
    },
    texts: {
      action: "pay",
      valueProp: "security_safety"
    }
  };

  if (disabled) {
    return (
      <button 
        disabled
        className="w-full p-1 rounded-xl font-extrabold text-lg bg-gray-600 text-gray-400 cursor-not-allowed flex items-center justify-center gap-3"
      >
        <SiMercadopago className="w-15 h-16 text-gray-500" />
        Datos incompletos
      </button>
    );
  }

  return (
    <div className="w-full">
      <Wallet 
        initialization={{ preferenceId: preferenceId }}
        customization={customization}
        onError={(error) => onPaymentError?.(error)}
      />
    </div>
  );
};

export default MercadoPagoButton;