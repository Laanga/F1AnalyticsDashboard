/**
 * Utilidades para formateo de datos en la aplicación F1
 */

/**
 * Formatea un número de puntos para mostrar
 * @param {number} puntos - Puntos a formatear
 * @returns {string} Puntos formateados
 */
export const formatearPuntos = (puntos) => {
  if (typeof puntos !== 'number') return '0';
  return puntos.toLocaleString('es-ES');
};

/**
 * Formatea un nombre de piloto para mostrar
 * @param {Object} piloto - Objeto piloto
 * @returns {string} Nombre formateado
 */
export const formatearNombrePiloto = (piloto) => {
  if (!piloto) return 'Piloto desconocido';
  
  if (piloto.full_name) {
    return piloto.full_name;
  }
  
  if (piloto.first_name && piloto.last_name) {
    return `${piloto.first_name} ${piloto.last_name}`;
  }
  
  if (piloto.givenName && piloto.familyName) {
    return `${piloto.givenName} ${piloto.familyName}`;
  }
  
  return piloto.name_acronym || piloto.code || `Piloto #${piloto.driver_number || '?'}`;
};

/**
 * Formatea el nombre de un equipo
 * @param {string} teamName - Nombre del equipo
 * @returns {string} Nombre del equipo formateado
 */
export const formatearNombreEquipo = (teamName) => {
  if (!teamName) return 'Equipo desconocido';
  
  // Mapeo de nombres comunes de equipos
  const teamMappings = {
    'Red Bull Racing Honda RBPT': 'Red Bull Racing',
    'Mercedes-AMG PETRONAS F1 Team': 'Mercedes',
    'Scuderia Ferrari': 'Ferrari',
    'McLaren Formula 1 Team': 'McLaren',
    'Aston Martin Aramco Cognizant F1 Team': 'Aston Martin',
    'BWT Alpine F1 Team': 'Alpine',
    'MoneyGram Haas F1 Team': 'Haas',
    'Visa Cash App RB Formula One Team': 'RB',
    'Williams Racing': 'Williams',
    'Kick Sauber F1 Team': 'Sauber'
  };
  
  return teamMappings[teamName] || teamName;
};

/**
 * Formatea una posición para mostrar
 * @param {number} posicion - Posición a formatear
 * @returns {string} Posición formateada
 */
export const formatearPosicion = (posicion) => {
  if (typeof posicion !== 'number') return '-';
  
  const sufijos = {
    1: 'º',
    2: 'º',
    3: 'º'
  };
  
  return `${posicion}${sufijos[posicion] || 'º'}`;
};

/**
 * Obtiene el color del equipo o un color por defecto
 * @param {string} teamColor - Color del equipo en hex
 * @returns {string} Color en formato hex
 */
export const getTeamColor = (teamColor) => {
  if (!teamColor) return '#e10600'; // Rojo F1 por defecto
  
  // Asegurar que el color tenga el formato correcto
  if (teamColor.startsWith('#')) {
    return teamColor;
  }
  
  return `#${teamColor}`;
};

/**
 * Trunca un texto a una longitud específica
 * @param {string} texto - Texto a truncar
 * @param {number} longitud - Longitud máxima
 * @returns {string} Texto truncado
 */
export const truncarTexto = (texto, longitud = 50) => {
  if (!texto || typeof texto !== 'string') return '';
  
  if (texto.length <= longitud) return texto;
  
  return `${texto.substring(0, longitud)}...`;
};