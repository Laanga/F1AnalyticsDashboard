import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentF1Season, getAvailableYears } from '../services/config/apiConfig';

const YearContext = createContext();

export const useYear = () => {
  const context = useContext(YearContext);
  if (!context) {
    throw new Error('useYear debe ser usado dentro de un YearProvider');
  }
  return context;
};

export const YearProvider = ({ children }) => {
  // Usar siempre el año actual por defecto
  const [selectedYear] = useState(getCurrentF1Season());
  const [availableYears, setAvailableYears] = useState([]);

  useEffect(() => {
    // Mantener la lógica de años disponibles para futuras funcionalidades
    setAvailableYears(getAvailableYears());
  }, []);

  const value = {
    selectedYear,
    availableYears,
    // Mantener isCurrentSeason para compatibilidad (siempre será true ahora)
    isCurrentSeason: true
  };

  return (
    <YearContext.Provider value={value}>
      {children}
    </YearContext.Provider>
  );
};