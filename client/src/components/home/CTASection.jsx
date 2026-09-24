import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * Above Footer Section: Frosted Glass Luxury Banner
 * Exact match to the reference architectural design
 */
export const CTASection = ({ section }) => {
  const title = section?.title || 'Luxury lighting without risk.';
  const subtitle = section?.subtitle || 'Design, support, and assurance — from consultation to installation.';
  const buttonText = section?.buttonText || 'Explore Our Products';
  const buttonLink = section?.buttonLink || '/catalog';

  return (
    <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-neutral-950 select-none">
      {/* Background Architectural Wall with Glowing Sconces & Climbing Ivy */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/above-footer-bg.jpg"
          alt="Architectural Lighting Wall"
          className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
          loading="lazy"
        />
        {/* Subtle gradient vignette to blend into dark footer */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/50 pointer-events-none" />
      </div>

      {/* Central Frosted Glassmorphism Card */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[28px] sm:rounded-[36px] bg-white/[0.10] backdrop-blur-[24px] -webkit-backdrop-blur-[24px] border border-white/25 p-8 sm:p-12 lg:p-16 shadow-[0_24px_60px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-10 transition-all duration-300">
          {/* Left Typography */}
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-sans font-light tracking-tight text-white leading-[1.18] drop-shadow-sm">
              {title.includes('without risk') ? (
                <>
                  Luxury lighting <br className="hidden sm:inline" />without risk.
                </>
              ) : (
                title
              )}
            </h2>
            <p className="text-sm sm:text-base text-neutral-200/90 font-light leading-relaxed">
              {subtitle}
            </p>
          </div>

          {/* Right Action Button */}
          <div className="shrink-0">
            <Link
              to={buttonLink}
              className="inline-flex items-center gap-3.5 pl-6 sm:pl-7 pr-2 sm:pr-2.5 py-2.5 sm:py-3 rounded-full bg-[#EAE8E4]/90 hover:bg-white text-neutral-900 text-xs sm:text-sm font-medium tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-0.5"
            >
              <span>{buttonText}</span>
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#DC2626] group-hover:bg-[#B91C1C] text-white flex items-center justify-center transition-colors duration-300 shadow">
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" />
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
