import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Home, Utensils, Bed, Building, Trees } from 'lucide-react';

const ROOM_GUIDES = [
  {
    id: 'living-room',
    name: 'Living Room',
    icon: Home,
    title: 'Warm & Inviting Centerpiece',
    tag: 'Family Gatherings & Entertainment',
    description: 'A grand modern chandelier or ring pendant paired with warm wall sconces creates a welcoming, cozy atmosphere for family and guests.',
    recommendedCategory: 'Chandelier & Wall Lamps',
    categoryLink: '/catalog?category=chandelier',
    lightMood: 'Warm Golden Glow (Soft & Cozy)',
    image: '/categories/chandelier.jpg',
  },
  {
    id: 'dining-room',
    name: 'Dining Table',
    icon: Utensils,
    title: 'Atmospheric Dining Pendants',
    tag: 'Dinner Parties & Celebrations',
    description: 'Linear pendants or clustered artisan glass lights focused gently over the table enhance the colors of food and create intimate conversations.',
    recommendedCategory: 'Pendant Lamps',
    categoryLink: '/catalog?category=pendant-lamp',
    lightMood: 'Warm Ambient Light',
    image: '/categories/pendant-lamp.jpg',
  },
  {
    id: 'bedroom',
    name: 'Master Bedroom',
    icon: Bed,
    title: 'Peaceful Bedside Glow',
    tag: 'Rest, Reading & Relaxation',
    description: 'Indirect halo wall lights and bedside hanging pendants provide eye-friendly, gentle warmth without glare before bedtime.',
    recommendedCategory: 'Wall Lamps',
    categoryLink: '/catalog?category=wall-lamp',
    lightMood: 'Gentle Amber Glow (Flicker-Free)',
    image: '/banner-bedroom.jpg',
  },
  {
    id: 'double-height',
    name: 'Foyer & Duplex',
    icon: Building,
    title: 'Grand Cascading Statement',
    tag: 'Double Height & Staircases',
    description: 'Dramatic multi-tier cascading crystal lights fill vertical spaces with magnificent brilliance that impresses every visitor.',
    recommendedCategory: 'Double Height Chandeliers',
    categoryLink: '/catalog?category=double-height',
    lightMood: 'Sparkling Brilliant Warmth',
    image: '/categories/double-height.jpg',
  },
  {
    id: 'outdoor',
    name: 'Outdoor & Porch',
    icon: Trees,
    title: 'Weatherproof Elegance',
    tag: 'Balconies, Gates & Entrances',
    description: 'Weather-resistant wall fixtures and gate lanterns that withstand rain and dust while guiding nighttime arrivals safely.',
    recommendedCategory: 'Outdoor Lights',
    categoryLink: '/catalog?category=outdoor-light',
    lightMood: 'Clear Warm Illumination',
    image: '/hero-outdoor.jpg',
  },
];

export const LightingMoodStudio = () => {
  const [selectedRoom, setSelectedRoom] = useState(ROOM_GUIDES[0]);

  return (
    <section className="py-20 sm:py-24 bg-[#0b0f17] relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161e2c] border border-red-500/30 text-[10px] uppercase tracking-wider text-red-300 font-bold mb-3">
            <Sparkles className="w-3 h-3 text-[#DC2626]" />
            <span>LIGHTING GUIDE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-white tracking-tight">
            Find the Perfect Light for Every Room
          </h2>
          <p className="text-sm text-neutral-300 mt-2 leading-relaxed">
            Select a room below to see expert recommendations on styles, moods, and suitable fixtures for your space.
          </p>
        </div>

        {/* Room Selection Tabs */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-10">
          {ROOM_GUIDES.map((room) => {
            const Icon = room.icon;
            const isSelected = selectedRoom.id === room.id;
            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoom(room)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isSelected
                    ? 'bg-[#DC2626] text-white font-bold shadow-lg shadow-red-600/25'
                    : 'bg-[#161e2c] text-neutral-300 hover:text-white hover:bg-[#1e283a] border border-white/8'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{room.name}</span>
              </button>
            );
          })}
        </div>

        {/* Room Showcase Feature Card - CLEAR & CRISP IMAGE */}
        <div className="bg-[#161e2c] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left: Clear Image Stage */}
            <div className="lg:col-span-7">
              <div className="relative rounded-xl overflow-hidden aspect-[16/10] bg-black/40 border border-white/10 shadow-lg group">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedRoom.image}
                    src={selectedRoom.image}
                    alt={selectedRoom.title}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </AnimatePresence>

                <div className="absolute bottom-3 left-3 z-10">
                  <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[#0b0f17]/90 border border-white/15 text-white backdrop-blur-md">
                    ✨ {selectedRoom.lightMood}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Friendly Recommendations */}
            <div className="lg:col-span-5 space-y-5">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#DC2626] font-bold block mb-1">
                  {selectedRoom.tag}
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-white leading-snug">
                  {selectedRoom.title}
                </h3>
              </div>

              <p className="text-sm text-neutral-300 leading-relaxed">
                {selectedRoom.description}
              </p>

              <div className="p-4 rounded-xl bg-[#0b0f17]/60 border border-white/8 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Recommended Type:</span>
                  <span className="font-semibold text-white">{selectedRoom.recommendedCategory}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400">Atmosphere:</span>
                  <span className="font-semibold text-red-300">{selectedRoom.lightMood}</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to={selectedRoom.categoryLink}
                  className="btn-gold inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs uppercase tracking-luxury shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore {selectedRoom.name} Lights</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
