import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, TrendingUp } from 'lucide-react';
import { getConstructorStandingsFromErgast } from '../../services/openf1Service';
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
        console.log('🏗️ Constructores cargados:', data.length, 'equipos');
      } catch (error) {
        console.error('Error al cargar constructores:', error);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-f1-dark/80 to-gray-900/80 backdrop-blur-md rounded-xl p-6 border border-gray-700/50"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          Clasificación de Constructores
        </h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dataSource === 'real' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
          <span className="text-xs text-gray-400">
            {dataSource === 'real' ? 'Datos Reales' : 'Datos Base'}
          </span>
        </div>
      </div>

      {constructores.length > 0 ? (
        <div className="space-y-3">
          {constructores.slice(0, 10).map((constructor, index) => (
            <motion.div
              key={constructor.constructor?.name || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800/70 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500' : 
                  index === 1 ? 'bg-gray-400' : 
                  index === 2 ? 'bg-orange-600' : 'bg-f1-red'
                }`}>
                  {constructor.position || index + 1}
                </div>
                <div>
                  <p className="text-white font-medium">{constructor.constructor?.name || constructor.team_name}</p>
                  <p className="text-gray-400 text-sm">{constructor.constructor?.nationality}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-white font-bold">{constructor.points || 0}</p>
                  <p className="text-gray-400 text-xs">puntos</p>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-medium">{constructor.wins || 0}</p>
                  <p className="text-gray-400 text-xs">victorias</p>
                </div>
                <div className="text-right">
                  <p className="text-blue-400 font-medium">{constructor.podiums || 0}</p>
                  <p className="text-gray-400 text-xs">podios</p>
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
        <div className="mt-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <p className="text-green-400 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <strong>Datos oficiales</strong> de la clasificación de constructores 2025
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ClasificacionConstructores;