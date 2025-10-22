import axios from 'axios';
import { API_CONFIG, getCurrentYear } from '../config/apiConfig.js';
import { getCachedData, setCachedData, delay, clearCache } from '../utils/cache.js';
import { getSelectedYear } from '../../hooks/useSelectedYear.js';

/**
 * Servicio para operaciones relacionadas con pilotos
 */

// Función para limpiar caché de pilotos específicamente
export const clearDriversCache = () => {
  // Limpiar toda la caché para asegurar datos frescos
  clearCache();
  console.log('🗑️ Caché de pilotos limpiada');
};

export const getDrivers = async (year = null) => {
  const selectedYear = year || getSelectedYear();
  const currentYear = getCurrentYear();
  const cacheKey = `drivers_${selectedYear}`;
  
  // Verificar caché primero
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    // Para el año actual, usar OpenF1 + Ergast para datos completos
    // Para años históricos, usar solo Ergast ya que OpenF1 no filtra por año
    if (selectedYear === currentYear) {
      // Año actual: combinar OpenF1 y Ergast
      const [openF1Response, ergastDrivers] = await Promise.all([
        axios.get(`${API_CONFIG.OPENF1.BASE_URL}/drivers`, {
          params: {
            session_key: 'latest'
          }
        }),
        getDriversFromErgast(selectedYear)
      ]);

      if (openF1Response.data && openF1Response.data.length > 0) {
        // Procesar y combinar datos de pilotos
        const driversProcessed = openF1Response.data
          .filter((driver, index, self) => 
            index === self.findIndex(d => d.driver_number === driver.driver_number)
          )
          .map(driver => {
            // Buscar datos de nacionalidad en Ergast
            const ergastDriver = ergastDrivers.find(ed => 
              ed.code === driver.name_acronym || 
              ed.permanentNumber === driver.driver_number ||
              ed.full_name.toLowerCase() === driver.full_name?.toLowerCase()
            );

            return {
              ...driver,
              full_name: driver.full_name || `${driver.first_name || ''} ${driver.last_name || ''}`.trim(),
              name_acronym: driver.name_acronym || driver.full_name?.split(' ').map(n => n[0]).join('') || '???',
              team_name: driver.team_name || 'Equipo no disponible',
              country_code: ergastDriver?.nationality || driver.country_code || 'Unknown',
              nationality: ergastDriver?.nationality || 'Unknown',
              headshot_url: driver.headshot_url || null
            };
          })
          .sort((a, b) => (a.driver_number || 999) - (b.driver_number || 999));

        setCachedData(cacheKey, driversProcessed);
        return driversProcessed;
      }
    }
    
    // Para años históricos o si OpenF1 falla, usar solo Ergast
    const ergastDrivers = await getDriversFromErgast(selectedYear);
    
    if (ergastDrivers && ergastDrivers.length > 0) {
      // Procesar datos de Ergast para formato consistente
      const driversProcessed = ergastDrivers.map((driver, index) => ({
        driver_number: driver.permanentNumber || index + 1,
        full_name: driver.full_name,
        first_name: driver.givenName,
        last_name: driver.familyName,
        name_acronym: driver.name_acronym,
        team_name: 'Equipo no disponible', // Ergast drivers endpoint no incluye equipo
        country_code: driver.nationality,
        nationality: driver.nationality,
        headshot_url: null // No disponible en Ergast
      })).sort((a, b) => (a.driver_number || 999) - (b.driver_number || 999));

      setCachedData(cacheKey, driversProcessed);
      return driversProcessed;
    }
    
    return await getDriversFallback(selectedYear);
  } catch (error) {
    console.error('❌ Error al obtener pilotos:', error.message);
    return await getDriversFallback(selectedYear);
  }
};

const getDriversFallback = async (selectedYear = null) => {
  const year = selectedYear || getSelectedYear();
  
  try {
    // Para años históricos, intentar solo con Ergast
    if (year !== getCurrentYear()) {
      const ergastDrivers = await getDriversFromErgast(year);
      if (ergastDrivers && ergastDrivers.length > 0) {
        return ergastDrivers.map((driver, index) => ({
          driver_number: driver.permanentNumber || index + 1,
          full_name: driver.full_name,
          first_name: driver.givenName,
          last_name: driver.familyName,
          name_acronym: driver.name_acronym,
          team_name: 'Equipo no disponible',
          country_code: driver.nationality,
          nationality: driver.nationality,
          headshot_url: null
        }));
      }
    }
    
    // Para año actual o si Ergast falla, usar OpenF1
    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/drivers`);
    
    if (response.data && response.data.length > 0) {
      const driversProcessed = response.data
        .filter((driver, index, self) => 
          index === self.findIndex(d => d.driver_number === driver.driver_number)
        )
        .slice(0, 20) // Limitar a 20 pilotos más recientes
        .map(driver => ({
          ...driver,
          full_name: driver.full_name || `${driver.first_name || ''} ${driver.last_name || ''}`.trim(),
          name_acronym: driver.name_acronym || '???',
          team_name: driver.team_name || 'Equipo no disponible',
          country_code: driver.country_code || 'XX',
          headshot_url: driver.headshot_url || null
        }));

      return driversProcessed;
    }
  } catch (fallbackError) {
    console.error('❌ Error en fallback de pilotos:', fallbackError.message);
  }
  
  return [];
};

export const getDriverByNumber = async (driverNumber) => {
  try {
    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/drivers`, {
      params: {
        driver_number: driverNumber,
        session_key: 'latest'
      }
    });

    return response.data?.[0] || null;
  } catch (error) {
    console.error(`❌ Error al obtener piloto #${driverNumber}:`, error.message);
    return null;
  }
};

export const getDriversFromErgast = async (year = null) => {
  const selectedYear = year || getSelectedYear();
  const cacheKey = `drivers_ergast_${selectedYear}`;
  
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    const response = await axios.get(`${API_CONFIG.JOLPICA.BASE_URL}/${selectedYear}/drivers.json`);
    
    if (response.data?.MRData?.DriverTable?.Drivers) {
      const drivers = response.data.MRData.DriverTable.Drivers;
      
      const processedDrivers = drivers.map(driver => ({
        driverId: driver.driverId,
        permanentNumber: driver.permanentNumber,
        code: driver.code,
        givenName: driver.givenName,
        familyName: driver.familyName,
        nationality: driver.nationality,
        full_name: `${driver.givenName} ${driver.familyName}`,
        name_acronym: driver.code || driver.familyName?.substring(0, 3).toUpperCase() || 'N/A',
        country_code: driver.nationality || 'Unknown'
      }));

      setCachedData(cacheKey, processedDrivers);
      return processedDrivers;
    }
  } catch (error) {
    console.error('❌ Error al obtener pilotos desde Ergast:', error.message);
  }
  
  return [];
};