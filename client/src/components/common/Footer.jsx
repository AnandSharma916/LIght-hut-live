import React from 'react';
import { Link } from 'react-router-dom';
import {
  Phone,
  Mail,
  MapPin,
  ArrowRight,
  Instagram,
  Facebook,
  Linkedin,
  Shield,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

/**
 * Luxury Architectural Lighting Footer & Above-Footer Section
 * Matches the editorial IMDC architectural aesthetic:
 * 1. Above Footer: Textured architectural wall with glowing sconces & climbing ivy,
 *    frosted glassmorphic card with "Luxury lighting without risk." & "Explore Our Products" button.
 * 2. Footer: Pitch black layout with 4 vertical divider-separated columns,
 *    warm gold column header accents, and bronze bottom sub-footer bar.
 */
export const Footer = () => {
  const { settings } = useSettings();

  const whatsappNumber = (settings?.whatsapp || '+91 9811000000').replace(/[^0-9]/g, '');

  return (
    <footer className="w-full relative bg-black text-neutral-300 overflow-hidden select-none">
      
      {/* ════════════════════════════════════════════════════════
          1. ABOVE FOOTER SECTION: LUXURY FROSTED GLASS BANNER
          (Exact match to reference design)
      ════════════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-neutral-950">
        
        {/* Background Architectural Wall with Glowing Sconces & Climbing Ivy */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/above-footer-bg.jpg"
            onError={(e) => {
              e.target.src = '/showroom-hero-hd.jpg';
            }}
            alt="Architectural Lighting Wall"
            className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.05]"
            loading="lazy"
          />
          {/* Subtle gradient vignette to blend into black footer */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/50 pointer-events-none" />
        </div>

        {/* Central Frosted Glassmorphism Card */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[28px] sm:rounded-[36px] bg-white/[0.10] backdrop-blur-[24px] -webkit-backdrop-blur-[24px] border border-white/25 p-8 sm:p-12 lg:p-14 shadow-[0_24px_60px_rgba(0,0,0,0.5)] flex flex-col gap-8 transition-all duration-300">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 sm:gap-10">
              {/* Left: Brand Logo & Typography */}
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center gap-3">
                  <img
                    src={settings?.logo || '/categories/logo.png'}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/logo.png';
                    }}
                    alt="LightHut Decorative Solutions"
                    className="h-12 w-auto object-contain filter drop-shadow"
                  />
                  <div className="border-l border-white/30 pl-3">
                    <span className="text-base font-serif-luxury tracking-[0.2em] font-bold text-white uppercase block leading-none">
                      LIGHTHUT
                    </span>
                    <span className="text-[9px] tracking-[0.25em] text-red-300 uppercase font-semibold block mt-1">
                      DECORATIVE SOLUTIONS
                    </span>
                  </div>
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-sans font-light tracking-tight text-white leading-[1.2] drop-shadow-sm">
                  Luxury lighting without risk.
                </h2>
                <p className="text-xs sm:text-sm text-neutral-200/90 font-light leading-relaxed">
                  Design, support, and assurance — from bespoke consultation to site installation.
                </p>
              </div>

              {/* Right: Primary Action Buttons */}
              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-3 pl-6 pr-2.5 py-2.5 rounded-full bg-white text-neutral-900 text-xs sm:text-sm font-semibold tracking-wide shadow-xl hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-0.5"
                >
                  <span>Explore Catalog</span>
                  <span className="w-8 h-8 rounded-full bg-[#DC2626] group-hover:bg-[#B91C1C] text-white flex items-center justify-center transition-colors duration-300 shadow">
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                  </span>
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs sm:text-sm font-semibold tracking-wide transition-all backdrop-blur-sm"
                >
                  <span>Contact Showroom</span>
                </Link>
              </div>
            </div>

            {/* Horizontal Divider Line (HR) */}
            <hr className="border-white/20 my-1" />

            {/* Quick Links Row Across All Collections (Har Link Added in Above Footer) */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-300">
                Explore Collections:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { name: 'Chandeliers', path: '/catalog?category=chandelier' },
                  { name: 'Pendants', path: '/catalog?category=pendant-lamp' },
                  { name: 'Wall Lamps', path: '/catalog?category=wall-lamp' },
                  { name: 'Double Height', path: '/catalog?category=double-height' },
                  { name: 'Outdoor Lights', path: '/catalog?category=outdoor-light' },
                  { name: 'Table Lamps', path: '/catalog?category=table-lamp' },
                  { name: 'Floor Lamps', path: '/catalog?category=floor-lamp' },
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="px-3 py-1.5 rounded-full bg-black/40 hover:bg-[#DC2626] border border-white/15 text-neutral-200 hover:text-white text-[11px] font-medium transition-all"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          2. MAIN FOOTER: 4 DIVIDER-SEPARATED COLUMNS
          (Pitch black with gold column top accents)
      ════════════════════════════════════════════════════════ */}
      <div className="relative z-10 bg-black pt-16 sm:pt-20 pb-16 sm:pb-20 border-t border-neutral-900">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-neutral-800/80">
            
            {/* ── COLUMN 1: BRAND LOGO & EDITORIAL MISSION (Span 5) ── */}
            <div className="lg:col-span-5 pr-0 md:pr-8 lg:pr-14 pb-10 md:pb-0 space-y-5">
              
              {/* Brand Logo Image Added */}
              <Link to="/" className="inline-flex items-center gap-3.5 group">
                <img
                  src={settings?.logo || '/categories/logo.png'}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/logo.png';
                  }}
                  alt="LightHut Decorative Solutions"
                  className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
                />
                <div className="flex flex-col border-l border-neutral-700/80 pl-3">
                  <span className="text-lg font-serif-luxury tracking-[0.2em] font-bold text-white uppercase leading-none">
                    LIGHTHUT
                  </span>
                  <span className="text-[9.5px] tracking-[0.25em] text-[#DC2626] uppercase font-semibold mt-1">
                    DECORATIVE SOLUTIONS
                  </span>
                </div>
              </Link>

              {/* Uppercase Category Headline */}
              <h3 className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-medium text-neutral-200 pt-2">
                PRESENTING THE FINEST IN ARCHITECTURAL LIGHTING
              </h3>

              {/* Paragraph 1 */}
              <p className="text-xs sm:text-[13px] text-neutral-400 font-light leading-relaxed max-w-md">
                LightHut is the exclusive promoter and distributor of premier architectural lighting designs, handcrafted crystal chandeliers, and designer luminaires. Our curated collections feature statement pendants, wall sconces, and exterior fixtures crafted for exceptional living spaces.
              </p>

              {/* Paragraph 2 */}
              <p className="text-xs sm:text-[13px] text-neutral-400 font-light leading-relaxed max-w-md">
                Our mission is to assist our clients through a premium bespoke service, tailored to their exact specifications, helping them create the perfect spatial ambiance with unique, luxurious, and innovative designer lighting.
              </p>

            </div>

            {/* ── COLUMN 2: QUICK LINKS (Span 2) ── */}
            <div className="lg:col-span-2 px-0 md:px-6 lg:px-8 py-8 md:py-0">
              <div className="border-t border-[#8C6D4F]/50 pt-3">
                <h4 className="text-neutral-100 font-normal text-sm sm:text-base tracking-wide mb-6">
                  Quick Links
                </h4>
                <ul className="space-y-3.5 text-xs sm:text-[13px] text-neutral-400 font-light">
                  <li>
                    <Link to="/" className="hover:text-white transition-colors duration-200 block">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/about" className="hover:text-white transition-colors duration-200 block">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/categories" className="hover:text-white transition-colors duration-200 block">
                      Collections & Brands
                    </Link>
                  </li>
                  <li>
                    <Link to="/catalog" className="hover:text-white transition-colors duration-200 block">
                      Products Catalog
                    </Link>
                  </li>
                  <li>
                    <Link to="/projects" className="hover:text-white transition-colors duration-200 block">
                      Showcase Projects
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-white transition-colors duration-200 block">
                      Contact Showroom
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/login" className="flex items-center gap-1.5 text-neutral-400 hover:text-[#DC2626] transition-colors duration-200">
                      <Shield className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>Admin Portal</span>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* ── COLUMN 3: CONTACT & WORKS (Span 3) ── */}
            <div className="lg:col-span-3 px-0 md:px-6 lg:px-8 py-8 md:py-0">
              <div className="border-t border-[#8C6D4F]/50 pt-3">
                <h4 className="text-neutral-100 font-normal text-sm sm:text-base tracking-wide mb-6">
                  Contact & Works
                </h4>
                <div className="space-y-4 text-xs sm:text-[13px] text-neutral-400 font-light">
                  
                  {/* Official Address with Google Maps Link */}
                  <a
                    href="https://maps.google.com/maps?q=28.678613662719727%2C77.15131378173828&z=17&hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 text-neutral-300 hover:text-white transition-colors group/addr"
                    title="Open in Google Maps"
                  >
                    <MapPin className="w-4 h-4 text-[#DC2626] group-hover/addr:scale-110 transition-transform shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong className="block text-white font-medium text-xs group-hover/addr:text-red-300 transition-colors">
                        M/S LIGHT-HUT DECORATIVE SOLUTIONS
                      </strong>
                      <span className="text-neutral-300">C37/4, Lawrence Road, Industrial Area</span>
                      <br />
                      <span className="text-neutral-300">New Delhi - 110035</span>
                      <br />
                      <span className="text-neutral-400 text-[11px]">(Near Metro Station Kanhaiya Nagar)</span>
                      <span className="block text-[11px] text-[#DC2626] font-medium mt-1">
                        View on Google Maps ↗
                      </span>
                    </div>
                  </a>

                  {/* Official Email */}
                  <a
                    href="mailto:lighthutdecorativedlh@gmail.com"
                    className="flex items-center gap-3 hover:text-white transition-colors group pt-2 border-t border-neutral-800"
                  >
                    <Mail className="w-4 h-4 text-[#8C6D4F] group-hover:text-amber-300 transition-colors shrink-0" />
                    <span className="truncate">lighthutdecorativedlh@gmail.com</span>
                  </a>

                </div>
              </div>
            </div>

            {/* ── COLUMN 4: SOCIAL MEDIA (Span 2) ── */}
            <div className="lg:col-span-2 pl-0 md:pl-6 lg:pl-8 py-8 md:py-0">
              <div className="border-t border-[#8C6D4F]/50 pt-3">
                <h4 className="text-neutral-100 font-normal text-sm sm:text-base tracking-wide mb-6">
                  Social media
                </h4>
                
                {/* Rounded Icon Circles */}
                <div className="flex items-center gap-3">
                  <a
                    href={settings?.socialLinks?.facebook || 'https://facebook.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white hover:border-[#8C6D4F] flex items-center justify-center transition-all duration-200"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>

                  <a
                    href={settings?.socialLinks?.instagram || 'https://www.instagram.com/lighthutdecorativesolutions/'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white hover:border-[#8C6D4F] flex items-center justify-center transition-all duration-200"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>

                  <a
                    href={settings?.socialLinks?.linkedin || 'https://linkedin.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full border border-neutral-700 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white hover:border-[#8C6D4F] flex items-center justify-center transition-all duration-200"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          3. SUB-FOOTER BOTTOM BAR: HIGH VISIBILITY ADMIN & COPYRIGHT
      ════════════════════════════════════════════════════════ */}
      <div className="bg-[#090A0D] text-neutral-400 py-4 px-4 sm:px-8 lg:px-12 border-t border-white/10">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-[13px] font-medium tracking-wide">
          
          <div className="text-neutral-400 text-center sm:text-left">
            {settings?.footerContent?.copyrightText || '© 2026 LightHut Luxury Architectural Lighting. All Rights Reserved.'}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181B22] hover:bg-[#DC2626] border border-white/20 hover:border-[#DC2626] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-md group"
              title="Access LightHut Admin Management Panel"
            >
              <Shield className="w-4 h-4 text-[#DC2626] group-hover:text-white transition-colors" />
              <span>Admin Panel</span>
            </Link>
          </div>

        </div>
      </div>

    </footer>
  );
};
