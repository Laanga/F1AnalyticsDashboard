import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Clock, Trophy, Flag, Users, Timer, Medal, Activity, Zap, Target } from 'lucide-react';
import { formatearFecha, formatearFechaHora, getTiempoRestante, isCarreraCompletada } from '../../utils/dateUtils';
import { getCompleteMeetingResults, categorizeSessionsByType } from '../../services/openf1Service';
import { getDriverPhoto } from '../../utils/formatUtils';

/**
 * Modal para mostrar detalles completos de una carrera
 */
const RaceModal = ({ isOpen, onClose, carrera, meeting }) => {
  // Hooks deben estar siempre al inicio del componente
  const [meetingData, setMeetingData] = useState(null);
  const [loadingMeeting, setLoadingMeeting] = useState(false);
  const [activeTab, setActiveTab] = useState('race');
  const [categorizedSessions, setCategorizedSessions] = useState({
    practice: [],
    qualifying: [],
    sprint: [],
    race: []
  });

  // Calcular valores derivados después de los hooks
  const isCompleted = carrera ? isCarreraCompletada(carrera.date_end) : false;

  // Función para cargar todos los datos del meeting
  const loadMeetingData = async () => {
    if (!meeting?.meeting_key) return;
    
    setLoadingMeeting(true);
    try {
      const data = await getCompleteMeetingResults(meeting.meeting_key);
      setMeetingData(data);
      
      // Categorizar sesiones por tipo
      const categorized = categorizeSessionsByType(data.session_list);
      setCategorizedSessions(categorized);
      
      // Establecer la pestaña activa basada en la sesión actual
      const currentSessionType = (carrera?.session_name || carrera?.session_type || '').toLowerCase();
      if (currentSessionType.includes('practice') || currentSessionType.includes('free')) {
        setActiveTab('practice');
      } else if (currentSessionType.includes('qualifying')) {
        setActiveTab('qualifying');
      } else if (currentSessionType.includes('sprint')) {
        setActiveTab('sprint');
      } else {
        setActiveTab('race');
      }
    } catch (error) {
      console.error('Error al cargar datos del meeting:', error);
      setMeetingData(null);
    } finally {
      setLoadingMeeting(false);
    }
  };

  // Cargar datos del meeting cuando el modal se abre
  useEffect(() => {
    if (isOpen && meeting?.meeting_key) {
      loadMeetingData();
    }
  }, [isOpen, meeting?.meeting_key]);

  // Función para obtener el icono de cada tipo de sesión
  const getSessionIcon = (type) => {
    switch (type) {
      case 'practice':
        return <Activity className="w-4 h-4" />;
      case 'qualifying':
        return <Target className="w-4 h-4" />;
      case 'sprint':
        return <Zap className="w-4 h-4" />;
      case 'race':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Flag className="w-4 h-4" />;
    }
  };

  // Función para obtener el nombre de cada tipo de sesión
  const getSessionName = (type) => {
    switch (type) {
      case 'practice':
        return 'Entrenamientos Libres';
      case 'qualifying':
        return 'Clasificación';
      case 'sprint':
        return 'Sprint';
      case 'race':
        return 'Carrera';
      default:
        return 'Sesión';
    }
  };

  // Función para renderizar los resultados de una sesión
  const renderSessionResults = (sessionType) => {
    const sessions = categorizedSessions[sessionType] || [];
    
    if (sessions.length === 0) {
      return (
        <div className="text-center py-8">
          <Flag className="w-12 h-12 text-white/40 mx-auto mb-3" />
          <p className="text-white/60">
            No hay sesiones de {getSessionName(sessionType).toLowerCase()} disponibles
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {sessions.map((session, sessionIndex) => {
          const sessionResults = meetingData?.sessions[session.session_key]?.results || [];
          const sessionInfo = meetingData?.sessions[session.session_key]?.session_info || session;
          
          return (
            <div key={session.session_key} className="glass rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white flex items-center space-x-2">
                  {getSessionIcon(sessionType)}
                  <span>{sessionInfo.session_name || getSessionName(sessionType)}</span>
                </h4>
                <span className="text-white/60 text-sm">
                  {formatearFechaHora(sessionInfo.date_start)}
                </span>
              </div>
              
              {loadingMeeting ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto"></div>
                  <p className="text-white/60 mt-2 text-sm">Cargando resultados...</p>
                </div>
              ) : sessionResults.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {sessionResults.slice(0, 20).map((result, index) => (
                    <motion.div
                      key={result.driver_number || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-xs">
                          {result.position || index + 1}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {result.driver_info?.full_name || result.driver_info?.broadcast_name || `Piloto #${result.driver_number}`}
                          </p>
                          <p className="text-white/60 text-xs">
                            {result.driver_info?.team_name || 'Equipo no disponible'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end">
                        <div className="relative">
                          <img
                            src={getDriverPhoto(result.driver_info) || '/drivers/default.png'}
                            alt={result.driver_info?.full_name || `Piloto #${result.driver_number}`}
                            className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                            onError={(e) => {
                              // Si la imagen falla, mostrar el fallback con número
                              e.target.style.display = 'none';
                              e.target.nextElementSibling.style.display = 'flex';
                            }}
                          />
                          <div 
                            className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center text-white font-bold text-xs border-2 border-white/20"
                            style={{ display: 'none' }}
                          >
                            {result.driver_number || '?'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {sessionResults.length > 20 && (
                    <p className="text-white/60 text-center text-xs mt-2">
                      Mostrando top 20 de {sessionResults.length} pilotos
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Flag className="w-6 h-6 text-white/40 mx-auto mb-2" />
                  <p className="text-white/60 text-sm">
                    No hay resultados disponibles para esta sesión
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // Return condicional después de todos los hooks
  if (!carrera) return null;
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900/95 backdrop-blur-xl rounded-3xl border border-white/10 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="relative p-6 border-b border-white/10">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-gradient-to-br from-green-500 to-green-600' 
                      : 'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                    <span className="text-2xl font-bold text-white">
                      {carrera.session_name?.replace('Race', 'R') || 'R'}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      {meeting?.meeting_name || carrera.session_name || 'Gran Premio'}
                    </h2>
                    <div className="flex items-center space-x-4 text-white/60">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{meeting?.location || 'Ubicación no disponible'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatearFecha(carrera.date_start)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Status Badge */}
                <div className="flex justify-center">
                  <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                    isCompleted
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {isCompleted ? 'Evento Completado' : 'Próximo Evento'}
                  </div>
                </div>

                {/* Meeting Information */}
                {meeting && (
                  <div className="glass rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Users className="w-5 h-5 text-purple-400" />
                      <h3 className="font-semibold text-white">Información del Evento</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-white/80">
                      <div className="flex justify-between">
                        <span>País:</span>
                        <span>{meeting.country_name || 'No disponible'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Circuito:</span>
                        <span>{meeting.circuit_short_name || meeting.location || 'No disponible'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Año:</span>
                        <span>{meeting.year || new Date(carrera.date_start).getFullYear()}</span>
                      </div>
                      {meeting.gmt_offset && (
                        <div className="flex justify-between">
                          <span>Zona Horaria:</span>
                          <span>GMT{meeting.gmt_offset}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Session Tabs */}
                <div className="glass rounded-xl p-1">
                  <div className="flex space-x-1">
                    {['practice', 'qualifying', 'sprint', 'race'].map((tab) => {
                      const hasData = categorizedSessions[tab]?.length > 0;
                      return (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          disabled={!hasData}
                          className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                            activeTab === tab
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                              : hasData
                              ? 'text-white/70 hover:text-white hover:bg-white/10'
                              : 'text-white/30 cursor-not-allowed'
                          }`}
                        >
                          {getSessionIcon(tab)}
                          <span>{getSessionName(tab)}</span>
                          {hasData && (
                            <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                              {categorizedSessions[tab].length}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Session Content */}
                <div className="min-h-[300px]">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      {renderSessionResults(activeTab)}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>


            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RaceModal;