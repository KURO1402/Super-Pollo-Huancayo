import { Link } from 'react-router-dom';
import { FaHome} from 'react-icons/fa';

const NotFound = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
    <div className="mb-8">
      <div className="relative">
        <div className="text-9xl font-bold text-azul-primario opacity-10">404</div>
      </div>
    </div>
    <p className="text-xl text-gray-600 mb-10 text-center max-w-2xl">
      Lo sentimos, no pudimos encontrar la página que estás buscando. 
      Mientras tanto, puedes volver al inicio.
    </p>

    <div className="flex flex-col sm:flex-row gap-4 mb-12">
      <Link 
        to="/" 
        className="flex items-center justify-center px-6 py-3 bg-azul-primario text-white rounded-lg hover:bg-azul-secundario transition duration-300 font-medium"
      >
        <FaHome className="mr-2" />
        Volver al Inicio
      </Link>
    </div>
  </div>
);

export default NotFound;
