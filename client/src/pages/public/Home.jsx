import React, { useState, useEffect, useMemo } from 'react';
import { homepageService } from '../../services/api';
import { HeroSection } from '../../components/home/HeroSection';
import { CategoriesSection } from '../../components/home/CategoriesSection';
import { AboutSection } from '../../components/home/AboutSection';
import { FeaturedProductsSection } from '../../components/home/FeaturedProductsSection';
import { ProjectsSection } from '../../components/home/ProjectsSection';
import { CTASection } from '../../components/home/CTASection';
import { ContactSection } from '../../components/home/ContactSection';
import { useSettings } from '../../context/SettingsContext';
import { ExploreProductRangeSection } from '../../components/home/ExploreProductRangeSection';
import { CuratedSpacesLookbook } from '../../components/home/CuratedSpacesLookbook';
import { CategoryBannersGrid } from '../../components/home/CategoryBannersGrid';
import { OurWorkShowcaseSection } from '../../components/home/OurWorkShowcaseSection';
import { OurInstagramShowcaseSection } from '../../components/home/OurInstagramShowcaseSection';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

// Streamlined homepage sections: concise luxury flow with both carousels permanently present
const FALLBACK_SECTIONS = [
  { sectionKey: 'hero', name: 'Hero' },
  { sectionKey: 'explore_range', name: 'Explore Product Range' },
  { sectionKey: 'featured_products', name: 'Featured Products' },
  { sectionKey: 'spaces_lookbook', name: 'Curated Spaces Lookbook' },
  { sectionKey: 'about', name: 'About' },
  { sectionKey: 'our_work', name: 'Our Work' },
  { sectionKey: 'projects', name: 'Projects' },
  { sectionKey: 'instagram', name: 'Our Instagram' },
  { sectionKey: 'contact', name: 'Contact Us' },
  { sectionKey: 'cta', name: 'CTA' },
];

export const Home = () => {
  const { settings } = useSettings();
  // Initialize with fallback sections so page renders immediately with ZERO white flash
  const [sections, setSections] = useState(FALLBACK_SECTIONS);

  // Set document title
  useEffect(() => {
    document.title = settings?.defaultSeoTitle || 'Luxury Designer Lamps & Architectural Lighting';
  }, [settings]);

  useEffect(() => {
    let isMounted = true;
    const fetchSections = async () => {
      try {
        const data = await homepageService.getHomepage();
        if (isMounted && data && data.success && Array.isArray(data.sections) && data.sections.length > 0) {
          setSections(data.sections);
        }
      } catch (err) {
        console.warn('Using default luxury layout sections:', err);
      }
    };

    fetchSections();
    return () => {
      isMounted = false;
    };
  }, []);

  // Component mapping by sectionKey (wrapped in ErrorBoundary so one failure cannot break others)
  const renderSection = (section) => {
    let content = null;
    switch (section.sectionKey) {
      case 'hero':
        content = (
          <React.Fragment key={section._id || 'hero'}>
            <HeroSection section={section} />
            <CategoryBannersGrid />
          </React.Fragment>
        );
        break;
      case 'explore_range':
      case 'categories':
        // The continuous smooth auto-scrolling category carousel
        content = <ExploreProductRangeSection key={section._id || 'explore_range'} section={section} />;
        break;
      case 'spaces_lookbook':
        // Editorial duet banner + 4-column curated spaces carousel
        content = <CuratedSpacesLookbook key={section._id || 'spaces_lookbook'} section={section} />;
        break;
      case 'about':
        content = <AboutSection key={section._id || 'about'} section={section} />;
        break;
      case 'our_work':
        content = <OurWorkShowcaseSection key={section._id || 'our_work'} />;
        break;
      case 'featured_products':
        content = <FeaturedProductsSection key={section._id || 'featured'} section={section} />;
        break;
      case 'projects':
        content = <ProjectsSection key={section._id || 'projects'} section={section} />;
        break;
      case 'instagram':
        content = <OurInstagramShowcaseSection key={section._id || 'instagram'} />;
        break;
      case 'cta':
        // The above-footer section is now rendered seamlessly directly atop the footer in Footer.jsx
        return null;
      case 'contact':
        content = <ContactSection key={section._id || 'contact'} section={section} />;
        break;
      default:
        return null;
    }

    return (
      <ErrorBoundary key={section._id || section.sectionKey}>
        {content}
      </ErrorBoundary>
    );
  };

  // Ensure all luxury showcase sections (Our Work, Instagram, Contact Us, and carousels)
  // are ALWAYS included in the homepage layout even when backend API returns default seed
  const sectionsToRender = useMemo(() => {
    if (sections && sections.length > 0) {
      const list = [];
      const hasSpaces = sections.some((s) => s.sectionKey === 'spaces_lookbook');
      const hasOurWork = sections.some((s) => s.sectionKey === 'our_work');
      const hasInstagram = sections.some((s) => s.sectionKey === 'instagram');
      const hasContact = sections.some((s) => s.sectionKey === 'contact');

      for (const s of sections) {
        if (s.sectionKey === 'categories') {
          // Render the high-end smooth auto-scrolling category carousel
          list.push({ ...s, sectionKey: 'explore_range' });
        } else if (s.sectionKey === 'featured_products') {
          list.push(s);
          // Insert Curated Spaces Lookbook carousel right after featured products
          if (!hasSpaces) {
            list.push({ sectionKey: 'spaces_lookbook', name: 'Curated Spaces Lookbook' });
          }
        } else if (s.sectionKey === 'about') {
          list.push(s);
          // Insert Our Work showcase right after About
          if (!hasOurWork) {
            list.push({ sectionKey: 'our_work', name: 'Our Work' });
          }
        } else if (s.sectionKey === 'projects') {
          list.push(s);
          // Insert Instagram showcase right after Projects
          if (!hasInstagram) {
            list.push({ sectionKey: 'instagram', name: 'Our Instagram' });
          }
        } else if (s.sectionKey !== 'lighting_studio') {
          list.push(s);
        }
      }

      // Ensure explore_range is present
      if (!list.some((s) => s.sectionKey === 'explore_range')) {
        const heroIdx = list.findIndex((s) => s.sectionKey === 'hero');
        list.splice(heroIdx + 1, 0, { sectionKey: 'explore_range', name: 'Explore Product Range' });
      }

      // Ensure spaces_lookbook is present
      if (!list.some((s) => s.sectionKey === 'spaces_lookbook')) {
        list.push({ sectionKey: 'spaces_lookbook', name: 'Curated Spaces Lookbook' });
      }

      // Ensure our_work is present
      if (!list.some((s) => s.sectionKey === 'our_work')) {
        list.push({ sectionKey: 'our_work', name: 'Our Work' });
      }

      // Ensure instagram is present
      if (!list.some((s) => s.sectionKey === 'instagram')) {
        list.push({ sectionKey: 'instagram', name: 'Our Instagram' });
      }

      // Ensure contact form is present on homepage
      if (!list.some((s) => s.sectionKey === 'contact')) {
        list.push({ sectionKey: 'contact', name: 'Contact Us' });
      }

      return list;
    }

    return FALLBACK_SECTIONS;
  }, [sections]);

  return (
    <div className="relative bg-white text-neutral-900 min-h-screen">
      {sectionsToRender.map((section) => renderSection(section))}
    </div>
  );
};
