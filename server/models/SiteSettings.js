import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      default: 'M/S LIGHT-HUT DECORATIVE SOLUTIONS',
    },
    tagline: {
      type: String,
      default: 'Architectural & Luxury Decorative Luminaires',
    },
    logo: {
      type: String,
      default: '',
    },
    favicon: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      default: 'lighthutdecorativedlh@gmail.com',
    },
    phone: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: 'C37/4, LAWRENCE ROAD, INDUSTRIAL AREA, NEW DELHI -110035 (Near Metro Station Kanhaiya Nagar)',
    },
    mapUrl: {
      type: String,
      default: 'https://maps.google.com/maps?q=28.678613662719727%2C77.15131378173828&z=17&hl=en',
    },
    whatsapp: {
      type: String,
      default: '',
    },
    socialLinks: {
      instagram: { type: String, default: 'https://www.instagram.com/lighthutdecorativesolutions/' },
      facebook: { type: String, default: 'https://facebook.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      pinterest: { type: String, default: 'https://pinterest.com' },
      youtube: { type: String, default: '' },
    },
    footerContent: {
      copyrightText: {
        type: String,
        default: '© 2026 LightHut Decorative Solutions. All Rights Reserved.',
      },
      aboutText: {
        type: String,
        default: 'Pioneering contemporary architectural lighting solutions, precision engineered luminaires, and tailored illumination for luxury residential and commercial environments.',
      },
      gstNumber: {
        type: String,
        default: '07BSYPK8425N1ZP',
      }
    },
    defaultSeoTitle: {
      type: String,
      default: 'LightHut | Premium Architectural & Decorative Lighting Manufacturer',
    },
    defaultSeoDescription: {
      type: String,
      default: 'Discover high-performance architectural wall lamps, pendant luminaires, modern table lamps, and custom lighting fixtures engineered for premier spaces.',
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings = mongoose.model('SiteSettings', siteSettingsSchema);
export default SiteSettings;
