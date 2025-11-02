import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, Shield, Flag, BarChart3 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const Navbar = () => {
  const location = useLocation();
  const navRef = useRef(null);
  const logoRef = useRef(null);
  const itemsRef = useRef([]);
  const speedLinesRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Configuración de los enlaces de navegación
  const navItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/pilotos', label: 'Pilotos', icon: Users },
    { path: '/equipos', label: 'Equipos', icon: Shield },
    { path: '/carreras', label: 'Carreras', icon: Flag },
    { path: '/estadisticas', label: 'Estadísticas', icon: BarChart3 },
  ];

  // Animación inicial del navbar
  useEffect(() => {
    if (navRef.current && logoRef.current) {
      const tl = gsap.timeline();
      
      // Animación de entrada del navbar completo
      tl.fromTo(
        navRef.current,
        {
          y: -100,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
        }
      );

      // Animación del logo con efecto de "arranque"
      tl.fromTo(
        logoRef.current,
        {
          scale: 0,
          rotation: -180,
          opacity: 0,
        },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'back.out(2)',
        },
        '-=0.5'
      );

      // Animación de los items del menú con stagger
      tl.fromTo(
        itemsRef.current,
        {
          y: -50,
          opacity: 0,
          scale: 0.5,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(1.7)',
        },
        '-=0.6'
      );

      // Animación continua del logo (pulso sutil)
      gsap.to(logoRef.current, {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }
  }, []);

  // Efecto de scroll para cambiar el navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto magnético en el logo
  const handleLogoMouseMove = (e) => {
    if (!logoRef.current) return;

    const rect = logoRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;

    gsap.to(logoRef.current, {
      x: deltaX,
      y: deltaY,
      rotation: deltaX * 0.5,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleLogoMouseLeave = () => {
    if (!logoRef.current) return;
    
    gsap.to(logoRef.current, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.5)',
    });
  };

  // Efecto de hover en items
  const handleItemHover = (index, isHovering) => {
    if (!itemsRef.current[index]) return;

    gsap.to(itemsRef.current[index], {
      scale: isHovering ? 1.05 : 1,
      y: isHovering ? -3 : 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  // Animación de líneas de velocidad
  useEffect(() => {
    if (speedLinesRef.current) {
      const speedLines = speedLinesRef.current.children;
      
      gsap.to(speedLines, {
        x: '200%',
        opacity: 0,
        duration: 1.5,
        stagger: 0.1,
        repeat: -1,
        ease: 'power2.in',
      });
    }
  }, []);

  return (
    <motion.nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    >
      {/* Líneas de velocidad de fondo */}
      <div 
        ref={speedLinesRef}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-f1-red/20 to-transparent"
            style={{
              top: `${20 + i * 15}%`,
              left: '-50%',
              width: '150px',
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Container con efecto glass mejorado - LIQUID GLASS */}
        <div className={`
          glass rounded-2xl px-6 py-3 flex items-center justify-between 
          border border-white/10 transition-all duration-300
          ${isScrolled ? 'shadow-2xl shadow-black/50' : 'shadow-xl shadow-black/30'}
        `}>
          {/* Logo / Título con efecto magnético */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group relative z-10"
            onMouseMove={handleLogoMouseMove}
            onMouseLeave={handleLogoMouseLeave}
          >
            <div ref={logoRef} className="relative">
              {/* Círculo de fondo animado */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 bg-f1-red/20 rounded-full blur-lg -z-10"
              />
              
              <div className="text-f1-red text-2xl font-black tracking-tighter">
                F1
              </div>
            </div>
            
            <div className="relative overflow-hidden">
              <span className="text-lg font-bold text-white/90 hidden sm:block group-hover:text-white transition-colors">
                Data
              </span>
              {/* Línea animada debajo */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-f1-red to-red-500 origin-left"
              />
            </div>

            {/* Partículas decorativas */}
            <div className="absolute -inset-2 pointer-events-none">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    opacity: [0, 0.6, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.7,
                    ease: 'easeOut',
                  }}
                  className="absolute w-1 h-1 bg-f1-red rounded-full"
                  style={{
                    left: `${20 + i * 30}%`,
                    top: '50%',
                  }}
                />
              ))}
            </div>
          </Link>

          {/* Enlaces de navegación centrados */}
          <div className="flex items-center space-x-1 sm:space-x-2 relative z-10">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                  onMouseEnter={() => handleItemHover(index, true)}
                  onMouseLeave={() => handleItemHover(index, false)}
                >
                  <motion.div
                    ref={(el) => (itemsRef.current[index] = el)}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl
                      transition-all duration-300 relative overflow-hidden
                      ${isActive 
                        ? 'bg-f1-red text-white shadow-lg shadow-f1-red/30' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    {/* Efecto de brillo al hacer hover */}
                    <motion.div
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />

                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                    <span className="hidden md:block text-sm font-medium relative z-10">
                      {item.label}
                    </span>

                    {/* Círculo de fondo animado para el activo */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-bg"
                        className="absolute inset-0 bg-f1-red rounded-xl -z-10"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.div>

                  {/* Indicador activo mejorado */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full overflow-hidden"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    >
                      <motion.div
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        className="h-full w-full bg-gradient-to-r from-transparent via-f1-red to-transparent"
                      />
                    </motion.div>
                  )}

                  {/* Partículas al hacer hover */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{
                          scale: [0, 1, 0],
                          opacity: [0, 0.8, 0],
                          y: [-10, -30],
                        }}
                        transition={{
                          duration: 0.8,
                          delay: i * 0.1,
                        }}
                        className="absolute w-1 h-1 bg-f1-red rounded-full"
                        style={{
                          left: `${25 + i * 25}%`,
                          top: '50%',
                        }}
                      />
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Espacio vacío para mantener el balance visual */}
          <div className="w-20 sm:w-24 relative z-10"></div>
        </div>

        {/* Línea decorativa inferior */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-f1-red/30 to-transparent"
        />
      </div>
    </motion.nav>
  );
};

export default Navbar;
