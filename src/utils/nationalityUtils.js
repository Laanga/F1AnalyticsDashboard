/**
 * Traduce nacionalidades del inglés al español
 * @param {string} nationality - Nacionalidad en inglés
 * @returns {string} - Nacionalidad en español
 */
export const translateNationality = (nationality) => {
  if (!nationality) return 'No disponible';
  
  const nationalityTranslations = {
    // Países más comunes en F1
    'British': 'Británico',
    'Spanish': 'Español',
    'German': 'Alemán',
    'French': 'Francés',
    'Italian': 'Italiano',
    'Dutch': 'Holandés',
    'Belgian': 'Belga',
    'Austrian': 'Austriaco',
    'Swiss': 'Suizo',
    'Finnish': 'Finlandés',
    'Swedish': 'Sueco',
    'Norwegian': 'Noruego',
    'Danish': 'Danés',
    'Polish': 'Polaco',
    'Russian': 'Ruso',
    'Hungarian': 'Húngaro',
    'Czech': 'Checo',
    'Slovak': 'Eslovaco',
    'Slovenian': 'Esloveno',
    'Croatian': 'Croata',
    'Serbian': 'Serbio',
    'Bulgarian': 'Búlgaro',
    'Romanian': 'Rumano',
    'Greek': 'Griego',
    'Turkish': 'Turco',
    'Portuguese': 'Portugués',
    'Irish': 'Irlandés',
    'Scottish': 'Escocés',
    'Welsh': 'Galés',
    'English': 'Inglés',
    'Monégasque': 'Monegasco',
    'Monaco': 'Monegasco',
    
    // Américas
    'American': 'Estadounidense',
    'Canadian': 'Canadiense',
    'Mexican': 'Mexicano',
    'Brazilian': 'Brasileño',
    'Argentine': 'Argentino',
    'Colombian': 'Colombiano',
    'Venezuelan': 'Venezolano',
    'Chilean': 'Chileno',
    'Peruvian': 'Peruano',
    'Uruguayan': 'Uruguayo',
    
    // Asia y Oceanía
    'Japanese': 'Japonés',
    'Chinese': 'Chino',
    'Korean': 'Coreano',
    'Thai': 'Tailandés',
    'Malaysian': 'Malayo',
    'Singaporean': 'Singapurense',
    'Indonesian': 'Indonesio',
    'Indian': 'Indio',
    'Australian': 'Australiano',
    'New Zealander': 'Neozelandés',
    
    // África y Medio Oriente
    'South African': 'Sudafricano',
    'Egyptian': 'Egipcio',
    'Moroccan': 'Marroquí',
    'Israeli': 'Israelí',
    'Lebanese': 'Libanés',
    'Emirati': 'Emiratí',
    'Saudi': 'Saudí',
    'Qatari': 'Catarí',
    'Kuwaiti': 'Kuwaití',
    'Bahraini': 'Bahreiní',
    
    // Otros casos especiales
    'Monegasque': 'Monegasco',
    'Liechtensteiner': 'Liechtensteiniano',
    'Luxembourgish': 'Luxemburgués',
    'Maltese': 'Maltés',
    'Cypriot': 'Chipriota',
    'Estonian': 'Estonio',
    'Latvian': 'Letón',
    'Lithuanian': 'Lituano',
    'Ukrainian': 'Ucraniano',
    'Belarusian': 'Bielorruso',
    'Moldovan': 'Moldavo',
    'Albanian': 'Albanés',
    'Macedonian': 'Macedonio',
    'Montenegrin': 'Montenegrino',
    'Bosnian': 'Bosnio'
  };
  
  // Buscar traducción exacta
  if (nationalityTranslations[nationality]) {
    return nationalityTranslations[nationality];
  }
  
  // Si no encuentra traducción, devolver el original
  return nationality;
};

/**
 * Obtiene la nacionalidad traducida de un piloto
 * @param {Object} driver - Objeto del piloto
 * @returns {string} - Nacionalidad traducida o información de respaldo
 */
export const getDriverNationality = (driver) => {
  if (driver.nationality) {
    return translateNationality(driver.nationality);
  }
  
  if (driver.country_code) {
    // Intentar traducir el country_code también, por si contiene una nacionalidad en inglés
    const translated = translateNationality(driver.country_code);
    // Si la traducción es diferente al original, significa que se tradujo exitosamente
    if (translated !== driver.country_code) {
      return translated;
    }
    // Si no se pudo traducir, devolver el código de país original
    return driver.country_code;
  }
  
  return 'No disponible';
};