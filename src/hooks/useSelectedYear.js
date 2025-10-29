import { useState, useEffect } from 'react';
import { getCurrentF1Season } from '../services/config/apiConfig';

let selectedYear = getCurrentF1Season();
let listeners = [];

export const getSelectedYear = () => selectedYear;

export const setSelectedYear = (year) => {
  selectedYear = year;
  listeners.forEach(listener => listener(year));
};

export const subscribeToYearChanges = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(listener => listener !== callback);
  };
};

export const useSelectedYear = () => {
  const [currentYear, setCurrentYear] = useState(getSelectedYear());

  useEffect(() => {
    const unsubscribe = subscribeToYearChanges((newYear) => {
      setCurrentYear(newYear);
    });

    return unsubscribe;
  }, []);

  return currentYear;
};