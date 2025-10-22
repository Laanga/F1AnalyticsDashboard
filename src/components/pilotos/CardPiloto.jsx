import { motion } from 'framer-motion';
import { User, Flag } from 'lucide-react';
import { getDriverNationality } from '../../utils/nationalityUtils';
import { getDriverFlag } from '../../utils/flagUtils.jsx';

const CardPiloto = ({ piloto, onClick }) => {
  const nacionalidad = getDriverNationality(piloto);
  const iniciales = piloto.name_acronym || 
    (piloto.full_name ? piloto.full_name.split(' ').map(n => n[0]).join('').substring(0, 3) : '???');
  const fotoUrl = piloto.headshot_url;
  const banderaUrl = getDriverFlag(piloto);

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
      <div className="flex items-start justify-between mb-4">
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

        {nacionalidad && nacionalidad !== 'No disponible' && (
          <div className="flex items-center space-x-2 text-white/60 text-xs">
            {banderaUrl ? (
              <img 
                src={banderaUrl} 
                alt={`Bandera de ${nacionalidad}`}
                className="w-4 h-3 rounded-sm object-cover shadow-sm"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextElementSibling.style.display = 'block';
                }}
              />
            ) : null}
            <Flag 
              className="w-4 h-4 hidden" 
              style={{ display: banderaUrl ? 'none' : 'block' }}
            />
            <span className="font-medium">{nacionalidad}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white group-hover:text-f1-red transition-colors line-clamp-1">
          {piloto.full_name || 'Nombre no disponible'}
        </h3>

        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-white/40" />
          <span className="text-sm font-mono text-white/70 tracking-wider">
            {iniciales}
          </span>
        </div>

        {piloto.team_name && (
          <div className="pt-2 mt-2 border-t border-white/10">
            <p className="text-xs text-white/50">Equipo</p>
            <p className="text-sm font-semibold text-white/80 line-clamp-1">
              {piloto.team_name}
            </p>
          </div>
        )}
      </div>
      <motion.div
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        className="h-1 bg-gradient-f1 rounded-full mt-4 transition-all duration-300"
      />
    </motion.div>
  );
};

export default CardPiloto;
