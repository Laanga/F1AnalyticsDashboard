import axios from 'axios';
import { API_CONFIG, getCurrentYear } from '../config/apiConfig.js';
import { getCachedData, setCachedData, delay } from '../utils/cache.js';

/**
 * Servicio para operaciones relacionadas con sesiones y carreras
 */

export const getSessions = async (sessionName = null) => {
  const cacheKey = sessionName ? `sessions_${sessionName}_${getCurrentYear()}` : `sessions_${getCurrentYear()}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log('🏁 Obteniendo sesiones...');
    const params = {};
    if (sessionName) {
      params.session_name = sessionName;
    }

    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/sessions`, { params });
    
    const sessions = response.data || [];
    setCachedData(cacheKey, sessions);
    console.log(`✅ ${sessions.length} sesiones obtenidas`);
    return sessions;
  } catch (error) {
    console.error('❌ Error al obtener sesiones:', error.message);
    return [];
  }
};

export const getRaces = async () => {
  return await getSessions('Race');
};

export const getLatestSession = async () => {
  try {
    console.log('🔍 Obteniendo última sesión...');
    const sessions = await getSessions();
    const latestSession = sessions.sort((a, b) => new Date(b.date_start) - new Date(a.date_start))[0];
    return latestSession || null;
  } catch (error) {
    console.error('❌ Error al obtener última sesión:', error.message);
    return null;
  }
};

export const getMeetings = async () => {
  const cacheKey = `meetings_${getCurrentYear()}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log('📅 Obteniendo meetings...');
    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/meetings`);
    
    const meetings = response.data || [];
    const currentYear = getCurrentYear();
    
    // Filtrar meetings del año actual
    const currentYearMeetings = meetings.filter(meeting => {
      const meetingYear = new Date(meeting.date_start).getFullYear();
      return meetingYear === currentYear;
    });

    setCachedData(cacheKey, currentYearMeetings);
    console.log(`✅ ${currentYearMeetings.length} meetings obtenidos para ${currentYear}`);
    return currentYearMeetings;
  } catch (error) {
    console.error('❌ Error al obtener meetings:', error.message);
    return [];
  }
};

export const getPositions = async (sessionKey) => {
  try {
    console.log(`📊 Obteniendo posiciones para sesión ${sessionKey}...`);
    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/position`, {
      params: { session_key: sessionKey }
    });
    
    return response.data || [];
  } catch (error) {
    console.error(`❌ Error al obtener posiciones para sesión ${sessionKey}:`, error.message);
    return [];
  }
};

export const getLaps = async (sessionKey) => {
  try {
    console.log(`⏱️ Obteniendo vueltas para sesión ${sessionKey}...`);
    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/laps`, {
      params: { session_key: sessionKey }
    });
    
    return response.data || [];
  } catch (error) {
    console.error(`❌ Error al obtener vueltas para sesión ${sessionKey}:`, error.message);
    return [];
  }
};