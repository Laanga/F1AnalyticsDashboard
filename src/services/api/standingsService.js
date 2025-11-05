import axios from 'axios';
import { API_CONFIG, getCurrentYear } from '../config/apiConfig.js';
import { getCachedData, setCachedData, clearCache } from '../utils/cache.js';
import { getSelectedYear } from '../../hooks/useSelectedYear.js';
import { getTeamColor } from '../../utils/formatUtils.js';

/**
 * Servicio para operaciones relacionadas con clasificaciones y standings
 */

export const getDriverStandingsFromErgast = async (options = {}) => {
  const { signal } = options;
  const selectedYear = getSelectedYear();
  const cacheKey = `driver_standings_ergast_${selectedYear}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_CONFIG.JOLPICA.BASE_URL}/${selectedYear}/driverstandings.json`, { signal });
    
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
      return processedStandings;
    }
  } catch (error) {
    // Ignorar errores de cancelación
    if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
      return [];
    }
    console.error('❌ Error al obtener clasificaciones desde Ergast:', error.message);
  }
  
  return [];
};

export const getConstructorStandingsFromErgast = async (options = {}) => {
  const { signal } = options;
  const selectedYear = getSelectedYear();
  const cacheKey = `constructor_standings_ergast_${selectedYear}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_CONFIG.JOLPICA.BASE_URL}/${selectedYear}/constructorstandings.json`, { signal });
    
    if (response.data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings) {
      const standings = response.data.MRData.StandingsTable.StandingsLists[0].ConstructorStandings;
      
      const processedStandings = standings.map(standing => {
        const constructorData = {
          position: parseInt(standing.position),
          points: parseFloat(standing.points),
          wins: parseInt(standing.wins),
          constructor: {
            constructorId: standing.Constructor.constructorId,
            name: standing.Constructor.name,
            nationality: standing.Constructor.nationality
          }
        };

        return constructorData;
      });

      setCachedData(cacheKey, processedStandings);
      return processedStandings;
    }
  } catch (error) {
    // Ignorar errores de cancelación
    if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
      return [];
    }
    console.error('❌ Error al obtener clasificaciones de constructores desde Ergast:', error.message);
  }
  
  return [];
};

export const getDriverStandings = async (options = {}) => {
  const { signal } = options;
  try {
    // Intentar obtener datos reales primero
    const realStandings = await getDriverStandingsFromErgast({ signal });
    if (realStandings.length > 0) {
      return realStandings;
    }
    
    // Fallback a datos base de OpenF1 (sin puntos simulados)
    return [];
  } catch (error) {
    console.error('❌ Error al obtener clasificación de pilotos:', error.message);
    return [];
  }
};

export const getConstructorStandings = async (options = {}) => {
  const { signal } = options;
  try {
    // Intentar obtener datos reales primero
    const realStandings = await getConstructorStandingsFromErgast({ signal });
    if (realStandings.length > 0) {
      return realStandings;
    }
    
    // Fallback a datos base de OpenF1 (sin puntos simulados)
    return [];
  } catch (error) {
    console.error('❌ Error al obtener clasificación de constructores:', error.message);
    return [];
  }
};

export const getChampionshipStandings = async (options = {}) => {
  const { signal } = options;
  try {
    const selectedYear = getSelectedYear();
    const cacheKey = `championship_standings_${selectedYear}`;
    
    // Limpiar cache para forzar actualización
    clearCache();
    
    // Verificar cache primero
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return applyTeamCorrections(cachedData);
    }
    
    // Obtener datos de pilotos y constructores
    const [driverStandings, constructorStandings] = await Promise.all([
      getDriverStandingsFromErgast({ signal }),
      getConstructorStandingsFromErgast({ signal })
    ]);



    if (driverStandings && constructorStandings) {
      // Agrupar pilotos por constructor
      const constructorsWithDrivers = constructorStandings.map(constructor => {
        const constructorDrivers = driverStandings.filter(driver => 
          driver.constructor.constructorId === constructor.constructor.constructorId
        );

        return {
          team_name: constructor.constructor.name,
          team_colour: getTeamColor(constructor.constructor.name), // Color específico del equipo
          points: constructor.points,
          position: constructor.position,
          wins: constructor.wins,
          drivers: constructorDrivers.map(driver => ({
            driver_number: driver.driver.permanentNumber || '0',
            full_name: `${driver.driver.givenName} ${driver.driver.familyName}`,
            name_acronym: driver.driver.code,
            points: driver.points,
            position: driver.position,
            wins: driver.wins,
            team_name: constructor.constructor.name,
            team_colour: getTeamColor(constructor.constructor.name) // Agregar color del equipo a los pilotos
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
          team_name: driver.constructor.name,
          team_colour: getTeamColor(driver.constructor.name) // Agregar color del equipo
        }))
      };

      // Aplicar correcciones manuales
      const correctedResult = applyTeamCorrections(result);
      
      setCachedData(cacheKey, correctedResult);
      return correctedResult;
    }
  } catch (error) {
    console.error('❌ Error al obtener clasificación del campeonato:', error.message);
  }

  // Fallback: devolver estructura vacía
  return {
    constructors: [],
    drivers: []
  };
};

/**
 * Aplica correcciones manuales a las asignaciones de equipos para 2025
 * Cambios mid-season:
 * - Tsunoda: Promovido a Red Bull Racing desde el GP de Japón (carrera 3)
 * - Lawson: Degradado a Racing Bulls desde el GP de Japón (carrera 3)
 * @param {Object} data - Datos de standings
 * @returns {Object} Datos corregidos
 */
const applyTeamCorrections = (data) => {
  
  // Primero, corregir los drivers individuales
  data.drivers = data.drivers.map(driver => {
    const driverKey = driver.name_acronym?.toLowerCase();
    const fullNameKey = driver.full_name?.toLowerCase();
    
    // Corrección específica para Tsunoda - DEBE IR A RED BULL RACING (promovido en 2025)
    if (driverKey === 'tsu' || (fullNameKey && fullNameKey.includes('tsunoda'))) {
      return {
        ...driver,
        team_name: 'Red Bull',
        team_colour: getTeamColor('Red Bull')
      };
    }
    
    // Corrección específica para Lawson - DEBE IR A RACING BULLS (degradado en 2025)
    if (driverKey === 'law' || (fullNameKey && fullNameKey.includes('lawson'))) {
      return {
        ...driver,
        team_name: 'RB F1 Team',
        team_colour: getTeamColor('RB F1 Team')
      };
    }
    
    // Para todos los demás pilotos, mantener sus datos originales
    return driver;
  });

  // Ahora reorganizar los constructores con los pilotos corregidos
  data.constructors = data.constructors.map(constructor => {
    let teamDrivers = [];
    
    // Identificar el equipo y asignar los pilotos correctos
    const teamName = constructor.team_name.toLowerCase();
    
    if (teamName.includes('red bull') && !teamName.includes('rb') && !teamName.includes('racing')) {
      // Red Bull Racing - Debe tener Verstappen y Tsunoda
      teamDrivers = data.drivers.filter(d => {
        const dKey = d.name_acronym?.toLowerCase();
        return dKey === 'ver' || dKey === 'tsu';
      });
    } else if (teamName.includes('rb') || teamName.includes('racing bulls')) {
      // Racing Bulls - Debe tener Lawson y Hadjar
      teamDrivers = data.drivers.filter(d => {
        const dKey = d.name_acronym?.toLowerCase();
        return dKey === 'law' || dKey === 'had';
      });
    } else {
      // Para otros equipos, mantener sus pilotos originales
      teamDrivers = constructor.drivers;
    }

    return {
      ...constructor,
      drivers: teamDrivers
    };
  });

  return data;
};