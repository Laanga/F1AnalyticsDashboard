import axios from 'axios';
import { API_CONFIG, getCurrentYear } from '../config/apiConfig.js';
import { getCachedData, setCachedData } from '../utils/cache.js';

/**
 * Servicio para operaciones relacionadas con clasificaciones y standings
 */

export const getDriverStandingsFromErgast = async () => {
  const currentYear = getCurrentYear();
  const cacheKey = `driver_standings_ergast_${currentYear}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log(`🏆 Obteniendo clasificación de pilotos desde Ergast para ${currentYear}...`);
    const response = await axios.get(`${API_CONFIG.JOLPICA.BASE_URL}/${currentYear}/driverstandings.json`);
    
    if (response.data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings) {
      const standings = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      
      const processedStandings = standings.map(standing => ({
        position: parseInt(standing.position),
        points: parseFloat(standing.points),
        wins: parseInt(standing.wins),
        driver: {
          driverId: standing.Driver.driverId,
          permanentNumber: standing.Driver.permanentNumber,
          code: standing.Driver.code,
          givenName: standing.Driver.givenName,
          familyName: standing.Driver.familyName,
          nationality: standing.Driver.nationality
        },
        constructor: {
          constructorId: standing.Constructors[0].constructorId,
          name: standing.Constructors[0].name,
          nationality: standing.Constructors[0].nationality
        }
      }));

      setCachedData(cacheKey, processedStandings);
      console.log(`✅ ${processedStandings.length} clasificaciones de pilotos obtenidas desde Ergast`);
      return processedStandings;
    }
  } catch (error) {
    console.error('❌ Error al obtener clasificaciones desde Ergast:', error.message);
  }
  
  return [];
};

export const getConstructorStandingsFromErgast = async () => {
  const currentYear = getCurrentYear();
  const cacheKey = `constructor_standings_ergast_${currentYear}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log(`🏗️ Obteniendo clasificación de constructores desde Ergast para ${currentYear}...`);
    const response = await axios.get(`${API_CONFIG.JOLPICA.BASE_URL}/${currentYear}/constructorstandings.json`);
    
    if (response.data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings) {
      const standings = response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
      
      const processedStandings = standings.map(standing => ({
        position: parseInt(standing.position),
        points: parseFloat(standing.points),
        wins: parseInt(standing.wins),
        constructor: {
          constructorId: standing.Constructor.constructorId,
          name: standing.Constructor.name,
          nationality: standing.Constructor.nationality
        }
      }));

      setCachedData(cacheKey, processedStandings);
      console.log(`✅ ${processedStandings.length} clasificaciones de constructores obtenidas desde Ergast`);
      return processedStandings;
    }
  } catch (error) {
    console.error('❌ Error al obtener clasificaciones de constructores desde Ergast:', error.message);
  }
  
  return [];
};

export const getDriverStandings = async () => {
  try {
    // Intentar obtener datos reales primero
    const realStandings = await getDriverStandingsFromErgast();
    if (realStandings.length > 0) {
      return realStandings;
    }
    
    // Fallback a datos base de OpenF1 (sin puntos simulados)
    console.log('⚠️ Usando datos base de OpenF1 para clasificación de pilotos');
    return [];
  } catch (error) {
    console.error('❌ Error al obtener clasificación de pilotos:', error.message);
    return [];
  }
};

export const getConstructorStandings = async () => {
  try {
    // Intentar obtener datos reales primero
    const realStandings = await getConstructorStandingsFromErgast();
    if (realStandings.length > 0) {
      return realStandings;
    }
    
    // Fallback a datos base de OpenF1 (sin puntos simulados)
    console.log('⚠️ Usando datos base de OpenF1 para clasificación de constructores');
    return [];
  } catch (error) {
    console.error('❌ Error al obtener clasificación de constructores:', error.message);
    return [];
  }
};

export const getChampionshipStandings = async () => {
  const currentYear = getCurrentYear();
  const cacheKey = `championship_standings_${currentYear}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log(`🏆 Obteniendo clasificación del campeonato para ${currentYear}...`);
    
    // Obtener datos de pilotos y constructores
    const [driverStandings, constructorStandings] = await Promise.all([
      getDriverStandingsFromErgast(),
      getConstructorStandingsFromErgast()
    ]);

    if (driverStandings && constructorStandings) {
      // Agrupar pilotos por constructor
      const constructorsWithDrivers = constructorStandings.map(constructor => {
        const constructorDrivers = driverStandings.filter(driver => 
          driver.constructor.constructorId === constructor.constructor.constructorId
        );

        return {
          team_name: constructor.constructor.name,
          team_colour: '#e10600', // Color por defecto
          points: constructor.points,
          position: constructor.position,
          wins: constructor.wins,
          drivers: constructorDrivers.map(driver => ({
            driver_number: driver.driver.permanentNumber || '0',
            full_name: `${driver.driver.givenName} ${driver.driver.familyName}`,
            name_acronym: driver.driver.code,
            points: driver.points,
            position: driver.position,
            wins: driver.wins
          }))
        };
      });

      const result = {
        constructors: constructorsWithDrivers,
        drivers: driverStandings.map(driver => ({
          driver_number: driver.driver.permanentNumber || '0',
          full_name: `${driver.driver.givenName} ${driver.driver.familyName}`,
          name_acronym: driver.driver.code,
          points: driver.points,
          position: driver.position,
          wins: driver.wins,
          team_name: driver.constructor.name
        }))
      };

      setCachedData(cacheKey, result);
      console.log(`✅ Clasificación del campeonato obtenida: ${constructorsWithDrivers.length} constructores`);
      return result;
    }
  } catch (error) {
    console.error('❌ Error al obtener clasificación del campeonato:', error.message);
  }

  // Fallback: devolver estructura vacía
  console.log('⚠️ Usando datos base para clasificación del campeonato');
  return {
    constructors: [],
    drivers: []
  };
};