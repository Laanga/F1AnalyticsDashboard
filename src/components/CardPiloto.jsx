import { motion } from 'framer-motion';
import { User, Flag } from 'lucide-react';

/**
 * Tarjeta de piloto con efecto glass y animaciones
 * @param {Object} piloto - Datos del piloto
 * @param {Function} onClick - Función al hacer clic
 */
const CardPiloto = ({ piloto, onClick }) => {
  // Obtenemos el código del país para la bandera (si existe)
  const paisCodigo = piloto.country_code || 'XX';
  
  // Obtenemos las iniciales del nombre
  const iniciales = piloto.name_acronym || 
    (piloto.full_name ? piloto.full_name.split(' ').map(n => n[0]).join('').substring(0, 3) : '???');

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass glass-hover rounded-2xl p-6 cursor-pointer group"
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${piloto.full_name || 'piloto'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      {/* Header con número del piloto */}
      <div className="flex items-start justify-between mb-4">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-16 h-16 rounded-xl bg-gradient-f1 flex items-center justify-center shadow-lg shadow-f1-red/30"
        >
          <span className="text-3xl font-bold text-white">
            {piloto.driver_number || '?'}
          </span>
        </motion.div>

        {/* Bandera del país */}
        <div className="flex items-center space-x-2 text-white/60 text-xs">
          <Flag className="w-4 h-4" />
          <span className="font-medium">{paisCodigo}</span>
        </div>
      </div>

      {/* Información del piloto */}
      <div className="space-y-2">
        {/* Nombre completo */}
        <h3 className="text-xl font-bold text-white group-hover:text-f1-red transition-colors line-clamp-1">
          {piloto.full_name || 'Nombre no disponible'}
        </h3>

        {/* Iniciales */}
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-white/40" />
          <span className="text-sm font-mono text-white/70 tracking-wider">
            {iniciales}
          </span>
        </div>

        {/* Equipo (si existe) */}
        {piloto.team_name && (
          <div className="pt-2 mt-2 border-t border-white/10">
            <p className="text-xs text-white/50">Equipo</p>
            <p className="text-sm font-semibold text-white/80 line-clamp-1">
              {piloto.team_name}
            </p>
          </div>
        )}
      </div>

      {/* Indicador hover */}
      <motion.div
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        className="h-1 bg-gradient-f1 rounded-full mt-4 transition-all duration-300"
      />
    </motion.div>
  );
};

export default CardPiloto;

