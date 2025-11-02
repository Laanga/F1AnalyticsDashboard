// Configuración de APIs usando variables de entorno
export const API_CONFIG = {
  OPENF1: {
    BASE_URL: import.meta.env.VITE_OPENF1_API_URL || 'https://api.openf1.org/v1',
    CACHE_DURATION: Number(import.meta.env.VITE_CACHE_DURATION) || 5 * 60 * 1000, // 5 minutos por defecto
  },
  JOLPICA: {
    BASE_URL: import.meta.env.VITE_ERGAST_API_URL || 'https://api.jolpi.ca/ergast/f1',
  }
};

// Total de carreras por temporada (calendario oficial F1)
export const RACES_PER_SEASON = {
  2026: 24, // Preparado para la temporada 2026
  2025: 24,
  2024: 24,
  2023: 23,
  2022: 22,
  2021: 22,
  2020: 17, // Temporada COVID reducida
  2019: 21,
  2018: 21,
  2017: 20,
  2016: 21,
  2015: 19,
  2014: 19,
};

// Sistema de puntos F1
export const F1_RACE_POINTS = {
  1: 25,   // 1er lugar
  2: 18,   // 2do lugar
  3: 15,   // 3er lugar
  4: 12,   // 4to lugar
  5: 10,   // 5to lugar
  6: 8,    // 6to lugar
  7: 6,    // 7mo lugar
  8: 4,    // 8vo lugar
  9: 2,    // 9no lugar
  10: 1    // 10mo lugar
};

export const F1_SPRINT_POINTS = {
  1: 8,    // 1er lugar
  2: 7,    // 2do lugar
  3: 6,    // 3er lugar
  4: 5,    // 4to lugar
  5: 4,    // 5to lugar
  6: 3,    // 6to lugar
  7: 2,    // 7mo lugar
  8: 1     // 8vo lugar
};

/**
 * Obtiene el año actual
 */
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

/**
 * Obtiene la temporada F1 activa
 * La temporada F1 generalmente comienza en marzo y termina en diciembre
 */
export const getCurrentF1Season = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // getMonth() retorna 0-11
  
  // Si estamos en enero o febrero, es el final de la temporada anterior
  // pero para propósitos de la app, ya mostramos la siguiente temporada
  // ya que no hay carreras activas
  if (currentMonth <= 2) {
    // Opcional: podrías retornar currentYear - 1 si quieres mostrar
    // los resultados finales de la temporada anterior
    return currentYear;
  }
  
  return currentYear;
};

/**
 * Obtiene el total de carreras de una temporada
 */
export const getTotalRacesForYear = (year) => {
  return RACES_PER_SEASON[year] || 24; // Por defecto 24 carreras
};

/**
 * Obtiene el sistema de puntos según el tipo de sesión
 */
export const getPointsSystem = (sessionName) => {
  if (sessionName && sessionName.toLowerCase().includes('sprint')) {
    return F1_SPRINT_POINTS;
  }
  return F1_RACE_POINTS;
};
