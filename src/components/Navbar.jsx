import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, Shield, Flag, BarChart3 } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  // Configuración de los enlaces de navegación
  const navItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/pilotos', label: 'Pilotos', icon: Users },
    { path: '/equipos', label: 'Equipos', icon: Shield },
    { path: '/carreras', label: 'Carreras', icon: Flag },
    { path: '/estadisticas', label: 'Estadísticas', icon: BarChart3 },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-3"
    >
      <div className="max-w-7xl mx-auto">
        {/* Container con efecto glass */}
        <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
          {/* Logo / Título */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="text-f1-red text-2xl font-bold"
            >
              F1
            </motion.div>
            <span className="text-lg font-semibold text-white/90 hidden sm:block group-hover:text-white transition-colors">
              Analytics
            </span>
          </Link>

          {/* Enlaces de navegación */}
          <div className="flex items-center space-x-1 sm:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative group"
                >
                  <motion.div
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl
                      transition-all duration-300
                      ${isActive 
                        ? 'bg-f1-red text-white shadow-lg shadow-f1-red/30' 
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden md:block text-sm font-medium">
                      {item.label}
                    </span>
                  </motion.div>

                  {/* Indicador activo */}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-f1-red rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Decoración - punto de estado */}
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="hidden lg:flex items-center space-x-2"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-lg shadow-green-500/50" />
            <span className="text-xs text-white/60">En vivo</span>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

