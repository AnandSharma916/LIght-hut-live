import React, { createContext, useContext, useState, useEffect } from 'react';
import { settingsService } from '../services/api';

const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    companyName: 'M/S LIGHT-HUT DECORATIVE SOLUTIONS',
    tagline: 'Luxury Designer Lamps & Premium Home Lighting',
    logo: '/categories/logo.png',
    favicon: '/favicon.svg',
    email: 'lighthutdecorativedlh@gmail.com',
    phone: '',
    address: 'C37/4, LAWRENCE ROAD, INDUSTRIAL AREA, NEW DELHI -110035 (Near Metro Station Kanhaiya Nagar)',
    mapUrl: 'https://maps.google.com/maps?q=28.678613662719727%2C77.15131378173828&z=17&hl=en',
    mapEmbedUrl: 'https://maps.google.com/maps?q=28.678613662719727,77.15131378173828&hl=en&z=17&output=embed',
    whatsapp: '',
    socialLinks: {
      instagram: 'https://www.instagram.com/lighthutdecorativesolutions/',
      facebook: 'https://facebook.com',
      linkedin: 'https://linkedin.com',
      pinterest: 'https://pinterest.com',
    },
    footerContent: {
      copyrightText: '© 2026 M/S LIGHT-HUT DECORATIVE SOLUTIONS. All Rights Reserved.',
      aboutText: 'Crafting luxury designer lamps, ambient pendants, chandeliers, and premium lighting fixtures to elevate modern homes across India.',
      gstNumber: '07BSYPK8425N1ZP',
    },
    defaultSeoTitle: 'Luxury Designer Lamps & Premium Home Lighting',
    defaultSeoDescription: 'Explore luxury designer lamps, ambient pendant lights, modern chandeliers, and artisanal fixtures for elegant living spaces.',
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      if (data.success && data.settings) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.warn('Could not fetch remote site settings, using defaults.', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
