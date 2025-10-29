import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { getChartColor, assignColorsToData } from '../../utils/chartColors';
import { getTeamColor, getTeamLogo, getDriverPhoto } from '../../utils/formatUtils';

// Componente personalizado para mostrar banderas en el eje X
const CustomXAxisTick = ({ x, y, payload }) => {
  const countryCode = payload.value;
  
  // Si es un código de país válido, mostrar bandera
  if (countryCode && countryCode.length === 2 && countryCode !== 'F1') {
    const flagUrl = `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
    
    return (
      <g transform={`translate(${x},${y})`}>
        <image
          x={-10}
          y={4}
          width={20}
          height={15}
          href={flagUrl}
          style={{ borderRadius: '2px' }}
        />
      </g>
    );
  }
  
  // Fallback para casos especiales
  return (
    <g transform={`translate(${x},${y})`}>
      <text 
        x={0} 
        y={0} 
        dy={16} 
        textAnchor="middle" 
        fill="rgba(255,255,255,0.6)" 
        fontSize="10"
      >
        🏁
      </text>
    </g>
  );
};

// Componente personalizado para mostrar logos de equipos en el eje X
const CustomTeamLogoTick = ({ x, y, payload, data }) => {
  if (!payload || !payload.value || !data) {
    return null;
  }

  // Buscar el equipo en los datos
  const teamData = data.find(item => 
    item.name === payload.value || 
    item.teamName === payload.value
  );

  if (!teamData) {
    return (
      <g>
        <text x={x} y={y} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="10">
          {payload.value}
        </text>
      </g>
    );
  }

  return (
    <g>
      {teamData.logo ? (
        <foreignObject x={x - 20} y={y - 10} width="40" height="40">
          <img 
            src={teamData.logo} 
            alt={teamData.teamName || teamData.name}
            style={{ 
              width: '40px', 
              height: '40px', 
              objectFit: 'contain',
              borderRadius: '6px'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </foreignObject>
      ) : (
        <circle cx={x} cy={y + 10} r="12" fill={teamData.color || '#666'} />
      )}
      <text 
        x={x} 
        y={y + 35} 
        textAnchor="middle" 
        fill="rgba(255,255,255,0.8)" 
        fontSize="12"
        fontWeight="500"
      >
        {(teamData.name || payload.value).length > 10 ? 
          (teamData.name || payload.value).substring(0, 10) + '...' : 
          (teamData.name || payload.value)
        }
      </text>
    </g>
  );
};

// Componente personalizado para mostrar fotos de pilotos en el eje X
const CustomDriverPhotoTick = ({ x, y, payload, data }) => {
  if (!payload || !payload.value) return null;

  // Buscar los datos del piloto en el array de datos
  const item = data?.find(d => d.name === payload.value);
  
  const driverData = {
    name: payload.value,
    photo: null,
    color: item?.color || '#666'
  };

  // Intentar obtener la foto del piloto usando los datos reales
  if (item?.driverData) {
    // Crear objeto piloto con los datos de Ergast
    const driverObj = {
      name_acronym: item.driverData.code,
      full_name: `${item.driverData.givenName} ${item.driverData.familyName}`,
      last_name: item.driverData.familyName?.toLowerCase(),
      familyName: item.driverData.familyName
    };

    const photo = getDriverPhoto(driverObj);
    if (photo) {
      driverData.photo = photo;
    }
  } else {
    // Fallback: intentar obtener la foto basándose en el nombre/código
    const driverObj = {
      name_acronym: payload.value,
      full_name: payload.value,
      last_name: payload.value.toLowerCase(),
      familyName: payload.value
    };

    const photo = getDriverPhoto(driverObj);
    if (photo) {
      driverData.photo = photo;
    }
  }

  return (
    <g>
      {driverData.photo ? (
        <foreignObject x={x - 20} y={y - 2} width="40" height="40">
          <img 
            src={driverData.photo} 
            alt={driverData.name}
            style={{ 
              width: '40px', 
              height: '40px', 
              objectFit: 'cover',
              borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.3)'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </foreignObject>
      ) : (
        <circle cx={x} cy={y + 10} r="12" fill={driverData.color || '#666'} />
      )}
      <text 
        x={x} 
        y={y + 55} 
        textAnchor="middle" 
        fill="rgba(255,255,255,0.8)" 
        fontSize="12"
        fontWeight="500"
      >
        {(driverData.name || payload.value).length > 10 ? 
          (driverData.name || payload.value).substring(0, 10) + '...' : 
          (driverData.name || payload.value)
        }
      </text>
    </g>
  );
};

/**
 * Componente de gráfica reutilizable con estilo glass
 * @param {Array} datos - Datos para la gráfica
 * @param {String} tipo - 'linea' o 'barra'
 * @param {String} titulo - Título de la gráfica
 * @param {Array} lineas - Array de configuraciones para múltiples líneas (solo para tipo 'linea')
 */
const GraficaPuntos = ({ datos = [], tipo = 'linea', titulo = 'Gráfica', lineas = [], showTitle = true }) => {
  
  // Mapeo de códigos de país a nombres para el tooltip
  const countryNames = {
    'BH': 'Bahrain', 'SA': 'Saudi Arabia', 'AU': 'Australia', 'JP': 'Japan',
    'CN': 'China', 'US': 'United States', 'IT': 'Italy', 'MC': 'Monaco',
    'ES': 'Spain', 'CA': 'Canada', 'AT': 'Austria', 'GB': 'Great Britain',
    'HU': 'Hungary', 'BE': 'Belgium', 'NL': 'Netherlands', 'AZ': 'Azerbaijan',
    'SG': 'Singapore', 'MX': 'Mexico', 'BR': 'Brazil', 'LV': 'Las Vegas',
    'QA': 'Qatar', 'AE': 'Abu Dhabi', 'DE': 'Germany', 'FR': 'France'
  };

  // Configuración del tooltip personalizado
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Convertir código de país a nombre si es aplicable
      const displayLabel = countryNames[label] || label;
      
      // Obtener información adicional del primer payload
      const raceData = payload[0]?.payload;
      const hasResults = raceData?.hasResults;
      const isFuture = raceData?.isFuture;
      const fullName = raceData?.fullName;
      
      return (
        <div className="bg-gray-900/95 backdrop-blur-md rounded-lg p-4 shadow-xl border border-gray-700/50">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-white font-semibold text-sm">{fullName || displayLabel}</p>
            {isFuture && (
              <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                Próxima
              </span>
            )}
          </div>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-3 mb-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-gray-300 text-sm">{entry.name}:</span>
              </div>
              <span className="text-white font-bold text-sm">
                {entry.value} pts
                {isFuture && <span className="text-gray-400 text-xs ml-1">(proyectado)</span>}
              </span>
            </div>
          ))}
          {isFuture && (
            <p className="text-xs text-gray-400 mt-2">
              Los puntos se mantienen hasta que se dispute la carrera
            </p>
          )}
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
      className={showTitle ? "glass rounded-2xl p-6" : ""}
    >
      {/* Título */}
      {showTitle && <h3 className="text-xl font-bold text-white mb-6">{titulo}</h3>}

      {/* Gráfica */}
      <ResponsiveContainer width="100%" height={300}>
        {tipo === 'barra' ? (
          <BarChart data={datos}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="name" 
              stroke="rgba(255,255,255,0.5)"
              tick={
                datos.length > 0 && datos[0]?.showDriverPhoto ? 
                  (props) => <CustomDriverPhotoTick {...props} data={datos} /> :
                datos.length > 0 && datos[0]?.showLogo ? 
                  (props) => <CustomTeamLogoTick {...props} data={datos} /> : 
                { fill: 'rgba(255,255,255,0.7)', fontSize: 12 }
              }
              height={datos.length > 0 && (datos[0]?.showLogo || datos[0]?.showDriverPhoto) ? 80 : 30}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            >
              {datos.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.color || getChartColor(index)} 
                />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <LineChart data={datos}>
            <CartesianGrid 
              strokeDasharray="1 1" 
              stroke="rgba(255,255,255,0.08)" 
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="countryCode" 
              stroke="rgba(255,255,255,0.4)"
              tick={<CustomXAxisTick />}
              axisLine={false}
              tickLine={false}
              height={30}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.4)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 10', 'dataMax + 20']}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Renderizar múltiples líneas si se proporcionan */}
            {lineas.length > 0 ? (
              lineas.map((lineaConfig, index) => (
                <Line 
                  key={lineaConfig.dataKey || index}
                  type="monotone" 
                  dataKey={lineaConfig.dataKey || 'value'} 
                  stroke={lineaConfig.color || getChartColor(index)} 
                  strokeWidth={lineaConfig.strokeWidth || 4}
                  dot={(props) => {
                    // Mostrar puntos solo en carreras con resultados
                    if (props.payload?.hasResults) {
                      return (
                        <circle 
                          cx={props.cx} 
                          cy={props.cy} 
                          r={3} 
                          fill={lineaConfig.color || getChartColor(index)}
                          stroke="rgba(255,255,255,0.3)"
                          strokeWidth={1}
                        />
                      );
                    }
                    return null;
                  }}
                  activeDot={{ 
                    r: 6, 
                    fill: lineaConfig.color || getChartColor(index),
                    stroke: 'rgba(255,255,255,0.3)',
                    strokeWidth: 2
                  }}
                  strokeDasharray={(props) => {
                    // Usar líneas punteadas para carreras futuras
                    const futureRaces = datos.filter(race => race.isFuture);
                    return futureRaces.length > 0 ? "5 5" : "0";
                  }}
                  animationDuration={1200}
                  name={lineaConfig.name || lineaConfig.dataKey}
                />
              ))
            ) : (
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={getChartColor(0)} 
                strokeWidth={4}
                dot={false}
                activeDot={{ 
                  r: 6, 
                  fill: getChartColor(0),
                  stroke: 'rgba(255,255,255,0.3)',
                  strokeWidth: 2
                }}
                animationDuration={1200}
              />
            )}
          </LineChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  );
};

export default GraficaPuntos;

