const countryCodeMapping = {
  'GBR': 'GB',
  'ESP': 'ES',
  'GER': 'DE',
  'FRA': 'FR',
  'ITA': 'IT',
  'NED': 'NL',
  'BEL': 'BE',
  'AUT': 'AT',
  'SUI': 'CH',
  'FIN': 'FI',
  'SWE': 'SE',
  'NOR': 'NO',
  'DEN': 'DK',
  'POL': 'PL',
  'RUS': 'RU',
  'HUN': 'HU',
  'CZE': 'CZ',
  'SVK': 'SK',
  'SVN': 'SI',
  'CRO': 'HR',
  'SRB': 'RS',
  'BUL': 'BG',
  'ROU': 'RO',
  'GRE': 'GR',
  'TUR': 'TR',
  'POR': 'PT',
  'IRL': 'IE',
  'SCO': 'GB',
  'WAL': 'GB',
  'ENG': 'GB',
  'MON': 'MC',
  'USA': 'US',
  'CAN': 'CA',
  'MEX': 'MX',
  'BRA': 'BR',
  'ARG': 'AR',
  'COL': 'CO',
  'CHI': 'CL',
  'PER': 'PE',
  'VEN': 'VE',
  'AUS': 'AU',
  'NZL': 'NZ',
  'JPN': 'JP',
  'CHN': 'CN',
  'KOR': 'KR',
  'THA': 'TH',
  'IND': 'IN',
  'SGP': 'SG',
  'MYS': 'MY',
  'IDN': 'ID',
  'ZAF': 'ZA',
  'EGY': 'EG',
  'MAR': 'MA',
  'ALG': 'DZ',
  'TUN': 'TN',
  'UAE': 'AE',
  'SAU': 'SA',
  'QAT': 'QA',
  'KUW': 'KW',
  'BHR': 'BH',
  'OMN': 'OM',
  'JOR': 'JO',
  'LBN': 'LB',
  'SYR': 'SY',
  'IRQ': 'IQ',
  'IRN': 'IR',
  'ISR': 'IL'
};

// Mapeo de nacionalidades en inglés a códigos ISO
const nationalityToCountryCode = {
  'British': 'GB',
  'Spanish': 'ES',
  'German': 'DE',
  'French': 'FR',
  'Italian': 'IT',
  'Dutch': 'NL',
  'Belgian': 'BE',
  'Austrian': 'AT',
  'Swiss': 'CH',
  'Finnish': 'FI',
  'Swedish': 'SE',
  'Norwegian': 'NO',
  'Danish': 'DK',
  'Polish': 'PL',
  'Russian': 'RU',
  'Hungarian': 'HU',
  'Czech': 'CZ',
  'Slovak': 'SK',
  'Slovenian': 'SI',
  'Croatian': 'HR',
  'Serbian': 'RS',
  'Bulgarian': 'BG',
  'Romanian': 'RO',
  'Greek': 'GR',
  'Turkish': 'TR',
  'Portuguese': 'PT',
  'Irish': 'IE',
  'Scottish': 'GB',
  'Welsh': 'GB',
  'English': 'GB',
  'Monégasque': 'MC',
  'Monegasque': 'MC',
  'American': 'US',
  'Canadian': 'CA',
  'Mexican': 'MX',
  'Brazilian': 'BR',
  'Argentinian': 'AR',
  'Argentine': 'AR',
  'Colombian': 'CO',
  'Chilean': 'CL',
  'Peruvian': 'PE',
  'Venezuelan': 'VE',
  'Australian': 'AU',
  'New Zealander': 'NZ',
  'Japanese': 'JP',
  'Chinese': 'CN',
  'South Korean': 'KR',
  'Thai': 'TH',
  'Indian': 'IN',
  'Singaporean': 'SG',
  'Malaysian': 'MY',
  'Indonesian': 'ID',
  'South African': 'ZA',
  'Egyptian': 'EG',
  'Moroccan': 'MA',
  'Algerian': 'DZ',
  'Tunisian': 'TN',
  'Emirati': 'AE',
  'Saudi': 'SA',
  'Qatari': 'QA',
  'Kuwaiti': 'KW',
  'Bahraini': 'BH',
  'Omani': 'OM',
  'Jordanian': 'JO',
  'Lebanese': 'LB',
  'Syrian': 'SY',
  'Iraqi': 'IQ',
  'Iranian': 'IR',
  'Israeli': 'IL',
};

export const getCountryCode = (driver) => {
  if (driver.nationality && nationalityToCountryCode[driver.nationality]) {
    return nationalityToCountryCode[driver.nationality];
  }
  
  if (driver.country_code) {
    return countryCodeMapping[driver.country_code] || driver.country_code;
  }
  
  return null;
};

export const getFlagUrl = (countryCode) => {
  if (!countryCode) return null;
  return `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;
};

export const getDriverFlag = (driver) => {
  const countryCode = getCountryCode(driver);
  return countryCode ? getFlagUrl(countryCode) : null;
};

export const FlagImage = ({ driver, className = '', alt = 'Bandera' }) => {
  const flagUrl = getDriverFlag(driver);
  const countryCode = getCountryCode(driver);
  
  if (!flagUrl) {
    return (
      <div className={`bg-gray-500 rounded-sm flex items-center justify-center ${className}`}>
        <span className="text-xs text-white">🏁</span>
      </div>
    );
  }
  
  return (
    <img
      src={flagUrl}
      alt={alt}
      className={`rounded-sm object-cover ${className}`}
      onError={(e) => {
        e.target.style.display = 'none';
        const fallback = e.target.nextElementSibling;
        if (fallback) {
          fallback.style.display = 'flex';
        }
      }}
      style={{ display: 'block' }}
    />
  );
};