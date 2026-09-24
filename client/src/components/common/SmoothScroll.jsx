import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

/**
 * Global Lenis Smooth Momentum Scroll Provider
 * Delivers butter-smooth inertial scrolling across all public pages,
 * handles anchor jumps smoothly, and resets scroll on route navigation.
 */
export const SmoothScroll = ({ children }) => {
  const lenisRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    let animationFrameId;
    let lenis = null;

    try {
      if (typeof window !== 'undefined') {
        lenis = new Lenis({
          duration: 1.15,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          orientation: 'vertical',
          gestureOrientation: 'vertical',
          smoothWheel: true,
          wheelMultiplier: 1.0,
          touchMultiplier: 1.6,
          infinite: false,
        });

        lenisRef.current = lenis;
        window.lenis = lenis;

        function raf(time) {
          if (lenis) {
            lenis.raf(time);
            animationFrameId = requestAnimationFrame(raf);
          }
        }
        animationFrameId = requestAnimationFrame(raf);
      }
    } catch (err) {
      console.warn('Lenis smooth scrolling fallback to native scroll:', err);
    }

    // Handle hash links with buttery smooth animation
    const handleAnchorClick = (e) => {
      try {
        const anchor = e.target.closest('a[href*="#"]');
        if (!anchor) return;

        const href = anchor.getAttribute('href');
        if (!href) return;

        const hashIndex = href.indexOf('#');
        if (hashIndex === -1) return;

        const hash = href.slice(hashIndex);
        if (hash === '#' || hash === '') return;

        const targetEl = document.querySelector(hash);
        if (targetEl) {
          e.preventDefault();
          if (lenis) {
            lenis.scrollTo(targetEl, { offset: -90, duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } catch (err) {
        // ignore anchor errors
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (lenis) {
        try {
          lenis.destroy();
        } catch (e) {
          // ignore
        }
      }
      lenisRef.current = null;
      if (typeof window !== 'undefined') {
        window.lenis = null;
      }
    };
  }, []);

  // Reset scroll position on route changes
  useEffect(() => {
    try {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    } catch (err) {
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }
    }
  }, [location.pathname]);

  return <>{children}</>;
};
