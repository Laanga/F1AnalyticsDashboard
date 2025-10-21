import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDrivers, getCurrentYear } from '../services/openf1Service';
import CardPiloto from '../components/pilotos/CardPiloto';
import Loader from '../components/ui/Loader';
import { X, User, Flag, Hash, Shield, Info } from 'lucide-react';

/**
 * Página de Pilotos - Muestra todos los pilotos con sus detalles
 */
const Pilotos = () => {
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pilotoSeleccionado, setPilotoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const currentYear = getCurrentYear();

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
          <span className="text-f1-red font-bold ml-3">{currentYear}</span>
        </h1>
        <p className="text-white/60 text-lg">
          {pilotos.length} pilotos activos en la temporada {currentYear}
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
              <div className="glass rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header del modal */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-start space-x-6">
                    {/* Foto grande del piloto */}
                    {pilotoSeleccionado.headshot_url ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-f1 shadow-2xl shadow-f1-red/30 flex-shrink-0"
                      >
                        <img 
                          src={pilotoSeleccionado.headshot_url} 
                          alt={pilotoSeleccionado.full_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'flex';
                          }}
                        />
                        <div 
                          className="w-full h-full bg-gradient-f1 items-center justify-center hidden"
                          style={{ display: 'none' }}
                        >
                          <span className="text-5xl font-bold text-white">
                            {pilotoSeleccionado.driver_number}
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-32 h-32 rounded-2xl bg-gradient-f1 flex items-center justify-center shadow-2xl shadow-f1-red/30 flex-shrink-0"
                      >
                        <span className="text-5xl font-bold text-white">
                          {pilotoSeleccionado.driver_number}
                        </span>
                      </motion.div>
                    )}

                    <div className="flex-1">
                      <motion.h2 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl font-bold text-white mb-2"
                      >
                        {pilotoSeleccionado.full_name}
                      </motion.h2>
                      <motion.p 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-white/60 text-lg"
                      >
                        {pilotoSeleccionado.team_name || 'Equipo no disponible'}
                      </motion.p>
                    </div>
                  </div>

                  {/* Botón cerrar */}
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleCerrarModal}
                    className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
                    aria-label="Cerrar modal"
                  >
                    <X className="w-6 h-6 text-white" />
                  </motion.button>
                </div>

                {/* Información del piloto */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"
                >
                  <div className="glass-dark rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-f1-red" />
                      <p className="text-white/50 text-xs">Acrónimo</p>
                    </div>
                    <p className="text-white font-bold text-xl">
                      {pilotoSeleccionado.name_acronym || 'N/A'}
                    </p>
                  </div>

                  {pilotoSeleccionado.country_code && (
                    <div className="glass-dark rounded-xl p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Flag className="w-4 h-4 text-f1-red" />
                        <p className="text-white/50 text-xs">País</p>
                      </div>
                      <p className="text-white font-bold text-xl">
                        {pilotoSeleccionado.country_code}
                      </p>
                    </div>
                  )}

                  <div className="glass-dark rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Hash className="w-4 h-4 text-f1-red" />
                      <p className="text-white/50 text-xs">Número</p>
                    </div>
                    <p className="text-white font-bold text-xl">
                      {pilotoSeleccionado.driver_number || 'N/A'}
                    </p>
                  </div>

                  <div className="glass-dark rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-4 h-4 text-f1-red" />
                      <p className="text-white/50 text-xs">Estado</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-white font-bold text-sm">Activo</p>
                    </div>
                  </div>
                </motion.div>

                {/* Información adicional del equipo */}
                {pilotoSeleccionado.team_name && pilotoSeleccionado.team_colour && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="glass-dark rounded-xl p-6 mb-6"
                  >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-f1-red" />
                      <span>Información del Equipo</span>
                    </h3>
                    
                    <div className="flex items-center space-x-4">
                      <div 
                        className="w-16 h-16 rounded-xl shadow-lg"
                        style={{ 
                          background: `#${pilotoSeleccionado.team_colour}`,
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-white font-semibold text-lg">
                          {pilotoSeleccionado.team_name}
                        </p>
                        <p className="text-white/50 text-sm">
                          Color: #{pilotoSeleccionado.team_colour}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Nota informativa */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="glass-dark rounded-xl p-4 flex items-start space-x-3"
                >
                  <Info className="w-5 h-5 text-f1-red flex-shrink-0 mt-0.5" />
                  <p className="text-white/70 text-sm">
                    Información obtenida de la API oficial de OpenF1. Los datos se actualizan automáticamente después de cada sesión.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pilotos;
