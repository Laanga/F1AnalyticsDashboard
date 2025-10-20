import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRaces, getCurrentSeasonMeetings } from '../services/openf1Service';
import Loader from '../components/Loader';
import { Flag, MapPin, Calendar, Trophy, CheckCircle2 } from 'lucide-react';

/**
 * Página de Carreras - Muestra las carreras de la temporada
 */
const Carreras = () => {
  const [carreras, setCarreras] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCarreras = async () => {
      try {
        setLoading(true);
        const [sesionesData, meetingsData] = await Promise.all([
          getRaces(),
          getCurrentSeasonMeetings(),
        ]);

        // Limitamos a las carreras más recientes
        const carrerasRecientes = sesionesData
          .sort((a, b) => new Date(b.date_start) - new Date(a.date_start))
          .slice(0, 10);

        setCarreras(carrerasRecientes);
        setMeetings(meetingsData);
      } catch (error) {
        console.error('Error al cargar carreras:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarCarreras();
  }, []);

  // Formatea la fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

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
          <span className="gradient-f1 bg-clip-text text-transparent ml-3">2024</span>
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
        <div className="glass glass-hover rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Flag className="w-6 h-6 text-f1-red" />
            <p className="text-white/60 text-sm">Total de Carreras</p>
          </div>
          <p className="text-4xl font-bold text-white">{carreras.length}</p>
        </div>

        <div className="glass glass-hover rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <MapPin className="w-6 h-6 text-f1-red" />
            <p className="text-white/60 text-sm">Grandes Premios</p>
          </div>
          <p className="text-4xl font-bold text-white">{meetings.length}</p>
        </div>

        <div className="glass glass-hover rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-2">
            <Trophy className="w-6 h-6 text-f1-red" />
            <p className="text-white/60 text-sm">Temporada</p>
          </div>
          <p className="text-4xl font-bold text-white">2024</p>
        </div>
      </motion.div>

      {/* Tabla de carreras */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl overflow-hidden"
      >
        {/* Header de la tabla */}
        <div className="bg-white/5 px-6 py-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center space-x-2">
            <Flag className="w-5 h-5 text-f1-red" />
            <span>Carreras Recientes</span>
          </h2>
        </div>

        {/* Contenido de la tabla */}
        <div className="divide-y divide-white/10">
          {carreras.length === 0 ? (
            <div className="px-6 py-12 text-center text-white/50">
              No hay carreras disponibles
            </div>
          ) : (
            carreras.map((carrera, index) => {
              // Buscamos el meeting correspondiente
              const meeting = meetings.find(
                (m) => m.meeting_key === carrera.meeting_key
              );

              return (
                <motion.div
                  key={carrera.session_key || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                  className="px-6 py-5 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                    {/* Información principal */}
                    <div className="flex items-start md:items-center space-x-4 flex-1">
                      {/* Número de carrera */}
                      <div className="w-12 h-12 rounded-xl bg-gradient-f1 flex items-center justify-center flex-shrink-0 shadow-lg shadow-f1-red/20">
                        <span className="text-white font-bold text-lg">
                          {index + 1}
                        </span>
                      </div>

                      {/* Detalles */}
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1 flex items-center space-x-2">
                          <span>
                            {meeting?.meeting_name || carrera.session_name || 'Carrera'}
                          </span>
                          {carrera.session_name === 'Race' && (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          )}
                        </h3>
                        
                        <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {meeting?.location || meeting?.country_name || 'Ubicación no disponible'}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4" />
                            <span>{formatearFecha(carrera.date_start)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Estado */}
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

      {/* Nota informativa */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 glass-dark rounded-2xl p-6 text-center"
      >
        <p className="text-white/60 text-sm">
          <strong className="text-white">Nota:</strong> Los ganadores y resultados 
          detallados se mostrarán con datos reales en futuras implementaciones.
        </p>
      </motion.div>
    </div>
  );
};

export default Carreras;

