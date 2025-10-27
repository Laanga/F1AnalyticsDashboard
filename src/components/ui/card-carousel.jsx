import React from "react"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/effect-coverflow"
import "swiper/css/pagination"
import "swiper/css/navigation"
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules"

import { getTeamColor, getTeamLogo } from "@/utils/formatUtils"

export const CardCarousel = ({
  images,
  autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {
  const css = `
  .swiper {
    width: 100%;
    padding-bottom: 50px;
  }
  
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
    /* height: 300px; */
    /* margin: 20px; */
  }
  
  .swiper-slide img {
    display: block;
    width: 100%;
  }
  
  
  .swiper-3d .swiper-slide-shadow-left {
    background-image: none;
  }
  .swiper-3d .swiper-slide-shadow-right{
    background: none;
  }
  `
  return (
    <section className="w-full">
      <style>{css}</style>
      <div className="w-full">
              <Swiper
                spaceBetween={50}
                autoplay={{
                  delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }}
                pagination={showPagination}
                navigation={
                  showNavigation
                    ? {
                        nextEl: ".swiper-button-next",
                        prevEl: ".swiper-button-prev",
                      }
                    : undefined
                }
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}>
                {images.map((image, index) => {
                  const teamColor = image.teamName ? getTeamColor(image.teamName) : '#e10600';
                  const teamLogo = image.teamName ? getTeamLogo(image.teamName) : null;
                  
                  return (
                    <SwiperSlide key={index}>
                      <div 
                        className="size-full rounded-3xl relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${teamColor}20 0%, ${teamColor}10 50%, transparent 100%)`,
                          boxShadow: `0 4px 20px ${teamColor}30`
                        }}
                      >
                        {/* Team logo as subtle background */}
                        {teamLogo && (
                          <div 
                            className="absolute inset-0 opacity-15 bg-no-repeat bg-contain"
                            style={{
                              backgroundImage: `url(${teamLogo})`,
                              backgroundSize: '120%',
                              backgroundPosition: 'center'
                            }}
                          />
                        )}
                        
                        {/* Gradient overlay for better image visibility */}
                        <div 
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: `linear-gradient(45deg, ${teamColor}15 0%, transparent 30%, transparent 70%, ${teamColor}15 100%)`
                          }}
                        />
                        
                        <img
                          src={image.src}
                          width={500}
                          height={500}
                          className="size-full rounded-xl relative z-10"
                          alt={image.alt} 
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
                {images.map((image, index) => {
                  const teamColor = image.teamName ? getTeamColor(image.teamName) : '#e10600';
                  const teamLogo = image.teamName ? getTeamLogo(image.teamName) : null;
                  
                  return (
                    <SwiperSlide key={`duplicate-${index}`}>
                      <div 
                        className="size-full rounded-3xl relative overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, ${teamColor}20 0%, ${teamColor}10 50%, transparent 100%)`,
                          boxShadow: `0 4px 20px ${teamColor}30`
                        }}
                      >
                        {/* Team logo as subtle background */}
                        {teamLogo && (
                          <div 
                            className="absolute inset-0 opacity-10 bg-center bg-no-repeat bg-contain"
                            style={{
                              backgroundImage: `url(${teamLogo})`,
                              backgroundSize: '60%',
                              backgroundPosition: 'center'
                            }}
                          />
                        )}
                        
                        {/* Gradient overlay for better image visibility */}
                        <div 
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: `linear-gradient(45deg, ${teamColor}15 0%, transparent 30%, transparent 70%, ${teamColor}15 100%)`
                          }}
                        />
                        
                        <img
                          src={image.src}
                          width={200}
                          height={200}
                          className="size-full rounded-xl relative z-10"
                          alt={image.alt} 
                        />
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
      </div>
    </section>
  );
}
