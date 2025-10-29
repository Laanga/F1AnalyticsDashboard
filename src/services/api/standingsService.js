import axios from 'axios';
import { API_CONFIG, getCurrentYear } from '../config/apiConfig.js';
import { getCachedData, setCachedData, clearCache } from '../utils/cache.js';
import { getSelectedYear } from '../../hooks/useSelectedYear.js';
import { getTeamColor } from '../../utils/formatUtils.js';

/**
 * Servicio para operaciones relacionadas con clasificaciones y standings
 */

export const getDriverStandingsFromErgast = async () => {
  const selectedYear = getSelectedYear();
  const cacheKey = `driver_standings_ergast_${selectedYear}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_CONFIG.JOLPICA.BASE_URL}/${selectedYear}/driverstandings.json`);
    
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
    console.error('❌ Error al obtener clasificaciones desde Ergast:', error.message);
  }
  
  return [];
};

export const getConstructorStandingsFromErgast = async () => {
  const selectedYear = getSelectedYear();
  const cacheKey = `constructor_standings_ergast_${selectedYear}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_CONFIG.JOLPICA.BASE_URL}/${selectedYear}/constructorstandings.json`);
    
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
    return [];
  } catch (error) {
    console.error('❌ Error al obtener clasificación de constructores:', error.message);
    return [];
  }
};

export const getChampionshipStandings = async (year = null) => {
  try {
    // TEMPORAL: Forzar año 2024 para obtener datos
    const selectedYear = 2024;
    const cacheKey = `championship_standings_${selectedYear}`;
    
    // TEMPORAL: Limpiar cache para forzar actualización
    clearCache();
    
    // Verificar cache primero
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return applyTeamCorrections(cachedData);
    }
    
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
 * Aplica correcciones manuales a las asignaciones de equipos
 * @param {Object} data - Datos de standings
 * @returns {Object} Datos corregidos
 */
const applyTeamCorrections = (data) => {
  // Solo aplicar correcciones específicas para Tsunoda y Lawson
  data.drivers = data.drivers.map(driver => {
    const driverKey = driver.name_acronym?.toLowerCase();
    const fullNameKey = driver.full_name?.toLowerCase();
    
    // Corrección específica para Tsunoda - DEBE IR A RED BULL RACING
    if (driverKey === 'tsu' || (fullNameKey && fullNameKey.includes('tsunoda'))) {
      return {
        ...driver,
        team_name: 'Red Bull Racing',
        team_colour: getTeamColor('Red Bull Racing')
      };
    }
    
    // Corrección específica para Lawson - DEBE IR A RB F1 TEAM
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

  // Corregir constructors - actualizar los drivers con las correcciones aplicadas
  data.constructors = data.constructors.map(constructor => {
    const updatedDrivers = constructor.drivers.map(driver => {
      // Buscar el driver corregido en la lista de drivers por acrónimo
      const correctedDriver = data.drivers.find(d => 
        d.name_acronym === driver.name_acronym
      );
      return correctedDriver || driver;
    });

    return {
      ...constructor,
      drivers: updatedDrivers
    };
  });



  return data;
};