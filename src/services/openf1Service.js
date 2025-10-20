import axios from 'axios';

// URL base de la API OpenF1
const API_URL = 'https://api.openf1.org/v1';

/**
 * Servicio centralizado para consumir la API de OpenF1
 * Documentación: https://openf1.org
 */

// === PILOTOS ===

/**
 * Obtiene la lista de todos los pilotos
 * @returns {Promise<Array>} Lista de pilotos
 */
export const getDrivers = async () => {
  try {
    const response = await axios.get(`${API_URL}/drivers`);
    // Filtramos duplicados por driver_number y tomamos los más recientes
    const uniqueDrivers = response.data.reduce((acc, driver) => {
      const existing = acc.find(d => d.driver_number === driver.driver_number);
      if (!existing) {
        acc.push(driver);
      }
      return acc;
    }, []);
    return uniqueDrivers;
  } catch (error) {
    console.error('Error al obtener pilotos:', error);
    throw error;
  }
};

/**
 * Obtiene información de un piloto específico
 * @param {number} driverNumber - Número del piloto
 * @returns {Promise<Object>} Datos del piloto
 */
export const getDriverByNumber = async (driverNumber) => {
  try {
    const response = await axios.get(`${API_URL}/drivers?driver_number=${driverNumber}`);
    return response.data[0];
  } catch (error) {
    console.error(`Error al obtener piloto ${driverNumber}:`, error);
    throw error;
  }
};

// === SESIONES Y CARRERAS ===

/**
 * Obtiene todas las sesiones (práctica, clasificación, carrera)
 * @param {string} sessionName - Tipo de sesión: 'Race', 'Qualifying', 'Practice'
 * @returns {Promise<Array>} Lista de sesiones
 */
export const getSessions = async (sessionName = null) => {
  try {
    const url = sessionName 
      ? `${API_URL}/sessions?session_name=${sessionName}`
      : `${API_URL}/sessions`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error al obtener sesiones:', error);
    throw error;
  }
};

/**
 * Obtiene solo las carreras (sesiones de tipo "Race")
 * @returns {Promise<Array>} Lista de carreras
 */
export const getRaces = async () => {
  return getSessions('Race');
};

/**
 * Obtiene las sesiones del año actual (2024)
 * @returns {Promise<Array>} Sesiones de 2024
 */
export const getCurrentSeasonSessions = async () => {
  try {
    const response = await axios.get(`${API_URL}/sessions?year=2025`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener sesiones de la temporada:', error);
    throw error;
  }
};

// === MEETINGS (Eventos/Grandes Premios) ===

/**
 * Obtiene todos los Grandes Premios
 * @returns {Promise<Array>} Lista de Grandes Premios
 */
export const getMeetings = async () => {
  try {
    const response = await axios.get(`${API_URL}/meetings`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener Grandes Premios:', error);
    throw error;
  }
};

/**
 * Obtiene los Grandes Premios del año actual
 * @returns {Promise<Array>} Grandes Premios de 2024
 */
export const getCurrentSeasonMeetings = async () => {
  try {
    const response = await axios.get(`${API_URL}/meetings?year=2025`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener Grandes Premios de la temporada:', error);
    throw error;
  }
};

// === POSICIONES ===

/**
 * Obtiene las posiciones de una sesión específica
 * @param {number} sessionKey - Clave de la sesión
 * @returns {Promise<Array>} Posiciones de la sesión
 */
export const getPositions = async (sessionKey) => {
  try {
    const response = await axios.get(`${API_URL}/position?session_key=${sessionKey}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener posiciones:', error);
    throw error;
  }
};

// === VUELTAS ===

/**
 * Obtiene las vueltas de una sesión
 * @param {number} sessionKey - Clave de la sesión
 * @returns {Promise<Array>} Vueltas de la sesión
 */
export const getLaps = async (sessionKey) => {
  try {
    const response = await axios.get(`${API_URL}/laps?session_key=${sessionKey}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener vueltas:', error);
    throw error;
  }
};

// === UTILIDADES ===

/**
 * Obtiene datos estadísticos agregados (simulados a partir de sesiones)
 * Esta función procesa datos de múltiples endpoints para crear estadísticas
 * @returns {Promise<Object>} Objeto con estadísticas agregadas
 */
export const getStatistics = async () => {
  try {
    const [drivers, sessions] = await Promise.all([
      getDrivers(),
      getCurrentSeasonSessions()
    ]);

    return {
      totalDrivers: drivers.length,
      totalRaces: sessions.filter(s => s.session_name === 'Race').length,
      totalSessions: sessions.length,
      drivers: drivers,
      sessions: sessions
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    throw error;
  }
};

export default {
  getDrivers,
  getDriverByNumber,
  getSessions,
  getRaces,
  getCurrentSeasonSessions,
  getMeetings,
  getCurrentSeasonMeetings,
  getPositions,
  getLaps,
  getStatistics
};

