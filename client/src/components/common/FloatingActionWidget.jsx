import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, ArrowUp } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

/**
 * Floating Action Widget with Individual Social Media Buttons
 * Features:
 * 1. Separate distinct buttons for each social & contact channel:
 *    - Direct Call (Phone)
 *    - Facebook
 *    - Instagram
 *    - WhatsApp
 * 2. ONLY WhatsApp has continuous animation (ping ring & gentle breath) running continuously.
 * 3. All other buttons are static until hovered.
 * 4. Scroll-To-Top button appears on scroll > 250px.
 */
export const FloatingActionWidget = () => {
  const { settings } = useSettings();
  const [showTopBtn, setShowTopBtn] = useState(false);

  const rawWhatsapp = (settings?.whatsapp || settings?.phone || '+91 9811000000').replace(/[^0-9]/g, '');
  const displayPhone = settings?.phone || settings?.whatsapp || '+91 8045811438';
  const rawCallPhone = displayPhone.replace(/[^0-9+]/g, '');

  const whatsappUrl = `https://wa.me/${rawWhatsapp}?text=${encodeURIComponent(
    'Hello LightHut, I would like to inquire about your luxury designer lighting collections.'
  )}`;
  const instagramUrl = settings?.socialLinks?.instagram || 'https://www.instagram.com/lighthutdecorativesolutions/';
  const facebookUrl = settings?.socialLinks?.facebook || 'https://facebook.com';

  // Scroll visibility
  useEffect(() => {
    const checkScroll = () => {
      if (window.scrollY > 250) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    };
    window.addEventListener('scroll', checkScroll, { passive: true });
    return () => window.removeEventListener('scroll', checkScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <aside
      aria-label="Floating social media and contact links"
      className="fixed bottom-5 sm:bottom-6 right-3.5 sm:right-6 z-50 flex flex-col items-center gap-2.5 sm:gap-3 select-none pointer-events-auto"
    >
      {/* ── Scroll-To-Top Button (Appears when scrolled down) ── */}
      <AnimatePresence>
        {showTopBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 8 }}
            onClick={scrollToTop}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white text-neutral-800 shadow-lg border border-neutral-200/90 flex items-center justify-center hover:bg-neutral-900 hover:text-white transition-all cursor-pointer group relative"
            title="Scroll to Top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span className="hidden sm:inline-flex absolute right-14 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-md bg-neutral-900/95 text-white text-[11px] font-medium tracking-wide shadow-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Back to Top
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Direct Phone Call Button ── */}
      <div className="relative group flex items-center justify-center">
        <a
          href={`tel:${rawCallPhone}`}
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-neutral-900 hover:bg-black text-white shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 border border-white/15 cursor-pointer"
          title={`Call Us: ${displayPhone}`}
          aria-label={`Call ${displayPhone}`}
        >
          <Phone className="w-5 h-5 text-white" />
        </a>
        <span className="hidden sm:inline-flex absolute right-15 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-neutral-900/95 text-white text-xs font-medium tracking-wide shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Call {displayPhone}
        </span>
      </div>

      {/* ── Facebook Button ── */}
      <div className="relative group flex items-center justify-center">
        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1877F2] hover:bg-[#1466d3] text-white shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
          title="Follow on Facebook"
          aria-label="Facebook page"
        >
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>
        <span className="hidden sm:inline-flex absolute right-15 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-neutral-900/95 text-white text-xs font-medium tracking-wide shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Facebook
        </span>
      </div>

      {/* ── Instagram Button ── */}
      <div className="relative group flex items-center justify-center">
        <a
          href={instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F77737] hover:opacity-95 text-white shadow-md hover:shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 cursor-pointer"
          title="Follow on Instagram"
          aria-label="Instagram profile"
        >
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <span className="hidden sm:inline-flex absolute right-15 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-neutral-900/95 text-white text-xs font-medium tracking-wide shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Instagram
        </span>
      </div>

      {/* ── WhatsApp Button (WITH CONTINUOUS ANIMATION) ── */}
      <div className="relative group flex items-center justify-center">
        {/* Continuous Ping Pulse Ring - ONLY on WhatsApp */}
        <span className="absolute -inset-1.5 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          animate={{
            scale: [1, 1.07, 1],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="relative z-10 w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-[#25D366] to-[#128C7E] text-white shadow-[0_8px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.65)] flex items-center justify-center transition-transform cursor-pointer"
          title="Chat on WhatsApp"
          aria-label="Direct WhatsApp Consultation"
        >
          <svg className="w-7 h-7 sm:w-8 sm:h-8 fill-white" viewBox="0 0 24 24">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.066-2.115-.497-1.745-.69-2.871-2.47-2.958-2.585-.087-.116-.708-.94-.708-1.792s.448-1.277.607-1.452c.16-.175.348-.219.465-.219.116 0 .232.001.334.006.107.006.249-.041.389.296.145.349.494 1.206.538 1.294.044.088.073.19.015.306-.059.117-.088.19-.175.292-.087.102-.184.227-.262.306-.088.087-.179.182-.077.357.102.175.453.748.973 1.211.669.596 1.233.78 1.408.868.175.088.277.073.379-.044.102-.117.437-.51.554-.685.116-.175.233-.146.393-.088.16.058 1.018.48 1.193.568.175.088.291.131.335.204.043.073.043.424-.101.829z" />
          </svg>
        </motion.a>

        <span className="hidden sm:inline-flex absolute right-16 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-neutral-900/95 text-white text-xs font-semibold tracking-wide shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat on WhatsApp
        </span>
      </div>
    </aside>
  );
};
