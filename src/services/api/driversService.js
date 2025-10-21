import axios from 'axios';
import { API_CONFIG, getCurrentYear } from '../config/apiConfig.js';
import { getCachedData, setCachedData, delay } from '../utils/cache.js';

/**
 * Servicio para operaciones relacionadas con pilotos
 */

export const getDrivers = async () => {
  const cacheKey = `drivers_${getCurrentYear()}`;
  
  // Verificar caché primero
  const cachedData = getCachedData(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  try {
    console.log('🏎️ Obteniendo pilotos...');
    const response = await axios.get(`${API_CONFIG.OPENF1.BASE_URL}/drivers`, {
      params: {
        session_key: 'latest'
      }
    });

    if (response.data && response.data.length > 0) {
      // Procesar y limpiar datos de pilotos
      const driversProcessed = response.data
        .filter((driver, index, self) => 
          index === self.findIndex(d => d.driver_number === driver.driver_number)
        )
        .map(driver => ({
          ...driver,
          full_name: driver.full_name || `${driver.first_name || ''} ${driver.last_name || ''}`.trim(),
          name_acronym: driver.name_acronym || driver.full_name?.split(' ').map(n => n[0]).join('') || '???',
          team_name: driver.team_name || 'Equipo no disponible',
          country_code: driver.country_code || 'XX',
          headshot_url: driver.headshot_url || null
        }))
        .sort((a, b) => (a.driver_number || 999) - (b.driver_number || 999));

      setCachedData(cacheKey, driversProcessed);
      console.log(`✅ ${driversProcessed.length} pilotos obtenidos y procesados`);
      return driversProcessed;
    } else {
      console.log('⚠️ No se encontraron pilotos, usando datos de respaldo');
      return await getDriversFallback();
    }
  } catch (error) {
    console.error('❌ Error al obtener pilotos:', error.message);
    return await getDriversFallback();
  }
};

const getDriversFallback = async () => {
  try {
    console.log('🔄 Intentando obtener pilotos sin filtro de sesión...');
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

      console.log(`✅ ${driversProcessed.length} pilotos obtenidos (fallback)`);
      return driversProcessed;
    }
  } catch (fallbackError) {
    console.error('❌ Error en fallback de pilotos:', fallbackError.message);
  }
  
  return [];
};

export const getDriverByNumber = async (driverNumber) => {
  try {
    console.log(`🔍 Buscando piloto #${driverNumber}...`);
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