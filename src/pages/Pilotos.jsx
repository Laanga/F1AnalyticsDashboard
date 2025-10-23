import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDrivers } from '../services/openf1Service';
import CardPiloto from '../components/pilotos/CardPiloto';
import Loader from '../components/ui/Loader';
import { X, User, Flag, Hash, Shield, Info } from 'lucide-react';
import { getDriverNationality } from '../utils/nationalityUtils';
import { getDriverFlag } from '../utils/flagUtils.jsx';
import { getTeamLogo } from '../utils/formatUtils';
import { useYear } from '../contexts/YearContext';

const Pilotos = () => {
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pilotoSeleccionado, setPilotoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const { selectedYear } = useYear();

  useEffect(() => {
    const cargarPilotos = async () => {
      try {
        setLoading(true);
        const data = await getDrivers(selectedYear);
        setPilotos(data);
      } catch (error) {
        console.error('Error al cargar pilotos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarPilotos();
  }, [selectedYear]);

  const handleClickPiloto = (piloto) => {
    setPilotoSeleccionado(piloto);
    setModalAbierto(true);
  };

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
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-10"
      >
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-white mb-3"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Pilotos
          <motion.span 
            className="text-f1-red font-bold ml-3"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5, type: "spring", stiffness: 200 }}
          >
            Temporada {selectedYear}
          </motion.span>
        </motion.h1>
        <motion.p 
          className="text-white/60 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {pilotos.length} pilotos activos en la temporada {selectedYear}
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {pilotos.map((piloto, index) => (
          <motion.div
            key={piloto.driver_number || index}
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ 
              delay: 0.5 + index * 0.08,
              duration: 0.6,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            whileHover={{ 
              y: -8, 
              scale: 1.03,
              rotateY: 2,
              transition: { duration: 0.3, ease: "easeOut" }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <CardPiloto
              piloto={piloto}
              onClick={() => handleClickPiloto(piloto)}
            />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {modalAbierto && pilotoSeleccionado && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleCerrarModal}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 100, rotateX: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 100, rotateX: 15 }}
              transition={{ 
                type: "spring", 
                damping: 20, 
                stiffness: 300,
                duration: 0.6
              }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div 
                className="glass rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
                style={{
                  background: pilotoSeleccionado.team_colour ? 
                    `linear-gradient(135deg, rgba(${parseInt(pilotoSeleccionado.team_colour.slice(0,2), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(2,4), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(4,6), 16)}, 0.1) 0%, rgba(0, 0, 0, 0.8) 100%)` :
                    undefined,
                  borderColor: pilotoSeleccionado.team_colour ? 
                    `#${pilotoSeleccionado.team_colour}40` : 
                    undefined,
                  boxShadow: pilotoSeleccionado.team_colour ? 
                    `0 20px 40px rgba(${parseInt(pilotoSeleccionado.team_colour.slice(0,2), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(2,4), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(4,6), 16)}, 0.2)` :
                    undefined
                }}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-start space-x-6">
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

                
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6"
                >
                  <motion.div 
                    className="glass-dark rounded-xl p-4 relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      boxShadow: pilotoSeleccionado.team_colour ? 
                        `0 10px 25px rgba(${parseInt(pilotoSeleccionado.team_colour.slice(0,2), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(2,4), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(4,6), 16)}, 0.3)` :
                        "0 10px 25px rgba(239, 68, 68, 0.3)"
                    }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <User className="w-4 h-4" style={{ color: pilotoSeleccionado.team_colour ? `#${pilotoSeleccionado.team_colour}` : '#ef4444' }} />
                      </motion.div>
                      <p className="text-white/50 text-xs">Acrónimo</p>
                    </div>
                    <motion.p 
                      className="text-white font-bold text-xl"
                      whileHover={{ scale: 1.1 }}
                    >
                      {pilotoSeleccionado.name_acronym || 'N/A'}
                    </motion.p>
                  </motion.div>

                  <motion.div 
                    className="glass-dark rounded-xl p-4 relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      boxShadow: pilotoSeleccionado.team_colour ? 
                        `0 10px 25px rgba(${parseInt(pilotoSeleccionado.team_colour.slice(0,2), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(2,4), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(4,6), 16)}, 0.3)` :
                        "0 10px 25px rgba(239, 68, 68, 0.3)"
                    }}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      {getDriverFlag(pilotoSeleccionado) ? (
                        <motion.img 
                          src={getDriverFlag(pilotoSeleccionado)} 
                          alt={`Bandera de ${getDriverNationality(pilotoSeleccionado)}`}
                          className="w-5 h-4 rounded-sm object-cover shadow-sm"
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextElementSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Flag 
                          className="w-4 h-4 hidden" 
                          style={{ 
                            display: getDriverFlag(pilotoSeleccionado) ? 'none' : 'block',
                            color: pilotoSeleccionado.team_colour ? `#${pilotoSeleccionado.team_colour}` : '#ef4444'
                          }}
                        />
                      </motion.div>
                      <p className="text-white/50 text-xs">Nacionalidad</p>
                    </div>
                    <motion.p 
                      className="text-white font-bold text-xl"
                      whileHover={{ scale: 1.1 }}
                    >
                      {getDriverNationality(pilotoSeleccionado)}
                    </motion.p>
                  </motion.div>

                  <motion.div 
                    className="glass-dark rounded-xl p-4 relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      boxShadow: pilotoSeleccionado.team_colour ? 
                        `0 10px 25px rgba(${parseInt(pilotoSeleccionado.team_colour.slice(0,2), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(2,4), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(4,6), 16)}, 0.3)` :
                        "0 10px 25px rgba(239, 68, 68, 0.3)"
                    }}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Hash className="w-4 h-4" style={{ color: pilotoSeleccionado.team_colour ? `#${pilotoSeleccionado.team_colour}` : '#ef4444' }} />
                      </motion.div>
                      <p className="text-white/50 text-xs">Número</p>
                    </div>
                    <motion.p 
                      className="text-white font-bold text-xl"
                      whileHover={{ scale: 1.1 }}
                    >
                      {pilotoSeleccionado.driver_number || 'N/A'}
                    </motion.p>
                  </motion.div>


                </motion.div>

                {/* Información adicional del equipo */}
                {pilotoSeleccionado.team_name && pilotoSeleccionado.team_colour && (
                  <motion.div
                    initial={{ y: 40, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
                    className="glass-dark rounded-xl p-6 mb-6 relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: `0 15px 35px rgba(${parseInt(pilotoSeleccionado.team_colour.slice(0,2), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(2,4), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(4,6), 16)}, 0.4)`
                    }}
                  >
                    <motion.h3 
                      className="text-lg font-bold text-white mb-4 flex items-center space-x-2"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                    >
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.6 }}
                      >
                        <Shield className="w-5 h-5" style={{ color: `#${pilotoSeleccionado.team_colour}` }} />
                      </motion.div>
                      <span>Información del Equipo</span>
                    </motion.h3>
                    
                    <motion.div 
                      className="flex items-center space-x-4"
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                    >
                      <motion.div 
                        className="w-16 h-16 rounded-xl shadow-lg relative bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center overflow-hidden"
                        style={{ 
                          boxShadow: `0 8px 20px rgba(${parseInt(pilotoSeleccionado.team_colour.slice(0,2), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(2,4), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(4,6), 16)}, 0.4)`
                        }}
                        whileHover={{ 
                          scale: 1.1, 
                          rotate: 5,
                          boxShadow: `0 12px 30px rgba(${parseInt(pilotoSeleccionado.team_colour.slice(0,2), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(2,4), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(4,6), 16)}, 0.6)`
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.img
                          src={getTeamLogo(pilotoSeleccionado.team_name)}
                          alt={`Logo ${pilotoSeleccionado.team_name}`}
                          className="w-12 h-12 object-contain"
                          whileHover={{ scale: 1.1 }}
                          onError={(e) => {
                            // Si falla la imagen, mostrar un cuadro de color como fallback
                            e.target.style.display = 'none';
                            e.target.parentElement.style.background = `linear-gradient(135deg, #${pilotoSeleccionado.team_colour}, rgba(${parseInt(pilotoSeleccionado.team_colour.slice(0,2), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(2,4), 16)}, ${parseInt(pilotoSeleccionado.team_colour.slice(4,6), 16)}, 0.7))`;
                          }}
                        />
                      </motion.div>
                      <div className="flex-1">
                        <motion.p 
                          className="text-white font-semibold text-lg"
                          whileHover={{ scale: 1.05, x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          {pilotoSeleccionado.team_name}
                        </motion.p>
                        <motion.p 
                          className="text-white/50 text-sm"
                          whileHover={{ scale: 1.05, x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          Equipo oficial de F1
                        </motion.p>
                      </div>
                    </motion.div>
                    
                    {/* Efecto de brillo animado */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        repeatDelay: 3,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                )}

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
