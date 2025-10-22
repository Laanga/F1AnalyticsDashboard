/**
 * Servicio principal de OpenF1 - Punto de entrada centralizado
 * Este archivo actúa como un barrel export para todos los servicios especializados
 */

// Importaciones para el export default
import { getCurrentYear } from './config/apiConfig.js';
import { clearCache } from './utils/cache.js';
import { getDrivers, getDriverByNumber, getDriversFromErgast } from './api/driversService.js';
import { getSessions, getRaces, getLatestSession, getMeetings, getPositions, getLaps } from './api/sessionsService.js';
import { getDriverStandings, getConstructorStandings, getDriverStandingsFromErgast, getConstructorStandingsFromErgast, getChampionshipStandings } from './api/standingsService.js';
import { getStatistics, getSeasonProgress } from './api/statisticsService.js';

// Configuración y utilidades
export { getCurrentYear } from './config/apiConfig.js';
export { clearCache } from './utils/cache.js';

// Servicios de pilotos
export { 
  getDrivers, 
  getDriverByNumber,
  getDriversFromErgast 
} from './api/driversService.js';

// Servicios de sesiones y carreras
export { 
  getSessions, 
  getRaces, 
  getLatestSession, 
  getMeetings, 
  getPositions, 
  getLaps 
} from './api/sessionsService.js';

// Servicios de clasificaciones
export { 
  getDriverStandings, 
  getConstructorStandings, 
  getDriverStandingsFromErgast, 
  getConstructorStandingsFromErgast,
  getChampionshipStandings 
} from './api/standingsService.js';

// Servicios de estadísticas
export { 
  getStatistics, 
  getSeasonProgress 
} from './api/statisticsService.js';

// Mantener compatibilidad con el export default anterior
export default {
  // Configuración
  getCurrentYear,
  clearCache,
  
  // Pilotos
  getDrivers,
  getDriverByNumber,
  getDriversFromErgast,
  
  // Sesiones y carreras
  getSessions,
  getRaces,
  getLatestSession,
  getMeetings,
  getPositions,
  getLaps,
  
  // Clasificaciones
  getDriverStandings,
  getConstructorStandings,
  getDriverStandingsFromErgast,
  getConstructorStandingsFromErgast,
  getChampionshipStandings,
  
  // Estadísticas
  getStatistics,
  getSeasonProgress
};
