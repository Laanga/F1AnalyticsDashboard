import { API_CONFIG } from '../config/apiConfig.js';

/**
 * Sistema de caché simple para reducir peticiones a la API
 */
const cache = new Map();

export const getCachedData = (key, ignoreExpiration = false) => {
  const cached = cache.get(key);
  if (cached) {
    const isExpired = Date.now() - cached.timestamp >= API_CONFIG.OPENF1.CACHE_DURATION;
    
    if (!isExpired) {

      return cached.data;
    } else if (ignoreExpiration) {

      return cached.data;
    }
  }
  return null;
};

export const setCachedData = (key, data) => {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
};

export const clearCache = () => {
  cache.clear();
};

// Utility para añadir delays entre peticiones
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));