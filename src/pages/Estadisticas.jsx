import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getStatistics } from '../services/openf1Service';
import Loader from '../components/Loader';
import PanelEstadisticas from '../components/PanelEstadisticas';
import GraficaPuntos from '../components/GraficaPuntos';
import { TrendingUp, Users, Flag, BarChart3, Trophy, Zap } from 'lucide-react';

/**
 * Página de Estadísticas - Vista general del campeonato
 */
const Estadisticas = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        setLoading(true);
        const data = await getStatistics();
        setStats(data);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarEstadisticas();
  }, []);

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

  // Preparar datos para gráfica de top pilotos (simulado)
  const topPilotos = stats.drivers.slice(0, 8).map((piloto) => ({
    name: piloto.name_acronym || piloto.full_name?.split(' ')[1] || 'Piloto',
    value: Math.floor(Math.random() * 250) + 50, // Datos simulados
  }));

  // Preparar datos de evolución (simulado)
  const datosEvolucion = [
    { name: 'Ronda 1', value: 180 },
    { name: 'Ronda 2', value: 220 },
    { name: 'Ronda 3', value: 195 },
    { name: 'Ronda 4', value: 240 },
    { name: 'Ronda 5', value: 265 },
    { name: 'Ronda 6', value: 290 },
  ];

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
          <span className="text-f1-red font-bold ml-3">Globales</span>
        </h1>
        <p className="text-white/60 text-lg">
          Análisis completo de la temporada 2024
        </p>
      </motion.div>

      {/* Grid de paneles de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <PanelEstadisticas
          titulo="Total de Pilotos"
          valor={stats.totalDrivers}
          descripcion="Activos en 2024"
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

      {/* Gráficas principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Top pilotos */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <GraficaPuntos
            datos={topPilotos}
            tipo="barra"
            titulo="Top 8 Pilotos - Puntos (Simulado)"
          />
        </motion.div>

        {/* Evolución de puntos */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GraficaPuntos
            datos={datosEvolucion}
            tipo="linea"
            titulo="Evolución de Puntos del Líder"
          />
        </motion.div>
      </div>

      {/* Podio simulado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass rounded-2xl p-8 mb-10"
      >
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-f1-red" />
          <span>Top 3 del Campeonato</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.drivers.slice(0, 3).map((piloto, index) => {
            const posiciones = ['🥇', '🥈', '🥉'];
            const alturas = ['h-32', 'h-40', 'h-24'];
            const puntos = [285, 265, 240]; // Simulados

            return (
              <motion.div
                key={piloto.driver_number}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`
                  glass-dark glass-hover rounded-2xl p-6 text-center
                  ${index === 0 ? 'md:order-2' : index === 1 ? 'md:order-1' : 'md:order-3'}
                `}
              >
                {/* Posición */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-3"
                >
                  {posiciones[index]}
                </motion.div>

                {/* Pedestal */}
                <div className={`${alturas[index]} bg-gradient-f1 rounded-xl mb-4 flex items-center justify-center transition-all duration-300`}>
                  <span className="text-6xl font-bold text-white">
                    {piloto.driver_number || '?'}
                  </span>
                </div>

                {/* Información */}
                <h3 className="text-white font-bold text-lg mb-1">
                  {piloto.full_name}
                </h3>
                <p className="text-white/60 text-sm mb-3">
                  {piloto.team_name || 'Equipo'}
                </p>
                
                {/* Puntos */}
                <div className="glass rounded-lg px-4 py-2">
                  <p className="text-white/50 text-xs mb-1">Puntos</p>
                  <p className="text-2xl font-bold text-white">
                    {puntos[index]}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

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
          <strong className="text-white">Nota:</strong> Algunos datos mostrados son simulados 
          con fines demostrativos. La versión futura incluirá standings y resultados reales.
        </p>
      </motion.div>
    </div>
  );
};

export default Estadisticas;

