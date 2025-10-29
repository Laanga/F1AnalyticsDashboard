import axios from 'axios';
import { API_CONFIG, getCurrentYear } from '../config/apiConfig.js';
import { getCachedData, setCachedData, delay } from '../utils/cache.js';
import { getSelectedYear } from '../../hooks/useSelectedYear.js';
import { safeRequest } from '../utils/rateLimiter.js';

export const getSessions = async (sessionName = null) => {
  const selectedYear = getSelectedYear();
  const cacheKey = sessionName ? `sessions_${sessionName}_${selectedYear}` : `sessions_${selectedYear}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await safeRequest(`${API_CONFIG.OPENF1.BASE_URL}/sessions`, {
      params: sessionName ? { session_name: sessionName } : {}
    });
    
    const sessions = response.data || [];
    
    if (!sessions || sessions.length === 0) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData) {
        return cachedData;
      }
      return [];
    }

    const filteredSessions = sessions.filter(session => {
      const sessionDate = new Date(session.date_start);
      return sessionDate.getFullYear() === selectedYear;
    });

    setCachedData(cacheKey, filteredSessions);
    return filteredSessions;
  } catch (error) {
    console.error('❌ Error al obtener sesiones:', error.message);
    
    const oldCachedData = getCachedData(cacheKey, true);
    if (oldCachedData && oldCachedData.length > 0) {
      return oldCachedData;
    }
    
    return [];
  }
};

export const getFutureRacesFromErgast = async (year) => {
  const cacheKey = `future_races_ergast_${year}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_CONFIG.ERGAST.BASE_URL}/${year}.json`);
    
    if (response.data?.MRData?.RaceTable?.Races) {
      const races = response.data.MRData.RaceTable.Races;
      
      const futureRaces = races
        .filter(race => {
          const raceDate = new Date(race.date);
          return raceDate > new Date();
        })
        .map((race, index) => {
          const meetingKey = parseInt(`${year}${String(race.round).padStart(2, '0')}`);
          
          return {
            session_key: parseInt(`${meetingKey}01`),
            session_name: 'Race',
            date_start: race.date + 'T' + (race.time || '14:00:00'),
            date_end: race.date + 'T' + (race.time || '16:00:00'),
            gmt_offset: '+00:00',
            session_type: 'Race',
            meeting_key: meetingKey,
            location: race.Circuit?.circuitName || race.raceName,
            country_code: race.Circuit?.Location?.country || 'Unknown',
            country_name: race.Circuit?.Location?.country || 'Unknown',
            circuit_key: race.Circuit?.circuitId || `circuit_${race.round}`,
            circuit_short_name: race.Circuit?.circuitName || race.raceName,
            race_name: race.raceName,
            round: parseInt(race.round),
            is_future_race: true,
            source: 'ergast'
          };
        });

      setCachedData(cacheKey, futureRaces);
      return futureRaces;
    }
  } catch (error) {
    console.error(`❌ Error al obtener carreras futuras desde Ergast para ${year}:`, error.message);
  }
  
  return [];
};

export const getRaces = async () => {
  const selectedYear = getSelectedYear();
  const currentYear = getCurrentYear();
  
  try {
    const historicalRaces = await getSessions('Race');
    
    const yearFilteredRaces = historicalRaces.filter(race => {
      const raceYear = new Date(race.date_start).getFullYear();
      return raceYear === selectedYear;
    });

    let futureRaces = [];
    if (selectedYear >= currentYear) {
      try {
        futureRaces = await getFutureRacesFromErgast(selectedYear);
      } catch (futureError) {
        console.warn('⚠️ Error al obtener carreras futuras, continuando solo con históricas:', futureError.message);
        futureRaces = [];
      }
    }
    
    const allRaces = [...yearFilteredRaces, ...futureRaces];
    
    allRaces.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));
    
    return allRaces;
  } catch (error) {
    console.error('❌ Error al obtener carreras combinadas:', error.message);
    
    try {
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
    const sessions = await getSessions();
    const latestSession = sessions.sort((a, b) => new Date(b.date_start) - new Date(a.date_start))[0];
    return latestSession || null;
  } catch (error) {
    console.error('❌ Error al obtener última sesión:', error.message);
    return null;
  }
};

export const getFutureMeetingsFromErgast = async (year) => {
  const cacheKey = `future_meetings_ergast_${year}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_CONFIG.ERGAST.BASE_URL}/${year}.json`);
    
    if (response.data?.MRData?.RaceTable?.Races) {
      const races = response.data.MRData.RaceTable.Races;
      
      const futureMeetings = races
        .filter(race => {
          const raceDate = new Date(race.date);
          return raceDate > new Date();
        })
        .map((race, index) => {
          const meetingKey = parseInt(`${year}${String(race.round).padStart(2, '0')}`);
          
          return {
            meeting_key: meetingKey,
            meeting_name: race.raceName,
            date_start: race.date + 'T09:00:00',
            date_end: race.date + 'T' + (race.time || '16:00:00'),
            gmt_offset: '+00:00',
            meeting_official_name: race.raceName,
            location: race.Circuit?.circuitName || race.raceName,
            country_code: race.Circuit?.Location?.country || 'Unknown',
            country_name: race.Circuit?.Location?.country || 'Unknown',
            circuit_key: race.Circuit?.circuitId || `circuit_${race.round}`,
            circuit_short_name: race.Circuit?.circuitName || race.raceName,
            year: year,
            round: parseInt(race.round),
            is_future_meeting: true,
            source: 'ergast'
          };
        });

      setCachedData(cacheKey, futureMeetings);
      return futureMeetings;
    }
  } catch (error) {
    console.error(`❌ Error al obtener meetings futuros desde Ergast para ${year}:`, error.message);
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
    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/meetings`);
    const meetings = response.data || [];
    
    const selectedYearMeetings = meetings.filter(meeting => {
      const meetingYear = new Date(meeting.date_start).getFullYear();
      return meetingYear === selectedYear;
    });

    let futureMeetings = [];
    if (selectedYear >= currentYear) {
      futureMeetings = await getFutureMeetingsFromErgast(selectedYear);
    }
    
    const allMeetings = [...selectedYearMeetings, ...futureMeetings];
    
    allMeetings.sort((a, b) => new Date(a.date_start) - new Date(b.date_start));

    setCachedData(cacheKey, allMeetings);
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
    const response = await safeRequest(`${API_CONFIG.OPENF1.BASE_URL}/position`, {
      params: { session_key: sessionKey }
    });
    
    const positions = response.data || [];
    setCachedData(cacheKey, positions);
    return positions;
  } catch (error) {
    console.error(`❌ Error al obtener posiciones para sesión ${sessionKey}:`, error.message);
    
    const oldCachedData = getCachedData(cacheKey, true);
    if (oldCachedData && oldCachedData.length > 0) {
      return oldCachedData;
    }
    
    return [];
  }
};

export const getLaps = async (sessionKey) => {
  try {
    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/laps`, {
      params: { session_key: sessionKey }
    });
    
    return response.data || [];
  } catch (error) {
    console.error(`❌ Error al obtener vueltas para sesión ${sessionKey}:`, error.message);
    return [];
  }
};

export const getLastSession = async () => {
  try {
    const sessions = await getSessions();
    
    if (!sessions || sessions.length === 0) {
      return null;
    }

    const sortedSessions = sessions
      .filter(session => new Date(session.date_start) <= new Date())
      .sort((a, b) => new Date(b.date_start) - new Date(a.date_start));

    return sortedSessions[0] || null;
  } catch (error) {
    console.error('Error obteniendo última sesión:', error);
    return null;
  }
};