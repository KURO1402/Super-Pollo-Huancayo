import { BrowserRouter } from "react-router-dom";
import AppRutas from "./rutas/Rutas";
import { ThemeProvider } from "./context/ThemeContext";
import ToastTemaWrapper from "./componentes/common/ToastTemaWrapper";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRutas />
        <ToastTemaWrapper />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
