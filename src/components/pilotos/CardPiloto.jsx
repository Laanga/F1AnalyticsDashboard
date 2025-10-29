import { motion } from 'framer-motion';
import { User, Flag } from 'lucide-react';
import { getDriverNationality } from '../../utils/nationalityUtils';
import { getDriverFlag } from '../../utils/flagUtils.jsx';
import { getTeamLogo, getDriverPhoto } from '../../utils/formatUtils';

const CardPiloto = ({ piloto, onClick }) => {
  const nacionalidad = getDriverNationality(piloto);
  const iniciales = piloto.name_acronym || 
    (piloto.full_name ? piloto.full_name.split(' ').map(n => n[0]).join('').substring(0, 3) : '???');
  const fotoUrl = getDriverPhoto(piloto) || piloto.headshot_url;
  const banderaUrl = getDriverFlag(piloto);

  const hexToRgb = (hex) => {
    if (!hex) return { r: 128, g: 128, b: 128 };
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 128, g: 128, b: 128 };
  };

  const teamColor = piloto.team_colour || '#808080';
  const rgb = hexToRgb(teamColor);
  const cardStyle = {
    background: `linear-gradient(135deg, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15) 0%, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.08) 50%, rgba(0, 0, 0, 0.4) 100%)`,
    borderColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`,
    boxShadow: `0 4px 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15), 0 0 0 1px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`
  };

  const gradientBarStyle = {
    background: `linear-gradient(90deg, ${teamColor}, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6))`
  };

  return (
    <motion.div
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        boxShadow: `0 8px 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25), 0 0 0 1px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`
      }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="backdrop-blur-sm border rounded-2xl p-6 cursor-pointer group overflow-hidden transition-all duration-300 relative"
      style={cardStyle}
      role="button"
      tabIndex={0}
      aria-label={`Ver detalles de ${piloto.full_name || 'piloto'}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick?.();
        }
      }}
    >
      {/* Logo de fondo difuminado */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end pr-4 pointer-events-none overflow-hidden"
        initial={{ opacity: 0, scale: 0.8, x: 20 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.img
          src={getTeamLogo(piloto.team_name)}
          alt={`Logo ${piloto.team_name}`}
          className="w-24 h-24 object-contain opacity-8 group-hover:opacity-12 transition-all duration-500"
          style={{
            filter: 'blur(0.5px) brightness(1.3) contrast(1.1)',
            transform: 'translateX(10px)',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)'
          }}
          whileHover={{ 
            scale: 1.05,
            rotate: -5,
            x: -5,
            filter: 'blur(0px) brightness(1.5) contrast(1.2)',
            opacity: 0.15
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </motion.div>

      {/* Contenido principal con z-index superior */}
      <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          {fotoUrl ? (
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="w-20 h-20 rounded-xl overflow-hidden shadow-lg"
              style={{ boxShadow: `0 4px 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)` }}
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
                className="w-full h-full flex items-center justify-center hidden"
                style={{ 
                  display: 'none',
                  background: `linear-gradient(135deg, ${teamColor}, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8))`
                }}
              >
                <span className="text-3xl font-bold text-white">
                  {piloto.driver_number || '?'}
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg"
              style={{ 
                background: `linear-gradient(135deg, ${teamColor}, rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.8))`,
                boxShadow: `0 4px 15px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4)`
              }}
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
        <motion.h3 
          className="text-xl font-bold text-white transition-colors line-clamp-1"
          whileHover={{ color: teamColor }}
        >
          {piloto.full_name || 'Nombre no disponible'}
        </motion.h3>

        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-white/40" />
          <span className="text-sm font-mono text-white/70 tracking-wider">
            {iniciales}
          </span>
        </div>

        {piloto.team_name && (
          <div className="pt-2 mt-2 border-t border-white/10">
            <p className="text-xs text-white/50">Equipo</p>
            <div className="flex items-center space-x-2">
              <motion.img
                src={getTeamLogo(piloto.team_name)}
                alt={`Logo ${piloto.team_name}`}
                className="w-5 h-5 object-contain"
                whileHover={{ scale: 1.1 }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <p className="text-sm font-semibold text-white/80 line-clamp-1">
                {piloto.team_name}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <motion.div
        initial={{ width: 0 }}
        whileHover={{ width: '100%' }}
        className="h-1 rounded-full mt-4 transition-all duration-300"
        style={gradientBarStyle}
      />
      </div> {/* Cierre del div del contenido principal */}
    </motion.div>
  );
};

export default CardPiloto;
