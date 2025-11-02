import { API_CONFIG } from '../config/apiConfig.js';

/**
 * Sistema de caché persistente usando localStorage
 * Los datos se mantienen entre sesiones del navegador
 */

const CACHE_PREFIX = 'f1_cache_';
const CACHE_VERSION = 'v1_';

/**
 * Obtiene datos del caché
 * @param {string} key - Clave del caché
 * @param {boolean} ignoreExpiration - Si true, ignora la expiración
 * @returns {any|null} - Datos cacheados o null
 */
export const getCachedData = (key, ignoreExpiration = false) => {
  try {
    const cacheKey = CACHE_PREFIX + CACHE_VERSION + key;
    const cached = localStorage.getItem(cacheKey);
    
    if (!cached) {
      return null;
    }

    const { data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp >= API_CONFIG.OPENF1.CACHE_DURATION;
    
    if (!isExpired || ignoreExpiration) {
      return data;
    }
    
    // Si expiró, eliminar del localStorage
    localStorage.removeItem(cacheKey);
    return null;
  } catch (error) {
    console.warn('Error al leer del caché:', error);
    return null;
  }
};

/**
 * Guarda datos en el caché
 * @param {string} key - Clave del caché
 * @param {any} data - Datos a cachear
 */
export const setCachedData = (key, data) => {
  try {
    const cacheKey = CACHE_PREFIX + CACHE_VERSION + key;
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    
    localStorage.setItem(cacheKey, JSON.stringify(cacheData));
  } catch (error) {
    // Si localStorage está lleno o no disponible, solo advertir
    console.warn('Error al guardar en caché:', error);
    
    // Intentar limpiar caché antiguo si está lleno
    if (error.name === 'QuotaExceededError') {
      clearExpiredCache();
      // Intentar guardar nuevamente
      try {
        localStorage.setItem(cacheKey, JSON.stringify(cacheData));
      } catch (retryError) {
        console.warn('No se pudo guardar en caché después de limpiar:', retryError);
      }
    }
  }
};

/**
 * Limpia todo el caché de la aplicación
 */
export const clearCache = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX + CACHE_VERSION)) {
        localStorage.removeItem(key);
      }
    });
    console.log('✅ Caché limpiado completamente');
  } catch (error) {
    console.warn('Error al limpiar caché:', error);
  }
};

/**
 * Limpia solo las entradas expiradas del caché
 */
export const clearExpiredCache = () => {
  try {
    const keys = Object.keys(localStorage);
    let removedCount = 0;
    
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX + CACHE_VERSION)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const { timestamp } = JSON.parse(cached);
            const isExpired = Date.now() - timestamp >= API_CONFIG.OPENF1.CACHE_DURATION;
            
            if (isExpired) {
              localStorage.removeItem(key);
              removedCount++;
            }
          }
        } catch (e) {
          // Si hay error al parsear, eliminar la entrada corrupta
          localStorage.removeItem(key);
          removedCount++;
        }
      }
    });
    
    if (removedCount > 0) {
      console.log(`🧹 Limpiadas ${removedCount} entradas expiradas del caché`);
    }
  } catch (error) {
    console.warn('Error al limpiar caché expirado:', error);
  }
};

/**
 * Obtiene el tamaño actual del caché en KB
 */
export const getCacheSize = () => {
  try {
    let total = 0;
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX + CACHE_VERSION)) {
        const item = localStorage.getItem(key);
        if (item) {
          total += item.length * 2; // Cada carácter = 2 bytes en UTF-16
        }
      }
    });
    
    return (total / 1024).toFixed(2); // Retorna en KB
  } catch (error) {
    console.warn('Error al calcular tamaño del caché:', error);
    return 0;
  }
};

/**
 * Obtiene estadísticas del caché
 */
export const getCacheStats = () => {
  try {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(k => k.startsWith(CACHE_PREFIX + CACHE_VERSION));
    
    let expired = 0;
    let valid = 0;
    
    cacheKeys.forEach(key => {
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          const { timestamp } = JSON.parse(cached);
          const isExpired = Date.now() - timestamp >= API_CONFIG.OPENF1.CACHE_DURATION;
          
          if (isExpired) {
            expired++;
          } else {
            valid++;
          }
        }
      } catch (e) {
        expired++;
      }
    });
    
    return {
      total: cacheKeys.length,
      valid,
      expired,
      sizeKB: getCacheSize()
    };
  } catch (error) {
    console.warn('Error al obtener estadísticas del caché:', error);
    return { total: 0, valid: 0, expired: 0, sizeKB: 0 };
  }
};

// Utility para añadir delays entre peticiones
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Limpiar caché expirado al cargar la aplicación
if (typeof window !== 'undefined') {
  // Ejecutar limpieza de caché expirado al iniciar
  setTimeout(() => {
    clearExpiredCache();
  }, 1000);
}
