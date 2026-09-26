import React, { useState, useEffect, useMemo } from 'react';
import { homepageService } from '../../services/api';
import { HeroSection } from '../../components/home/HeroSection';
import { AboutSection } from '../../components/home/AboutSection';
import { ProjectsSection } from '../../components/home/ProjectsSection';
import { ContactSection } from '../../components/home/ContactSection';
import { useSettings } from '../../context/SettingsContext';
import { ExploreProductRangeSection } from '../../components/home/ExploreProductRangeSection';
import { CuratedSpacesLookbook } from '../../components/home/CuratedSpacesLookbook';
import { CategoryBannersGrid } from '../../components/home/CategoryBannersGrid';
import { OurInstagramShowcaseSection } from '../../components/home/OurInstagramShowcaseSection';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';

// Streamlined homepage sections: excluded "MOST LOVED DESIGNS" and "Our Work" as requested
const FALLBACK_SECTIONS = [
  { sectionKey: 'hero', name: 'Hero' },
  { sectionKey: 'explore_range', name: 'Explore Product Range' },
  { sectionKey: 'spaces_lookbook', name: 'Curated Spaces Lookbook' },
  { sectionKey: 'about', name: 'About' },
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
      case 'projects':
        content = <ProjectsSection key={section._id || 'projects'} section={section} />;
        break;
      case 'instagram':
        content = <OurInstagramShowcaseSection key={section._id || 'instagram'} />;
        break;
      case 'cta':
        // The above-footer section is rendered seamlessly directly atop the footer in Footer.jsx
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

  // Compute final sections: explicit removal of MOST LOVED DESIGNS (featured_products) and our_work on homepage
  const sectionsToRender = useMemo(() => {
    if (sections && sections.length > 0) {
      const list = [];
      const hasSpaces = sections.some((s) => s.sectionKey === 'spaces_lookbook');
      const hasInstagram = sections.some((s) => s.sectionKey === 'instagram');

      for (const s of sections) {
        // Exclude MOST LOVED DESIGNS (featured_products) and our_work from homepage
        if (s.sectionKey === 'featured_products' || s.sectionKey === 'our_work' || s.sectionKey === 'lighting_studio') {
          continue;
        }

        if (s.sectionKey === 'categories') {
          list.push({ ...s, sectionKey: 'explore_range' });
          if (!hasSpaces) {
            list.push({ sectionKey: 'spaces_lookbook', name: 'Curated Spaces Lookbook' });
          }
        } else if (s.sectionKey === 'projects') {
          list.push(s);
          if (!hasInstagram) {
            list.push({ sectionKey: 'instagram', name: 'Our Instagram' });
          }
        } else {
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
        const rangeIdx = list.findIndex((s) => s.sectionKey === 'explore_range');
        list.splice(rangeIdx + 1, 0, { sectionKey: 'spaces_lookbook', name: 'Curated Spaces Lookbook' });
      }

      // Ensure instagram is present
      if (!list.some((s) => s.sectionKey === 'instagram')) {
        list.push({ sectionKey: 'instagram', name: 'Our Instagram' });
      }

      // Ensure contact form is present on homepage
      if (!list.some((s) => s.sectionKey === 'contact')) {
        list.push({ sectionKey: 'contact', name: 'Contact Us' });
      }

      // Final strict filter guaranteeing exclusion of both sections
      return list.filter(
        (s) => s.sectionKey !== 'featured_products' && s.sectionKey !== 'our_work'
      );
    }

    return FALLBACK_SECTIONS;
  }, [sections]);

  return (
    <div className="relative bg-white text-neutral-900 min-h-screen">
      {sectionsToRender.map((section) => renderSection(section))}
    </div>
  );
};
