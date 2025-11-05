import { useState, useCallback, useMemo } from 'react';
import { getChampionshipStandings, getDrivers } from '../services/openf1Service';
import Loader from '../components/ui/Loader';
import { Shield, Users, TrendingUp, Trophy } from 'lucide-react';
import { useYear } from '../contexts/YearContext';
import { getTeamLogo, getTeamColor, getDriverPhoto } from '../utils/formatUtils';
import { getDriverNationality } from '../utils/nationalityUtils';
import { useAsyncDataParallel } from '../hooks/useAsyncData';

const Equipos = () => {
  const { selectedYear } = useYear();

  // Usar el hook personalizado para manejar las llamadas con cleanup
  const { data, loading, error } = useAsyncDataParallel([
    (signal) => getChampionshipStandings({ signal }),
    (signal) => getDrivers({ signal })
  ], []);

  const [standingsData, driversData = []] = data;

  // Procesar los datos solo cuando cambien
  const standings = useMemo(() => {
    if (!standingsData || !driversData) return null;

    const driversMap = new Map();
    const driversMapByName = new Map();
    
    driversData.forEach(driver => {
      if (driver.driver_number) {
        driversMap.set(String(driver.driver_number), driver);
      }
      if (driver.full_name) {
        driversMapByName.set(driver.full_name.toLowerCase(), driver);
      }
      if (driver.name_acronym) {
        driversMapByName.set(driver.name_acronym.toLowerCase(), driver);
      }
    });
    
    const equiposFormateados = standingsData.constructors.map(constructor => ({
      nombre: constructor.team_name,
      pilotos: constructor.drivers.map(driver => {
        let driverWithPhoto = driversMap.get(String(driver.driver_number));
        
        if (!driverWithPhoto) {
          driverWithPhoto = driversMapByName.get(driver.full_name?.toLowerCase()) ||
                           driversMapByName.get(driver.name_acronym?.toLowerCase());
        }
        
        return {
          driver_number: driver.driver_number,
          full_name: driver.full_name,
          name_acronym: driver.name_acronym,
          puntos: driver.points,
          team_name: constructor.team_name,
          team_colour: constructor.team_colour,
          country_code: driverWithPhoto?.country_code || '',
          headshot_url: driverWithPhoto?.headshot_url || null
        };
      }),
      color: constructor.team_colour || '#e10600',
      puntos: constructor.points
    }));
    
    return { constructors: equiposFormateados };
  }, [standingsData, driversData]);

  const equipos = useMemo(() => {
    return standings?.constructors || [];
  }, [standings]);

  if (loading) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 overflow-x-hidden">
        <Loader mensaje="Cargando equipos..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 overflow-x-hidden">
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-white/70">Error al cargar equipos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 overflow-x-hidden">
      <div className="mb-10 relative animate__animated animate__fadeInDown">
        <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-f1-red to-red-700 flex items-center justify-center shadow-lg hover:animate__animated hover:animate__pulse">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white animate__animated animate__fadeInLeft">
              Equipos
              <span className="text-f1-red font-bold ml-3 animate__animated animate__fadeInRight animate__delay-1s">
                Temporada {selectedYear}
              </span>
            </h1>
            <p className="text-white/60 text-lg flex items-center space-x-2 animate__animated animate__fadeInUp animate__delay-2s">
              <Users className="w-5 h-5" />
              <span>Análisis de constructores y sus pilotos</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate__animated animate__fadeIn animate__delay-2s">
        {equipos.map((equipo, index) => {
          const delayClass = index === 0 ? 'animate__delay-1s' : 
                           index === 1 ? 'animate__delay-2s' : 
                           index === 2 ? 'animate__delay-3s' : 
                           'animate__delay-4s';
          
          return (
          <div
            key={equipo.nombre}
            className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 border-2 transition-all duration-300 cursor-pointer hover:scale-105 hover:-translate-y-2 animate__animated animate__fadeInUp ${delayClass}`}
            style={{
              background: `linear-gradient(135deg, ${getTeamColor(equipo.nombre)}60 0%, ${getTeamColor(equipo.nombre)}40 50%, ${getTeamColor(equipo.nombre)}50 100%)`,
              borderColor: `${getTeamColor(equipo.nombre)}`,
              boxShadow: `0 8px 32px ${getTeamColor(equipo.nombre)}60, 0 0 0 2px ${getTeamColor(equipo.nombre)}80`
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <div className="flex items-center justify-center hover:animate__animated hover:animate__pulse">
                  <img
                    src={getTeamLogo(equipo.nombre)}
                    alt={`Logo ${equipo.nombre}`}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextElementSibling.style.display = 'block';
                    }}
                  />
                  <Shield 
                    className="w-10 h-10 sm:w-12 sm:h-12 text-white hidden" 
                    style={{ display: 'none' }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white hover:animate__animated hover:animate__pulse">
                    {equipo.nombre}
                  </h2>
                  <p className="text-white/60 text-xs sm:text-sm flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span>{equipo.pilotos.length} piloto{equipo.pilotos.length !== 1 ? 's' : ''}</span>
                  </p>
                </div>
              </div>

              <div className="text-right hover:animate__animated hover:animate__pulse">
                <div className="flex items-center space-x-1 justify-end mb-1">
                  <Trophy className="w-3 h-3 text-yellow-400" />
                  <p className="text-white/50 text-xs">Puntos</p>
                </div>
                <p 
                  className="text-2xl sm:text-3xl font-bold hover:scale-110 transition-transform duration-300"
                  style={{ color: getTeamColor(equipo.color) }}
                >
                  {equipo.puntos}
                </p>
              </div>
            </div>

            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 text-white/70 text-sm mb-2">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">Pilotos del equipo</span>
              </div>
              
              {equipo.pilotos
                .sort((a, b) => b.puntos - a.puntos)
                .map((piloto, idx) => {
                  const pilotoDelayClass = idx === 0 ? 'animate__delay-1s' : 
                                         idx === 1 ? 'animate__delay-2s' : 
                                         'animate__delay-3s';
                  
                  return (
                <div
                  key={piloto.driver_number || idx}
                  className={`glass-dark rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-3 cursor-pointer border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 hover:translate-x-1 animate__animated animate__fadeInLeft ${pilotoDelayClass}`}
                  style={{
                    background: `linear-gradient(90deg, ${getTeamColor(equipo.color)}15 0%, transparent 100%)`
                  }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="relative">
                      {(() => {
                        const driverPhoto = getDriverPhoto(piloto);
                        return driverPhoto ? (
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden shadow-lg hover:scale-110 hover:rotate-3 transition-transform duration-300">
                            <img 
                              src={driverPhoto} 
                              alt={piloto.full_name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.parentElement.style.display = 'none';
                                e.target.parentElement.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          </div>
                        ) : null;
                      })()}
                      <div 
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center hover:scale-110 hover:rotate-3 transition-transform duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${getTeamColor(equipo.color)} 0%, ${getTeamColor(equipo.color)}80 100%)`,
                          boxShadow: `0 4px 10px ${getTeamColor(equipo.color)}40`,
                          display: getDriverPhoto(piloto) ? 'none' : 'flex'
                        }}
                      >
                        <span className="text-white font-bold text-sm">
                          {piloto.driver_number}
                        </span>
                      </div>

                    </div>
                    <div>
                      <p className="text-white font-semibold hover:animate__animated hover:animate__pulse">
                        {piloto.full_name}
                      </p>
                      <p className="text-white/50 text-xs">
                        {piloto.name_acronym} • {getDriverNationality(piloto)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right hover:scale-105 transition-transform duration-300">
                    <p className="text-white/50 text-xs">Pts</p>
                    <p 
                      className="font-bold text-base sm:text-lg hover:scale-110 transition-transform duration-300"
                      style={{ color: getTeamColor(equipo.color) }}
                    >
                      {piloto.puntos}
                    </p>
                  </div>
                </div>
                  );
                })}
            </div>

            <div
              className={`h-3 rounded-full mt-6 relative overflow-hidden animate__animated animate__fadeInRight ${delayClass}`}
              style={{
                background: `linear-gradient(90deg, ${getTeamColor(equipo.nombre)}90 0%, ${getTeamColor(equipo.nombre)} 50%, transparent 100%)`,
                boxShadow: `0 4px 15px ${getTeamColor(equipo.nombre)}80`
              }}
            >
              <div
                className="absolute inset-0 rounded-full animate__animated animate__slideInLeft animate__infinite animate__slower"
                style={{
                  background: `linear-gradient(90deg, transparent 0%, ${getTeamColor(equipo.nombre)} 50%, transparent 100%)`
                }}
              />
            </div>
          </div>
          );
        })}
      </div>

      <div className="mt-10 glass-dark rounded-2xl p-4 sm:p-6 text-center animate__animated animate__fadeIn animate__delay-1s">
        <p className="text-white/60 text-sm">
          <strong className="text-white">Datos actualizados:</strong> Los puntos mostrados son calculados en tiempo real 
          basados en los resultados de las carreras de la temporada {selectedYear}.
        </p>
      </div>
     </div>
   );
};

export default Equipos;
