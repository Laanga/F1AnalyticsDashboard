import axios from 'axios';
import { API_CONFIG, getCurrentYear } from '../config/apiConfig.js';
import { getCachedData, setCachedData, delay } from '../utils/cache.js';
import { getSelectedYear } from '../../hooks/useSelectedYear.js';
import { safeRequest } from '../utils/rateLimiter.js';

/**
 * Servicio para operaciones relacionadas con sesiones y carreras
 */

export const getSessions = async (sessionName = null) => {
  const selectedYear = getSelectedYear();
  const cacheKey = sessionName ? `sessions_${sessionName}_${selectedYear}` : `sessions_${selectedYear}`;
  
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

    // Usar safeRequest con rate limiting
    const response = await safeRequest(`${API_CONFIG.OPENF1.BASE_URL}/sessions`, { 
      params
    });
    
    const sessions = response.data || [];
    setCachedData(cacheKey, sessions);
    console.log(`✅ ${sessions.length} sesiones obtenidas`);
    return sessions;
  } catch (error) {
    console.error('❌ Error al obtener sesiones:', error.message);
    
    // Si hay datos en caché antiguos, usarlos como fallback
    const oldCachedData = getCachedData(cacheKey, true); // ignorar expiración
    if (oldCachedData && oldCachedData.length > 0) {
      console.log('⚠️ Usando datos en caché como fallback');
      return oldCachedData;
    }
    
    return [];
  }
};

// Función para obtener carreras futuras desde Ergast/Jolpica
export const getFutureRacesFromErgast = async (year = null) => {
  const selectedYear = year || getSelectedYear();
  const currentYear = getCurrentYear();
  const cacheKey = `future_races_ergast_${selectedYear}`;
  
  // Solo buscar carreras futuras para el año actual o años futuros
  if (selectedYear < currentYear) {
    return [];
  }
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log(`🏁 Obteniendo carreras futuras desde Ergast para ${selectedYear}...`);
    const response = await axios.get(`${API_CONFIG.JOLPICA.BASE_URL}/${selectedYear}.json`);
    
    if (response.data?.MRData?.RaceTable?.Races) {
      const races = response.data.MRData.RaceTable.Races;
      const currentDate = new Date();
      
      // Filtrar solo carreras futuras y mapear al formato OpenF1
      const futureRaces = races
        .filter(race => {
          const raceDate = new Date(race.date + 'T' + (race.time || '14:00:00'));
          return raceDate > currentDate;
        })
        .map((race, index) => {
          // Generar un session_key único para carreras futuras
          const sessionKey = `future_${selectedYear}_${race.round}_race`;
          const meetingKey = `future_${selectedYear}_${race.round}`;
          
          return {
            session_key: sessionKey,
            session_name: 'Race',
            date_start: race.date + 'T' + (race.time || '14:00:00'),
            date_end: race.date + 'T' + (race.time || '16:00:00'), // Estimado 2 horas después
            gmt_offset: '+00:00', // UTC por defecto
            session_type: 'Race',
            meeting_key: meetingKey,
            location: race.Circuit?.circuitName || race.raceName,
            country_code: race.Circuit?.Location?.country || 'Unknown',
            country_name: race.Circuit?.Location?.country || 'Unknown',
            circuit_key: race.Circuit?.circuitId || `circuit_${race.round}`,
            circuit_short_name: race.Circuit?.circuitName || race.raceName,
            race_name: race.raceName,
            round: parseInt(race.round),
            // Campos adicionales para compatibilidad
            is_future_race: true,
            source: 'ergast'
          };
        });

      setCachedData(cacheKey, futureRaces);
      console.log(`✅ ${futureRaces.length} carreras futuras obtenidas desde Ergast para ${selectedYear}`);
      return futureRaces;
    }
  } catch (error) {
    console.error(`❌ Error al obtener carreras futuras desde Ergast para ${selectedYear}:`, error.message);
  }
  
  return [];
};

export const getRaces = async () => {
  const selectedYear = getSelectedYear();
  const currentYear = getCurrentYear();
  
  try {
    // Obtener carreras históricas de OpenF1
    const historicalRaces = await getSessions('Race');
    
    // Filtrar carreras del año seleccionado
    const yearFilteredRaces = historicalRaces.filter(race => {
      const raceYear = new Date(race.date_start).getFullYear();
      return raceYear === selectedYear;
    });

    // Si es el año actual o futuro, también obtener carreras futuras de Ergast
    let futureRaces = [];
    if (selectedYear >= currentYear) {
      try {
        futureRaces = await getFutureRacesFromErgast(selectedYear);
      } catch (futureError) {
        console.warn('⚠️ Error al obtener carreras futuras, continuando solo con históricas:', futureError.message);
        futureRaces = [];
      }
    }
    
    // Combinar carreras históricas y futuras
    const allRaces = [...yearFilteredRaces, ...futureRaces];
    
    // Ordenar por fecha
    allRaces.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
    
    console.log(`🏁 Total de carreras para ${selectedYear}: ${allRaces.length} (${yearFilteredRaces.length} históricas + ${futureRaces.length} futuras)`);
    
    return allRaces;
  } catch (error) {
    console.error('❌ Error al obtener carreras combinadas:', error.message);
    
    // Fallback más robusto
    try {
      console.log('🔄 Intentando fallback a carreras históricas...');
      const fallbackRaces = await getSessions('Race');
      const filteredFallback = fallbackRaces.filter(race => {
        const raceYear = new Date(race.date_start).getFullYear();
        return raceYear === selectedYear;
      });
      return filteredFallback;
    } catch (fallbackError) {
      console.error('❌ Error en fallback:', fallbackError.message);
      return [];
    }
  }
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

// Función para obtener meetings futuros desde Ergast/Jolpica
export const getFutureMeetingsFromErgast = async (year = null) => {
  const selectedYear = year || getSelectedYear();
  const currentYear = getCurrentYear();
  const cacheKey = `future_meetings_ergast_${selectedYear}`;
  
  // Solo buscar meetings futuros para el año actual o años futuros
  if (selectedYear < currentYear) {
    return [];
  }
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log(`📅 Obteniendo meetings futuros desde Ergast para ${selectedYear}...`);
    const response = await axios.get(`${API_CONFIG.JOLPICA.BASE_URL}/${selectedYear}.json`);
    
    if (response.data?.MRData?.RaceTable?.Races) {
      const races = response.data.MRData.RaceTable.Races;
      const currentDate = new Date();
      
      // Filtrar solo carreras futuras y crear meetings correspondientes
      const futureMeetings = races
        .filter(race => {
          const raceDate = new Date(race.date + 'T' + (race.time || '14:00:00'));
          return raceDate > currentDate;
        })
        .map((race, index) => {
          const meetingKey = `future_${selectedYear}_${race.round}`;
          
          return {
            meeting_key: meetingKey,
            meeting_name: race.raceName,
            date_start: race.date + 'T09:00:00', // Estimado inicio del fin de semana
            date_end: race.date + 'T' + (race.time || '16:00:00'),
            gmt_offset: '+00:00',
            meeting_official_name: race.raceName,
            location: race.Circuit?.circuitName || race.raceName,
            country_code: race.Circuit?.Location?.country || 'Unknown',
            country_name: race.Circuit?.Location?.country || 'Unknown',
            circuit_key: race.Circuit?.circuitId || `circuit_${race.round}`,
            circuit_short_name: race.Circuit?.circuitName || race.raceName,
            year: selectedYear,
            round: parseInt(race.round),
            // Campos adicionales para compatibilidad
            is_future_meeting: true,
            source: 'ergast'
          };
        });

      setCachedData(cacheKey, futureMeetings);
      console.log(`✅ ${futureMeetings.length} meetings futuros obtenidos desde Ergast para ${selectedYear}`);
      return futureMeetings;
    }
  } catch (error) {
    console.error(`❌ Error al obtener meetings futuros desde Ergast para ${selectedYear}:`, error.message);
  }
  
  return [];
};

export const getMeetings = async () => {
  const selectedYear = getSelectedYear();
  const currentYear = getCurrentYear();
  const cacheKey = `meetings_${selectedYear}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log('📅 Obteniendo meetings...');
    
    // Obtener meetings históricas de OpenF1
    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/meetings`);
    const meetings = response.data || [];
    
    // Filtrar meetings del año seleccionado
    const selectedYearMeetings = meetings.filter(meeting => {
      const meetingYear = new Date(meeting.date_start).getFullYear();
      return meetingYear === selectedYear;
    });

    // Si es el año actual o futuro, también obtener meetings futuros de Ergast
    let futureMeetings = [];
    if (selectedYear >= currentYear) {
      futureMeetings = await getFutureMeetingsFromErgast(selectedYear);
    }
    
    // Combinar meetings históricas y futuras
    const allMeetings = [...selectedYearMeetings, ...futureMeetings];
    
    // Ordenar por fecha
    allMeetings.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));

    setCachedData(cacheKey, allMeetings);
    console.log(`📅 Total de meetings para ${selectedYear}: ${allMeetings.length} (${selectedYearMeetings.length} históricas + ${futureMeetings.length} futuras)`);
    return allMeetings;
  } catch (error) {
    console.error('❌ Error al obtener meetings:', error.message);
    return [];
  }
};

export const getPositions = async (sessionKey) => {
  const cacheKey = `positions_${sessionKey}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log(`📊 Obteniendo posiciones para sesión ${sessionKey}...`);
    const response = await safeRequest(`${API_CONFIG.OPENF1.BASE_URL}/position`, {
      params: { session_key: sessionKey }
    });
    
    const positions = response.data || [];
    setCachedData(cacheKey, positions);
    console.log(`✅ ${positions.length} posiciones obtenidas para sesión ${sessionKey}`);
    return positions;
  } catch (error) {
    console.error(`❌ Error al obtener posiciones para sesión ${sessionKey}:`, error.message);
    
    // Intentar usar datos en caché como fallback
    const oldCachedData = getCachedData(cacheKey, true);
    if (oldCachedData && oldCachedData.length > 0) {
      console.log(`⚠️ Usando datos en caché como fallback para posiciones de sesión ${sessionKey}`);
      return oldCachedData;
    }
    
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