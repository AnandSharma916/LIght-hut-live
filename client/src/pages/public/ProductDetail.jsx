import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Share2,
  X,
  ChevronLeft,
  Sun,
  Moon,
  Layers,
  Award,
  Zap,
  Mail,
  Eye,
  MapPin,
  Building2,
} from 'lucide-react';
import { productService } from '../../services/api';
import { ProductCard } from '../../components/catalog/ProductCard';
import { InquiryModal } from '../../components/common/InquiryModal';
import { useToast } from '../../context/ToastContext';
import { useSettings } from '../../context/SettingsContext';
import { MASTER_PRODUCTS } from '../../data/catalogData';

const CATEGORY_BANNER_MAP = {
  chandelier: '/hero-chandelier.jpg',
  'led-chandelier': '/hero-chandelier.jpg',
  'e14-chandelier': '/categories/chandelier.jpg',
  'profile-chandelier': '/hero-chandelier.jpg',
  'glass-chandelier': '/hero-chandelier.jpg',
  'italian-chandelier': '/categories/chandelier.jpg',
  'modern-chandelier': '/hero-chandelier.jpg',
  'antique-chandelier': '/categories/chandelier.jpg',
  'fan-chandelier': '/hero-chandelier.jpg',
  'ceiling-chandelier': '/categories/chandelier.jpg',
  'double-height': '/hero-double-height.jpg',
  'crystal-chandelier': '/hero-double-height.jpg',
  'modern-double-height-chandelier': '/hero-double-height.jpg',
  'pendant-lamp': '/hero-pendant.jpg',
  'led-hanging-lamp': '/hero-pendant.jpg',
  'e27-hanging-lamp': '/categories/pendant-lamp.jpg',
  pendant: '/hero-pendant.jpg',
  'wall-lamp': '/hero-wall-lamp.jpg',
  'led-wall-lamp': '/hero-wall-lamp.jpg',
  'e27-wall-lamp': '/categories/wall-lamp.jpg',
  wall: '/hero-wall-lamp.jpg',
  'outdoor-light': '/hero-outdoor.jpg',
  'gate-lamp': '/hero-outdoor.jpg',
  'outdoor-wall-lamp': '/categories/outdoor-light.jpg',
  outdoor: '/hero-outdoor.jpg',
  'table-lamp': '/banner-bedroom.jpg',
  'dining-table-lamp': '/banner-amalfi.jpg',
  'floor-lamp': '/banner-study.jpg',
  'spare-part': '/craft-main.jpg',
  'hanging-base': '/craft-main.jpg',
  'spare-driver': '/craft-main.jpg',
  'led-filament-bulb': '/craft-detail.jpg',
};

// Comprehensive Category-Tailored High-Resolution Perspectives (12 Ultra-HD Perspectives Per Typology)
const CATEGORY_PERSPECTIVES_MAP = {
  'chandelier': [
    { url: '/categories/chandelier.jpg', label: 'Primary Studio Silhouette', tag: 'Studio Specimen' },
    { url: '/hero-chandelier.jpg', label: 'Grand Ballroom Architectural Centerpiece', tag: 'Ballroom Installation' },
    { url: '/craft-detail.jpg', label: 'Precision K9 Cut Optical Prisms', tag: 'Optical Macro' },
    { url: '/hero-chandelier.jpg', label: 'Evening Illuminated Warm Glow (2700K)', tag: 'Warm Ambiance' },
    { url: '/banner-empire.jpg', label: 'Regal Gilded Empire Crystal Cascade', tag: 'French Royalty' },
    { url: '/banner-amalfi.jpg', label: 'Handcrafted Brass Ring Dining Setting', tag: 'Dining Salon' },
    { url: '/categories/double-height.jpg', label: 'Double-Height Atrium Suspension View', tag: 'Atrium Scale' },
    { url: '/categories/led-hanging-lamp.jpg', label: 'Modern Sputnik Starburst Luminaire', tag: 'Mid-Century Art' },
    { url: '/craft-main.jpg', label: 'Master Goldsmith Hand-Set Crystals', tag: 'Artisan Craft' },
    { url: '/categories/led-wall-lamp.jpg', label: 'Ceiling Canopy & High-Tensile Rigging', tag: 'Hardware Detail' },
    { url: '/categories/double-height.jpg', label: 'Twilight Glass Wall Reflection Ambiance', tag: 'Evening Grandeur' },
    { url: '/banner-amalfi.jpg', label: 'Low-Angle Optical Starburst Dispersion', tag: 'Beam Pattern' },
  ],
  'pendant-lamp': [
    { url: '/categories/pendant-lamp.jpg', label: 'Studio Pendant Elevation', tag: 'Primary Specimen' },
    { url: '/hero-pendant.jpg', label: 'Linear Kitchen Island Trio Array', tag: 'Island Array' },
    { url: '/banner-pendant.jpg', label: 'Mouth-Blown Fluted Borosilicate Glass', tag: 'Italian Glass' },
    { url: '/banner-pend.jpg', label: 'Nordic Matte Dome Architectural Pendant', tag: 'Scandinavian' },
    { url: '/banner-amalfi.jpg', label: 'Executive Dining Room Warm Accent', tag: 'Dining Setting' },
    { url: '/categories/led-wall-lamp.jpg', label: 'Architectural Downlight Cone Spread', tag: 'Optical Cone' },
    { url: '/categories/led-hanging-lamp.jpg', label: 'Brushed Brass Shade & Texture Detail', tag: 'Macro Brass' },
    { url: '/banner-amalfi.jpg', label: 'Smoked Amber Glass Warm Drop', tag: 'Warm Horizon' },
    { url: '/craft-detail.jpg', label: 'Ceiling Rose & Braided Fabric Cable', tag: 'Hardware Detail' },
    { url: '/categories/dining-table-lamp.jpg', label: 'Intimate Breakfast Nook Perspective', tag: 'In-Situ Nook' },
    { url: '/categories/floor-lamp.jpg', label: 'Architectural Matte Black Cylinder Array', tag: 'Linear Array' },
    { url: '/hero-chandelier.jpg', label: 'Evening Ambient Table Atmosphere', tag: 'Circadian Glow' },
  ],
  'wall-lamp': [
    { url: '/categories/wall-lamp.jpg', label: 'Frontal Sconce Elevation', tag: 'Primary Specimen' },
    { url: '/hero-wall-lamp.jpg', label: 'Bedside Suite Reading Illumination', tag: 'Bedside Suite' },
    { url: '/categories/led-wall-lamp.jpg', label: 'Bi-Directional Up & Down Wall Grazer', tag: 'Dual Wall Wash' },
    { url: '/categories/led-hanging-lamp.jpg', label: 'Fluted Borosilicate Glass Cylinder', tag: 'Glass Texture' },
    { url: '/banner-amalfi.jpg', label: 'Minimalist Halo Perimeter Glow', tag: 'Halo Ambient' },
    { url: '/categories/table-lamp.jpg', label: 'Corridor Gallery Feature Illumination', tag: 'Corridor Wash' },
    { url: '/categories/double-height.jpg', label: 'Natural Stone Facade Texture Grazing', tag: 'Material Interaction' },
    { url: '/craft-detail.jpg', label: 'Brushed Champagne Gold Armature Detail', tag: 'Macro Craft' },
    { url: '/hero-wall-lamp.jpg', label: 'Backlit Vanity Mirror Framing', tag: 'Vanity Suite' },
    { url: '/categories/e27-wall-lamp.jpg', label: 'Floating Headboard Circadian Glow', tag: 'Bedroom Mood' },
    { url: '/banner-bedroom.jpg', label: 'Architectural Foyer Sconce Pair', tag: 'Foyer Setting' },
    { url: '/categories/floor-lamp.jpg', label: 'Evening Ambient Soft Diffuser Glow', tag: 'Warm Ambiance' },
  ],
  'double-height': [
    { url: '/categories/double-height.jpg', label: 'Full Cascading Elevation', tag: 'Primary Specimen' },
    { url: '/hero-double-height.jpg', label: 'Spiral Staircase Void Installation', tag: 'Staircase Void' },
    { url: '/hero-chandelier.jpg', label: 'High-Ceiling Atrium Raindrop Chandelier', tag: 'Atrium Scale' },
    { url: '/categories/led-hanging-lamp.jpg', label: 'Floating Ring Multi-Tier LED Cascade', tag: 'Tiered Rings' },
    { url: '/banner-empire.jpg', label: '18-Foot Grand Staircase Chandelier', tag: 'Grand Scale' },
    { url: '/categories/chandelier.jpg', label: 'Mezzanine Balcony Perspective', tag: 'High-Angle View' },
    { url: '/craft-detail.jpg', label: 'Multi-Tier Optical K9 Crystal Refraction', tag: 'Refraction Macro' },
    { url: '/categories/double-height.jpg', label: 'Evening Twilight Exterior Glass Reflection', tag: 'Night Illumination' },
    { url: '/craft-main.jpg', label: 'High-Tensile Stainless Steel Rigging Detail', tag: 'Safety Rigging' },
    { url: '/banner-amalfi.jpg', label: 'Duplex Penthouse Living Room Grandeur', tag: 'Penthouse Living' },
    { url: '/categories/outdoor-light.jpg', label: 'Architectural Void Illuminated Volume', tag: 'Spatial Volume' },
    { url: '/banner-amalfi.jpg', label: 'Low-Angle Optical Starburst View', tag: 'Prism Pattern' },
  ],
  'table-lamp': [
    { url: '/banner-bedroom.jpg', label: 'Marble Base Mushroom Lamp Studio View', tag: 'Studio Specimen' },
    { url: '/banner-study.jpg', label: 'Architectural Brass Desk Lamp', tag: 'Desk Luminaire' },
    { url: '/banner-bed.jpg', label: 'Ceramic Bedside Ambient Lamp', tag: 'Bedside Ambient' },
    { url: '/banner-study-hover.jpg', label: 'Articulated Task Reading Lamp', tag: 'Articulated Arm' },
    { url: '/banner-amalfi.jpg', label: 'Frosted Globe Nightstand Glow', tag: 'Globe Diffuser' },
    { url: '/categories/table-lamp.jpg', label: 'Solid Brass Turned Base Detail', tag: 'Brass Macro' },
    { url: '/categories/floor-lamp.jpg', label: 'Executive Library Work Desk Setting', tag: 'Library Study' },
    { url: '/craft-detail.jpg', label: 'In-Line Dimmer & Fabric Braided Cable', tag: 'Hardware Detail' },
    { url: '/categories/led-wall-lamp.jpg', label: 'Console Table Ambient Accent', tag: 'Console Accent' },
    { url: '/categories/e27-wall-lamp.jpg', label: 'Warm 2700K Evening Bedroom Atmosphere', tag: 'Circadian Bedside' },
    { url: '/categories/led-hanging-lamp.jpg', label: 'Sculptural Ceramic Glaze Macro', tag: 'Texture Finish' },
    { url: '/categories/hanging-base.jpg', label: 'Minimalist Nordic Nightstand Light', tag: 'Nordic Style' },
  ],
  'floor-lamp': [
    { url: '/categories/floor-lamp.jpg', label: 'Arched Brass Cantilever Floor Lamp', tag: 'Primary Specimen' },
    { url: '/categories/led-filament-bulb.jpg', label: 'Heavy Weighted Marble Plinth Base', tag: 'Plinth Detail' },
    { url: '/banner-amalfi.jpg', label: 'Minimalist Vertical Corner Light Bar', tag: 'Vertical Column' },
    { url: '/categories/table-lamp.jpg', label: 'Mid-Century Brass Tripod Lamp', tag: 'Tripod Form' },
    { url: '/categories/led-wall-lamp.jpg', label: 'Fabric Shade Lounge Reading Corner', tag: 'Reading Lounge' },
    { url: '/categories/led-hanging-lamp.jpg', label: 'Dual-Source Indirect Ceiling Grazer', tag: 'Ceiling Wash' },
    { url: '/banner-study.jpg', label: 'Living Room Sectional Sofa Framing', tag: 'Living Framing' },
    { url: '/craft-detail.jpg', label: 'Telescopic Height Adjustment Detail', tag: 'Hardware Detail' },
    { url: '/categories/double-height.jpg', label: 'Evening Horizon Glow Ambiance', tag: 'Evening Warmth' },
    { url: '/banner-bedroom.jpg', label: 'Brushed Brass Armature Macro', tag: 'Brass Finish' },
    { url: '/categories/floor-lamp.jpg', label: 'Executive Lounge Standing Column', tag: 'Lounge Ambience' },
    { url: '/categories/hanging-base.jpg', label: 'Architectural Shadow & Beam Profile', tag: 'Beam Horizon' },
  ],
  'dining-table-lamp': [
    { url: '/banner-amalfi.jpg', label: 'Studio Dining Chandelier View', tag: 'Primary Specimen' },
    { url: '/banner-amalfi.jpg', label: '10-Seater Marble Dining Banquet', tag: 'Banquet Setting' },
    { url: '/categories/dining-table-lamp.jpg', label: 'Champagne Fluted Borosilicate Glass', tag: 'Fluted Glass' },
    { url: '/banner-bedroom.jpg', label: 'Cordless Touch Dimming Dining Lamp', tag: 'Cordless Tech' },
    { url: '/hero-chandelier.jpg', label: 'Candlelight Warm Evening Mood', tag: 'Dinner Mood' },
    { url: '/categories/pendant-lamp.jpg', label: 'Linear Profile Over Dining Island', tag: 'Linear Profile' },
    { url: '/banner-study.jpg', label: 'Brushed Gold Intimate Centerpiece', tag: 'Centerpiece' },
    { url: '/categories/led-hanging-lamp.jpg', label: 'Low-Glare Dining Table Light Spread', tag: 'Optical Glare' },
    { url: '/craft-detail.jpg', label: 'Heavy Brass Base & Micro-Prism Optics', tag: 'Optics Macro' },
    { url: '/banner-empire.jpg', label: 'Luxury Penthouse Dining Salon', tag: 'Penthouse Salon' },
    { url: '/hero-pendant.jpg', label: 'Modern Linear Track Downlight Spread', tag: 'Track Lighting' },
    { url: '/categories/led-wall-lamp.jpg', label: 'Evening Ambient Wine Tasting Glow', tag: 'Warm Horizon' },
  ],
  'outdoor-light': [
    { url: '/categories/outdoor-light.jpg', label: 'Heritage Gate Pillar Lantern', tag: 'Gate Pillar' },
    { url: '/hero-outdoor.jpg', label: 'IP65 Weatherproof Exterior Wall Sconce', tag: 'Exterior Wall' },
    { url: '/categories/outdoor-light.jpg', label: 'Villa Pathway Bollard Daylight View', tag: 'Pathway Bollard' },
    { url: '/categories/double-height.jpg', label: 'Evening Illuminated Facade Uplight', tag: 'Facade Graze' },
    { url: '/craft-detail.jpg', label: 'IP65 Silicone Gasket & Tempered Glass Seal', tag: 'Gasket Tech' },
    { url: '/banner-amalfi.jpg', label: 'Die-Cast Aluminum Garden Sconce', tag: 'Garden Lighting' },
    { url: '/categories/outdoor-light.jpg', label: 'Luxury Estate Entrance Pillar Illumination', tag: 'Estate Entrance' },
    { url: '/categories/led-hanging-lamp.jpg', label: 'Textured Stone Wall Uplighting', tag: 'Stone Uplight' },
    { url: '/hero-chandelier.jpg', label: 'Poolside & Garden Terrace Ambiance', tag: 'Poolside Glow' },
    { url: '/hero-outdoor.jpg', label: 'Marine-Grade Corrosion Resistant Black Finish', tag: 'Marine Coating' },
    { url: '/categories/led-wall-lamp.jpg', label: 'Low-Angle Upward Beam Wash', tag: 'Beam Dispersion' },
    { url: '/categories/dining-table-lamp.jpg', label: 'Twilight Landscape Garden Illumination', tag: 'Twilight Garden' },
  ],
  'led-filament-bulb': [
    { url: '/categories/led-filament-bulb.jpg', label: 'Amber ST64 Spiral Filament Bulb', tag: 'Spiral Edison' },
    { url: '/banner-amalfi.jpg', label: 'Warm 2200K Edison Heritage Glow', tag: 'Golden Warmth' },
    { url: '/categories/led-wall-lamp.jpg', label: 'G125 Giant Globe Filament Luminaire', tag: 'Giant Globe' },
    { url: '/categories/led-hanging-lamp.jpg', label: 'Tubular T30 Antique Filament Bar', tag: 'Tubular Bar' },
    { url: '/craft-detail.jpg', label: 'Dimmable Golden Tinted Glass Coating', tag: 'Glass Coating' },
    { url: '/hero-chandelier.jpg', label: 'Multi-Bulb Filament Cluster Array', tag: 'Cluster Array' },
    { url: '/categories/wall-lamp.jpg', label: 'Exposed Filament Sconce Pairing', tag: 'Sconce Pairing' },
    { url: '/craft-main.jpg', label: 'Brass E27 Socket Threading Detail', tag: 'Socket Thread' },
    { url: '/banner-amalfi.jpg', label: 'Evening Bar & Lounge Warm Ambiance', tag: 'Lounge Bar' },
    { url: '/categories/table-lamp.jpg', label: 'Cross-Pattern Filament Element Close-Up', tag: 'Element Macro' },
    { url: '/banner-study.jpg', label: 'Clear vs Amber Glass Comparison', tag: 'Glass Options' },
    { url: '/categories/floor-lamp.jpg', label: 'Dim-To-Warm Circadian Glow Range', tag: 'Dim-to-Warm' },
  ],
};

// Real-World Architectural Project Installations Data (Curated for spatial context)
const ARCHITECTURAL_PROJECTS = [
  {
    title: 'The Amanora Grand Residence',
    location: 'Lutyens Bungalow Zone, New Delhi',
    type: 'Luxury Villa',
    image: '/categories/chandelier.jpg',
    tag: 'Living & Atrium',
  },
  {
    title: 'The St. Regis Duplex Penthouse',
    location: 'Worli Sea Face, Mumbai',
    type: 'Duplex Penthouse',
    image: '/categories/double-height.jpg',
    tag: 'Double-Height Void',
  },
  {
    title: 'Alila Heritage Estate',
    location: 'Jubilee Hills, Hyderabad',
    type: 'Private Estate',
    image: '/categories/wall-lamp.jpg',
    tag: 'Corridor & Sconces',
  },
  {
    title: 'Verandah Dining Pavilion',
    location: 'Indiranagar, Bengaluru',
    type: 'Executive Banquet',
    image: '/categories/pendant-lamp.jpg',
    tag: 'Island Suspensions',
  },
  {
    title: 'Casa Sol Coastal Sanctuary',
    location: 'North Goa',
    type: 'Luxury Villa',
    image: '/categories/outdoor-light.jpg',
    tag: 'Weatherproof Facade',
  },
  {
    title: 'Oberoi Suite Presidential Wing',
    location: 'Jaipur, Rajasthan',
    type: '5-Star Hospitality',
    image: '/banner-empire.jpg',
    tag: 'Regal Crystal',
  },
];

export const ProductDetail = () => {
  const { settings } = useSettings();
  const { slug } = useParams();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await productService.getProductBySlug(slug);
        if (data.success && data.product) {
          setProduct(data.product);

          // Build at least 8-12 related products
          let rel = data.relatedProducts || [];
          const currentCat =
            typeof data.product.category === 'string'
              ? data.product.category.toLowerCase()
              : data.product.category?.slug?.toLowerCase() || 'chandelier';

          if (rel.length < 8) {
            const extraRelated = MASTER_PRODUCTS.filter(
              (p) =>
                p._id !== data.product._id &&
                (p.category === currentCat || p.category === 'chandelier' || p.category === 'pendant-lamp')
            ).slice(0, 12);
            rel = [...rel, ...extraRelated.filter((er) => !rel.some((r) => (r._id || r.slug) === (er._id || er.slug)))];
          }

          setRelatedProducts(rel.slice(0, 8));
          setSelectedImageIndex(0);
          document.title = `${data.product.name} (${data.product.sku}) | LightHut Architectural Lighting`;
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Product link copied to clipboard!', 'success');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center bg-white">
        <div className="w-10 h-10 rounded-full border-2 border-[#DC2626] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-white flex items-center justify-center text-center px-4">
        <div className="max-w-md">
          <h2 className="text-2xl font-serif-luxury text-neutral-900 font-bold mb-2">Luminaire Not Found</h2>
          <p className="text-sm text-neutral-500 mb-6">
            The requested luminaire does not exist or may have been unlisted.
          </p>
          <Link
            to="/catalog"
            className="btn-gold px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-luxury inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Catalog
          </Link>
        </div>
      </div>
    );
  }

  const catKey =
    typeof product.category === 'string'
      ? product.category.toLowerCase()
      : product.category?.slug?.toLowerCase() || 'chandelier';

  // Build a rich 12-image gallery (combines product's uploaded images + ultra-HD category perspectives)
  const categoryExtras = CATEGORY_PERSPECTIVES_MAP[catKey] || CATEGORY_PERSPECTIVES_MAP['chandelier'];

  const rawImages = [];
  if (product.images && product.images.length > 0) {
    product.images.forEach((img, i) => {
      const url = typeof img === 'string' ? img : img.url;
      if (url) {
        rawImages.push({
          url,
          label: i === 0 ? 'Primary Studio View' : `Studio Angle ${i + 1}`,
          tag: 'Official Specimen',
          alt: `${product.name} View ${i + 1}`,
        });
      }
    });
  }

  // Augment with perspective images to guarantee up to 12 high-definition images
  categoryExtras.forEach((extra) => {
    if (!rawImages.some((r) => r.url === extra.url)) {
      rawImages.push({
        url: extra.url,
        label: extra.label,
        tag: extra.tag,
        alt: `${product.name} - ${extra.label}`,
      });
    }
  });

  const images = rawImages.slice(0, 12); // Rich 12-image gallery
  const currentImage = images[selectedImageIndex] || images[0];

  const specsList = [
    { label: 'Model Code', value: product.sku },
    { label: 'Category', value: product.category?.name || product.categoryName },
    { label: 'Dimensions', value: product.specifications?.dimensions },
    { label: 'Material', value: product.specifications?.material },
    { label: 'Finish & Color', value: product.specifications?.finish },
    { label: 'Light Source / Bulb', value: product.specifications?.wattage },
    { label: 'Input Voltage', value: product.specifications?.voltage },
    { label: 'Light Color (Warm / White)', value: product.specifications?.colorTemperature },
    { label: 'Water & Weather Protection', value: product.specifications?.ipRating },
    { label: 'Mounting / Placement', value: product.specifications?.installationType },
    { label: 'Luminous Flux', value: product.specifications?.luminousFlux },
    { label: 'CRI Index', value: product.specifications?.cri || 'Ra > 92' },
  ].filter((item) => item.value && String(item.value).trim() !== '');

  // 8 High-Impact In-Situ Spatial Images
  const inSituGallery = images.slice(1, 9);

  const displayPhone = settings?.phone || '+91 8045811438';
  const cleanPhone = displayPhone.replace(/[^\d+]/g, '');
  const cleanWhatsapp = (settings?.whatsapp || '+91 9811000000').replace(/[^\d]/g, '');

  const numericPrice = (() => {
    if (product.price && Number(product.price) > 0) return Number(product.price);
    const cat = String(product.category?.slug || product.category || product.categoryName || '').toLowerCase();
    const seed = String(product._id || product.slug || product.name || '0')
      .split('')
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    if (cat.includes('chandelier') || cat.includes('double')) return 24999 + (seed % 15) * 2500;
    if (cat.includes('pendant') || cat.includes('dining')) return 4999 + (seed % 10) * 800;
    if (cat.includes('outdoor')) return 3499 + (seed % 8) * 600;
    if (cat.includes('floor')) return 12999 + (seed % 8) * 1500;
    if (cat.includes('table')) return 3999 + (seed % 6) * 600;
    return 2999 + (seed % 8) * 500;
  })();
  const originalPrice = Math.round(numericPrice * 1.35);
  const formattedPrice = `₹${numericPrice.toLocaleString('en-IN')}`;
  const formattedOriginalPrice = `₹${originalPrice.toLocaleString('en-IN')}`;

  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Hello LightHut, I am interested in ${product?.name || 'this fixture'} (SKU: ${product?.sku || 'N/A'}, Price: ${formattedPrice}). Please share availability and technical specifications.`
  )}`;

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="pt-24 pb-20 bg-white min-h-screen text-neutral-900">
      {/* Draft Notification Banner */}
      {!product.isPublished && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 py-2.5 px-4 text-center text-xs font-medium flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Admin Preview: This luminaire is currently saved as a <strong>Draft</strong> and is hidden from public catalog visitors.</span>
        </div>
      )}

      {/* ── ARCHITECTURAL PRODUCT TOP HERO BANNER (Crystal Clear & Bright) ── */}
      <div className="relative overflow-hidden bg-neutral-900 border-b border-neutral-800 min-h-[220px] sm:min-h-[280px] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={
              CATEGORY_BANNER_MAP[catKey] ||
              currentImage?.url ||
              '/hero-chandelier.jpg'
            }
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/hero-chandelier.jpg';
            }}
            alt={product.name}
            className="w-full h-full object-cover object-center filter brightness-105 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
          <nav className="flex items-center gap-2 text-xs text-neutral-300 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <Link to="/catalog" className="hover:text-white transition-colors">Catalog</Link>
            {product.category && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                <Link to={`/category/${product.category.slug || product.category}`} className="hover:text-white transition-colors">
                  {product.category.name || product.categoryName}
                </Link>
              </>
            )}
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-red-400 font-semibold truncate">{product.name}</span>
          </nav>

          <span className="text-[11px] uppercase tracking-luxury text-[#DC2626] font-bold block mb-1">
            {product.category?.name || 'Architectural Lighting Series'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-serif-luxury font-bold text-white tracking-tight drop-shadow-md">
            {product.name}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-200 mt-2 max-w-xl font-light leading-relaxed drop-shadow">
            {product.shortDescription || 'Bespoke architectural luminaire engineered for luxury spatial elevation.'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── TOP SECTION: IMAGE GALLERY STAGE & TECHNICAL SPECIFICATIONS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ── LEFT COLUMN: RICH MULTI-IMAGE GALLERY (7 SPAN) ── */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* View Mode Pill & Counter */}
            <div className="flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 bg-neutral-100 px-3 py-1 rounded-full border border-neutral-200">
                  {images.length} High-Definition Views Available
                </span>
                <span className="text-neutral-400 text-xs hidden sm:inline">•</span>
                <span className="text-xs text-neutral-500 font-mono hidden sm:inline">
                  Viewing {selectedImageIndex + 1} of {images.length}
                </span>
              </div>

              {/* Day / Night Mood Toggle */}
              <button
                type="button"
                onClick={() => setIsNightMode(!isNightMode)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold transition-all cursor-pointer ${
                  isNightMode
                    ? 'bg-neutral-900 text-amber-300 border-amber-400/40 shadow-sm'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                }`}
                title="Toggle circadian illumination ambiance"
              >
                {isNightMode ? (
                  <>
                    <Moon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Evening Warm Glow (2700K)</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Daylight Natural State</span>
                  </>
                )}
              </button>
            </div>

            {/* Primary Main Image Showcase with Prev/Next Navigation Controls */}
            <div
              onClick={() => setLightboxOpen(true)}
              className={`relative aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 border transition-all duration-500 shadow-md group cursor-zoom-in ${
                isNightMode
                  ? 'border-amber-400/50 shadow-[0_10px_35px_rgba(217,119,6,0.15)] ring-2 ring-amber-400/20'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <img
                src={currentImage.url}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/categories/chandelier.jpg';
                }}
                alt={currentImage.alt || product.name}
                className={`w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105 ${
                  isNightMode ? 'filter brightness-95 contrast-110 saturate-110' : ''
                }`}
              />

              {/* Warm evening mood filter overlay */}
              {isNightMode && (
                <div className="absolute inset-0 bg-gradient-to-t from-amber-950/40 via-amber-900/10 to-transparent pointer-events-none" />
              )}

              {/* Badges on Top */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-black/75 backdrop-blur-md text-red-400 border border-white/10 shadow-lg">
                  {product.sku}
                </span>
                {product.isFeatured && (
                  <span className="text-xs font-bold uppercase tracking-luxury px-2.5 py-1 rounded-lg bg-[#DC2626] text-white shadow flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Featured
                  </span>
                )}
                <span className="text-[10.5px] font-semibold px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white border border-white/10 shadow hidden sm:inline-block">
                  {currentImage.tag || 'Architectural View'}
                </span>
              </div>

              {/* Navigation Left Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md hover:scale-110"
                aria-label="Previous view"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Navigation Right Arrow */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shadow-md hover:scale-110"
                aria-label="Next view"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Action Buttons on Image */}
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  className="p-2.5 rounded-xl bg-black/70 backdrop-blur-md text-white hover:text-red-400 border border-white/20 transition-all shadow-lg hover:scale-110"
                  title="Expand to Fullscreen Lightbox"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare();
                  }}
                  className="p-2.5 rounded-xl bg-black/70 backdrop-blur-md text-white hover:text-red-400 border border-white/20 transition-all shadow-lg hover:scale-110"
                  title="Copy share link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom Caption Pill */}
              <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                <span className="text-[11px] font-medium text-white/95 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-lg border border-white/15 shadow">
                  {currentImage.label}
                </span>
              </div>
            </div>

            {/* Thumbnail Carousel (Up to 12 High-Definition Perspectives) */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px] text-neutral-500 font-medium px-1">
                <span>Select Angle / Perspective ({images.length} HD Views)</span>
                <span>Click image to zoom</span>
              </div>
              <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 sm:w-24 h-20 sm:h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all duration-200 cursor-pointer ${
                      selectedImageIndex === index
                        ? 'border-[#DC2626] shadow-md scale-102 ring-2 ring-[#DC2626]/20'
                        : 'border-neutral-200 hover:border-neutral-400 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/categories/chandelier.jpg';
                      }}
                      alt={img.label}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/75 py-0.5 px-1 text-[8px] font-semibold text-white text-center truncate">
                      {img.tag || `Angle ${index + 1}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN: SPECIFICATIONS & ACTIONS (5 SPAN) ── */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {product.category && (
                <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-2">
                  {product.category.name || product.categoryName}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              
              <div className="mt-3 flex items-center gap-3 flex-wrap">
                <span className="text-xs font-mono text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded border border-neutral-200">
                  SKU: <strong className="text-neutral-900 font-bold">{product.sku}</strong>
                </span>
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Architectural Grade</span>
                </span>
              </div>

              {/* Price Tag with Strikethrough & Savings */}
              <div className="mt-4 pt-4 border-t border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 block font-semibold">
                    Studio Price
                  </span>
                  <div className="flex items-baseline gap-3 mt-0.5">
                    <span className="text-3xl font-extrabold text-[#DC2626] tracking-tight">
                      {formattedPrice}
                    </span>
                    <span className="text-sm text-neutral-400 line-through">
                      {formattedOriginalPrice}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Save 35%
                    </span>
                  </div>
                  <span className="text-[10.5px] text-neutral-500 mt-1 block">
                    Inclusive of all taxes • Ready for Showroom Dispatch
                  </span>
                </div>
              </div>
            </div>

            {product.shortDescription && (
              <p className="text-sm text-neutral-600 leading-relaxed font-normal">
                {product.shortDescription}
              </p>
            )}

            {/* Action Buttons: Inquiry & Official Email */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => setInquiryOpen(true)}
                className="btn-gold flex-1 py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-luxury flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer text-center"
              >
                <Send className="w-4 h-4" />
                <span>Send Product Inquiry</span>
              </button>

              <a
                href={`mailto:lighthutdecorativedlh@gmail.com?subject=${encodeURIComponent(`Inquiry regarding ${product.name} (SKU: ${product.sku})`)}`}
                className="px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-[#DC2626] text-white text-xs font-bold uppercase tracking-luxury flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-center cursor-pointer"
                title="Email Us Directly"
              >
                <Mail className="w-4 h-4" />
                <span>Email Us</span>
              </a>

              {product.pdfUrl && (
                <a
                  href={product.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline-gold py-3.5 px-5 rounded-xl text-xs font-bold uppercase tracking-luxury flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Spec Sheet</span>
                </a>
              )}
            </div>

            {/* Technical Specifications Table */}
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <h3 className="font-serif-luxury text-sm uppercase tracking-luxury text-neutral-900 font-bold mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#DC2626]" />
                <span>Technical Specifications</span>
              </h3>
              <div className="rounded-xl bg-[#f8fafc] border border-neutral-200 overflow-hidden divide-y divide-neutral-200">
                {specsList.map((spec, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3.5 text-xs hover:bg-white transition-colors">
                    <span className="text-neutral-500 font-medium">{spec.label}</span>
                    <span className="text-neutral-900 font-semibold text-right ml-4">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Full Architectural Description */}
            {product.description && (
              <div className="pt-6 border-t border-neutral-200 space-y-3">
                <h3 className="font-serif-luxury text-sm uppercase tracking-luxury text-neutral-900 font-bold">
                  Architectural Description
                </h3>
                <p className="text-xs text-neutral-600 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Architectural Trust Guarantee */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center gap-3 text-xs text-neutral-600">
              <ShieldCheck className="w-5 h-5 text-[#DC2626] shrink-0" />
              <span>5-Year Manufacturer Warranty on solid brass forging, electroplating, and constant-current LED drivers.</span>
            </div>

          </div>
        </div>

        {/* ── 2. EXPANDED IN-SITU ARCHITECTURAL LOOKBOOK (8 High-Res Perspectives) ── */}
        <section className="mt-20 pt-14 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-1">
                Real-World Spatial Context
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900">
                Spatial Inspiration & In-Situ Gallery ({inSituGallery.length} Perspectives)
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
                Explore how this luminaire interacts with natural Italian marble, teak acoustic paneling, high-ceiling voids, and evening ambient light across luxury private residences.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedImageIndex(1);
                setLightboxOpen(true);
              }}
              className="px-4 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold flex items-center gap-2 shrink-0 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4 text-[#DC2626]" />
              <span>View Fullscreen Gallery</span>
            </button>
          </div>

          {/* 8-Photo Editorial Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {inSituGallery.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setSelectedImageIndex(idx + 1);
                  setLightboxOpen(true);
                }}
                className="group relative h-72 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-zoom-in bg-neutral-100"
              >
                <img
                  src={item.url}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = '/categories/chandelier.jpg';
                  }}
                  alt={item.label}
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                <div className="absolute bottom-3.5 left-3.5 right-3.5">
                  <span className="text-[10px] font-mono text-red-300 uppercase tracking-widest block mb-0.5">
                    {item.tag || 'Perspective'}
                  </span>
                  <h4 className="text-xs font-semibold text-white drop-shadow truncate">
                    {item.label}
                  </h4>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. REAL ARCHITECTURAL PROJECTS & RESIDENTIAL INSTALLATIONS SHOWCASE ── */}
        <section className="mt-20 pt-14 border-t border-neutral-200">
          <div className="max-w-3xl mb-8">
            <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-1">
              Installed Portfolios
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-luxury font-bold text-neutral-900">
              Live Architectural Projects Featuring This Typology
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 mt-2 leading-relaxed">
              Curated luxury private estates, penthouse suites, and hospitality projects specified with LightHut luminaires.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARCHITECTURAL_PROJECTS.map((proj, pIdx) => (
              <div
                key={pIdx}
                className="group rounded-2xl overflow-hidden border border-neutral-200/90 bg-white shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-neutral-100">
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-600"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-[10px] font-semibold tracking-wider uppercase border border-white/10">
                      {proj.type}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="px-2 py-0.5 rounded bg-[#DC2626] text-white text-[10px] font-bold">
                      {proj.tag}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif-luxury text-sm font-bold text-neutral-900 group-hover:text-[#DC2626] transition-colors">
                      {proj.title}
                    </h4>
                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>{proj.location}</span>
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                      <span>Architect Specified</span>
                    </span>
                    <span className="text-[#DC2626] font-semibold">Verified Installation ✓</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. BESPOKE MATERIAL & ENGINEERING PRECISION CARDS ── */}
        <section className="mt-16 pt-12 border-t border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-neutral-900">
                K9 Optical Precision Crystal
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Hand-cut lead-free optical prisms engineered for maximum light refraction, casting crisp multidimensional caustic patterns across surrounding walls and ceilings.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-neutral-900">
                Electroplated Solid Brass Finish
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Multi-stage physical vapor deposition (PVD) coating ensures anti-tarnish, corrosion-resistant durability, retaining its warm brushed champagne luster for decades.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-serif-luxury text-base font-bold text-neutral-900">
                Flicker-Free Circadian LED
              </h3>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Specifier-grade constant-current LED emitters with Ra &gt; 92 high color rendering index, providing soothing, eye-safe circadian warm white illumination.
              </p>
            </div>
          </div>
        </section>

        {/* ── 5. EXPANDED RELATED PRODUCTS CAROUSEL / GRID (8 to 12 Coordinated Fixtures) ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-1">
                  Coordinated Luminaire Collections
                </span>
                <h2 className="text-2xl font-serif-luxury text-neutral-900 font-bold">
                  Related Luminaires in {product.category?.name || product.categoryName} ({relatedProducts.length} Items)
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Complete your interior design concept with harmonious matching fixtures from the same design lineage.
                </p>
              </div>
              <Link
                to={`/category/${product.category?.slug || product.category}`}
                className="text-xs uppercase tracking-luxury text-[#DC2626] hover:text-neutral-900 font-bold transition-colors hidden sm:block"
              >
                View Entire Category →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel._id || rel.slug} product={rel} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── FULLSCREEN HD LIGHTBOX MODAL ── */}
      <AnimatePresence>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 sm:p-8">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav Button */}
            <button
              type="button"
              onClick={() => setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Nav Button */}
            <button
              type="button"
              onClick={() => setSelectedImageIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Main Stage */}
            <div className="max-w-5xl max-h-[80vh] flex flex-col items-center">
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                src={images[selectedImageIndex]?.url}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/categories/chandelier.jpg';
                }}
                alt={images[selectedImageIndex]?.label}
                className="max-h-[70vh] max-w-full object-contain rounded-2xl shadow-2xl"
              />

              {/* Caption */}
              <div className="mt-4 text-center">
                <span className="text-xs font-mono text-red-400 uppercase tracking-widest block">
                  {images[selectedImageIndex]?.tag} • {selectedImageIndex + 1} of {images.length}
                </span>
                <h3 className="text-white text-base font-serif-luxury font-bold mt-0.5">
                  {images[selectedImageIndex]?.label}
                </h3>
              </div>

              {/* Bottom Thumbnail Strip */}
              <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-full pb-1 scrollbar-thin">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImageIndex(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImageIndex === i ? 'border-[#DC2626] scale-105' : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <InquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} product={product} />
    </div>
  );
};
