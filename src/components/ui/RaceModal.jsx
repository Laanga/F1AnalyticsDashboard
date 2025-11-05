import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Clock, Trophy, Flag, Users, Timer, Medal, Activity, Zap, Target, Info } from 'lucide-react';
import { formatearFecha, formatearFechaHora, getTiempoRestante, isCarreraCompletada } from '../../utils/dateUtils';
import { getCompleteMeetingResults, categorizeSessionsByType } from '../../services/openf1Service';
import { getDriverPhoto } from '../../utils/formatUtils';
import { getTeamColor } from '../../utils/chartColors';

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
  const [showEventInfo, setShowEventInfo] = useState(false);

  const isCompleted = carrera ? isCarreraCompletada(carrera.date_end) : false;

  const loadMeetingData = async () => {
    if (!meeting?.meeting_key) return;
    
    setLoadingMeeting(true);
    try {
      const data = await getCompleteMeetingResults(meeting.meeting_key);
      setMeetingData(data);
      
      // Categorizar sesiones por tipo
      const categorized = categorizeSessionsByType(data.session_list);
      setCategorizedSessions(categorized);
      
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

  useEffect(() => {
    if (isOpen && meeting?.meeting_key) {
      loadMeetingData();
    }
  }, [isOpen, meeting?.meeting_key]);

  // Bloquear scroll del body cuando el modal esté abierto
  useEffect(() => {
    if (isOpen) {
      // Guardar el scroll actual
      const scrollY = window.scrollY;
      
      // Bloquear scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      // Cleanup: restaurar scroll cuando el modal se cierre
      return () => {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        
        // Restaurar posición de scroll
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

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
          const typeTextForSession = String((sessionInfo.session_name || sessionInfo.session_type || sessionType || '')).toLowerCase();
          const showTimeColumn = /race|sprint/.test(typeTextForSession);
          
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
              
              {sessionResults.length > 0 ? (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {/* Cabecera fija */}
                  <div className="sticky top-0 z-10 grid grid-cols-12 gap-2 px-4 py-2 bg-black/40 backdrop-blur-sm border-b border-white/10">
                    <div className="col-span-2 text-white/80 text-sm font-medium">Pos / Nº</div>
                    <div className="col-span-4 text-white/80 text-sm font-medium">Piloto</div>
                    <div className={`${showTimeColumn ? 'col-span-4' : 'col-span-6'} text-white/80 text-sm font-medium`}>Equipo</div>
                    {showTimeColumn && (
                      <div className="col-span-2 text-white/80 text-sm font-medium text-right">Tiempo / Gap</div>
                    )}
                  </div>

                  {sessionResults.slice(0, 20).map((result, index) => {
                    const pos = result.position || index + 1;
                    const teamName = result.driver_info?.team_name || 'Equipo no disponible';
                    const teamColor = getTeamColor(teamName);
                    const typeText = String((sessionInfo.session_name || sessionInfo.session_type || sessionType || '')).toLowerCase();
                    const isRaceLike = /race|sprint/.test(typeText);
                    const isPractice = /(practice|fp1|fp2|fp3|free practice)/.test(typeText);
                    const isQualy = /(qualifying|q1|q2|q3)/.test(typeText);
                    const gapOrInterval = result.gap_to_leader || result.interval;
                    const lapOrTime = result.time || result.best_lap_time || result.duration;
                    const statusCandidates = [result.status, result.finish_status, result.classification, result.status_text, result.result];
                    const statusText = statusCandidates.find(Boolean);
                    const s = statusText ? String(statusText).toUpperCase() : '';
                    const posText = String(result.position_text || '').toUpperCase();
                    const parseTimeToMs = (val) => {
                      if (val == null) return null;
                      if (typeof val === 'number') return val;
                      // formatos esperados "M:SS.mmm" o "SS.mmm"
                      const parts = String(val).trim().split(':');
                      let ms = 0;
                      if (parts.length === 2) {
                        const m = parseInt(parts[0], 10) || 0;
                        const s = parseFloat(parts[1]) || 0;
                        ms = m * 60 * 1000 + s * 1000;
                      } else {
                        const s = parseFloat(parts[0]) || 0;
                        ms = s * 1000;
                      }
                      return ms;
                    };

                    const pickQualyBest = (dur, gaps) => {
                      // dur/gaps pueden ser arrays [Q1,Q2,Q3] o primitivos
                      if (Array.isArray(dur)) {
                        const candidates = dur.filter(Boolean);
                        if (candidates.length === 0) return null;
                        // Elegir mejor vuelta (mínimo tiempo)
                        let best = candidates[0];
                        let bestMs = parseTimeToMs(best);
                        for (let i = 1; i < candidates.length; i++) {
                          const ms = parseTimeToMs(candidates[i]);
                          if (ms != null && (bestMs == null || ms < bestMs)) {
                            best = candidates[i];
                            bestMs = ms;
                          }
                        }
                        return best;
                      }
                      return dur || (Array.isArray(gaps) ? gaps.filter(Boolean).slice(-1)[0] : gaps);
                    };

                    const timeOrGap = (() => {
                      // Estados explícitos conocidos (prioridad alta)
                      if (s.includes('DNF') || s.includes('RETIRED') || s === 'R' || posText.includes('DNF') || posText === 'R' || posText.includes('RET')) return 'DNF';
                      if (s.includes('DNS') || posText.includes('DNS')) return 'DNS · No salió';
                      if (s.includes('DSQ') || s.includes('DQ') || s.includes('DISQUALIFIED') || posText.includes('DSQ')) return 'DSQ · Descalificado';
                      if (s.includes('NC') || s.includes('NOT CLASSIFIED') || posText.includes('NC')) return 'NC · No clasificado';

                      // Libres: no mostrar tiempos
                      if (isPractice) return '—';

                      // Clasificación: no mostrar tiempos de momento
                      if (isQualy) return '—';

                      // Carrera/Sprint
                      if (isRaceLike) {
                        if (pos === 1) return '-';
                        if (gapOrInterval) return gapOrInterval;
                        if (lapOrTime) return lapOrTime;
                        if (posText.includes('DNF') || posText === 'R' || posText.includes('RET')) return 'DNF';
                        // Por defecto, si no hay datos mostrables en carrera, considerar DNF
                        return 'DNF';
                      }

                      // Fallback: mejor tiempo si existe
                      if (lapOrTime) return lapOrTime;
                      return 'Sin tiempo';
                    })();
                    const driverName = result.driver_info?.full_name || result.driver_info?.broadcast_name || `Piloto #${result.driver_number}`;

                    return (
                      <motion.div
                        key={result.driver_number || index}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="grid grid-cols-12 gap-3 items-center rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                        style={{ borderLeft: `4px solid ${teamColor}` }}
                      >
                        {/* Pos / Nº */}
                        <div className="col-span-2 flex items-center space-x-3 px-4 py-3">
                          <div 
                            className={`relative w-10 h-10 rounded-lg flex items-center justify-center text-sm font-extrabold shadow-lg border ${
                              pos === 1
                                ? 'bg-gradient-to-br from-yellow-300 via-yellow-400 to-amber-500 text-black border-yellow-200/50 shadow-yellow-400/30'
                                : pos === 2
                                ? 'bg-gradient-to-br from-gray-300 via-gray-400 to-slate-500 text-black border-gray-200/50 shadow-gray-400/30'
                                : pos === 3
                                ? 'bg-gradient-to-br from-amber-600 via-orange-500 to-amber-700 text-white border-amber-300/50 shadow-amber-500/30'
                                : 'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-white border-slate-400/30 shadow-slate-600/20'
                            }`}
                          >
                            {pos}
                          </div>
                          <span className="text-white/80 text-sm">#{result.driver_number || '?'}</span>
                        </div>

                        {/* Piloto */}
                        <div className="col-span-4 flex items-center space-x-3 px-2 py-2">
                          <div className="relative">
                            <img
                              src={getDriverPhoto(result.driver_info) || '/drivers/default.png'}
                              alt={driverName}
                              className="w-9 h-9 rounded-full object-cover border-2 border-white/20"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                            <div 
                              className="w-9 h-9 rounded-full bg-gradient-to-r from-gray-600 to-gray-700 flex items-center justify-center text-white font-bold text-xs border-2 border-white/20"
                              style={{ display: 'none' }}
                            >
                              {result.driver_number || '?'}
                            </div>
                          </div>
                          <p className="text-white font-semibold text-base truncate">{driverName}</p>
                        </div>

                        {/* Equipo */}
                        <div className={`${showTimeColumn ? 'col-span-4' : 'col-span-6'} px-2 py-2`}>
                          <p className="text-white/80 text-base truncate">{teamName}</p>
                        </div>

                        {/* Tiempo / Gap */}
                        {showTimeColumn && (
                          <div className="col-span-2 px-4 py-3 text-right">
                            <p className="text-white text-base font-semibold">{timeOrGap}</p>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}

                  {sessionResults.length > 20 && (
                    <p className="text-white/60 text-center text-xs mt-2">
                      Mostrando top 20 de {sessionResults.length} pilotos
                    </p>
                  )}
                </div>
              ) : loadingMeeting ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400 mx-auto"></div>
                  <p className="text-white/60 mt-2 text-sm">Cargando resultados...</p>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass glass-hover rounded-3xl border border-white/20 shadow-glass w-full sm:max-w-5xl max-w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Header */}
              <div className="relative p-4 sm:p-5 border-b border-white/10" style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                backdropFilter: 'blur(10px)'
              }}>
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-3 right-3 p-2.5 rounded-full glass border border-white/20 hover:border-white/30 transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-wrap items-start gap-3 sm:flex-nowrap sm:space-x-3"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center glass border border-white/20 shadow-glass ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-green-500/30 to-green-600/30' 
                        : 'bg-gradient-to-br from-blue-500/30 to-blue-600/30'
                    }`}
                    style={{
                      backdropFilter: 'blur(10px)',
                      boxShadow: isCompleted 
                        ? '0 8px 25px rgba(34, 197, 94, 0.3)' 
                        : '0 8px 25px rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    <span className="text-xl font-bold text-white">
                      {carrera.session_name?.replace('Race', 'R') || 'R'}
                    </span>
                  </motion.div>
                  
                  <div className="flex-1">
                    <motion.h2 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-lg font-bold text-white mb-1"
                    >
                      {meeting?.meeting_name || carrera.session_name || 'Gran Premio'}
                    </motion.h2>
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center space-x-2 text-white/60 text-xs"
                    >
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{meeting?.location || 'Ubicación no disponible'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatearFecha(carrera.date_start)}</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Content */}
              <div className="p-4 sm:p-6 space-y-6">
                {/* Loading State */}
                {loadingMeeting && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-12 space-y-4"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-f1-red/30 border-t-f1-red rounded-full"
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-center"
                    >
                      <p className="text-white font-medium mb-1">Cargando datos de la carrera...</p>
                      <p className="text-white/60 text-sm">Obteniendo información detallada del evento</p>
                    </motion.div>
                    
                    {/* Loading dots animation */}
                    <div className="flex space-x-1">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 1, 0.5]
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.2
                          }}
                          className="w-2 h-2 bg-f1-red rounded-full"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Content when not loading */}
                {!loadingMeeting && (
                  <>
                    {/* Status Badge */}
                    <div className="flex justify-center">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`px-6 py-3 rounded-2xl text-sm font-medium glass border transition-all duration-300 ${
                          isCompleted
                            ? 'bg-green-500/20 text-green-400 border-green-500/30 shadow-green-500/20'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30 shadow-blue-500/20'
                        }`}
                        style={{
                          boxShadow: isCompleted 
                            ? '0 8px 25px rgba(34, 197, 94, 0.2)' 
                            : '0 8px 25px rgba(59, 130, 246, 0.2)'
                        }}
                      >
                        {isCompleted ? '✅ Evento Completado' : '🏁 Próximo Evento'}
                      </motion.div>
                    </div>
                  </>
                )}

                 {/* Meeting Information */}
                {!loadingMeeting && meeting && (
                  <>
                    <div className="flex justify-end">
                      <motion.button
                        onClick={() => setShowEventInfo(v => !v)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                          showEventInfo
                            ? 'glass text-white border-white/20 shadow-glass'
                            : 'text-white/80 glass-hover border-white/10 hover:text-white'
                        }`}
                        style={{
                          background: showEventInfo
                            ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(147, 51, 234, 0.25) 100%)'
                            : 'rgba(255,255,255,0.08)',
                          backdropFilter: 'blur(8px)'
                        }}
                      >
                        <Info className="w-3.5 h-3.5 text-white/90" />
                        <span>{showEventInfo ? 'Ocultar info del evento' : 'Mostrar info del evento'}</span>
                      </motion.button>
                    </div>
                    {showEventInfo && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass glass-hover rounded-2xl p-4 border border-white/10"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        <div className="flex items-center space-x-2 mb-3">
                          <Users className="w-5 h-5 text-purple-400" />
                          <h3 className="font-semibold text-white text-sm">Información del Evento</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white/80 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="text-white/90">País:</span>
                            <span className="truncate">{meeting.country_name || 'No disponible'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white/90">Circuito:</span>
                            <span className="truncate">{meeting.circuit_short_name || meeting.location || 'No disponible'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-white/90">Año:</span>
                            <span className="truncate">{meeting.year || new Date(carrera.date_start).getFullYear()}</span>
                          </div>
                          {meeting.gmt_offset && (
                            <div className="flex items-center space-x-2">
                              <span className="text-white/90">Zona Horaria:</span>
                              <span className="truncate">GMT{meeting.gmt_offset}</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </>
                )}

                {/* Session Tabs */}
                {!loadingMeeting && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass rounded-2xl p-1.5 border border-white/10"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                      backdropFilter: 'blur(15px)'
                    }}
                  >
                    <div className="flex flex-wrap gap-2 sm:flex-nowrap sm:space-x-2">
                      {['practice', 'qualifying', 'sprint', 'race'].map((tab) => {
                      const hasData = categorizedSessions[tab]?.length > 0;
                      return (
                        <motion.button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          disabled={!hasData}
                          whileHover={hasData ? { scale: 1.02 } : {}}
                          whileTap={hasData ? { scale: 0.98 } : {}}
                          className={`flex-1 min-w-[140px] flex items-center justify-center space-x-2 py-2 px-3 sm:py-3 sm:px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                            activeTab === tab
                              ? 'glass text-white shadow-glass border border-white/20'
                              : hasData
                              ? 'text-white/70 hover:text-white hover:glass hover:border-white/10'
                              : 'text-white/30 cursor-not-allowed'
                          }`}
                          style={activeTab === tab ? {
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.3) 100%)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                          } : {}}
                        >
                          <motion.div
                            animate={activeTab === tab ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 0.3 }}
                          >
                            {getSessionIcon(tab)}
                          </motion.div>
                          <span className="text-sm">{getSessionName(tab)}</span>
                          {hasData && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="glass text-xs px-2 py-0.5 rounded-full border border-white/20"
                              style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                backdropFilter: 'blur(5px)'
                              }}
                            >
                              {categorizedSessions[tab].length}
                            </motion.span>
                          )}
                        </motion.button>
                      );
                    })}
                   </div>
                 </motion.div>
                )}

                 {/* Session Content */}
                 {!loadingMeeting && (
                   <motion.div 
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: 0.4 }}
                     className="min-h-[300px]"
                   >
                     <AnimatePresence mode="wait">
                       <motion.div
                         key={activeTab}
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0, y: -20 }}
                         transition={{ duration: 0.3 }}
                       >
                         {renderSessionResults(activeTab)}
                       </motion.div>
                     </AnimatePresence>
                   </motion.div>
                 )}
              </div>


            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RaceModal;