import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Sparkles, Sliders, Moon, Eye, EyeOff, Zap, ChevronUp, ChevronDown } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   Kelvin Presets for Architectural Color Temperature
───────────────────────────────────────────────────────────── */
export const KELVIN_PRESETS = [
  {
    id: '2200k',
    kelvin: '2200K',
    name: 'Candlelight Amber',
    subtext: 'Intimate Sunset Warmth',
    hex: '#ff9a3c',
    rgb: '255, 154, 60',
    glow: 'rgba(255, 154, 60, 0.28)',
    spotlightBeam: 'linear-gradient(180deg, rgba(255, 154, 60, 0.28) 0%, rgba(255, 154, 60, 0.08) 50%, transparent 100%)',
    badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
  },
  {
    id: '2700k',
    kelvin: '2700K',
    name: 'Warm Gold Luxury',
    subtext: 'Signature Showroom Ambience',
    hex: '#f59e0b',
    rgb: '245, 158, 11',
    glow: 'rgba(245, 158, 11, 0.26)',
    spotlightBeam: 'linear-gradient(180deg, rgba(245, 158, 11, 0.26) 0%, rgba(245, 158, 11, 0.07) 50%, transparent 100%)',
    badgeClass: 'text-amber-300 bg-amber-400/10 border-amber-400/30',
  },
  {
    id: '4000k',
    kelvin: '4000K',
    name: 'Neutral Architectural',
    subtext: 'High-Precision True CRI',
    hex: '#93c5fd',
    rgb: '147, 197, 253',
    glow: 'rgba(147, 197, 253, 0.22)',
    spotlightBeam: 'linear-gradient(180deg, rgba(147, 197, 253, 0.22) 0%, rgba(147, 197, 253, 0.06) 50%, transparent 100%)',
    badgeClass: 'text-sky-300 bg-sky-400/10 border-sky-400/30',
  },
  {
    id: '6000k',
    kelvin: '6000K',
    name: 'Daylight Gallery',
    subtext: 'Museum Dispersion',
    hex: '#e0f2fe',
    rgb: '224, 242, 254',
    glow: 'rgba(224, 242, 254, 0.20)',
    spotlightBeam: 'linear-gradient(180deg, rgba(224, 242, 254, 0.20) 0%, rgba(224, 242, 254, 0.05) 50%, transparent 100%)',
    badgeClass: 'text-neutral-100 bg-white/15 border-white/30',
  },
];

const AmbianceContext = createContext({
  activeKelvin: KELVIN_PRESETS[1],
  setActiveKelvin: () => {},
  luxIntensity: 1,
  setLuxIntensity: () => {},
  photonCursorEnabled: true,
  setPhotonCursorEnabled: () => {},
});

export const useAmbiance = () => useContext(AmbianceContext);

export const AmbientLightExperience = ({ children }) => {
  const [activeKelvin, setActiveKelvin] = useState(KELVIN_PRESETS[1]); // Default 2700K Warm Gold
  const [luxIntensity, setLuxIntensity] = useState(1); // 0.3 - 1.2
  const [photonCursorEnabled, setPhotonCursorEnabled] = useState(true);
  const [hudOpen, setHudOpen] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -200, y: -200 });

  const targetPosRef = useRef({ x: -200, y: -200 });
  const currentPosRef = useRef({ x: -200, y: -200 });
  const animFrameRef = useRef(null);

  // Sync activeKelvin to document root CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--kelvin-temp', activeKelvin.kelvin);
    root.style.setProperty('--kelvin-color', activeKelvin.hex);
    root.style.setProperty('--kelvin-rgb', activeKelvin.rgb);
    root.style.setProperty('--kelvin-glow', activeKelvin.glow);
    root.style.setProperty('--lux-intensity', luxIntensity.toString());
  }, [activeKelvin, luxIntensity]);

  // Smooth mouse photon tracking loop (Interpolated physics)
  useEffect(() => {
    const handlePointerMove = (e) => {
      targetPosRef.current = { x: e.clientX, y: e.clientY };
      const root = document.documentElement;
      root.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
      root.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const animateLoop = () => {
      // Smooth lerp: current + (target - current) * factor
      const ease = 0.12;
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * ease;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * ease;

      setCursorPos({
        x: currentPosRef.current.x,
        y: currentPosRef.current.y,
      });

      animFrameRef.current = requestAnimationFrame(animateLoop);
    };

    animFrameRef.current = requestAnimationFrame(animateLoop);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <AmbianceContext.Provider
      value={{
        activeKelvin,
        setActiveKelvin,
        luxIntensity,
        setLuxIntensity,
        photonCursorEnabled,
        setPhotonCursorEnabled,
      }}
    >
      <div className="relative">
        {/* ════════════════════════════════════════════════════════
            VOLUMETRIC MOUSE PHOTON TRACKER (Cursor Glow)
        ════════════════════════════════════════════════════════ */}
        {photonCursorEnabled && (
          <div
            className="fixed pointer-events-none z-30 transition-opacity duration-500 will-change-transform"
            style={{
              left: cursorPos.x,
              top: cursorPos.y,
              transform: 'translate(-50%, -50%)',
              width: `${Math.round(480 * luxIntensity)}px`,
              height: `${Math.round(480 * luxIntensity)}px`,
              opacity: cursorPos.x > 0 ? 0.35 * luxIntensity : 0,
              background: `radial-gradient(circle, ${activeKelvin.glow} 0%, rgba(${activeKelvin.rgb}, 0.06) 40%, transparent 70%)`,
              mixBlendMode: 'screen',
              filter: 'blur(32px)',
            }}
          />
        )}

        {/* ════════════════════════════════════════════════════════
            GLOBAL AMBIENT LIGHT FLOATING HUD (Architectural Switcher)
        ════════════════════════════════════════════════════════ */}
        <div className="fixed bottom-6 right-6 z-40 select-none">
          <AnimatePresence>
            {hudOpen && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.95 }}
                transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                className="mb-3 w-80 p-4 rounded-2xl bg-[#11141c]/95 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-white space-y-4"
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_currentColor] transition-colors"
                      style={{ color: activeKelvin.hex }}
                    />
                    <span className="text-xs font-serif-luxury font-bold uppercase tracking-luxury text-white">
                      Photometric Studio
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                    CRI Ra &gt; 98
                  </span>
                </div>

                {/* Kelvin Presets */}
                <div>
                  <label className="text-[10px] uppercase tracking-luxury text-neutral-400 font-semibold block mb-2">
                    Correlated Color Temp (CCT)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {KELVIN_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setActiveKelvin(preset)}
                        className={`p-2 rounded-xl text-left border transition-all flex flex-col justify-between ${
                          activeKelvin.id === preset.id
                            ? 'bg-white/10 border-white/30 shadow-lg'
                            : 'bg-black/30 border-white/5 hover:border-white/20 hover:bg-white/5 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-mono font-bold" style={{ color: preset.hex }}>
                            {preset.kelvin}
                          </span>
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: preset.hex, boxShadow: `0 0 8px ${preset.hex}` }}
                          />
                        </div>
                        <span className="text-[10px] text-neutral-300 mt-1 font-medium truncate">
                          {preset.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lux Dimmer Slider */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[10px] uppercase tracking-luxury text-neutral-400 font-semibold flex items-center gap-1.5">
                      <Sliders className="w-3 h-3 text-[#DC2626]" />
                      <span>Luminous Intensity</span>
                    </label>
                    <span className="text-[10px] font-mono font-bold text-red-400">
                      {Math.round(luxIntensity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.3"
                    max="1.2"
                    step="0.05"
                    value={luxIntensity}
                    onChange={(e) => setLuxIntensity(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#DC2626]"
                  />
                  <div className="flex justify-between text-[9px] text-neutral-500 font-mono mt-1">
                    <span>30% Subdued</span>
                    <span>100% Full Spec</span>
                    <span>120% Boost</span>
                  </div>
                </div>

                {/* Cursor Light Toggle */}
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-[11px] text-neutral-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-red-400" />
                    <span>Mouse Photon Tracking</span>
                  </span>
                  <button
                    onClick={() => setPhotonCursorEnabled(!photonCursorEnabled)}
                    className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                      photonCursorEnabled ? 'bg-[#DC2626]' : 'bg-neutral-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform ${
                        photonCursorEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trigger Pill */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setHudOpen(!hudOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#14171f]/90 hover:bg-[#1c212c] border border-white/15 hover:border-white/30 text-white shadow-[0_10px_35px_rgba(0,0,0,0.6)] backdrop-blur-xl transition-all group"
          >
            {/* Luminous Emitter Dot */}
            <span
              className="w-2.5 h-2.5 rounded-full transition-all duration-500 shadow-md group-hover:scale-125"
              style={{
                backgroundColor: activeKelvin.hex,
                boxShadow: `0 0 12px ${activeKelvin.hex}`,
              }}
            />
            <span className="text-xs font-mono font-semibold tracking-wider">
              {activeKelvin.kelvin}
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-luxury text-neutral-400 hidden sm:inline">
              Lighting Studio
            </span>
            {hudOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
            )}
          </motion.button>
        </div>

        {/* Main Content Children */}
        {children}
      </div>
    </AmbianceContext.Provider>
  );
};
