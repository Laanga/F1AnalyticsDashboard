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
 * Obtiene el color del equipo basado en el nombre del equipo o un color por defecto
 * @param {string} teamNameOrColor - Nombre del equipo o color del equipo en hex
 * @returns {string} Color en formato hex
 */
export const getTeamColor = (teamNameOrColor) => {
  // Si ya es un color hex, devolverlo directamente
  if (typeof teamNameOrColor === 'string' && teamNameOrColor.startsWith('#')) {
    console.log('Color hex directo:', teamNameOrColor);
    return teamNameOrColor;
  }

  if (!teamNameOrColor) {
    console.log('No se proporcionó nombre de equipo - usando color por defecto');
    return '#e10600'; // Rojo F1 por defecto
  }
  
  // Mapeo de colores específicos por nombre de equipo (temporada 2025)
  const teamColorMappings = {
    'Red Bull Racing Honda RBPT': '#3671C6',
    'Red Bull Racing': '#3671C6',
    'Red Bull': '#3671C6',
    'Mercedes-AMG PETRONAS F1 Team': '#27F4D2',
    'Mercedes': '#27F4D2',
    'Scuderia Ferrari': '#E8002D',
    'Ferrari': '#E8002D',
    'McLaren F1 Team': '#FF8000',
    'McLaren Formula 1 Team': '#FF8000',
    'McLaren': '#FF8000',
    'Aston Martin Aramco Cognizant F1 Team': '#229971',
    'Aston Martin': '#229971',
    'BWT Alpine F1 Team': '#0093CC',
    'Alpine': '#0093CC',
    'MoneyGram Haas F1 Team': '#B6BABD',
    'Haas F1 Team': '#B6BABD',
    'Haas': '#B6BABD',
    'Visa Cash App RB Formula One Team': '#6692FF',
    'RB F1 Team': '#6692FF',
    'Racing Bulls': '#6692FF',
    'RB': '#6692FF',
    'Kick Sauber F1 Team': '#52E252',
    'Sauber': '#52E252',
    'Kick Sauber': '#52E252',
    'Williams Racing': '#64C4FF',
    'Williams': '#64C4FF'
  };
  
  const teamName = teamNameOrColor?.toLowerCase() || '';
  console.log('Buscando color para equipo:', teamName);
  
  // Buscar coincidencia exacta primero
  for (const [key, color] of Object.entries(teamColorMappings)) {
    if (key.toLowerCase() === teamName) {
      console.log('Coincidencia exacta encontrada:', key, '->', color);
      return color;
    }
  }
  
  // Buscar coincidencia parcial por nombre
  for (const [key, color] of Object.entries(teamColorMappings)) {
    if (key.toLowerCase().includes(teamName) || teamName.includes(key.toLowerCase())) {
      console.log('Coincidencia parcial encontrada:', key, '->', color);
      return color;
    }
  }
  
  // Si es un color hex sin #, agregarlo
  if (/^[0-9A-Fa-f]{6}$/.test(teamNameOrColor)) {
    console.log('Color hex sin # detectado:', teamNameOrColor);
    return `#${teamNameOrColor}`;
  }
  
  // Color por defecto si no se encuentra
  console.log('No se encontró color para:', teamName, '- usando color por defecto');
  return '#e10600'; // Rojo F1 por defecto
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

/**
 * Obtiene la ruta del logo del equipo basado en el nombre
 * @param {string} teamName - Nombre del equipo
 * @returns {string} Ruta del logo del equipo
 */
export const getTeamLogo = (teamName) => {
  if (!teamName) return '/teams/default.png';
  
  // Mapeo de nombres de equipos a archivos de logo
  const teamLogoMappings = {
    'Red Bull Racing Honda RBPT': '/teams/red-bull.png',
    'Red Bull Racing': '/teams/red-bull.png',
    'Mercedes-AMG PETRONAS F1 Team': '/teams/mercedes.png',
    'Mercedes': '/teams/mercedes.png',
    'Scuderia Ferrari': '/teams/ferrari.png',
    'Ferrari': '/teams/ferrari.png',
    'McLaren F1 Team': '/teams/mclaren.png',
    'McLaren': '/teams/mclaren.png',
    'Aston Martin Aramco Cognizant F1 Team': '/teams/aston-martin.png',
    'Aston Martin': '/teams/aston-martin.png',
    'BWT Alpine F1 Team': '/teams/alpine.png',
    'Alpine': '/teams/alpine.png',
    'MoneyGram Haas F1 Team': '/teams/haas.png',
    'Haas': '/teams/haas.png',
    'Visa Cash App RB Formula One Team': '/teams/visa-red.png',
    'Racing Bulls': '/teams/visa-red.png',
    'Kick Sauber F1 Team': '/teams/kick.png',
    'Sauber': '/teams/kick.png',
    'Kick Sauber': '/teams/kick.png',
    'Williams Racing': '/teams/williams.png',
    'Williams': '/teams/williams.png'
  };
  
  // Buscar coincidencia exacta primero
  if (teamLogoMappings[teamName]) {
    return teamLogoMappings[teamName];
  }
  
  // Buscar coincidencia parcial
  const teamNameLower = teamName.toLowerCase();
  for (const [key, logo] of Object.entries(teamLogoMappings)) {
    if (key.toLowerCase().includes(teamNameLower) || teamNameLower.includes(key.toLowerCase())) {
      return logo;
    }
  }
  
  // Si no se encuentra, intentar con palabras clave
  if (teamNameLower.includes('red bull')) return '/teams/red-bull.png';
  if (teamNameLower.includes('mercedes')) return '/teams/mercedes.png';
  if (teamNameLower.includes('ferrari')) return '/teams/ferrari.png';
  if (teamNameLower.includes('mclaren')) return '/teams/mclaren.png';
  if (teamNameLower.includes('aston')) return '/teams/aston-martin.png';
  if (teamNameLower.includes('alpine')) return '/teams/alpine.png';
  if (teamNameLower.includes('haas')) return '/teams/haas.png';
  if (teamNameLower.includes('rb') || teamNameLower.includes('visa')) return '/teams/visa-red.png';
  if (teamNameLower.includes('sauber') || teamNameLower.includes('kick')) return '/teams/kick.png';
  if (teamNameLower.includes('williams')) return '/teams/williams.png';
  
  // Logo por defecto si no se encuentra
  return '/teams/default.png';
};