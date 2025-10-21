import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Panel de estadística individual con efecto glass
 * @param {String} titulo - Título del panel
 * @param {String|Number} valor - Valor principal
 * @param {String} descripcion - Descripción adicional
 * @param {Object} icono - Componente de icono de Lucide
 * @param {String} tendencia - 'arriba', 'abajo' o null
 */
const PanelEstadisticas = ({ 
  titulo, 
  valor, 
  descripcion, 
  icono: Icon, 
  tendencia = null,
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="glass glass-hover rounded-2xl p-6"
    >
      {/* Header con icono */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-white/60 text-sm font-medium mb-1">{titulo}</p>
          <motion.h3
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, type: 'spring', stiffness: 200 }}
            className="text-4xl font-bold text-white"
          >
            {valor}
          </motion.h3>
        </div>

        {/* Icono */}
        {Icon && (
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-12 h-12 rounded-xl bg-f1-red/20 flex items-center justify-center"
          >
            <Icon className="w-6 h-6 text-f1-red" />
          </motion.div>
        )}
      </div>

      {/* Descripción y tendencia */}
      <div className="flex items-center justify-between">
        <p className="text-white/50 text-xs">{descripcion}</p>
        
        {tendencia && (
          <div className={`
            flex items-center space-x-1 text-xs font-semibold
            ${tendencia === 'arriba' ? 'text-green-400' : 'text-red-400'}
          `}>
            {tendencia === 'arriba' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
          </div>
        )}
      </div>

      {/* Barra decorativa */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ delay: delay + 0.3, duration: 0.8 }}
        className="h-1 bg-gradient-f1 rounded-full mt-4"
      />
    </motion.div>
  );
};

export default PanelEstadisticas;

