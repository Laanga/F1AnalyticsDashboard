import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getDrivers } from '../services/openf1Service';
import Loader from '../components/Loader';
import GraficaPuntos from '../components/GraficaPuntos';
import { Shield, Users, TrendingUp } from 'lucide-react';

/**
 * Página de Equipos - Muestra equipos agrupados por pilotos
 */
const Equipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarEquipos = async () => {
      try {
        setLoading(true);
        const pilotos = await getDrivers();
        
        // Agrupar pilotos por equipo
        const equiposAgrupados = pilotos.reduce((acc, piloto) => {
          const nombreEquipo = piloto.team_name || 'Equipo Desconocido';
          
          if (!acc[nombreEquipo]) {
            acc[nombreEquipo] = {
              nombre: nombreEquipo,
              pilotos: [],
              color: piloto.team_colour || '#e10600',
            };
          }
          
          acc[nombreEquipo].pilotos.push(piloto);
          return acc;
        }, {});

        setEquipos(Object.values(equiposAgrupados));
      } catch (error) {
        console.error('Error al cargar equipos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarEquipos();
  }, []);

  // Datos de ejemplo para comparación de equipos
  const datosComparacion = equipos.slice(0, 6).map(equipo => ({
    name: equipo.nombre.length > 15 ? equipo.nombre.substring(0, 15) + '...' : equipo.nombre,
    value: Math.floor(Math.random() * 400) + 100, // Datos simulados
  }));

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Loader mensaje="Cargando equipos..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          Equipos
          <span className="gradient-f1 bg-clip-text text-transparent ml-3">F1</span>
        </h1>
        <p className="text-white/60 text-lg">
          Análisis de constructores y sus pilotos
        </p>
      </motion.div>

      {/* Gráfica comparativa */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-10"
      >
        <GraficaPuntos
          datos={datosComparacion}
          tipo="barra"
          titulo="Comparativa de Puntos por Equipo (Simulado)"
        />
      </motion.div>

      {/* Grid de equipos */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {equipos.map((equipo, index) => (
          <motion.div
            key={equipo.nombre}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="glass glass-hover rounded-2xl p-6"
          >
            {/* Header del equipo */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${equipo.color || '#e10600'} 0%, ${equipo.color || '#8b0000'} 100%)`,
                  }}
                >
                  <Shield className="w-7 h-7 text-white" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {equipo.nombre}
                  </h2>
                  <p className="text-white/60 text-sm flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{equipo.pilotos.length} piloto{equipo.pilotos.length !== 1 ? 's' : ''}</span>
                  </p>
                </div>
              </div>

              {/* Badge de puntos (simulado) */}
              <div className="text-right">
                <p className="text-white/50 text-xs mb-1">Puntos</p>
                <p className="text-3xl font-bold text-white">
                  {Math.floor(Math.random() * 400) + 100}
                </p>
              </div>
            </div>

            {/* Lista de pilotos del equipo */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-white/70 text-sm mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">Pilotos del equipo</span>
              </div>
              
              {equipo.pilotos.map((piloto, idx) => (
                <motion.div
                  key={piloto.driver_number || idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + idx * 0.1 }}
                  className="glass-dark rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-f1 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {piloto.driver_number}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-semibold">
                        {piloto.full_name}
                      </p>
                      <p className="text-white/50 text-xs">
                        {piloto.name_acronym} • {piloto.country_code}
                      </p>
                    </div>
                  </div>
                  
                  {/* Puntos del piloto (simulados) */}
                  <div className="text-right">
                    <p className="text-white/50 text-xs">Pts</p>
                    <p className="text-white font-bold">
                      {Math.floor(Math.random() * 200)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Barra decorativa con color del equipo */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
              className="h-1 rounded-full mt-6"
              style={{
                background: `linear-gradient(90deg, ${equipo.color || '#e10600'} 0%, transparent 100%)`,
              }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Nota informativa */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-10 glass-dark rounded-2xl p-6 text-center"
      >
        <p className="text-white/60 text-sm">
          <strong className="text-white">Nota:</strong> Los puntos mostrados son simulados. 
          La integración con datos reales de standings se implementará en futuras versiones.
        </p>
      </motion.div>
    </div>
  );
};

export default Equipos;

