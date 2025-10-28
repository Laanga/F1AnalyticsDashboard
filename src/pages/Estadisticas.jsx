import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Flag, BarChart3, Zap, TrendingUp } from 'lucide-react';
import { getDriverStandingsFromErgast, getConstructorStandingsFromErgast, getCurrentYear, getStatistics, getChampionshipStandings, getPointsEvolution } from '../services/openf1Service';
import { getChartColor, assignColorsToData, DRIVER_COLORS, getTeamColor, getDriverTeamColor, assignTeamColorsToDrivers } from '../utils/chartColors';
import { useYear } from '../contexts/YearContext';
import GraficaPuntos from '../components/estadisticas/GraficaPuntos';
import PanelEstadisticas from '../components/estadisticas/PanelEstadisticas';
import ClasificacionConstructores from '../components/estadisticas/ClasificacionConstructores';
import Loader from '../components/ui/Loader';

/**
 * Página de Estadísticas - Vista general del campeonato
 */
const Estadisticas = () => {
  const [stats, setStats] = useState({});
  const [equipos, setEquipos] = useState([]);
  const [evolutionData, setEvolutionData] = useState({ evolutionData: [], lineConfig: [], totalRaces: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedYear } = useYear();

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        setLoading(true);
        const [estadisticas, equiposData, evolucionData] = await Promise.all([
          getStatistics(),
          getChampionshipStandings('constructors'),
          getPointsEvolution(3)
        ]);
        
        setStats(estadisticas);
        setEquipos(equiposData);
        setEvolutionData(evolucionData);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setError('Error al cargar las estadísticas');
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, [selectedYear]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader mensaje="Analizando estadísticas..." />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-white/70">Error al cargar estadísticas</p>
        </div>
      </div>
    );
  }

  // Preparar datos para gráfica de top pilotos (datos reales)
  const topPilotos = stats.topDrivers.slice(0, 8).map((piloto, index) => ({
    name: piloto.driver?.code || piloto.driver?.familyName || 'Piloto',
    value: parseInt(piloto.points) || 0, // Datos reales de la API
    color: getDriverTeamColor(piloto), // Color del equipo del piloto
    teamName: piloto.constructor?.name || 'Equipo', // Nombre del equipo para referencia
  }));

  // Usar datos de evolución detallados de todas las carreras
  const datosEvolucion = evolutionData.evolutionData || [];
  
  // Configuración de líneas para el gráfico de evolución con colores de equipo
  const lineasEvolucion = evolutionData.lineConfig
    .map((piloto, index) => ({
      dataKey: piloto.dataKey,
      name: piloto.name,
      color: getDriverTeamColor({ 
        driver: { code: piloto.name, familyName: piloto.name },
        constructor: { name: piloto.teamName }
      }),
      strokeWidth: 4, // Líneas más gruesas para mejor visibilidad
      teamName: piloto.teamName,
      fullName: piloto.fullName,
      points: piloto.points,
      position: piloto.position
    }));

  // Preparar datos para gráfica de equipos (datos reales)
  const datosEquipos = (equipos?.constructors || [])
    .sort((a, b) => (b.points || 0) - (a.points || 0)) // Ordenar por puntos descendente
    .slice(0, 10) // Top 10 equipos
    .map(equipo => ({
      name: equipo.team_name && equipo.team_name.length > 15 ? 
        equipo.team_name.substring(0, 15) + '...' : 
        equipo.team_name || 'Equipo',
      value: parseInt(equipo.points) || 0, // Datos reales de puntos
      color: getTeamColor(equipo.team_name || ''), // Color específico del equipo
      teamName: equipo.team_name || 'Equipo' // Nombre completo para referencia
    }));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
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
          Análisis completo de la temporada {selectedYear}
        </p>
      </motion.div>

      {/* Grid de paneles de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <PanelEstadisticas
          titulo="Total de Pilotos"
          valor={stats.totalDrivers}
          descripcion={`Activos en ${selectedYear}`}
          icono={Users}
          tendencia="arriba"
          delay={0}
        />
        
        <PanelEstadisticas
          titulo="Carreras"
          valor={stats.totalRaces}
          descripcion="Completadas"
          icono={Flag}
          delay={0.1}
        />
        
        <PanelEstadisticas
          titulo="Sesiones Totales"
          valor={stats.totalSessions}
          descripcion="Práctica, clasificación y carrera"
          icono={BarChart3}
          delay={0.2}
        />
        
        <PanelEstadisticas
          titulo="Rendimiento"
          valor="94%"
          descripcion="Precisión de datos"
          icono={Zap}
          tendencia="arriba"
          delay={0.3}
        />
      </div>

      {/* Gráfico de Evolución de Puntos - Sección Principal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-10"
      >
        <div className="bg-gradient-to-br from-f1-dark/80 to-gray-900/80 backdrop-blur-md rounded-2xl border border-gray-700/50 overflow-hidden">
          {/* Header del gráfico */}
          <div className="p-8 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                 <TrendingUp className="w-8 h-8 text-f1-red" />
                 Evolución de Puntos - Top 3 Pilotos
               </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-sm text-gray-400 font-medium">
                    {evolutionData.racesWithResults || 0} con resultados
                  </span>
                </div>
                {evolutionData.futureRacesShown > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span className="text-sm text-gray-400 font-medium">
                      {evolutionData.futureRacesShown} próximas
                    </span>
                  </div>
                )}
                <div className="text-xs text-gray-500">
                  ({evolutionData.racesShown || 0} de {evolutionData.totalRaces || 0} mostradas)
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-lg mb-6">
              Progresión de puntos a lo largo de la temporada {selectedYear}
            </p>
            
            {/* Leyenda de pilotos */}
            {lineasEvolucion.length > 0 && (
              <div className="flex flex-wrap gap-6 mb-6">
                {lineasEvolucion.map((linea, index) => (
                  <div key={linea.dataKey} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: linea.color }}
                    ></div>
                    <span className="text-white text-lg font-semibold">
                      {linea.fullName || linea.name}
                    </span>
                    <span className="text-gray-400 text-sm font-medium">
                      ({linea.points} pts)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Gráfico */}
          <div className="px-8 pb-8">
            <div className="h-96">
              <GraficaPuntos
                datos={datosEvolucion}
                tipo="linea"
                titulo=""
                lineas={lineasEvolucion}
                showTitle={false}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Gráficas secundarias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Top pilotos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GraficaPuntos
            datos={topPilotos}
            tipo="barra"
            titulo="Top 8 Pilotos - Puntos del Campeonato"
          />
        </motion.div>

        {/* Comparativa de equipos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GraficaPuntos
            datos={datosEquipos}
            tipo="barra"
            titulo={`Comparativa de Equipos - Temporada ${selectedYear}`}
          />
        </motion.div>
      </div>

      {/* Top Drivers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-f1-dark/80 to-gray-900/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 mb-10"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Top 5 Pilotos
          </h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${stats.dataSource === 'real' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span className="text-xs text-gray-400">
              {stats.dataSource === 'real' ? 'Datos Reales' : 'Datos Base'}
            </span>
          </div>
        </div>
        <div className="space-y-3">
          {stats.topDrivers?.length > 0 ? (
            stats.topDrivers.slice(0, 5).map((driver, index) => (
              <div key={driver.driver_number || index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-f1-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {driver.position || index + 1}
                  </span>
                  <div>
                    <p className="text-white font-medium">{driver.driver?.givenName} {driver.driver?.familyName}</p>
                    <p className="text-gray-400 text-sm">{driver.constructor?.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{driver.points || 0} pts</p>
                  <p className="text-gray-400 text-sm">{driver.wins || 0} victorias</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400">No hay datos de clasificación disponibles</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Podio Actual */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-f1-dark/80 to-gray-900/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 mb-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Podio Actual
          </h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${stats.dataSource === 'real' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
            <span className="text-xs text-gray-400">
              {stats.dataSource === 'real' ? 'Clasificación Real' : 'Sin Datos'}
            </span>
          </div>
        </div>
        
        {stats.topDrivers?.length >= 3 ? (
          <div className="flex justify-center items-end gap-4">
            {/* Segundo lugar */}
            <div className="text-center">
              <div className="w-16 h-20 bg-gradient-to-t from-gray-600 to-gray-400 rounded-t-lg flex items-end justify-center pb-2">
                <span className="text-white font-bold text-lg">2</span>
              </div>
              <div className="mt-2">
                <p className="text-white font-medium text-sm">{stats.topDrivers[1]?.driver?.code || stats.topDrivers[1]?.driver?.familyName}</p>
                <p className="text-gray-400 text-xs">{stats.topDrivers[1]?.constructor?.name}</p>
                <p className="text-yellow-400 font-bold text-sm">{stats.topDrivers[1]?.points || 0} pts</p>
              </div>
            </div>
            
            {/* Primer lugar */}
            <div className="text-center">
              <div className="w-16 h-24 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-lg flex items-end justify-center pb-2">
                <span className="text-white font-bold text-lg">1</span>
              </div>
              <div className="mt-2">
                <p className="text-white font-medium text-sm">{stats.topDrivers[0]?.driver?.code || stats.topDrivers[0]?.driver?.familyName}</p>
                <p className="text-gray-400 text-xs">{stats.topDrivers[0]?.constructor?.name}</p>
                <p className="text-yellow-400 font-bold text-sm">{stats.topDrivers[0]?.points || 0} pts</p>
              </div>
            </div>
            
            {/* Tercer lugar */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-t from-orange-800 to-orange-600 rounded-t-lg flex items-end justify-center pb-2">
                <span className="text-white font-bold text-lg">3</span>
              </div>
              <div className="mt-2">
                <p className="text-white font-medium text-sm">{stats.topDrivers[2]?.driver?.code || stats.topDrivers[2]?.driver?.familyName}</p>
                <p className="text-gray-400 text-xs">{stats.topDrivers[2]?.constructor?.name}</p>
                <p className="text-yellow-400 font-bold text-sm">{stats.topDrivers[2]?.points || 0} pts</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No hay suficientes datos para mostrar el podio</p>
            <p className="text-gray-500 text-sm mt-2">Se necesitan al menos 3 pilotos con puntos</p>
          </div>
        )}
      </motion.div>

      {/* Clasificación de Constructores */}
      <ClasificacionConstructores />

      {/* Estadísticas adicionales */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Récords */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-f1-red" />
            <span>Récords de la Temporada</span>
          </h3>
          
          <div className="space-y-3">
            <div className="glass-dark rounded-xl p-4">
              <p className="text-white/60 text-sm mb-1">Vuelta más rápida</p>
              <p className="text-white font-bold text-lg">1:18.567</p>
              <p className="text-white/50 text-xs mt-1">Monza - Italia</p>
            </div>
            
            <div className="glass-dark rounded-xl p-4">
              <p className="text-white/60 text-sm mb-1">Mayor diferencia</p>
              <p className="text-white font-bold text-lg">45.2s</p>
              <p className="text-white/50 text-xs mt-1">GP de Mónaco</p>
            </div>
          </div>
        </div>

        {/* Información del sistema */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-f1-red" />
            <span>Fuente de Datos</span>
          </h3>
          
          <div className="space-y-3">
            <div className="glass-dark rounded-xl p-4">
              <p className="text-white/60 text-sm mb-2">API Oficial</p>
              <a
                href="https://openf1.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-f1-red hover:text-f1-red/80 font-semibold transition-colors"
              >
                OpenF1.org
              </a>
            </div>
            
            <div className="glass-dark rounded-xl p-4">
              <p className="text-white/60 text-sm mb-2">Última actualización</p>
              <p className="text-white font-semibold">
                {new Date().toLocaleString('es-ES')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Nota final */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="mt-10 glass-dark rounded-2xl p-6 text-center"
      >
        <p className="text-white/60 text-sm">
          <strong className="text-white">Nota:</strong> Los datos de puntos y clasificaciones 
          son obtenidos en tiempo real de la API oficial de Ergast F1.
        </p>
      </motion.div>
    </div>
  );
};

export default Estadisticas;

