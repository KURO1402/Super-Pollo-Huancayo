import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const ToastTemaWrapper = () => {
  const location = useLocation();
  const { theme } = useTheme();

  const esRutaAdmin = location.pathname.startsWith('/admin');

  const toastTheme = esRutaAdmin && theme === 'dark' ? 'dark' : 'light';

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={toastTheme}
      limit={5}
    />
  );
};

export default ToastTemaWrapper;