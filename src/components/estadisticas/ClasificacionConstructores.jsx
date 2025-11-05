import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, TrendingUp } from 'lucide-react';
import { getConstructorStandingsFromErgast, getCurrentYear } from '../../services/openf1Service';
import { getTeamLogo } from '../../utils/formatUtils';
import Loader from '../ui/Loader';

const ClasificacionConstructores = () => {
  const [constructores, setConstructores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('loading');

  useEffect(() => {
    const cargarConstructores = async () => {
      try {
        setLoading(true);
        const data = await getConstructorStandingsFromErgast();
        setConstructores(data);
        setDataSource(data.length > 0 && data[0].points > 0 ? 'real' : 'base');

      } catch (error) {
        console.error('❌ Error al cargar constructores:', error);
        setDataSource('error');
      } finally {
        setLoading(false);
      }
    };

    cargarConstructores();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <motion.div
      className="glass glass-hover rounded-3xl p-8 shadow-glass mb-10"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <div className="flex items-center space-x-3 mb-8">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Users className="w-8 h-8 text-blue-400" />
        </motion.div>
        <h2 className="text-3xl font-bold text-white text-glow">Clasificación de Constructores</h2>
        <div className="flex items-center gap-2 ml-auto">
          <div className={`w-2 h-2 rounded-full ${dataSource === 'real' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
          <span className="text-xs text-gray-400">
            {dataSource === 'real' ? 'Datos Reales' : 'Datos Base'}
          </span>
        </div>
      </div>

      {constructores.length > 0 ? (
        <div className="space-y-4">
          {constructores.slice(0, 10).map((constructor, index) => (
            <motion.div
              key={constructor.constructor?.name || index}
              className={`
                glass glass-hover rounded-2xl p-6 border transition-all duration-300
                ${index < 3 
                  ? `border-yellow-400/30 bg-gradient-to-r ${
                      index === 0 ? 'from-yellow-400/20 to-yellow-600/10' :
                      index === 1 ? 'from-gray-300/20 to-gray-500/10' :
                      'from-amber-600/20 to-amber-800/10'
                    }` 
                  : 'border-white/10 hover:border-blue-400/30'
                }
              `}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.5 }}
              whileHover={{ 
                scale: 1.02, 
                y: -2,
                boxShadow: "0 10px 30px rgba(59, 130, 246, 0.2)"
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* Posición */}
                  <motion.div 
                    className={`
                      w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-lg
                      ${index < 3 
                        ? index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black shadow-yellow-400/30' :
                          index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black shadow-gray-400/30' :
                          'bg-gradient-to-br from-amber-600 to-amber-800 text-white shadow-amber-600/30'
                        : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-blue-500/30'
                      }
                    `}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    {constructor.position || index + 1}
                  </motion.div>

                  {/* Escudo del equipo */}
                  <motion.div
                    className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <img
                      src={getTeamLogo(constructor.constructor?.name || constructor.team_name)}
                      alt={`${constructor.constructor?.name || constructor.team_name} logo`}
                      className="w-full h-full object-contain p-2"
                      onError={(e) => {
                        e.target.src = '/images/teams/default.png';
                      }}
                    />
                    {/* Efecto shimmer para equipos en podio */}
                    {index < 3 && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </motion.div>

                  {/* Información del constructor */}
                  <div className="flex-1">
                    <h3 className="text-white font-bold text-xl mb-1">
                      {constructor.constructor?.name || constructor.team_name}
                    </h3>
                    <p className="text-white/60 text-sm font-medium">
                      {constructor.constructor?.nationality}
                    </p>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="flex items-center space-x-6">
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-2xl font-bold text-white">{constructor.points || 0}</p>
                    <p className="text-white/60 text-sm">Puntos</p>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-2xl font-bold text-green-400">{constructor.wins || 0}</p>
                    <p className="text-white/60 text-sm">Victorias</p>
                  </motion.div>

                  <motion.div 
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-2xl font-bold text-blue-400">{constructor.podiums || 0}</p>
                    <p className="text-white/60 text-sm">Podios</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No hay datos de constructores disponibles</p>
          <p className="text-gray-500 text-sm mt-2">
            {dataSource === 'error' ? 'Error al cargar datos' : 'Esperando datos de la temporada'}
          </p>
        </div>
      )}

      {dataSource === 'real' && constructores.length > 0 && (
        <motion.div 
          className="mt-6 p-4 glass rounded-xl border border-green-400/30 bg-gradient-to-r from-green-400/10 to-green-600/5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <p className="text-green-400 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <strong>Datos oficiales</strong> de la clasificación de constructores {getCurrentYear()}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ClasificacionConstructores;