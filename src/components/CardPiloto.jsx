import { motion } from 'framer-motion';
import { User, Flag } from 'lucide-react';

/**
 * Tarjeta de piloto con efecto glass y animaciones
 * @param {Object} piloto - Datos del piloto
 * @param {Function} onClick - Función al hacer clic
 */
const CardPiloto = ({ piloto, onClick }) => {
  // Obtenemos el país
  const pais = piloto.country_code || 'N/A';
  
  // Obtenemos las iniciales del nombre
  const iniciales = piloto.name_acronym || 
    (piloto.full_name ? piloto.full_name.split(' ').map(n => n[0]).join('').substring(0, 3) : '???');

  // URL de la foto del piloto
  const fotoUrl = piloto.headshot_url;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass glass-hover rounded-2xl p-6 cursor-pointer group overflow-hidden"
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${piloto.full_name || 'piloto'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      {/* Header con foto o número del piloto */}
      <div className="flex items-start justify-between mb-4">
        {/* Foto del piloto o número */}
        <div className="relative">
          {fotoUrl ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-f1 shadow-lg shadow-f1-red/30"
            >
              <img 
                src={fotoUrl} 
                alt={piloto.full_name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Si falla la imagen, mostrar número
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'flex';
                }}
              />
              <div 
                className="w-full h-full bg-gradient-f1 items-center justify-center hidden"
                style={{ display: 'none' }}
              >
                <span className="text-3xl font-bold text-white">
                  {piloto.driver_number || '?'}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-20 h-20 rounded-xl bg-gradient-f1 flex items-center justify-center shadow-lg shadow-f1-red/30"
            >
              <span className="text-3xl font-bold text-white">
                {piloto.driver_number || '?'}
              </span>
            </motion.div>
          )}
        </div>

        {/* País (solo si existe) */}
        {piloto.country_code && (
          <div className="flex items-center space-x-2 text-white/60 text-xs">
            <Flag className="w-4 h-4" />
            <span className="font-medium">{pais}</span>
          </div>
        )}
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
