import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Flag, TrendingUp, Users, Zap } from 'lucide-react';

/**
 * Página de inicio - Hero con presentación del dashboard
 */
const Inicio = () => {
  const navigate = useNavigate();

  // Características destacadas
  const caracteristicas = [
    {
      icono: Flag,
      titulo: 'Carreras en Vivo',
      descripcion: 'Sigue las carreras con datos en tiempo real',
    },
    {
      icono: Users,
      titulo: 'Análisis de Pilotos',
      descripcion: 'Estadísticas detalladas de cada piloto',
    },
    {
      icono: TrendingUp,
      titulo: 'Tendencias',
      descripcion: 'Visualiza la evolución de la temporada',
    },
    {
      icono: Zap,
      titulo: 'Actualización Rápida',
      descripcion: 'Datos sincronizados con la API oficial',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl mx-auto w-full">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-block mb-6"
          >
            <div className="glass rounded-full px-6 py-2 inline-flex items-center space-x-2">
              <div className="w-2 h-2 bg-f1-red rounded-full animate-pulse" />
              <span className="text-sm text-white/80">Temporada 2024 en curso</span>
            </div>
          </motion.div>

          {/* Título principal */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight"
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
            className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto mb-10"
          >
            Analiza datos en tiempo real de la Fórmula 1 con la experiencia visual
            más avanzada. Diseñado con tecnología de vidrio líquido.
          </motion.p>

          {/* Botón CTA */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/pilotos')}
            className="group relative px-8 py-4 rounded-2xl gradient-f1 text-white font-semibold text-lg shadow-2xl shadow-f1-red/30 overflow-hidden"
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
        </motion.div>

        {/* Grid de características */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {caracteristicas.map((caracteristica, index) => {
            const Icon = caracteristica.icono;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="glass glass-hover rounded-2xl p-6 text-center"
              >
                {/* Icono */}
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-f1 flex items-center justify-center shadow-lg shadow-f1-red/30"
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>

                {/* Contenido */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {caracteristica.titulo}
                </h3>
                <p className="text-sm text-white/60">
                  {caracteristica.descripcion}
                </p>

                {/* Barra decorativa */}
                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  className="h-0.5 bg-gradient-f1 rounded-full mt-4 transition-all duration-300"
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer decorativo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-white/40 text-sm">
            Powered by{' '}
            <a
              href="https://openf1.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-f1-red hover:text-f1-red/80 transition-colors font-semibold"
            >
              OpenF1 API
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Inicio;

