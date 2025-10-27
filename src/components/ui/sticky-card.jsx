"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import ReactLenis from "lenis/react";
import React, { useRef } from "react";
import { getTeamColor, getTeamLogo } from "@/utils/formatUtils";

const StickyCard = ({ 
  i, 
  pilot, 
  progress, 
  range, 
  targetScale 
}) => {
  const container = useRef(null);
  // Remove scaling effect - cards stay full size
  const scale = 1;
  
  const teamColor = getTeamColor(pilot.teamName);
  const teamLogo = getTeamLogo(pilot.teamName);

  return (
    <div 
      ref={container} 
      className="sticky top-1/2 -translate-y-1/2 flex items-center justify-center"
    >
      <motion.div 
        style={{ 
          scale, 
          top: `calc(-5vh + ${i * 15 + 50}px)`,
        }} 
        className="relative flex h-[450px] w-[650px] origin-top flex-col overflow-hidden rounded-3xl shadow-2xl"
      >
        {/* Team color solid background */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${teamColor}80 0%, ${teamColor}90 50%, ${teamColor} 100%)`
          }}
        />
        
        {/* Team logo as background */}
        {teamLogo && (
          <div 
            className="absolute inset-0 opacity-40 bg-no-repeat bg-contain"
            style={{
              backgroundImage: `url(${teamLogo})`,
              backgroundSize: '120%',
              backgroundPosition: '80% center'
            }}
          />
        )}
        
        {/* Pilot image */}
        <div className="relative z-10 h-full w-full">
          <img 
            src={pilot.src} 
            alt={pilot.name} 
            className="h-full w-full object-cover object-center"
          />
          
          {/* Subtle gradient overlay only at bottom for text visibility */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Pilot info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-end justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-1">
                  {pilot.name}
                </h3>
                <p 
                  className="text-lg font-semibold opacity-90"
                  style={{ color: teamColor }}
                >
                  {pilot.teamName}
                </p>
                {pilot.number && (
                  <p className="text-white/90 text-xl font-bold mt-2">
                    #{pilot.number}
                  </p>
                )}
              </div>
              
              {/* Team logo small */}
              {teamLogo && (
                <div className="w-16 h-16 opacity-80">
                  <img 
                    src={teamLogo} 
                    alt={`${pilot.teamName} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative border with team color */}
        <div 
          className="absolute inset-0 rounded-3xl border-2 opacity-30"
          style={{ borderColor: teamColor }}
        />
      </motion.div>
    </div>
  );
};

const StickyCardStack = ({ pilots }) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  return (
    <ReactLenis root>
      <main 
        ref={container} 
        className="relative flex w-full flex-col items-center justify-center pb-[200vh] pt-[20vh]"
      >
        <div className="absolute left-1/2 top-[10%] grid -translate-x-1/2 content-start justify-items-center gap-6 text-center">
          <span className="relative max-w-[20ch] text-sm uppercase leading-tight opacity-60 text-white after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white/40 after:to-transparent after:content-['']">
            Desplázate para ver todos los pilotos
          </span>
        </div>
        
        {pilots.map((pilot, i) => {
          const targetScale = Math.max(
            0.85,
            1 - (pilots.length - i - 1) * 0.03,
          );
          // Distribute cards evenly across the scroll range with less overlap
          const startRange = i / pilots.length * 0.9; // Start later for less overlap
          const endRange = Math.min(1, startRange + 0.25); // Reduced overlap for better visibility
          
          return (
            <StickyCard 
              key={`pilot_${i}`}
              i={i}
              pilot={pilot}
              progress={scrollYProgress}
              range={[startRange, endRange]}
              targetScale={targetScale}
            />
          );
        })}
      </main>
    </ReactLenis>
  );
};

export { StickyCardStack, StickyCard };