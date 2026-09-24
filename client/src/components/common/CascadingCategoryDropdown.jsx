import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ArrowRight, Layers } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   10 Architectural Product Categories with Subcategories & HD Image Assets
   Every single subcategory has an authentic product image thumbnail & gallery
───────────────────────────────────────────────────────────── */
export const PRODUCT_CATEGORIES_DATA = [
  // 1) WALL LAMP
  {
    name: 'Wall Lamp',
    slug: 'wall-lamp',
    icon: '💡',
    sub: [
      {
        name: 'Led Wall Lamp',
        slug: 'led-wall-lamp',
        image: '/categories/led-wall-lamp.jpg',
        desc: 'Linear & Halo Minimalist Sconces',
      },
      {
        name: 'E27 Wall Lamp',
        slug: 'e27-wall-lamp',
        image: '/categories/e27-wall-lamp.jpg',
        desc: 'Fluted Glass & Vintage Sconces',
      },
    ],
    previewGallery: [
      { url: '/categories/led-wall-lamp.jpg', title: 'LH-WL101 Slim Linear LED', link: '/catalog?category=wall-lamp' },
      { url: '/categories/wall-lamp.jpg', title: 'LH-WL102 Round Halo Light', link: '/catalog?category=wall-lamp' },
      { url: '/categories/e27-wall-lamp.jpg', title: 'LH-WL201 Brass Swing-Arm Sconce', link: '/catalog?category=wall-lamp' },
      { url: '/categories/wall-lamp.jpg', title: 'Bi-Directional Sconce', link: '/catalog?category=wall-lamp' },
    ],
  },

  // 2) PENDANT LAMP
  {
    name: 'Pendant Lamp',
    slug: 'pendant-lamp',
    icon: '🔆',
    sub: [
      {
        name: 'Led Hanging Lamp',
        slug: 'led-hanging-lamp',
        image: '/categories/led-hanging-lamp.jpg',
        desc: 'Integrated Architectural Suspensions',
      },
      {
        name: 'E27 Hanging Lamp',
        slug: 'e27-hanging-lamp',
        image: '/categories/e27-hanging-lamp.jpg',
        desc: 'Mouth-Blown Fluted Glass Drops',
      },
    ],
    previewGallery: [
      { url: '/categories/led-hanging-lamp.jpg', title: 'LH-PL101 Cone Pendant', link: '/catalog?category=pendant-lamp' },
      { url: '/categories/e27-hanging-lamp.jpg', title: 'LH-PL201 Fluted Amber Glass', link: '/catalog?category=pendant-lamp' },
      { url: '/categories/pendant-lamp.jpg', title: 'Sculptural Suspended Luminaire', link: '/catalog?category=pendant-lamp' },
      { url: '/categories/led-hanging-lamp.jpg', title: 'Architectural Hanging Cone', link: '/catalog?category=pendant-lamp' },
    ],
  },

  // 3) CHANDELIER
  {
    name: 'Chandelier',
    slug: 'chandelier',
    icon: '✨',
    sub: [
      {
        name: 'Led Chandelier',
        slug: 'led-chandelier',
        image: '/categories/chandelier.jpg',
        desc: 'Architectural Geometric Rings',
      },
      {
        name: 'E14 Chandelier',
        slug: 'e14-chandelier',
        image: '/categories/e14-chandelier.jpg',
        desc: 'Multi-Arm European Candelabras',
      },
      {
        name: 'Profile Chandelier',
        slug: 'profile-chandelier',
        image: '/categories/profile-chandelier.jpg',
        desc: 'Linear Profile Suspensions',
      },
      {
        name: 'Glass Chandelier',
        slug: 'glass-chandelier',
        image: '/categories/glass-chandelier.jpg',
        desc: 'Handcrafted Optical Glass Elements',
      },
      {
        name: 'Italian Chandelier',
        slug: 'italian-chandelier',
        image: '/categories/italian-chandelier.jpg',
        desc: 'Venetian & Artisan European Glass',
      },
      {
        name: 'Modern chandelier',
        slug: 'modern-chandelier',
        image: '/categories/modern-chandelier.jpg',
        desc: 'Contemporary Sculptural Centerpieces',
      },
      {
        name: 'Antic Chandelier',
        slug: 'antic-chandelier',
        image: '/categories/antic-chandelier.jpg',
        desc: 'Heritage Gilded & Classic Ironwork',
      },
      {
        name: 'Fan chandelier',
        slug: 'fan-chandelier',
        image: '/categories/fan-chandelier.jpg',
        desc: 'Integrated Ceiling Fan & Lighting',
      },
      {
        name: 'Celling chandelier',
        slug: 'ceiling-chandelier',
        image: '/categories/ceiling-chandelier.jpg',
        desc: 'Semi-Flush Mount Centerpieces',
      },
    ],
    previewGallery: [
      { url: '/categories/chandelier.jpg', title: 'LH-CH101 Multi-Tier Ring Chandelier', link: '/catalog?category=chandelier' },
      { url: '/categories/e14-chandelier.jpg', title: 'LH-CH201 E14 French Candelabra', link: '/catalog?category=chandelier' },
      { url: '/categories/italian-chandelier.jpg', title: 'LH-CH501 Venetian Italian Chandelier', link: '/catalog?category=chandelier' },
      { url: '/categories/fan-chandelier.jpg', title: 'LH-CH801 Retractable Fan Chandelier', link: '/catalog?category=chandelier' },
    ],
  },

  // 4) DOUBLE HEIGHT
  {
    name: 'Double Height',
    slug: 'double-height',
    icon: '🏛️',
    sub: [
      {
        name: 'Crystal Chandelier',
        slug: 'crystal-chandelier',
        image: '/categories/double-height.jpg',
        desc: '18ft+ Monumental Staircase Drops',
      },
      {
        name: 'Modern Chandelier',
        slug: 'modern-chandelier-dh',
        image: '/categories/modern-chandelier-dh.jpg',
        desc: 'Spiral Duplex Void Rings',
      },
    ],
    previewGallery: [
      { url: '/categories/double-height.jpg', title: 'LH-DH101 Grand Crystal Cascade', link: '/catalog?category=double-height' },
      { url: '/categories/modern-chandelier-dh.jpg', title: 'LH-DH201 Modern Staggered Rings', link: '/catalog?category=double-height' },
      { url: '/categories/double-height.jpg', title: 'Atrium Void Suspension', link: '/catalog?category=double-height' },
      { url: '/categories/modern-chandelier-dh.jpg', title: '18ft Architectural Suspension', link: '/catalog?category=double-height' },
    ],
  },

  // 5) DINING TABLE LAMP
  {
    name: 'Dining Table Lamp',
    slug: 'dining-table-lamp',
    icon: '🍽️',
    sub: [],
    previewGallery: [
      { url: '/categories/dining-table-lamp.jpg', title: 'Cordless Touch Banquet Lamp', link: '/catalog?category=dining-table-lamp' },
      { url: '/hero-pendant.jpg', title: 'Champagne Fluted Drops', link: '/catalog?category=dining-table-lamp' },
      { url: '/banner-amalfi.jpg', title: 'Brushed Gold Dining Accent', link: '/catalog?category=dining-table-lamp' },
      { url: '/showroom-hero-hd.jpg', title: 'Executive Dining Centerpiece', link: '/catalog?category=dining-table-lamp' },
    ],
  },

  // 6) OUTDOOR LIGHT
  {
    name: 'Outdoor Light',
    slug: 'outdoor-light',
    icon: '🌿',
    sub: [
      {
        name: 'Gate Lamp',
        slug: 'gate-lamp',
        image: '/categories/outdoor-light.jpg',
        desc: 'Heritage Weatherproof Lanterns',
      },
      {
        name: 'Wall Lamp',
        slug: 'outdoor-wall-lamp',
        image: '/hero-outdoor.jpg',
        desc: 'IP65 Die-Cast Exterior Sconces',
      },
    ],
    previewGallery: [
      { url: '/categories/outdoor-light.jpg', title: 'Heritage Gate Pillar Lantern', link: '/catalog?category=outdoor-light' },
      { url: '/hero-outdoor.jpg', title: 'IP65 Architectural Sconce', link: '/catalog?category=outdoor-light' },
      { url: '/hero-outdoor.jpg', title: 'Villa Pathway Bollard', link: '/catalog?category=outdoor-light' },
      { url: '/categories/outdoor-light.jpg', title: 'Exterior Facade Grazer', link: '/catalog?category=outdoor-light' },
    ],
  },

  // 7) TABLE LAMP
  {
    name: 'Table Lamp',
    slug: 'table-lamp',
    icon: '🪔',
    sub: [],
    previewGallery: [
      { url: '/categories/table-lamp.jpg', title: 'Marble Base Mushroom Lamp', link: '/catalog?category=table-lamp' },
      { url: '/banner-study.jpg', title: 'Architectural Brass Task Lamp', link: '/catalog?category=table-lamp' },
      { url: '/banner-bed.jpg', title: 'Ceramic Bedside Ambient Light', link: '/catalog?category=table-lamp' },
      { url: '/banner-study-hover.jpg', title: 'Articulated Reading Desk Light', link: '/catalog?category=table-lamp' },
    ],
  },

  // 8) FLOOR LAMP
  {
    name: 'Floor Lamp',
    slug: 'floor-lamp',
    icon: '🕯️',
    sub: [],
    previewGallery: [
      { url: '/categories/floor-lamp.jpg', title: 'Arched Brass Living Room Arc', link: '/catalog?category=floor-lamp' },
      { url: '/categories/floor-lamp.jpg', title: 'Heavy Marble Plinth Luminaire', link: '/catalog?category=floor-lamp' },
      { url: '/hero-wall-lamp.jpg', title: 'Vertical Corner Ambient Bar', link: '/catalog?category=floor-lamp' },
      { url: '/categories/floor-lamp.jpg', title: 'Mid-Century Brass Floor Lamp', link: '/catalog?category=floor-lamp' },
    ],
  },

  // 9) LED FILAMENT BULB
  {
    name: 'LED Filament Bulb',
    slug: 'led-filament-bulb',
    icon: '💫',
    sub: [],
    previewGallery: [
      { url: '/categories/led-filament-bulb.jpg', title: 'Amber ST64 Spiral Bulb', link: '/catalog?category=led-filament-bulb' },
      { url: '/categories/led-filament-bulb.jpg', title: '2200K Edison Warm Glow', link: '/catalog?category=led-filament-bulb' },
      { url: '/categories/led-filament-bulb.jpg', title: 'G125 Giant Globe Bulb', link: '/catalog?category=led-filament-bulb' },
      { url: '/categories/led-filament-bulb.jpg', title: 'Vintage Spiral Filament', link: '/catalog?category=led-filament-bulb' },
    ],
  },

  // 10) SPARE PART
  {
    name: 'Spare Part',
    slug: 'spare-part',
    icon: '🔧',
    sub: [
      {
        name: 'Hanging Base',
        slug: 'hanging-base',
        image: '/categories/hanging-base.jpg',
        desc: 'Mounting Plates & Rigging Hardware',
      },
      {
        name: 'Spare Driver',
        slug: 'spare-driver',
        image: '/categories/spare-driver.jpg',
        desc: 'Constant Current LED Drivers',
      },
    ],
    previewGallery: [
      { url: '/categories/hanging-base.jpg', title: 'Brass Canopy & Rigging Base', link: '/catalog?category=spare-part' },
      { url: '/categories/spare-driver.jpg', title: 'Constant Current LED Driver', link: '/catalog?category=spare-part' },
      { url: '/categories/hanging-base.jpg', title: 'Telescopic Mounting Canopy', link: '/catalog?category=spare-part' },
      { url: '/categories/spare-driver.jpg', title: 'Electronic Power Supply Unit', link: '/catalog?category=spare-part' },
    ],
  },
];

export const CascadingCategoryDropdown = ({ onClose, className = '' }) => {
  const [activeCategory, setActiveCategory] = useState(PRODUCT_CATEGORIES_DATA[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.15 }}
      className={`relative bg-white text-neutral-800 rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-neutral-200/90 p-2 w-[240px] select-none ${className}`}
    >
      {/* Category List */}
      <div className="space-y-0.5">
        <div className="px-2.5 py-1 mb-1 border-b border-neutral-100 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            Categories
          </span>
          <span className="text-[10px] font-bold text-[#DC2626]">
            {PRODUCT_CATEGORIES_DATA.length}
          </span>
        </div>

        {PRODUCT_CATEGORIES_DATA.map((cat) => {
          const hasSub = cat.sub && cat.sub.length > 0;
          const isHovered = activeCategory?.slug === cat.slug;

          return (
            <div
              key={cat.slug}
              className="relative"
              onMouseEnter={() => setActiveCategory(cat)}
            >
              <Link
                to={`/category/${cat.slug}`}
                onClick={onClose}
                className={`group/item flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isHovered
                    ? 'bg-neutral-900 text-white pl-3 shadow-xs'
                    : 'text-neutral-700 hover:bg-neutral-100/90 hover:text-neutral-950 hover:pl-3'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs shrink-0">{cat.icon}</span>
                  <span className="truncate tracking-normal">
                    {cat.name}
                  </span>
                </div>

                {hasSub && (
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform shrink-0 ${
                      isHovered ? 'translate-x-0.5 text-[#DC2626]' : 'text-neutral-300'
                    }`}
                  />
                )}
              </Link>

              {/* Sub Dropdown Flyout to the Right — Clean, Compact & Image-Free */}
              <AnimatePresence>
                {isHovered && hasSub && (
                  <motion.div
                    initial={{ opacity: 0, x: 6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 4 }}
                    transition={{ duration: 0.14 }}
                    className="absolute left-[calc(100%+6px)] top-0 w-[220px] bg-white rounded-2xl shadow-[0_16px_40px_rgba(0,0,0,0.14)] border border-neutral-200/90 p-2 z-50 flex flex-col justify-between"
                  >
                    <div>
                      {/* Header */}
                      <div className="px-2.5 py-1 mb-1 border-b border-neutral-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] truncate">
                          {cat.name} Types
                        </span>
                        <span className="text-[10px] text-neutral-400 font-mono">
                          {cat.sub.length}
                        </span>
                      </div>

                      {/* Clean Subcategory List */}
                      <div className="space-y-0.5">
                        {cat.sub.map((subItem) => (
                          <Link
                            key={subItem.slug}
                            to={`/category/${cat.slug}/${subItem.slug}`}
                            onClick={onClose}
                            className="group/sub flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-medium text-neutral-700 hover:text-[#DC2626] hover:bg-red-50/80 transition-all duration-150"
                          >
                            <span className="truncate group-hover/sub:translate-x-0.5 transition-transform duration-150">
                              {subItem.name}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-neutral-300 group-hover/sub:text-[#DC2626] group-hover/sub:translate-x-0.5 transition-all shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Link: All Category Fixtures */}
                    <div className="mt-1.5 pt-1.5 border-t border-neutral-100 px-1">
                      <Link
                        to={`/category/${cat.slug}`}
                        onClick={onClose}
                        className="text-[11px] font-semibold text-[#DC2626] hover:text-[#B91C1C] flex items-center justify-between px-1.5 py-1 rounded-lg hover:bg-red-50/50 transition-colors group/link"
                      >
                        <span>Explore All {cat.name}s</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Bottom link: View All Categories */}
      <div className="mt-1.5 pt-1.5 border-t border-neutral-100 px-1">
        <Link
          to="/categories"
          onClick={onClose}
          className="w-full text-center py-1.5 rounded-xl text-[11px] font-semibold text-neutral-700 hover:text-white hover:bg-[#DC2626] bg-neutral-100/80 transition-colors flex items-center justify-center gap-1.5"
        >
          <Layers className="w-3.5 h-3.5" /> All Master Categories
        </Link>
      </div>
    </motion.div>
  );
};
