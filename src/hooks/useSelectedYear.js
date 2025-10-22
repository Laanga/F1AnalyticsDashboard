import { useState, useEffect } from 'react';
import { getCurrentF1Season } from '../services/config/apiConfig';

// Variable global para almacenar el año seleccionado
let selectedYear = getCurrentF1Season();
let listeners = [];

// Función para obtener el año seleccionado (para servicios)
export const getSelectedYear = () => selectedYear;

// Función para cambiar el año seleccionado (para el contexto)
export const setSelectedYear = (year) => {
  selectedYear = year;
  // Notificar a todos los listeners
  listeners.forEach(listener => listener(year));
};

// Función para suscribirse a cambios de año
export const subscribeToYearChanges = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(listener => listener !== callback);
  };
};

// Hook reactivo para componentes React
export const useSelectedYear = () => {
  const [currentYear, setCurrentYear] = useState(getSelectedYear());

  useEffect(() => {
    // Suscribirse a cambios de año
    const unsubscribe = subscribeToYearChanges((newYear) => {
      setCurrentYear(newYear);
    });

    return unsubscribe;
  }, []);

  return currentYear;
};