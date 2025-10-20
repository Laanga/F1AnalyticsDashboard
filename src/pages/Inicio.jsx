import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flag, TrendingUp, Users, Zap } from 'lucide-react';
import { getSeasonProgress, getCurrentYear } from '../services/openf1Service';

/**
 * Página de inicio - Hero con presentación del dashboard
 */
const Inicio = () => {
  const navigate = useNavigate();
  const [seasonProgress, setSeasonProgress] = useState(null);
  const [currentYear] = useState(getCurrentYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progress = await getSeasonProgress();
        setSeasonProgress(progress);
      } catch (error) {
        console.error('Error al obtener progreso:', error);
        setSeasonProgress({
          progress: 0,
          completed: 0,
          total: 0,
          remaining: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  // Características destacadas
  const caracteristicas = [
    {
      icono: Flag,
      titulo: 'Datos en Tiempo Real',
      descripcion: 'Información actualizada',
    },
    {
      icono: Users,
      titulo: 'Análisis de Pilotos',
      descripcion: 'Estadísticas detalladas',
    },
    {
      icono: TrendingUp,
      titulo: 'Evolución',
      descripcion: 'Progreso del campeonato',
    },
    {
      icono: Zap,
      titulo: 'API Oficial',
      descripcion: 'Datos de OpenF1',
    },
  ];

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <div className="max-w-5xl mx-auto w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Badge con progreso de temporada */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="glass rounded-full px-6 py-2 inline-flex items-center space-x-3">
              <div className="w-2 h-2 bg-f1-red rounded-full animate-pulse" />
              <span className="text-sm text-white/80">
                Temporada {currentYear}
              </span>
              {!loading && seasonProgress && seasonProgress.total > 0 && (
                <>
                  <div className="w-px h-4 bg-white/20" />
                  <span className="text-sm text-white/60">
                    {seasonProgress.completed}/{seasonProgress.total}
                  </span>
                </>
              )}
            </div>
          </motion.div>

          {/* Título principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-4 leading-tight"
          >
            F1 Analytics
            <br />
            <span className="text-f1-red font-bold">
              Dashboard
            </span>
          </motion.h1>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8"
          >
            Analiza datos en tiempo real de la Fórmula 1 con la experiencia visual
            más avanzada
          </motion.p>

          {/* Botón CTA */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/pilotos')}
            className="group relative px-8 py-4 rounded-2xl gradient-f1 text-white font-semibold text-base shadow-2xl shadow-f1-red/30 overflow-hidden mb-10"
          >
            {/* Efecto de brillo animado */}
            <motion.div
              animate={{ x: ['0%', '200%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
            />
            
            <span className="relative flex items-center space-x-2">
              <span>Comenzar Análisis</span>
              <Zap className="w-5 h-5 group-hover:animate-pulse" />
            </span>
          </motion.button>

          {/* Grid de características */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8"
          >
            {caracteristicas.map((caracteristica, index) => {
              const Icon = caracteristica.icono;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="glass glass-hover rounded-xl p-5 text-center"
                >
                  {/* Icono */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-f1 flex items-center justify-center shadow-lg shadow-f1-red/30"
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Contenido */}
                  <h3 className="text-sm font-bold text-white mb-1">
                    {caracteristica.titulo}
                  </h3>
                  <p className="text-xs text-white/60">
                    {caracteristica.descripcion}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Footer decorativo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="text-center"
          >
            <p className="text-white/40 text-xs">
              Powered by{' '}
              <a
                href="https://openf1.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-f1-red hover:text-f1-red/80 transition-colors font-semibold"
              >
                OpenF1 API
              </a>
              {' '}• {currentYear}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Inicio;
