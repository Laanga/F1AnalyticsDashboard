import axios from 'axios';
import { API_CONFIG } from '../config/apiConfig.js';
import { getCachedData, setCachedData } from '../utils/cache.js';

/**
 * Servicio para operaciones relacionadas con resultados de carreras
 */

/**
 * Obtiene los resultados finales de una carrera usando session_key
 * @param {number} sessionKey - Clave única de la sesión
 * @returns {Promise<Array>} Array con los resultados de la carrera
 */
export const getRaceResults = async (sessionKey) => {
  if (!sessionKey) {
    console.warn('⚠️ No se proporcionó session_key para obtener resultados');
    return [];
  }

  const cacheKey = `race_results_${sessionKey}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log(`🏁 Obteniendo resultados de carrera para sesión ${sessionKey}...`);
    
    // Intentar obtener resultados usando el endpoint session_result
    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/session_result`, {
      params: { session_key: sessionKey }
    });
    
    if (response.data && response.data.length > 0) {
      const results = response.data.sort((a, b) => (a.position || 999) - (b.position || 999));
      setCachedData(cacheKey, results);
      console.log(`✅ ${results.length} resultados obtenidos para sesión ${sessionKey}`);
      return results;
    }

    // Si no hay resultados en session_result, intentar con position endpoint
    console.log(`⚠️ No hay resultados en session_result, intentando con position...`);
    const positionResponse = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/position`, {
      params: { session_key: sessionKey }
    });

    if (positionResponse.data && positionResponse.data.length > 0) {
      // Obtener las posiciones finales (últimas posiciones registradas)
      const positions = positionResponse.data;
      
      // Agrupar por driver_number y obtener la última posición de cada piloto
      const finalPositions = {};
      positions.forEach(pos => {
        const driverNumber = pos.driver_number;
        if (!finalPositions[driverNumber] || new Date(pos.date) > new Date(finalPositions[driverNumber].date)) {
          finalPositions[driverNumber] = pos;
        }
      });

      const results = Object.values(finalPositions)
        .sort((a, b) => (a.position || 999) - (b.position || 999));

      setCachedData(cacheKey, results);
      console.log(`✅ ${results.length} posiciones finales obtenidas para sesión ${sessionKey}`);
      return results;
    }

    console.log(`⚠️ No se encontraron resultados para la sesión ${sessionKey}`);
    return [];

  } catch (error) {
    console.error(`❌ Error al obtener resultados para sesión ${sessionKey}:`, error.message);
    return [];
  }
};

/**
 * Obtiene información detallada de los pilotos para una sesión específica
 * @param {number} sessionKey - Clave única de la sesión
 * @returns {Promise<Array>} Array con información de los pilotos
 */
export const getSessionDrivers = async (sessionKey) => {
  if (!sessionKey) {
    console.warn('⚠️ No se proporcionó session_key para obtener pilotos');
    return [];
  }

  const cacheKey = `session_drivers_${sessionKey}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log(`👥 Obteniendo pilotos para sesión ${sessionKey}...`);
    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/drivers`, {
      params: { session_key: sessionKey }
    });
    
    const drivers = response.data || [];
    setCachedData(cacheKey, drivers);
    console.log(`✅ ${drivers.length} pilotos obtenidos para sesión ${sessionKey}`);
    return drivers;

  } catch (error) {
    console.error(`❌ Error al obtener pilotos para sesión ${sessionKey}:`, error.message);
    return [];
  }
};

/**
 * Combina resultados de carrera con información de pilotos
 * @param {number} sessionKey - Clave única de la sesión
 * @returns {Promise<Array>} Array con resultados completos incluyendo información de pilotos
 */
export const getCompleteRaceResults = async (sessionKey) => {
  try {
    console.log(`🏆 Obteniendo resultados completos para sesión ${sessionKey}...`);
    
    const [results, drivers] = await Promise.all([
      getRaceResults(sessionKey),
      getSessionDrivers(sessionKey)
    ]);

    if (results.length === 0) {
      console.log(`⚠️ No hay resultados disponibles para la sesión ${sessionKey}`);
      return [];
    }

    // Combinar resultados con información de pilotos
    const completeResults = results.map(result => {
      const driver = drivers.find(d => d.driver_number === result.driver_number);
      return {
        ...result,
        driver_info: driver || null
      };
    });

    console.log(`✅ Resultados completos obtenidos: ${completeResults.length} pilotos`);
    return completeResults;

  } catch (error) {
    console.error(`❌ Error al obtener resultados completos para sesión ${sessionKey}:`, error.message);
    return [];
  }
};