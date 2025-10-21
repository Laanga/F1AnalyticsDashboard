/**
 * Utilidades para manejo de fechas en la aplicación F1
 */

/**
 * Formatea una fecha para mostrar en español
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return 'Fecha no disponible';
  
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch (error) {
    console.error('Error al formatear fecha:', error);
    return 'Fecha inválida';
  }
};

/**
 * Formatea una fecha y hora para mostrar en español
 * @param {string|Date} fecha - Fecha a formatear
 * @returns {string} Fecha y hora formateada
 */
export const formatearFechaHora = (fecha) => {
  if (!fecha) return 'Fecha no disponible';
  
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    console.error('Error al formatear fecha y hora:', error);
    return 'Fecha inválida';
  }
};

/**
 * Determina si una fecha ya pasó
 * @param {string|Date} fecha - Fecha a verificar
 * @returns {boolean} True si la fecha ya pasó
 */
export const isCarreraCompletada = (fecha) => {
  if (!fecha) return false;
  
  try {
    const fechaCarrera = new Date(fecha);
    const ahora = new Date();
    return fechaCarrera < ahora;
  } catch (error) {
    console.error('Error al verificar fecha:', error);
    return false;
  }
};

/**
 * Obtiene el tiempo restante hasta una fecha
 * @param {string|Date} fecha - Fecha objetivo
 * @returns {string} Tiempo restante formateado
 */
export const getTiempoRestante = (fecha) => {
  if (!fecha) return 'Fecha no disponible';
  
  try {
    const fechaObjetivo = new Date(fecha);
    const ahora = new Date();
    const diferencia = fechaObjetivo - ahora;
    
    if (diferencia <= 0) {
      return 'Ya pasó';
    }
    
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (dias > 0) {
      return `${dias} día${dias !== 1 ? 's' : ''}`;
    } else if (horas > 0) {
      return `${horas} hora${horas !== 1 ? 's' : ''}`;
    } else {
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      return `${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    }
  } catch (error) {
    console.error('Error al calcular tiempo restante:', error);
    return 'Error en cálculo';
  }
};