import { motion } from 'framer-motion';

/**
 * Componente de fondo animado con efecto de partículas y gradientes
 * Crea una atmósfera "liquid glass" sutil
 */
const FondoAnimado = () => {
  // Generamos partículas decorativas
  const particulas = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 100 + 50,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradiente base */}
      <div className="absolute inset-0 bg-gradient-to-br from-f1-dark via-f1-gray to-f1-dark" />

      {/* Gradiente animado sutil */}
      <motion.div
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-f1-red/10 via-transparent to-f1-red/5"
      />

      {/* Partículas flotantes */}
      {particulas.map((particula) => (
        <motion.div
          key={particula.id}
          initial={{
            x: `${particula.x}vw`,
            y: `${particula.y}vh`,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            y: [`${particula.y}vh`, `${particula.y - 20}vh`, `${particula.y}vh`],
            scale: [0, 1, 0],
            opacity: [0, 0.15, 0],
          }}
          transition={{
            duration: particula.duration,
            repeat: Infinity,
            delay: particula.delay,
            ease: 'easeInOut',
          }}
          className="absolute rounded-full blur-3xl"
          style={{
            width: particula.size,
            height: particula.size,
            background: `radial-gradient(circle, rgba(225, 6, 0, 0.2) 0%, transparent 70%)`,
          }}
        />
      ))}

      {/* Efecto de grid sutil (opcional) */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />
    </div>
  );
};

export default FondoAnimado;

