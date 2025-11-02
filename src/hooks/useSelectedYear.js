import { getCurrentF1Season } from '../services/config/apiConfig';

/**
 * Hook simplificado que siempre retorna la temporada actual
 * Mantiene compatibilidad con código existente
 */
export const getSelectedYear = () => {
  return getCurrentF1Season();
};

export default getSelectedYear;
