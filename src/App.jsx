import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import FondoAnimado from './components/FondoAnimado';
import Inicio from './pages/Inicio';
import Pilotos from './pages/Pilotos';
import Equipos from './pages/Equipos';
import Carreras from './pages/Carreras';
import Estadisticas from './pages/Estadisticas';

const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* Fondo animado global */}
      <FondoAnimado />
      
      {/* Navbar fija */}
      <Navbar />
      
      {/* Contenedor principal - sin padding en home, con padding en otras páginas */}
      <main className={isHomePage ? '' : 'min-h-screen pt-20 pb-10'}>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/pilotos" element={<Pilotos />} />
          <Route path="/equipos" element={<Equipos />} />
          <Route path="/carreras" element={<Carreras />} />
          <Route path="/estadisticas" element={<Estadisticas />} />
        </Routes>
      </main>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
