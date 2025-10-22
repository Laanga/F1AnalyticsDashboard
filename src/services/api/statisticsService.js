import { getCurrentYear, getTotalRacesForYear } from '../config/apiConfig.js';
import { getCachedData, setCachedData } from '../utils/cache.js';
import { getDrivers } from './driversService.js';
import { getSessions, getMeetings } from './sessionsService.js';
import { getDriverStandingsFromErgast, getConstructorStandingsFromErgast } from './standingsService.js';
import { getSelectedYear } from '../../hooks/useSelectedYear.js';

/**
 * Servicio para estadísticas y análisis de datos
 */

export const getStatistics = async () => {
  const selectedYear = getSelectedYear();
  const cacheKey = `statistics_${selectedYear}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log('📊 Generando estadísticas...');
    
    // Obtener datos base
    const [drivers, sessions, meetings] = await Promise.all([
      getDrivers(),
      getSessions(),
      getMeetings()
    ]);

    // Intentar obtener datos reales de clasificaciones
    const [driverStandings, constructorStandings] = await Promise.all([
      getDriverStandingsFromErgast(),
      getConstructorStandingsFromErgast()
    ]);

    const totalRaces = getTotalRacesForYear(selectedYear);
    const completedRaces = sessions.filter(session => 
      session.session_name === 'Race' && 
      new Date(session.date_start) < new Date()
    ).length;

    const upcomingMeetings = meetings.filter(meeting => 
      new Date(meeting.date_start) > new Date()
    ).slice(0, 3);

    // Determinar el tipo de datos
    const hasRealData = driverStandings.length > 0 && constructorStandings.length > 0;
    const dataSource = hasRealData ? 'real' : 'base';

    let statistics = {
      totalDrivers: drivers.length,
      totalRaces,
      completedRaces,
      upcomingMeetings,
      dataSource,
      topDrivers: [],
      topConstructors: [],
      championshipLeader: null,
      constructorLeader: null,
      totalPoints: 0,
      totalWins: 0
    };

    if (hasRealData) {
      // Usar datos reales
      statistics.topDrivers = driverStandings.slice(0, 10);
      statistics.topConstructors = constructorStandings.slice(0, 10);
      statistics.championshipLeader = driverStandings[0] || null;
      statistics.constructorLeader = constructorStandings[0] || null;
      statistics.totalPoints = driverStandings.reduce((sum, driver) => sum + driver.points, 0);
      statistics.totalWins = driverStandings.reduce((sum, driver) => sum + driver.wins, 0);
    }

    setCachedData(cacheKey, statistics);
    console.log(`✅ Estadísticas generadas (${dataSource === 'real' ? 'DATOS REALES' : 'DATOS BASE'})`);
    return statistics;

  } catch (error) {
    console.error('❌ Error al generar estadísticas:', error.message);
    return {
      totalDrivers: 0,
      totalRaces: getTotalRacesForYear(selectedYear),
      completedRaces: 0,
      upcomingMeetings: [],
      dataSource: 'error',
      topDrivers: [],
      topConstructors: [],
      championshipLeader: null,
      constructorLeader: null,
      totalPoints: 0,
      totalWins: 0
    };
  }
};

export const getSeasonProgress = async () => {
  const selectedYear = getSelectedYear();
  const cacheKey = `season_progress_${selectedYear}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log('📈 Calculando progreso de temporada...');
    
    const sessions = await getSessions('Race');
    const totalRaces = getTotalRacesForYear(selectedYear);
    const completedRaces = sessions.filter(session => 
      new Date(session.date_start) < new Date()
    ).length;

    const progress = {
      totalRaces,
      completedRaces,
      remainingRaces: totalRaces - completedRaces,
      progressPercentage: Math.round((completedRaces / totalRaces) * 100)
    };

    setCachedData(cacheKey, progress);
    console.log(`✅ Progreso calculado: ${progress.progressPercentage}%`);
    return progress;

  } catch (error) {
    console.error('❌ Error al calcular progreso:', error.message);
    return {
      totalRaces: getTotalRacesForYear(selectedYear),
      completedRaces: 0,
      remainingRaces: getTotalRacesForYear(selectedYear),
      progressPercentage: 0
    };
  }
};