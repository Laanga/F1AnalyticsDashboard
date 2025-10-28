import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig.js';
import { getCachedData, setCachedData } from '../utils/cache.js';

/**
 * Servicio para obtener todas las sesiones de un meeting y sus resultados
 */

/**
 * Obtiene todas las sesiones de un meeting específico
 * @param {number} meetingKey - Clave del meeting
 * @returns {Promise<Array>} Array de sesiones del meeting
 */
export const getMeetingSessions = async (meetingKey) => {
  const cacheKey = `meeting_sessions_${meetingKey}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log(`🏁 Obteniendo sesiones del meeting ${meetingKey}...`);
    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/sessions`, {
      params: { meeting_key: meetingKey }
    });
    
    const sessions = response.data || [];
    
    // Ordenar sesiones por fecha y tipo
    const sortedSessions = sessions.sort((a, b) => {
      const dateA = new Date(a.date_start);
      const dateB = new Date(b.date_start);
      return dateA - dateB;
    });

    setCachedData(cacheKey, sortedSessions);
    console.log(`✅ ${sortedSessions.length} sesiones obtenidas para meeting ${meetingKey}`);
    return sortedSessions;
  } catch (error) {
    console.error(`❌ Error al obtener sesiones del meeting ${meetingKey}:`, error.message);
    return [];
  }
};

/**
 * Obtiene los resultados de una sesión específica
 * @param {number} sessionKey - Clave de la sesión
 * @param {string} sessionType - Tipo de sesión (Practice, Qualifying, Sprint, Race)
 * @returns {Promise<Array>} Array de resultados de la sesión
 */
export const getSessionResults = async (sessionKey, sessionType) => {
  const cacheKey = `session_results_${sessionKey}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log(`📊 Obteniendo resultados de la sesión ${sessionKey} (${sessionType})...`);
    
    let results = [];
    
    // Para carreras y sprints, intentar primero session_result
    if (sessionType === 'Race' || sessionType === 'Sprint') {
      try {
        const sessionResultResponse = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/session_result`, {
          params: { session_key: sessionKey }
        });
        results = sessionResultResponse.data || [];
      } catch (error) {
        console.log(`⚠️ No se encontraron session_result para ${sessionKey}, intentando con position...`);
      }
    }
    
    // Si no hay resultados o es una sesión de práctica/clasificación, usar position
    if (results.length === 0) {
      try {
        const positionResponse = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/position`, {
          params: { session_key: sessionKey }
        });
        const positions = positionResponse.data || [];
        
        // Para sesiones de práctica y clasificación, obtener las mejores posiciones
        if (positions.length > 0) {
          const latestPositions = positions.reduce((acc, position) => {
            const driverNumber = position.driver_number;
            if (!acc[driverNumber] || new Date(position.date) > new Date(acc[driverNumber].date)) {
              acc[driverNumber] = position;
            }
            return acc;
          }, {});
          
          results = Object.values(latestPositions).sort((a, b) => a.position - b.position);
        }
      } catch (error) {
        console.error(`❌ Error al obtener posiciones para sesión ${sessionKey}:`, error.message);
      }
    }

    setCachedData(cacheKey, results);
    console.log(`✅ ${results.length} resultados obtenidos para sesión ${sessionKey}`);
    return results;
  } catch (error) {
    console.error(`❌ Error al obtener resultados de la sesión ${sessionKey}:`, error.message);
    return [];
  }
};

/**
 * Obtiene información de los pilotos para una sesión
 * @param {number} sessionKey - Clave de la sesión
 * @returns {Promise<Array>} Array de información de pilotos
 */
export const getSessionDrivers = async (sessionKey) => {
  const cacheKey = `session_drivers_${sessionKey}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log(`👥 Obteniendo pilotos de la sesión ${sessionKey}...`);
    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/drivers`, {
      params: { session_key: sessionKey }
    });
    
    const drivers = response.data || [];
    setCachedData(cacheKey, drivers);
    console.log(`✅ ${drivers.length} pilotos obtenidos para sesión ${sessionKey}`);
    return drivers;
  } catch (error) {
    console.error(`❌ Error al obtener pilotos de la sesión ${sessionKey}:`, error.message);
    return [];
  }
};

/**
 * Obtiene resultados completos de todas las sesiones de un meeting
 * @param {number} meetingKey - Clave del meeting
 * @returns {Promise<Object>} Objeto con todas las sesiones y sus resultados
 */
export const getCompleteMeetingResults = async (meetingKey) => {
  try {
    console.log(`🏆 Obteniendo resultados completos del meeting ${meetingKey}...`);
    
    const sessions = await getMeetingSessions(meetingKey);
    const sessionResults = {};
    
    for (const session of sessions) {
      const sessionType = session.session_name || session.session_type;
      const results = await getSessionResults(session.session_key, sessionType);
      const drivers = await getSessionDrivers(session.session_key);
      
      // Combinar resultados con información de pilotos
      const completeResults = results.map(result => {
        const driver = drivers.find(d => d.driver_number === result.driver_number);
        return {
          ...result,
          driver_info: driver || null
        };
      });
      
      sessionResults[session.session_key] = {
        session_info: session,
        results: completeResults,
        session_type: sessionType
      };
    }
    
    console.log(`✅ Resultados completos obtenidos para meeting ${meetingKey}`);
    return {
      meeting_key: meetingKey,
      sessions: sessionResults,
      session_list: sessions
    };
  } catch (error) {
    console.error(`❌ Error al obtener resultados completos del meeting ${meetingKey}:`, error.message);
    return {
      meeting_key: meetingKey,
      sessions: {},
      session_list: []
    };
  }
};

/**
 * Categoriza las sesiones por tipo
 * @param {Array} sessions - Array de sesiones
 * @returns {Object} Sesiones categorizadas por tipo
 */
export const categorizeSessionsByType = (sessions) => {
  const categorized = {
    practice: [],
    qualifying: [],
    sprint: [],
    race: []
  };
  
  sessions.forEach(session => {
    const sessionName = (session.session_name || session.session_type || '').toLowerCase();
    
    if (sessionName.includes('practice') || sessionName.includes('free')) {
      categorized.practice.push(session);
    } else if (sessionName.includes('qualifying') || sessionName.includes('quali')) {
      categorized.qualifying.push(session);
    } else if (sessionName.includes('sprint')) {
      categorized.sprint.push(session);
    } else if (sessionName.includes('race')) {
      categorized.race.push(session);
    }
  });
  
  return categorized;
};