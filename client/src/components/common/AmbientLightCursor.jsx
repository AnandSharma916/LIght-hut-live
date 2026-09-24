import React, { useEffect, useState } from 'react';

/**
 * Ambient Lighting Interactive Cursor Glow
 * Follows the user's cursor with an ethereal, warm golden-amber ambient lighting aura
 * that illuminates headers, cards, and surfaces as the user explores.
 */
export const AmbientLightCursor = () => {
  const [pos, setPos] = useState({ x: -500, y: -500 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;

      // Detect touch device
      if ('ontouchstart' in window || (navigator && navigator.maxTouchPoints > 0)) {
        return;
      }

      let animationFrameId;

      const handleMouseMove = (e) => {
        setVisible(true);
        cancelAnimationFrame(animationFrameId);
        animationFrameId = requestAnimationFrame(() => {
          setPos({ x: e.clientX, y: e.clientY });
        });
      };

      const handleMouseLeave = () => setVisible(false);
      const handleMouseEnter = () => setVisible(true);

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseenter', handleMouseEnter);

      return () => {
        cancelAnimationFrame(animationFrameId);
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mouseenter', handleMouseEnter);
      };
    } catch (err) {
      console.warn('AmbientLightCursor init notice:', err);
    }
  }, []);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-40 transition-opacity duration-300 overflow-hidden"
      style={{
        background: `radial-gradient(circle 380px at ${pos.x}px ${pos.y}px, rgba(212, 175, 55, 0.075), rgba(245, 158, 11, 0.025) 45%, transparent 75%)`,
      }}
    />
  );
};
