import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDrivers } from '../services/openf1Service';
import CardPiloto from '../components/CardPiloto';
import Loader from '../components/Loader';
import GraficaPuntos from '../components/GraficaPuntos';
import { X, TrendingUp } from 'lucide-react';

/**
 * Página de Pilotos - Muestra todos los pilotos con sus detalles
 */
const Pilotos = () => {
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pilotoSeleccionado, setPilotoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Cargar pilotos al montar el componente
  useEffect(() => {
    const cargarPilotos = async () => {
      try {
        setLoading(true);
        const data = await getDrivers();
        setPilotos(data);
      } catch (error) {
        console.error('Error al cargar pilotos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarPilotos();
  }, []);

  // Manejar clic en tarjeta de piloto
  const handleClickPiloto = (piloto) => {
    setPilotoSeleccionado(piloto);
    setModalAbierto(true);
  };

  // Cerrar modal
  const handleCerrarModal = () => {
    setModalAbierto(false);
    setTimeout(() => setPilotoSeleccionado(null), 300);
  };

  // Datos de ejemplo para la gráfica (en una implementación real, estos vendrían de la API)
  const datosGraficaEjemplo = [
    { name: 'Carrera 1', value: 25 },
    { name: 'Carrera 2', value: 18 },
    { name: 'Carrera 3', value: 25 },
    { name: 'Carrera 4', value: 15 },
    { name: 'Carrera 5', value: 25 },
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader mensaje="Cargando pilotos..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Pilotos
          <span className="text-f1-red font-bold ml-3">2024</span>
        </h1>
        <p className="text-white/60 text-lg">
          Explora el rendimiento de cada piloto de la temporada actual
        </p>
      </motion.div>

      {/* Grid de pilotos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {pilotos.map((piloto, index) => (
          <motion.div
            key={piloto.driver_number || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <CardPiloto
              piloto={piloto}
              onClick={() => handleClickPiloto(piloto)}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Modal de detalles del piloto */}
      <AnimatePresence>
        {modalAbierto && pilotoSeleccionado && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCerrarModal}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="glass rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header del modal */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-f1 flex items-center justify-center shadow-lg shadow-f1-red/30">
                      <span className="text-4xl font-bold text-white">
                        {pilotoSeleccionado.driver_number}
                      </span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white">
                        {pilotoSeleccionado.full_name}
                      </h2>
                      <p className="text-white/60">
                        {pilotoSeleccionado.team_name || 'Equipo no disponible'}
                      </p>
                    </div>
                  </div>

                  {/* Botón cerrar */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCerrarModal}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                    aria-label="Cerrar modal"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>

                {/* Información adicional */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="glass-dark rounded-xl p-4">
                    <p className="text-white/50 text-xs mb-1">Acrónimo</p>
                    <p className="text-white font-bold text-lg">
                      {pilotoSeleccionado.name_acronym || 'N/A'}
                    </p>
                  </div>
                  <div className="glass-dark rounded-xl p-4">
                    <p className="text-white/50 text-xs mb-1">País</p>
                    <p className="text-white font-bold text-lg">
                      {pilotoSeleccionado.country_code || 'N/A'}
                    </p>
                  </div>
                  <div className="glass-dark rounded-xl p-4">
                    <p className="text-white/50 text-xs mb-1">Número</p>
                    <p className="text-white font-bold text-lg">
                      #{pilotoSeleccionado.driver_number || 'N/A'}
                    </p>
                  </div>
                  <div className="glass-dark rounded-xl p-4">
                    <p className="text-white/50 text-xs mb-1">Estado</p>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-white font-bold text-sm">Activo</p>
                    </div>
                  </div>
                </div>

                {/* Gráfica de rendimiento (datos de ejemplo) */}
                <div className="mb-4">
                  <GraficaPuntos
                    datos={datosGraficaEjemplo}
                    tipo="linea"
                    titulo="Rendimiento en las últimas carreras"
                  />
                </div>

                {/* Nota informativa */}
                <div className="glass-dark rounded-xl p-4 flex items-start space-x-3">
                  <TrendingUp className="w-5 h-5 text-f1-red flex-shrink-0 mt-0.5" />
                  <p className="text-white/70 text-sm">
                    Los datos de rendimiento y estadísticas detalladas se actualizarán 
                    con información en tiempo real de las próximas carreras.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pilotos;

