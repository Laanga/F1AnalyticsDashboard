import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

/**
 * Componente de gráfica reutilizable con estilo glass
 * @param {Array} datos - Datos para la gráfica
 * @param {String} tipo - 'linea' o 'barra'
 * @param {String} titulo - Título de la gráfica
 */
const GraficaPuntos = ({ datos = [], tipo = 'linea', titulo = 'Gráfica' }) => {
  // Configuración del tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 shadow-xl">
          <p className="text-white font-semibold mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Si no hay datos, mostramos un mensaje
  if (!datos || datos.length === 0) {
    return (
      <div className="glass rounded-2xl p-8">
        <h3 className="text-xl font-bold text-white mb-4">{titulo}</h3>
        <div className="flex items-center justify-center h-64 text-white/50">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-6"
    >
      {/* Título */}
      <h3 className="text-xl font-bold text-white mb-6">{titulo}</h3>

      {/* Gráfica */}
      <ResponsiveContainer width="100%" height={300}>
        {tipo === 'barra' ? (
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }}
              iconType="circle"
            />
            <Bar 
              dataKey="value" 
              fill="#e10600" 
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            />
          </BarChart>
        ) : (
          <LineChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: 'rgba(255,255,255,0.7)' }}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#e10600" 
              strokeWidth={3}
              dot={{ fill: '#e10600', r: 5 }}
              activeDot={{ r: 8, fill: '#ff0000' }}
              animationDuration={800}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  );
};

export default GraficaPuntos;

