import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Flag, BarChart3, Zap, Timer, Gauge, Database } from 'lucide-react';
import { getDriverStandingsFromErgast, getConstructorStandingsFromErgast, getCurrentYear, getStatistics, getChampionshipStandings } from '../services/openf1Service';
import { getChartColor, assignColorsToData, DRIVER_COLORS, getTeamColor, getDriverTeamColor, assignTeamColorsToDrivers } from '../utils/chartColors';
import { getDriverPhoto } from '../utils/formatUtils';
import { useYear } from '../contexts/YearContext';
import GraficaPuntos from '../components/estadisticas/GraficaPuntos';
import PanelEstadisticas from '../components/estadisticas/PanelEstadisticas';
import ClasificacionConstructores from '../components/estadisticas/ClasificacionConstructores';
import Loader from '../components/ui/Loader';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Página de Estadísticas - Vista general del campeonato
 */
const Estadisticas = () => {
  const [stats, setStats] = useState({});
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedYear } = useYear();

  // Refs para animaciones GSAP
  const headerRef = useRef(null);
  const graficasRef = useRef(null);
  const clasificacionRef = useRef(null);
  const constructoresRef = useRef(null);
  const recordsRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const cargarEstadisticas = async () => {
      try {
        setLoading(true);
        const [estadisticas, equiposData] = await Promise.all([
          getStatistics({ signal }),
          getChampionshipStandings({ signal })
        ]);
        
        setStats(estadisticas);
        setEquipos(equiposData);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setError('Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
    
    return () => {
      controller.abort();
    };
  }, []);

  // Animaciones GSAP
  useEffect(() => {
    if (!loading && headerRef.current) {
      // Animación del header
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
        }
      );

      // Animación de las gráficas
      if (graficasRef.current) {
        gsap.fromTo(
          graficasRef.current.children,
          { opacity: 0, x: -100, rotateY: -20 },
          {
            opacity: 1,
            x: 0,
            rotateY: 0,
            duration: 1,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: graficasRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }

      // Animación de la clasificación de pilotos
      if (clasificacionRef.current) {
        gsap.fromTo(
          clasificacionRef.current,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: clasificacionRef.current,
              start: 'top 80%',
            }
          }
        );

        // Animación de los items de clasificación
        const items = clasificacionRef.current.querySelectorAll('.clasificacion-item');
        gsap.fromTo(
          items,
          { opacity: 0, x: -50 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: clasificacionRef.current,
              start: 'top 70%',
            }
          }
        );
      }

      // Animación de constructores
      if (constructoresRef.current) {
        gsap.fromTo(
          constructoresRef.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: constructoresRef.current,
              start: 'top 80%',
            }
          }
        );
      }

      // Animación de récords con efecto de explosión
      if (recordsRef.current) {
        const recordCards = recordsRef.current.children;
        gsap.fromTo(
          recordCards,
          { opacity: 0, scale: 0, rotation: -180 },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: recordsRef.current,
              start: 'top 80%',
            }
          }
        );
      }
    }
  }, [loading, stats]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader mensaje="Analizando estadísticas..." />
      </div>
    );
  }

  if (error || !stats || Object.keys(stats).length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-white/70">{error || "Error al cargar estadísticas"}</p>
        </div>
      </div>
    );
  }

  // Preparar datos para gráfica de top pilotos (datos reales)
  const topPilotos = stats.topDrivers?.slice(0, 20).map((piloto, index) => ({
    name: piloto.driver?.code || piloto.driver?.familyName || 'Piloto',
    value: parseInt(piloto.points) || 0, // Datos reales de la API
    color: getDriverTeamColor(piloto), // Color del equipo del piloto
    teamName: piloto.constructor?.name || 'Equipo', // Nombre del equipo para referencia
    showDriverPhoto: true, // Indicador para mostrar fotos de pilotos
    driverData: piloto.driver // Datos completos del piloto para obtener la foto
  })) || [];



  const getTeamLogo = (teamName) => {
    
    // Búsqueda directa primero - Nombres exactos de la API de Ergast
    const teamLogos = {
      // Red Bull variations (Ergast usa "Red Bull")
      'Red Bull': '/teams/red-bull.png',
      'Red Bull Racing': '/teams/red-bull.png',
      'Oracle Red Bull Racing': '/teams/red-bull.png',
      
      // Mercedes variations (Ergast usa "Mercedes")
      'Mercedes': '/teams/mercedes.png',
      'Mercedes-AMG Petronas F1 Team': '/teams/mercedes.png',
      'Mercedes-AMG Petronas': '/teams/mercedes.png',
      
      // Ferrari variations (Ergast usa "Ferrari")
      'Ferrari': '/teams/ferrari.png',
      'Scuderia Ferrari': '/teams/ferrari.png',
      'Scuderia Ferrari HP': '/teams/ferrari.png',
      
      // McLaren variations (Ergast usa "McLaren")
      'McLaren': '/teams/mclaren.png',
      'McLaren F1 Team': '/teams/mclaren.png',
      'Papaya Rules Racing': '/teams/mclaren.png',
      
      // Aston Martin variations (Ergast usa "Aston Martin")
      'Aston Martin': '/teams/aston-martin.png',
      'Aston Martin Aramco Cognizant F1 Team': '/teams/aston-martin.png',
      'Aston Martin Aramco': '/teams/aston-martin.png',
      
      // Alpine variations (Ergast usa "Alpine F1 Team")
      'Alpine': '/teams/alpine.png',
      'Alpine F1 Team': '/teams/alpine.png',
      'BWT Alpine F1 Team': '/teams/alpine.png',
      
      // Williams variations (Ergast usa "Williams")
      'Williams': '/teams/williams.png',
      'Williams Racing': '/teams/williams.png',
      
      // Haas variations (Ergast usa "Haas F1 Team")
      'Haas': '/teams/haas.png',
      'Haas F1 Team': '/teams/haas.png',
      'MoneyGram Haas F1 Team': '/teams/haas.png',
      
      // Kick Sauber variations (Ergast usa "Kick Sauber")
      'Kick Sauber': '/teams/kick.png',
      'Sauber': '/teams/kick.png',
      'Stake F1 Team Kick Sauber': '/teams/kick.png',
      
      // RB variations (Ergast usa "RB F1 Team")
      'RB': '/teams/visa-red.png',
      'RB F1 Team': '/teams/visa-red.png',
      'Racing Bulls': '/teams/visa-red.png',
      'Visa Cash App RB F1 Team': '/teams/visa-red.png',
      'AlphaTauri': '/teams/visa-red.png'
    };
    
    // Búsqueda directa
    if (teamLogos[teamName]) {
      return teamLogos[teamName];
    }
    
    // Búsqueda por palabras clave (insensible a mayúsculas)
    const teamNameLower = teamName.toLowerCase();
    
    if (teamNameLower.includes('aston')) {
      return '/teams/aston-martin.png';
    }
    if (teamNameLower.includes('sauber') || teamNameLower.includes('kick')) {
      return '/teams/kick.png';
    }
    if (teamNameLower.includes('red bull') || teamNameLower.includes('redbull')) {
      return '/teams/red-bull.png';
    }
    if (teamNameLower.includes('mercedes')) {
      return '/teams/mercedes.png';
    }
    if (teamNameLower.includes('ferrari')) {
      return '/teams/ferrari.png';
    }
    if (teamNameLower.includes('mclaren')) {
      return '/teams/mclaren.png';
    }
    if (teamNameLower.includes('alpine')) {
      return '/teams/alpine.png';
    }
    if (teamNameLower.includes('williams')) {
      return '/teams/williams.png';
    }
    if (teamNameLower.includes('haas')) {
      return '/teams/haas.png';
    }
    if (teamNameLower.includes('rb') || teamNameLower.includes('racing bulls') || teamNameLower.includes('alphatauri')) {
      return '/teams/visa-red.png';
    }
    
    return '/teams/red-bull.png';
  };

  // Preparar datos para gráfica de equipos (datos reales)
  const datosEquipos = (equipos?.constructors || [])
    .sort((a, b) => (b.points || 0) - (a.points || 0)) // Ordenar por puntos descendente
    .slice(0, 10) // Top 10 equipos
    .map(equipo => ({
      name: equipo.team_name || 'Equipo',
      value: parseInt(equipo.points) || 0, // Datos reales de puntos
      color: getTeamColor(equipo.team_name || ''), // Color específico del equipo
      teamName: equipo.team_name || 'Equipo', // Nombre completo para referencia
      logo: getTeamLogo(equipo.team_name || 'Equipo'), // Logo del equipo
      showLogo: true // Flag para indicar que debe mostrar logo
    }));



  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div ref={headerRef}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Estadísticas
            <span className="text-f1-red font-bold ml-3">Temporada {selectedYear}</span>
          </h1>
          <p className="text-white/60 text-lg">
            Visualización completa de la temporada {selectedYear}
          </p>
        </motion.div>
      </div>

      {/* Gráficas secundarias */}
      <div ref={graficasRef} className="grid grid-cols-1 gap-6 mb-10">
        {/* Top pilotos */}
        <div>
          <GraficaPuntos
            datos={topPilotos}
            tipo="barra"
            titulo="Top 20 Pilotos - Puntos del Campeonato"
          />
        </div>

        {/* Comparativa de equipos */}
        <div>
          <GraficaPuntos
            datos={datosEquipos}
            tipo="barra"
            titulo={`Comparativa de Equipos - Temporada ${selectedYear}`}
          />
        </div>
      </div>

      {/* Clasificación de Pilotos */}
      <div ref={clasificacionRef}>
        <motion.div 
          className="glass glass-hover rounded-3xl p-8 shadow-glass mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center space-x-3 mb-8">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Trophy className="w-8 h-8 text-f1-red" />
            </motion.div>
            <h2 className="text-3xl font-bold text-white text-glow">Clasificación de Pilotos</h2>
            <div className="flex items-center gap-2 ml-auto">
              <div className={`w-2 h-2 rounded-full ${stats.dataSource === 'real' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
              <span className="text-xs text-gray-400">
                {stats.dataSource === 'real' ? 'Datos Reales' : 'Datos Base'}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {stats.topDrivers?.length > 0 ? (
              stats.topDrivers.slice(0, 20).map((driver, index) => (
                <motion.div
                  key={driver.driver_number || index}
                  className={`
                    clasificacion-item glass glass-hover rounded-2xl p-6 border transition-all duration-300
                    ${index < 3 
                      ? `border-yellow-400/30 bg-gradient-to-r ${
                          index === 0 ? 'from-yellow-400/20 to-yellow-600/10' :
                          index === 1 ? 'from-gray-300/20 to-gray-500/10' :
                          'from-amber-600/20 to-amber-800/10'
                        }` 
                      : 'border-white/10 hover:border-f1-red/30'
                    }
                  `}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ 
                    scale: 1.02, 
                    y: -2,
                    boxShadow: "0 10px 30px rgba(225, 6, 0, 0.2)"
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      {/* Posición */}
                      <motion.div 
                        className={`
                          relative w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg overflow-hidden
                          ${index === 0 
                            ? 'bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-black border border-yellow-300/50' :
                            index === 1 
                            ? 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-black border border-gray-200/50' :
                            index === 2 
                            ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-amber-800 text-white border border-amber-500/50' :
                            'bg-gradient-to-br from-slate-600 via-slate-700 to-slate-800 text-white border border-slate-500/50'
                          }
                          backdrop-blur-sm shadow-2xl
                        `}
                        whileHover={{ 
                          scale: 1.15, 
                          rotate: 3,
                          boxShadow: index < 3 
                            ? index === 0 ? "0 20px 40px rgba(251, 191, 36, 0.4)" :
                              index === 1 ? "0 20px 40px rgba(156, 163, 175, 0.4)" :
                              "0 20px 40px rgba(217, 119, 6, 0.4)"
                            : "0 20px 40px rgba(71, 85, 105, 0.4)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 10,
                          duration: 0.3
                        }}
                      >
                        {/* Efecto shimmer para posiciones del podio */}
                        {index < 3 && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{
                              repeat: Infinity,
                              duration: 2,
                              ease: "easeInOut"
                            }}
                            style={{ clipPath: 'inset(0 0 0 0 round 16px)' }}
                          />
                        )}
                        
                        {/* Número de posición */}
                        <span className="relative z-10 font-extrabold tracking-tight">
                          {driver.position || index + 1}
                        </span>
                      </motion.div>

                      {/* Foto del piloto */}
                      <motion.div 
                        className="relative"
                        whileHover={{ scale: 1.1, rotate: 3 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 bg-gradient-to-br from-slate-800 to-slate-900">
                          <img
                            src={getDriverPhoto(driver.driver) || '/drivers/default.png'}
                            alt={`${driver.driver?.givenName} ${driver.driver?.familyName}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/drivers/default.png';
                            }}
                          />
                        </div>
                        {/* Efecto de brillo */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0"
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>

                      {/* Información del piloto */}
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-xl mb-1">
                          {driver.driver?.givenName} {driver.driver?.familyName}
                        </h3>
                        <p className="text-white/60 text-sm font-medium">
                          {driver.constructor?.name}
                        </p>
                      </div>
                    </div>

                    {/* Estadísticas */}
                    <div className="flex items-center space-x-8">
                      <motion.div 
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <p className="text-2xl font-bold text-white">{driver.points || 0}</p>
                        <p className="text-white/60 text-sm">Puntos</p>
                      </motion.div>
                      
                      <motion.div 
                        className="text-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <p className="text-2xl font-bold text-yellow-400">{driver.wins || 0}</p>
                        <p className="text-white/60 text-sm">Victorias</p>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-400">No hay datos de clasificación disponibles</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Clasificación de Constructores */}
      <div ref={constructoresRef}>
        <ClasificacionConstructores />
      </div>

      {/* Estadísticas adicionales */}
      <div ref={recordsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {/* Récords */}
        <motion.div 
          className="glass rounded-2xl p-6 relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-f1-red/10 to-transparent pointer-events-none" />
          
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2 relative z-10">
            <Trophy className="w-5 h-5 text-f1-red" />
            <span>Récords de la Temporada</span>
          </h3>
          
          <div className="space-y-3 relative z-10">
            <motion.div 
              className="glass-dark rounded-xl p-4 relative overflow-hidden group"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-f1-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center space-x-3 relative z-10">
                <Timer className="w-5 h-5 text-f1-red" />
                <div className="flex-1">
                  <p className="text-white/60 text-sm mb-1">Vuelta más rápida</p>
                  <p className="text-white font-bold text-lg">1:18.567</p>
                  <p className="text-white/50 text-xs mt-1">Monza - Italia</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass-dark rounded-xl p-4 relative overflow-hidden group"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center space-x-3 relative z-10">
                <Gauge className="w-5 h-5 text-amber-400" />
                <div className="flex-1">
                  <p className="text-white/60 text-sm mb-1">Mayor diferencia</p>
                  <p className="text-white font-bold text-lg">45.2s</p>
                  <p className="text-white/50 text-xs mt-1">GP de Mónaco</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              className="glass-dark rounded-xl p-4 relative overflow-hidden group"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center space-x-3 relative z-10">
                <Zap className="w-5 h-5 text-blue-400" />
                <div className="flex-1">
                  <p className="text-white/60 text-sm mb-1">Pit Stop más rápido</p>
                  <p className="text-white font-bold text-lg">1.82s</p>
                  <p className="text-white/50 text-xs mt-1">Red Bull Racing</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Fuentes de Datos */}
        <motion.div 
          className="glass rounded-2xl p-6 relative overflow-hidden"
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none" />
          
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2 relative z-10">
            <Database className="w-5 h-5 text-blue-400" />
            <span>Fuentes de Datos</span>
          </h3>
          
          <div className="space-y-3 relative z-10">
            <motion.div 
              className="glass-dark rounded-xl p-4 relative overflow-hidden group"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-f1-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <p className="text-white/60 text-sm mb-2">API Principal</p>
                <a
                  href="https://openf1.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-f1-red hover:text-f1-red/80 font-semibold transition-colors text-lg flex items-center space-x-2"
                >
                  <span>OpenF1</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    →
                  </motion.span>
                </a>
                <p className="text-white/50 text-xs mt-2">Datos de sesiones y telemetría en tiempo real</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="glass-dark rounded-xl p-4 relative overflow-hidden group"
              whileHover={{ scale: 1.05, x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <p className="text-white/60 text-sm mb-2">API Histórica</p>
                <a
                  href="http://ergast.com/mrd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors text-lg flex items-center space-x-2"
                >
                  <span>Ergast F1 API</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
                  >
                    →
                  </motion.span>
                </a>
                <p className="text-white/50 text-xs mt-2">Clasificaciones y resultados históricos</p>
              </div>
            </motion.div>

            <motion.div 
              className="glass-dark rounded-xl p-4"
              whileHover={{ scale: 1.05 }}
            >
              <p className="text-white/60 text-sm mb-2">Última actualización</p>
              <p className="text-white font-semibold">
                {new Date().toLocaleString('es-ES')}
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Nota final con animación */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="mt-10 glass-dark rounded-2xl p-6 text-center relative overflow-hidden"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-f1-red/20 via-transparent to-f1-red/20 blur-xl"
        />
        <p className="text-white/60 text-sm relative z-10">
          <strong className="text-white">Nota:</strong> Los datos de puntos y clasificaciones 
          son obtenidos en tiempo real de OpenF1 y Ergast F1 API.
        </p>
      </motion.div>
    </div>
  );
};

export default Estadisticas;
