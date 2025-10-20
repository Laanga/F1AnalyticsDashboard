import axios from 'axios';

// URL base de la API OpenF1
const API_URL = 'https://api.openf1.org/v1';

/**
 * Sistema de caché simple para reducir peticiones a la API
 */
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

const getCachedData = (key) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`✅ Cache hit: ${key}`);
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Servicio centralizado para consumir la API de OpenF1
 */

// Obtener el año actual dinámicamente
export const getCurrentYear = () => {
  return new Date().getFullYear();
};

// Total de carreras por temporada (calendario oficial F1)
const RACES_PER_SEASON = {
  2025: 24,
  2024: 24,
  // Añadir más años según sea necesario
};

// Obtener el total de carreras de una temporada
const getTotalRacesForYear = (year) => {
  return RACES_PER_SEASON[year] || 24; // Por defecto 24 carreras
};

// Utility para añadir delays entre peticiones
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// === PILOTOS ===

/**
 * Obtiene la lista de pilotos activos de la temporada actual (2025)
 * Solo obtiene pilotos que han participado en sesiones de 2025
 * @returns {Promise<Array>} Lista de pilotos únicos de 2025
 */
export const getDrivers = async () => {
  const cacheKey = 'drivers-2025';
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const year = getCurrentYear();
    
    // Primero obtenemos las sesiones de 2025 para saber qué pilotos participaron
    const sessionsResponse = await axios.get(`${API_URL}/sessions?year=${year}`);
    
    if (!sessionsResponse.data || sessionsResponse.data.length === 0) {
      console.warn('No hay sesiones para el año', year);
      return [];
    }

    // Tomamos la sesión más reciente para obtener pilotos actuales
    const latestSession = sessionsResponse.data
      .sort((a, b) => new Date(b.date_start) - new Date(a.date_start))[0];
    
    if (!latestSession) {
      return [];
    }

    // Obtenemos los pilotos de esa sesión
    const driversResponse = await axios.get(
      `${API_URL}/drivers?session_key=${latestSession.session_key}`
    );
    
    // Filtrar pilotos únicos por driver_number
    const driverMap = new Map();
    driversResponse.data.forEach(driver => {
      if (driver.driver_number && !driverMap.has(driver.driver_number)) {
        driverMap.set(driver.driver_number, driver);
      }
    });
    
    const result = Array.from(driverMap.values())
      .filter(driver => driver.driver_number) // Solo pilotos con número
      .sort((a, b) => a.driver_number - b.driver_number);
    
    console.log(`✅ Obtenidos ${result.length} pilotos únicos de ${year}`);
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error al obtener pilotos:', error);
    // Intentar con método alternativo si falla
    return getDriversFallback();
  }
};

/**
 * Método alternativo para obtener pilotos si el método principal falla
 */
const getDriversFallback = async () => {
  try {
    const year = getCurrentYear();
    // Obtener todos los pilotos y filtrar por año manualmente
    const response = await axios.get(`${API_URL}/drivers`);
    
    // Filtrar pilotos únicos y recientes (últimos en aparecer)
    const driverMap = new Map();
    const recentDrivers = response.data
      .filter(d => d.driver_number && d.session_key) // Solo con datos válidos
      .sort((a, b) => b.session_key - a.session_key) // Más recientes primero
      .slice(0, 100); // Top 100 más recientes
    
    recentDrivers.forEach(driver => {
      if (!driverMap.has(driver.driver_number)) {
        driverMap.set(driver.driver_number, driver);
      }
    });
    
    const result = Array.from(driverMap.values())
      .sort((a, b) => a.driver_number - b.driver_number)
      .slice(0, 25); // Máximo 25 pilotos (grid completo F1)
    
    console.log(`✅ Fallback: Obtenidos ${result.length} pilotos`);
    return result;
  } catch (error) {
    console.error('Error en fallback de pilotos:', error);
    return [];
  }
};

/**
 * Obtiene información de un piloto específico
 * @param {number} driverNumber - Número del piloto
 * @returns {Promise<Object>} Datos del piloto
 */
export const getDriverByNumber = async (driverNumber) => {
  const cacheKey = `driver-${driverNumber}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${API_URL}/drivers?driver_number=${driverNumber}`);
    // Tomar el más reciente
    const result = response.data.sort((a, b) => b.session_key - a.session_key)[0] || null;
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error(`Error al obtener piloto ${driverNumber}:`, error);
    return null;
  }
};

// === SESIONES Y CARRERAS ===

/**
 * Obtiene todas las sesiones de la temporada actual (2025)
 * @param {string} sessionName - Tipo de sesión: 'Race', 'Qualifying', 'Sprint', etc.
 * @returns {Promise<Array>} Lista de sesiones
 */
export const getSessions = async (sessionName = null) => {
  const year = getCurrentYear();
  const cacheKey = `sessions-${year}-${sessionName || 'all'}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    let url = `${API_URL}/sessions?year=${year}`;
    
    if (sessionName) {
      url += `&session_name=${sessionName}`;
    }
    
    const response = await axios.get(url);
    
    // Ordenar por fecha descendente (más reciente primero)
    const result = response.data
      .filter(s => s.year === year) // Asegurar que sea del año actual
      .sort((a, b) => new Date(b.date_start) - new Date(a.date_start));
    
    console.log(`✅ Obtenidas ${result.length} sesiones de ${year}${sessionName ? ` (${sessionName})` : ''}`);
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    const expiredCache = cache.get(cacheKey);
    if (expiredCache && error.response?.status === 429) {
      console.log('⚠️ Usando caché expirado por rate limit');
      return expiredCache.data;
    }
    return [];
  }
};

/**
 * Obtiene solo las carreras de la temporada actual
 * @returns {Promise<Array>} Lista de carreras
 */
export const getRaces = async () => {
  return getSessions('Race');
};

/**
 * Obtiene la sesión más reciente
 * @returns {Promise<Object>} Última sesión
 */
export const getLatestSession = async () => {
  try {
    const sessions = await getSessions();
    return sessions[0] || null;
  } catch (error) {
    console.error('Error al obtener última sesión:', error);
    return null;
  }
};

// === MEETINGS (Eventos/Grandes Premios) ===

/**
 * Obtiene todos los Grandes Premios de la temporada actual (2025)
 * @returns {Promise<Array>} Lista de Grandes Premios
 */
export const getMeetings = async () => {
  const year = getCurrentYear();
  const cacheKey = `meetings-${year}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${API_URL}/meetings?year=${year}`);
    
    // Ordenar por fecha y filtrar por año
    const result = response.data
      .filter(m => m.year === year) // Solo del año actual
      .sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
    
    console.log(`✅ Obtenidos ${result.length} Grandes Premios de ${year}`);
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error al obtener Grandes Premios:', error);
    const expiredCache = cache.get(cacheKey);
    if (expiredCache && error.response?.status === 429) {
      console.log('⚠️ Usando caché expirado por rate limit');
      return expiredCache.data;
    }
    return [];
  }
};

// === POSICIONES Y RESULTADOS ===

/**
 * Obtiene las posiciones de una sesión específica
 * @param {number} sessionKey - Clave de la sesión
 * @returns {Promise<Array>} Posiciones de la sesión
 */
export const getPositions = async (sessionKey) => {
  const cacheKey = `positions-${sessionKey}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${API_URL}/position?session_key=${sessionKey}`);
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener posiciones:', error);
    return [];
  }
};

// === VUELTAS ===

/**
 * Obtiene las vueltas de una sesión
 * @param {number} sessionKey - Clave de la sesión
 * @returns {Promise<Array>} Vueltas de la sesión
 */
export const getLaps = async (sessionKey) => {
  const cacheKey = `laps-${sessionKey}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const response = await axios.get(`${API_URL}/laps?session_key=${sessionKey}`);
    setCachedData(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener vueltas:', error);
    return [];
  }
};

// === ESTADÍSTICAS AGREGADAS ===

/**
 * Obtiene estadísticas completas de la temporada actual (2025)
 * @returns {Promise<Object>} Objeto con estadísticas agregadas
 */
export const getStatistics = async () => {
  const year = getCurrentYear();
  const cacheKey = `statistics-${year}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    // Hacer las peticiones de forma secuencial con pequeños delays
    console.log(`📊 Obteniendo estadísticas de ${year}...`);
    
    const drivers = await getDrivers();
    await delay(200);
    
    const sessions = await getSessions();
    await delay(200);
    
    const meetings = await getMeetings();

    // Total de carreras oficial de la temporada
    const totalRaces = getTotalRacesForYear(year);
    
    // Carreras completadas basadas en sesiones
    const raceSessions = sessions.filter(s => s.session_name === 'Race');
    const now = new Date();
    
    const completedRaces = raceSessions.filter(r => {
      const raceStart = new Date(r.date_start);
      return raceStart < now;
    });
    
    console.log(`🏁 Temporada ${year}: ${completedRaces.length}/${totalRaces} carreras completadas`);
    
    // Próximos meetings
    const upcomingMeetings = meetings.filter(m => {
      const meetingStart = new Date(m.date_start);
      return meetingStart > now;
    });
    
    const nextRace = upcomingMeetings.length > 0 
      ? upcomingMeetings.sort((a, b) => new Date(a.date_start) - new Date(b.date_start))[0]
      : null;

    const result = {
      year,
      totalDrivers: drivers.length,
      totalRaces: totalRaces, // Total oficial de carreras en la temporada
      completedRaces: completedRaces.length,
      remainingRaces: totalRaces - completedRaces.length,
      totalSessions: sessions.length,
      totalMeetings: meetings.length,
      nextRace,
      drivers,
      sessions,
      meetings
    };
    
    console.log(`✅ Estadísticas de ${year}:`, {
      pilotos: result.totalDrivers,
      carreras: `${result.completedRaces}/${result.totalRaces}`,
      restantes: result.remainingRaces
    });
    
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return {
      year,
      totalDrivers: 0,
      totalRaces: 0,
      completedRaces: 0,
      remainingRaces: 0,
      totalSessions: 0,
      totalMeetings: 0,
      nextRace: null,
      drivers: [],
      sessions: [],
      meetings: []
    };
  }
};

/**
 * Obtiene el progreso de la temporada
 * @returns {Promise<Object>} Progreso en porcentaje
 */
export const getSeasonProgress = async () => {
  const year = getCurrentYear();
  const cacheKey = `season-progress-${year}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const stats = await getStatistics();
    const progress = stats.totalRaces > 0 
      ? Math.round((stats.completedRaces / stats.totalRaces) * 100)
      : 0;
    
    const result = {
      progress,
      completed: stats.completedRaces,
      total: stats.totalRaces,
      remaining: stats.remainingRaces
    };
    
    setCachedData(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error al calcular progreso de temporada:', error);
    return {
      progress: 0,
      completed: 0,
      total: 0,
      remaining: 0
    };
  }
};

/**
 * Limpia la caché (útil para desarrollo)
 */
export const clearCache = () => {
  cache.clear();
  console.log('🗑️ Caché limpiado');
};

export default {
  getDrivers,
  getDriverByNumber,
  getSessions,
  getRaces,
  getLatestSession,
  getMeetings,
  getPositions,
  getLaps,
  getStatistics,
  getSeasonProgress,
  getCurrentYear,
  clearCache
};
