import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRaces, getMeetings } from '../services/openf1Service';
import Loader from '../components/ui/Loader';
import RaceModal from '../components/ui/RaceModal';
import { formatearFecha, isCarreraCompletada } from '../utils/dateUtils';
import { Flag, MapPin, Calendar, Trophy, CheckCircle2, Clock } from 'lucide-react';
import { useYear } from '../contexts/YearContext';
import { getTotalRacesForYear } from '../services/config/apiConfig';

/**
 * Página de Carreras - Muestra las carreras de la temporada
 */
const Carreras = () => {
  const [carreras, setCarreras] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRace, setSelectedRace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { selectedYear } = useYear();

  // Función para abrir el modal con los detalles de una carrera
  const openRaceModal = (carrera) => {
    setSelectedRace(carrera);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeRaceModal = () => {
    setIsModalOpen(false);
    setSelectedRace(null);
  };

  useEffect(() => {
    const cargarCarreras = async () => {
      try {
        setLoading(true);
        const [sesionesData, meetingsData] = await Promise.all([
          getRaces(),
          getMeetings(),
        ]);

        // Filtrar carreras por año seleccionado
        const carrerasFiltradas = sesionesData.filter(carrera => {
          const carreraYear = new Date(carrera.date_start).getFullYear();
          return carreraYear === selectedYear;
        });

        setCarreras(carrerasFiltradas);
        setMeetings(meetingsData);
      } catch (error) {
        console.error('Error al cargar carreras:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarCarreras();
  }, [selectedYear]);





  // Separa carreras completadas y próximas
  const carrerasCompletadas = carreras.filter(c => isCarreraCompletada(c.date_end));
  const proximasCarreras = carreras.filter(c => !isCarreraCompletada(c.date_end));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader mensaje="Cargando carreras..." />
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
          Carreras
          <span className="text-f1-red font-bold ml-3">Temporada {selectedYear}</span>
        </h1>
        <p className="text-white/60 text-lg">
          Calendario y resultados de la temporada
        </p>
      </motion.div>

      {/* Estadísticas rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
      >
        <motion.div 
          className="glass glass-hover rounded-2xl p-6 group"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <Flag className="w-6 h-6 text-f1-red" />
            </motion.div>
            <p className="text-white/60 text-sm">Total de Carreras</p>
          </div>
          <motion.p 
            className="text-4xl font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
          >
            {carrerasCompletadas.length} / {getTotalRacesForYear(selectedYear)}
          </motion.p>
          <p className="text-white/40 text-xs mt-1">
            Disputadas / Total temporada
          </p>
        </motion.div>

        <motion.div 
          className="glass glass-hover rounded-2xl p-6 group"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <motion.div
              whileHover={{ scale: 1.2 }}
              transition={{ duration: 0.3 }}
            >
              <CheckCircle2 className="w-6 h-6 text-green-500" />
            </motion.div>
            <p className="text-white/60 text-sm">Completadas</p>
          </div>
          <motion.p 
            className="text-4xl font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
          >
            {carrerasCompletadas.length}
          </motion.p>
        </motion.div>

        <motion.div 
          className="glass glass-hover rounded-2xl p-6 group"
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="w-6 h-6 text-blue-400" />
            </motion.div>
            <p className="text-white/60 text-sm">Por Disputar</p>
          </div>
          <motion.p 
            className="text-4xl font-bold text-white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
          >
            {proximasCarreras.length}
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Próximas Carreras */}
      {proximasCarreras.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
            <Clock className="w-6 h-6 text-blue-400" />
            <span>Próximas Carreras</span>
          </h2>
          
          <div className="glass rounded-2xl overflow-hidden">
            <div className="divide-y divide-white/10">
              {proximasCarreras.map((carrera, index) => {
                const meeting = meetings.find(m => m.meeting_key === carrera.meeting_key);
                
                return (
                  <motion.div
                    key={carrera.session_key || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    whileHover={{ 
                      backgroundColor: 'rgba(59, 130, 246, 0.1)',
                      scale: 1.01,
                      x: 5
                    }}
                    onClick={() => openRaceModal(carrera)}
                    className="px-6 py-5 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-blue-400"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                      <div className="flex items-start md:items-center space-x-4 flex-1">
                        <motion.div 
                          className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20"
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: 5,
                            boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.4)"
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <motion.span 
                            className="text-white font-bold text-lg"
                            whileHover={{ scale: 1.1 }}
                          >
                            {index + 1}
                          </motion.span>
                        </motion.div>

                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg mb-1 flex items-center space-x-2">
                            <span>{meeting?.meeting_name || 'Gran Premio'}</span>
                            <Clock className="w-5 h-5 text-blue-400" />
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{meeting?.location || meeting?.country_name || 'Ubicación'}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatearFecha(carrera.date_start)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="glass-dark px-4 py-2 rounded-lg">
                          <p className="text-white/50 text-xs mb-1">Circuito</p>
                          <p className="text-white font-semibold text-sm">
                            {meeting?.circuit_short_name || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Carreras Completadas */}
      {carrerasCompletadas.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass rounded-2xl overflow-hidden"
        >
          <div className="bg-white/5 px-6 py-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Carreras Completadas</span>
            </h2>
          </div>

          <div className="divide-y divide-white/10">
            {carrerasCompletadas.length === 0 ? (
              <div className="px-6 py-12 text-center text-white/50">
                Todavía no hay carreras completadas en {selectedYear}
              </div>
            ) : (
              carrerasCompletadas.map((carrera, index) => {
                const meeting = meetings.find(m => m.meeting_key === carrera.meeting_key);

                return (
                  <motion.div
                    key={carrera.session_key || index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    whileHover={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      scale: 1.01,
                      x: 5
                    }}
                    onClick={() => openRaceModal(carrera)}
                    className="px-6 py-5 transition-all duration-300 cursor-pointer border-l-4 border-transparent hover:border-green-400"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                      <div className="flex items-start md:items-center space-x-4 flex-1">
                        <motion.div 
                          className="w-12 h-12 rounded-xl bg-gradient-f1 flex items-center justify-center flex-shrink-0 shadow-lg shadow-f1-red/20"
                          whileHover={{ 
                            scale: 1.1, 
                            rotate: -5,
                            boxShadow: "0 20px 25px -5px rgba(220, 38, 38, 0.4)"
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <motion.span 
                            className="text-white font-bold text-lg"
                            whileHover={{ scale: 1.1 }}
                          >
                            {index + 1}
                          </motion.span>
                        </motion.div>

                        <div className="flex-1">
                          <h3 className="text-white font-bold text-lg mb-1 flex items-center space-x-2">
                            <span>{meeting?.meeting_name || carrera.session_name || 'Carrera'}</span>
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          </h3>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4" />
                              <span>{meeting?.location || meeting?.country_name || 'Ubicación'}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{formatearFecha(carrera.date_start)}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="glass-dark px-4 py-2 rounded-lg">
                          <p className="text-white/50 text-xs mb-1">Circuito</p>
                          <p className="text-white font-semibold text-sm">
                            {meeting?.circuit_short_name || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>
      )}

      {/* Mensaje si no hay carreras */}
      {carreras.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-12 text-center"
        >
          <Flag className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/60 text-lg">
            No hay datos de carreras disponibles para {selectedYear}
          </p>
        </motion.div>
      )}

      {/* Modal de detalles de carrera */}
      <RaceModal
        isOpen={isModalOpen}
        onClose={closeRaceModal}
        carrera={selectedRace}
        meeting={selectedRace ? meetings.find(m => m.meeting_key === selectedRace.meeting_key) : null}
      />
    </div>
  );
};

export default Carreras;
