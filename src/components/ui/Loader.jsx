import { motion } from 'framer-motion';

/**
 * Componente de carga con animación estilo F1
 * Muestra un indicador giratorio con efecto glass
 */
const Loader = ({ mensaje = 'Cargando datos...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {/* Spinner animado */}
      <div className="relative">
        {/* Círculo exterior */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 rounded-full border-4 border-white/10 border-t-f1-red"
        />
        
        {/* Círculo interior */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-2 w-16 h-16 rounded-full border-4 border-white/5 border-b-f1-red"
        />

        {/* Punto central */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute inset-0 m-auto w-3 h-3 bg-f1-red rounded-full shadow-lg shadow-f1-red/50"
        />
      </div>

      {/* Mensaje */}
      <motion.p
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-white/70 text-sm font-medium"
      >
        {mensaje}
      </motion.p>

      {/* Barra de progreso animada */}
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="h-full w-1/3 bg-gradient-to-r from-transparent via-f1-red to-transparent"
        />
      </div>
    </div>
  );
};

export default Loader;

