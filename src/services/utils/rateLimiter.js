import axios from 'axios';

/**
 * Utilidad para manejar rate limiting y peticiones con retry
 */

// Queue para controlar concurrencia
let requestQueue = [];
let isProcessingQueue = false;
const MAX_CONCURRENT_REQUESTS = 3; // Máximo 3 peticiones concurrentes
const BASE_DELAY = 1000; // 1 segundo base
const MAX_RETRIES = 3;

/**
 * Delay con backoff exponencial
 * @param {number} attempt - Número de intento (0-based)
 * @param {number} baseDelay - Delay base en ms
 * @returns {Promise} Promise que se resuelve después del delay
 */
export const exponentialBackoff = (attempt, baseDelay = BASE_DELAY) => {
  const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000; // Jitter aleatorio
  console.log(`⏳ Esperando ${Math.round(delay)}ms antes del reintento ${attempt + 1}...`);
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Procesa la queue de peticiones de forma secuencial
 */
const processQueue = async () => {
  if (isProcessingQueue || requestQueue.length === 0) {
    return;
  }

  isProcessingQueue = true;
  
  while (requestQueue.length > 0) {
    const batch = requestQueue.splice(0, MAX_CONCURRENT_REQUESTS);
    
    // Procesar batch en paralelo
    await Promise.all(batch.map(async (requestItem) => {
      try {
        const result = await requestItem.execute();
        requestItem.resolve(result);
      } catch (error) {
        requestItem.reject(error);
      }
    }));
    
    // Delay entre batches para evitar rate limiting
    if (requestQueue.length > 0) {
      await new Promise(resolve => setTimeout(resolve, 500)); // 500ms entre batches
    }
  }
  
  isProcessingQueue = false;
};

/**
 * Añade una petición a la queue
 * @param {Function} requestFunction - Función que ejecuta la petición
 * @returns {Promise} Promise que se resuelve con el resultado
 */
export const queueRequest = (requestFunction) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({
      execute: requestFunction,
      resolve,
      reject
    });
    
    // Iniciar procesamiento si no está en curso
    processQueue();
  });
};

/**
 * Ejecuta una petición HTTP con retry y backoff exponencial
 * @param {string} url - URL de la petición
 * @param {Object} config - Configuración de axios
 * @param {number} maxRetries - Número máximo de reintentos
 * @returns {Promise} Promise con la respuesta
 */
export const requestWithRetry = async (url, config = {}, maxRetries = MAX_RETRIES) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Si no es el primer intento, aplicar backoff
      if (attempt > 0) {
        await exponentialBackoff(attempt - 1);
      }
      
      console.log(`🔄 Intento ${attempt + 1}/${maxRetries + 1} para: ${url}`);
      
      const response = await axios.get(url, {
        timeout: 15000, // 15 segundos timeout
        ...config
      });
      
      console.log(`✅ Petición exitosa en intento ${attempt + 1}: ${url}`);
      return response;
      
    } catch (error) {
      lastError = error;
      
      // Si es error 429 (rate limit), siempre reintentar
      if (error.response?.status === 429) {
        console.warn(`⚠️ Rate limit alcanzado (429) en intento ${attempt + 1}. Reintentando...`);
        continue;
      }
      
      // Si es error de red o timeout, reintentar
      if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND' || !error.response) {
        console.warn(`⚠️ Error de red en intento ${attempt + 1}: ${error.message}. Reintentando...`);
        continue;
      }
      
      // Para otros errores HTTP, no reintentar
      if (error.response?.status >= 400 && error.response?.status < 500 && error.response?.status !== 429) {
        console.error(`❌ Error HTTP ${error.response.status}, no reintentando: ${url}`);
        throw error;
      }
      
      console.warn(`⚠️ Error en intento ${attempt + 1}: ${error.message}`);
    }
  }
  
  console.error(`❌ Todos los reintentos fallaron para: ${url}`);
  throw lastError;
};

/**
 * Wrapper para peticiones con queue y retry
 * @param {string} url - URL de la petición
 * @param {Object} config - Configuración de axios
 * @returns {Promise} Promise con la respuesta
 */
export const safeRequest = async (url, config = {}) => {
  return queueRequest(() => requestWithRetry(url, config));
};

/**
 * Delay simple entre peticiones
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promise que se resuelve después del delay
 */
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene el estado actual de la queue
 * @returns {Object} Estado de la queue
 */
export const getQueueStatus = () => {
  return {
    queueLength: requestQueue.length,
    isProcessing: isProcessingQueue,
    maxConcurrent: MAX_CONCURRENT_REQUESTS
  };
};