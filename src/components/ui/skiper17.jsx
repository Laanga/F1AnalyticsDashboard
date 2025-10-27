"use client";

import { useRef } from "react";
import ReactLenis from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { getTeamColor, getTeamLogo } from "@/utils/formatUtils";

// Sticky card stack inspired by Skiper UI (GSAP + ScrollTrigger)
// Converted to plain JS and adapted for this project structure

const StickyCard002 = ({
  cards = [],
  className = "",
  containerClassName = "",
  imageClassName = "",
  children,
}) => {
  const container = useRef(null);
  const cardRefs = useRef([]);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);

    const cardsEls = cardRefs.current;
    const total = cardsEls.length;
    if (!cardsEls[0]) return;

    // Initial states: first visible, others offscreen at bottom
    gsap.set(cardsEls[0], { y: "0%", scale: 1, rotation: 0 });
    for (let i = 1; i < total; i++) {
      if (!cardsEls[i]) continue;
      gsap.set(cardsEls[i], { y: "100%", scale: 1, rotation: 0 });
    }

    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: container.current?.querySelector(".sticky-cards"),
        start: "top top",
        end: `+=${window.innerHeight * Math.max(total - 1, 1)}`,
        pin: true,
        scrub: 0.5,
        pinSpacing: true,
      },
    });

    // Transition each image to the next
    for (let i = 0; i < total - 1; i++) {
      const current = cardsEls[i];
      const next = cardsEls[i + 1];
      if (!current || !next) continue;

      scrollTimeline.to(
        current,
        { scale: 0.8, rotation: 5, duration: 1, ease: "none" },
        i,
      );

      scrollTimeline.to(
        next,
        { y: "0%", duration: 1, ease: "none" },
        i,
      );
    }

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    if (container.current) resizeObserver.observe(container.current);

    return () => {
      resizeObserver.disconnect();
      scrollTimeline.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, { scope: container });

  return (
    <ReactLenis root>
      <div className={cn("relative h-screen w-full", className)} ref={container}>
        <div className="sticky-cards relative flex h-full w-full items-center justify-center overflow-hidden p-3 lg:p-8">
          <div
            className={cn(
              "relative h-[90%] w-full max-w-sm overflow-hidden rounded-lg sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl",
              containerClassName,
            )}
          >
            {cards.map((card, i) => {
              const teamColor = getTeamColor(card.teamName);
              const teamLogo = card.teamName ? getTeamLogo(card.teamName) : null;
              return (
                <div
                  key={card.id ?? i}
                  className="absolute inset-0 rounded-3xl overflow-hidden"
                  ref={(el) => { cardRefs.current[i] = el; }}
                >
                  {/* Fondo con color del equipo */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${teamColor}80 0%, ${teamColor}90 50%, ${teamColor} 100%)`
                    }}
                  />

                  {/* Logo del equipo como fondo */}
                  {teamLogo && (
                    <div
                      className="absolute inset-0 opacity-30 bg-no-repeat bg-contain"
                      style={{
                        backgroundImage: `url(${teamLogo})`,
                        backgroundSize: '120%',
                        backgroundPosition: '80% center'
                      }}
                    />
                  )}

                  {/* Imagen del piloto */}
                  <img
                    src={card.image}
                    alt={card.alt ?? ''}
                    className={cn(
                      "absolute inset-0 h-full w-full object-cover object-center z-10",
                      imageClassName,
                    )}
                  />

                  {/* Gradiente inferior para legibilidad */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent z-20" />

                  {/* Contenido de la tarjeta */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-30">
                    <div className="flex items-end justify-between">
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{card.name}</h3>
                        <p className="text-lg font-semibold opacity-90" style={{ color: teamColor }}>
                          {card.teamName}
                        </p>
                        {card.number && (
                          <p className="text-white/90 text-xl font-bold mt-2">#{card.number}</p>
                        )}
                      </div>
                      {teamLogo && (
                        <div className="w-16 h-16 opacity-80">
                          <img src={teamLogo} alt={`${card.teamName} logo`} className="w-full h-full object-contain" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Borde decorativo */}
                  <div
                    className="absolute inset-0 rounded-3xl border-2 opacity-30 z-40"
                    style={{ borderColor: teamColor }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        {/* Contenido que debe aparecer al finalizar el pin del stack */}
        {children && (
          <div className="px-3 lg:px-8 mt-6">
            {children}
          </div>
        )}
      </div>
    </ReactLenis>
  );
};

export { StickyCard002 };