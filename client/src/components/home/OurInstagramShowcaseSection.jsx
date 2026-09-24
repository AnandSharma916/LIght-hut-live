import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Instagram, Heart, MessageCircle, ExternalLink, Play, Sparkles, X } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

/* ── Curated Instagram Reels & Posts Showcasing Real Lighting Projects ── */
const INSTAGRAM_POSTS_ROW1 = [
  {
    id: 'insta-1',
    handle: '@lighthutofficial',
    likes: '3.4k',
    comments: '128',
    caption: 'Transforming a double-height villa living room with our monumental cascading crystal chandelier ✨ #LuxuryLighting #InteriorDesign',
    image: '/categories/double-height.jpg',
    type: 'reel',
    views: '48.2k',
  },
  {
    id: 'insta-2',
    handle: '@lighthutofficial',
    likes: '2.8k',
    comments: '94',
    caption: 'Soft ambient evenings in this minimalist master sanctuary. 2700K warm circadian bedside drops. 🌙',
    image: '/banner-bedroom.jpg',
    type: 'post',
  },
  {
    id: 'insta-3',
    handle: '@lighthutofficial',
    likes: '4.1k',
    comments: '215',
    caption: 'Exterior architectural facade grazing in Bel Air. Balcony illumination that breathes life at twilight.',
    image: '/hero-outdoor.jpg',
    type: 'reel',
    views: '82.5k',
  },
  {
    id: 'insta-4',
    handle: '@lighthutofficial',
    likes: '1.9k',
    comments: '67',
    caption: 'Mouth-blown fluted glass pendant cluster over a custom monolithic marble dining table. Perfection in every cut.',
    image: '/categories/e27-hanging-lamp.jpg',
    type: 'post',
  },
  {
    id: 'insta-5',
    handle: '@lighthutofficial',
    likes: '3.9k',
    comments: '182',
    caption: 'Backlit Himalayan onyx vanity mirror for this bespoke Milan penthouse bathroom remodel. 💫',
    image: '/categories/led-wall-lamp.jpg',
    type: 'reel',
    views: '64.1k',
  },
  {
    id: 'insta-6',
    handle: '@lighthutofficial',
    likes: '2.5k',
    comments: '88',
    caption: 'Art deco symmetry with virgin brushed brass sconces and borosilicate fluting. Parisian salon vibes.',
    image: '/categories/e27-wall-lamp.jpg',
    type: 'post',
  },
  {
    id: 'insta-7',
    handle: '@lighthutofficial',
    likes: '5.2k',
    comments: '310',
    caption: 'Floating cantilevered staircase with concealed warm step-grazers & sculptural brass pendants. ✨',
    image: '/categories/modern-chandelier-dh.jpg',
    type: 'reel',
    views: '110k',
  },
  {
    id: 'insta-8',
    handle: '@lighthutofficial',
    likes: '2.1k',
    comments: '74',
    caption: 'Warm cove indirect lighting highlights the fluted timber wall of this quiet Scandinavian retreat.',
    image: '/categories/floor-lamp.jpg',
    type: 'post',
  },
];

const INSTAGRAM_POSTS_ROW2 = [
  {
    id: 'insta-9',
    handle: '@lighthutofficial',
    likes: '4.7k',
    comments: '240',
    caption: 'Infinity pool nightfall reflection in Santorini. IP68 underwater fixtures and low-glare terrace wash. 🌊',
    image: '/categories/outdoor-light.jpg',
    type: 'reel',
    views: '93.4k',
  },
  {
    id: 'insta-10',
    handle: '@lighthutofficial',
    likes: '3.1k',
    comments: '114',
    caption: 'Linear kitchen island lighting crafted from extruded aviation aluminum and optic diffusion lenses.',
    image: '/categories/profile-chandelier.jpg',
    type: 'post',
  },
  {
    id: 'insta-11',
    handle: '@lighthutofficial',
    likes: '3.8k',
    comments: '166',
    caption: 'Curating warm low-glare illumination for private art collections. True 98+ CRI color fidelity.',
    image: '/categories/italian-chandelier.jpg',
    type: 'reel',
    views: '57.8k',
  },
  {
    id: 'insta-12',
    handle: '@lighthutofficial',
    likes: '2.9k',
    comments: '99',
    caption: 'Japandi bedside aesthetic: raw textured plaster, handcrafted paper halo, and soft diffused glow. 🌿',
    image: '/banner-bed.jpg',
    type: 'post',
  },
  {
    id: 'insta-13',
    handle: '@lighthutofficial',
    likes: '4.3k',
    comments: '198',
    caption: 'Multi-tiered brass ring halo suspended over a 12-seater Mayfair dining table. Pure theatrical drama.',
    image: '/categories/chandelier.jpg',
    type: 'reel',
    views: '76.0k',
  },
  {
    id: 'insta-14',
    handle: '@lighthutofficial',
    likes: '2.6k',
    comments: '82',
    caption: 'Modern private library alcove with integrated micro-grazers tucked beneath walnut shelves.',
    image: '/banner-study.jpg',
    type: 'post',
  },
  {
    id: 'insta-15',
    handle: '@lighthutofficial',
    likes: '3.6k',
    comments: '143',
    caption: 'Four-level glass & timber villa illuminated with synchronized scene controllers from sunset to midnight.',
    image: '/showroom-hero-hd.jpg',
    type: 'reel',
    views: '68.9k',
  },
  {
    id: 'insta-16',
    handle: '@lighthutofficial',
    likes: '2.3k',
    comments: '79',
    caption: 'Monochrome architectural lounge featuring trimless recessed downlights and indirect perimeter cove.',
    image: '/categories/dining-table-lamp.jpg',
    type: 'post',
  },
];

export const OurInstagramShowcaseSection = () => {
  const { settings } = useSettings();
  const [selectedPost, setSelectedPost] = useState(null);

  const instagramUrl = settings?.socialLinks?.instagram || 'https://www.instagram.com/lighthutdecorativesolutions/';

  const row1Doubled = [...INSTAGRAM_POSTS_ROW1, ...INSTAGRAM_POSTS_ROW1];
  const row2Doubled = [...INSTAGRAM_POSTS_ROW2, ...INSTAGRAM_POSTS_ROW2];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-neutral-50 text-neutral-900 border-b border-neutral-200/80 overflow-hidden select-none">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        {/* ── Section Header with Instagram Branding ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 p-[2px] shadow-sm flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-rose-600" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-neutral-900 tracking-tight whitespace-nowrap">
                Our Instagram
              </h2>
            </div>
            <p className="text-neutral-500 text-xs sm:text-sm md:text-base max-w-2xl leading-relaxed">
              Follow <span className="font-semibold text-neutral-900">@lighthutdecorativesolutions</span> for daily interior inspiration, behind-the-scenes lighting craft, and real-time installation reels.
            </p>
          </div>

          <div className="shrink-0 pt-2 sm:pt-0">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-rose-500/25 transition-all hover:scale-105"
            >
              <Instagram className="w-4 h-4" />
              <span>Follow @lighthutdecorativesolutions</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Continuous Dual-Row Instagram Feed Marquee ── */}
      <div className="marquee-container space-y-3 sm:space-y-4 relative w-full overflow-hidden">
        {/* Soft edge blur gradient masks */}
        <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-neutral-50 via-neutral-50/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-neutral-50 via-neutral-50/80 to-transparent z-10 pointer-events-none" />

        {/* Row 1: Scrolling Right */}
        <div className="overflow-hidden flex">
          <div className="animate-marquee-right flex gap-3 sm:gap-4 pl-4">
            {row1Doubled.map((post, idx) => (
              <div
                key={`ir1-${post.id}-${idx}`}
                onClick={() => setSelectedPost(post)}
                className="group relative w-[160px] sm:w-[210px] md:w-[245px] aspect-[9/15] rounded-sm sm:rounded-md overflow-hidden bg-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-2xl cursor-pointer transition-all duration-500 shrink-0 border border-neutral-300/80 hover:-translate-y-1.5"
              >
                <img
                  src={post.image}
                  onError={(e) => {
                    e.target.src = '/hero-chandelier.jpg';
                  }}
                  alt={post.caption}
                  className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Top Instagram badge */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-xs text-white text-[10px] font-medium border border-white/10">
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-[1px]">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <Instagram className="w-2.5 h-2.5 text-rose-600" />
                      </div>
                    </div>
                    <span>lighthut</span>
                  </div>

                  {post.type === 'reel' && (
                    <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center border border-white/10">
                      <Play className="w-2.5 h-2.5 fill-white" />
                    </div>
                  )}
                </div>

                {/* Bottom subtle permanent gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />

                {/* Interactive Hover Reveal with Instagram Details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 sm:p-5 flex flex-col justify-end text-left pointer-events-none">
                  <p className="text-white/95 text-[11px] sm:text-xs leading-relaxed line-clamp-3 mb-3">
                    {post.caption}
                  </p>

                  <div className="flex items-center justify-between text-white/90 text-xs pt-2 border-t border-white/20">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span className="text-[11px] font-semibold">{post.likes}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-white/80" />
                        <span className="text-[11px] font-semibold">{post.comments}</span>
                      </span>
                    </div>

                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1">
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Left */}
        <div className="overflow-hidden flex">
          <div className="animate-marquee-left flex gap-3 sm:gap-4 pl-4">
            {row2Doubled.map((post, idx) => (
              <div
                key={`ir2-${post.id}-${idx}`}
                onClick={() => setSelectedPost(post)}
                className="group relative w-[160px] sm:w-[210px] md:w-[245px] aspect-[9/15] rounded-sm sm:rounded-md overflow-hidden bg-neutral-900 shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-2xl cursor-pointer transition-all duration-500 shrink-0 border border-neutral-300/80 hover:-translate-y-1.5"
              >
                <img
                  src={post.image}
                  onError={(e) => {
                    e.target.src = '/hero-pendant.jpg';
                  }}
                  alt={post.caption}
                  className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Top Instagram badge */}
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/50 backdrop-blur-xs text-white text-[10px] font-medium border border-white/10">
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-[1px]">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <Instagram className="w-2.5 h-2.5 text-rose-600" />
                      </div>
                    </div>
                    <span>lighthut</span>
                  </div>

                  {post.type === 'reel' && (
                    <div className="w-6 h-6 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center border border-white/10">
                      <Play className="w-2.5 h-2.5 fill-white" />
                    </div>
                  )}
                </div>

                {/* Bottom subtle permanent gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-60 group-hover:opacity-0 transition-opacity duration-300 pointer-events-none" />

                {/* Interactive Hover Reveal with Instagram Details */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 sm:p-5 flex flex-col justify-end text-left pointer-events-none">
                  <p className="text-white/95 text-[11px] sm:text-xs leading-relaxed line-clamp-3 mb-3">
                    {post.caption}
                  </p>

                  <div className="flex items-center justify-between text-white/90 text-xs pt-2 border-t border-white/20">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                        <span className="text-[11px] font-semibold">{post.likes}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5 text-white/80" />
                        <span className="text-[11px] font-semibold">{post.comments}</span>
                      </span>
                    </div>

                    <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300 flex items-center gap-1">
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Instagram Post Lightbox Modal ── */}
      <AnimatePresence>
        {selectedPost && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-neutral-900 text-white rounded-lg overflow-hidden shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="relative aspect-[4/5] bg-black">
                  <img
                    src={selectedPost.image}
                    alt={selectedPost.caption}
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                <div className="p-6 sm:p-7 flex flex-col justify-between bg-neutral-900 border-t md:border-t-0 md:border-l border-white/10">
                  <div>
                    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 p-[2px]">
                        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                          <Instagram className="w-4 h-4 text-rose-600" />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">lighthutdecorativesolutions</div>
                        <div className="text-[11px] text-neutral-400">Architectural & Designer Lighting</div>
                      </div>
                    </div>

                    <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed mb-6">
                      {selectedPost.caption}
                    </p>

                    <div className="flex items-center gap-4 text-white/80 text-xs mb-6">
                      <span className="flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                        <span className="font-semibold">{selectedPost.likes} Likes</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-white/80" />
                        <span className="font-semibold">{selectedPost.comments} Comments</span>
                      </span>
                    </div>
                  </div>

                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xs bg-gradient-to-r from-purple-600 via-rose-500 to-amber-500 text-white text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-lg hover:brightness-110 transition-all"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>View Post on Instagram</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
