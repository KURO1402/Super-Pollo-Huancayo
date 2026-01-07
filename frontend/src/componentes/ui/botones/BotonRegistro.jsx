import { Link } from 'react-router-dom'

const BotonRegistro = () => {
    return ( 
        <Link to='/registro'>
            <button className="text-gray-100 text-sm md:text-base hover:text-rojo transition-colors duration-200 px-2 py-1 rounded-md hover:bg-azul-primario cursor-pointer">
                Registrarse
            </button>
        </Link>
     );
}
 
export default BotonRegistro;