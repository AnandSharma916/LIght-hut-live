import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Sparkles,
  X,
  Lightbulb,
  Layers,
  Download,
  Home,
  Check,
} from 'lucide-react';
import { catalogService, productService } from '../../services/api';
import { ProductCard } from '../../components/catalog/ProductCard';
import { useSettings } from '../../context/SettingsContext';
import { CascadingCategoryDropdown, PRODUCT_CATEGORIES_DATA } from '../../components/common/CascadingCategoryDropdown';
import { MASTER_CATEGORIES } from '../../data/catalogData';

export const Catalog = () => {
  const { settings } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(MASTER_CATEGORIES);
  const [activeCategoryMeta, setActiveCategoryMeta] = useState(null);
  const [allTotal, setAllTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // URL Query Params
  const currentCategory = searchParams.get('category') || 'all';
  const currentSub = searchParams.get('sub') || '';
  const currentSearch = searchParams.get('search') || '';
  const currentSort = searchParams.get('sort') || 'sortOrder';
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentFeatured = searchParams.get('featured') || '';

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(currentSearch);
  const [catalogDropdownOpen, setCatalogDropdownOpen] = useState(false);

  // Document Title
  useEffect(() => {
    document.title = `Lamps & Lighting Catalog | ${settings.companyName || 'LightHut Decorative Solutions'}`;
  }, [settings.companyName]);

  // Scroll to top on filter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage, currentCategory, currentSub]);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  // Fetch catalog data from backend
  useEffect(() => {
    let isMounted = true;

    const fetchCatalogData = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 24,
          sort: currentSort,
          category: currentCategory !== 'all' ? currentCategory : undefined,
          search: currentSearch.trim() !== '' ? currentSearch.trim() : undefined,
          featured: currentFeatured !== '' ? currentFeatured : undefined,
          sub: currentSub !== '' ? currentSub : undefined,
        };

        const data = await catalogService.getCatalog(params);

        if (isMounted) {
          if (data && data.success) {
            setProducts(data.products || []);
            setTotalProducts(data.pagination?.total ?? data.products?.length ?? 0);
            setTotalPages(data.pagination?.totalPages || 1);
            if (data.categories && data.categories.length > 0) {
              setCategories(data.categories);
            }
            if (data.allTotal !== undefined) {
              setAllTotal(data.allTotal);
            }
            if (data.activeCategory) {
              setActiveCategoryMeta(data.activeCategory);
            }
          } else {
            // Graceful fallback to standard product API
            const fallback = await productService.getProducts(params);
            if (fallback && fallback.success) {
              setProducts(fallback.products || []);
              setTotalProducts(fallback.total || fallback.products?.length || 0);
              setTotalPages(fallback.totalPages || 1);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching catalog data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCatalogData();

    return () => {
      isMounted = false;
    };
  }, [currentCategory, currentSub, currentSearch, currentSort, currentPage, currentFeatured]);

  // Filter products by active subcategory if selected
  const displayedProducts = useMemo(() => {
    if (!currentSub) return products;
    const target = currentSub.toLowerCase();
    const filtered = products.filter((p) => {
      const pSub = String(p.subcategory || p.subCategory || '').toLowerCase();
      const pSlug = String(p.slug || '').toLowerCase();
      const pName = String(p.name || '').toLowerCase();
      return pSub.includes(target) || target.includes(pSub) || pSlug.includes(target) || pName.includes(target);
    });
    return filtered.length > 0 ? filtered : products;
  }, [products, currentSub]);

  // Active Category Information (Computed with backend priority)
  const activeCategoryData = useMemo(() => {
    if (activeCategoryMeta && (activeCategoryMeta.slug === currentCategory || currentCategory === 'all')) {
      return {
        name: activeCategoryMeta.name || 'All Architectural Lighting',
        tag: activeCategoryMeta.tag || 'Complete Lighting Portfolio',
        description:
          activeCategoryMeta.description ||
          'Explore our complete portfolio of handcrafted chandeliers, suspended pendants, bi-directional wall sconces, and modular architectural systems.',
        image: activeCategoryMeta.heroImage || '/showroom-hero-hd.jpg',
        total: activeCategoryMeta.total ?? totalProducts,
      };
    }

    if (!currentCategory || currentCategory === 'all') {
      return {
        name: 'All Architectural Lighting',
        tag: 'Complete Lighting Portfolio',
        description:
          'Explore our complete portfolio of handcrafted chandeliers, suspended pendants, bi-directional wall sconces, and modular architectural systems.',
        image: '/showroom-hero-hd.jpg',
        total: allTotal || totalProducts,
      };
    }

    // Search in current categories
    const found = categories.find((c) => c.slug === currentCategory);
    if (found) {
      return {
        name: found.name,
        tag: found.tag || 'Curated Architectural Series',
        description:
          found.description ||
          'Engineered with museum-grade color rendering, precision optics, and architectural craftsmanship.',
        image: found.image || '/showroom-hero-hd.jpg',
        total: found.total ?? totalProducts,
      };
    }

    // Check subcategories
    for (const cat of categories) {
      const sub = cat.subcategories?.find((s) => s.slug === currentCategory);
      if (sub) {
        return {
          name: sub.name,
          tag: `${cat.name} • Precision Luminaire`,
          description: `Architectural ${sub.name.toLowerCase()} engineered for modern residential and luxury hospitality spaces.`,
          image: cat.image || '/showroom-hero-hd.jpg',
          total: sub.count ?? totalProducts,
        };
      }
    }

    return {
      name: currentCategory.replace(/-/g, ' ').toUpperCase(),
      tag: 'Architectural Luminaire Series',
      description: 'Engineered with museum-grade color rendering, precision optics, and architectural craftsmanship.',
      image: '/showroom-hero-hd.jpg',
      total: totalProducts,
    };
  }, [activeCategoryMeta, currentCategory, categories, allTotal, totalProducts]);

  // Update URL Query Parameters Helper
  const updateQuery = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, val]) => {
      if (val === undefined || val === '' || val === 'all') {
        newParams.delete(key);
      } else {
        newParams.set(key, val);
      }
    });
    // Reset to page 1 on filter/search change unless page is explicitly changed
    if (!updates.page) {
      newParams.delete('page');
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQuery({ search: searchInput });
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  // Printable Catalog PDF Brochure Generator
  const handleDownloadCatalog = () => {
    const printWindow = window.open('', '_blank');
    const categoryTitle = activeCategoryData?.name || 'All Lighting Collections';
    const fixtureList = products && products.length > 0 ? products : [];

    const productsHtml = fixtureList
      .map(
        (p) => `
        <div style="break-inside: avoid; page-break-inside: avoid; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; padding: 12px; background: #ffffff; display: flex; flex-direction: column;">
          <img src="${p.primaryImage || p.images?.[0]?.url || '/showroom-hero-hd.jpg'}" style="width: 100%; height: 180px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" alt="${p.name}" />
          <div style="font-size: 10px; color: #DC2626; font-weight: bold; text-transform: uppercase;">${p.categoryName || p.category?.name || 'Architectural Luminaire'}</div>
          <div style="font-size: 13px; font-weight: bold; color: #111827; margin: 3px 0 6px 0;">${p.name}</div>
          <div style="font-size: 10px; color: #4b5563; line-height: 1.5; border-top: 1px solid #f3f4f6; padding-top: 6px; margin-top: auto;">
            ${p.sku ? `<div><strong>SKU:</strong> ${p.sku}</div>` : ''}
            ${p.specifications?.finish ? `<div><strong>Finish:</strong> ${p.specifications.finish}</div>` : ''}
            ${p.specifications?.colorTemperature ? `<div><strong>CCT:</strong> ${p.specifications.colorTemperature}</div>` : ''}
            ${p.specifications?.material ? `<div><strong>Material:</strong> ${p.specifications.material}</div>` : ''}
          </div>
        </div>
      `
      )
      .join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${categoryTitle} - LightHut Decorative Solutions Catalog</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
            body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 25px; color: #111827; background: #ffffff; }
            .header { border-bottom: 2px solid #111827; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            h1 { font-family: 'Playfair Display', serif; font-size: 24px; margin: 0 0 4px 0; color: #111827; }
            .sub { font-size: 12px; color: #6b7280; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
            .footer { margin-top: 30px; padding-top: 12px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #6b7280; display: flex; justify-content: space-between; }
            @media print {
              body { padding: 10px; }
              @page { size: A4; margin: 10mm; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1>LIGHTHUT DECORATIVE SOLUTIONS</h1>
              <div class="sub">Collection: <strong>${categoryTitle}</strong> • ${fixtureList.length} Fixtures</div>
            </div>
            <div style="text-align: right; font-size: 10px; color: #6b7280;">
              <div>LightHut Luxury Architectural Lighting</div>
              <div>Catalog Date: ${new Date().toLocaleDateString()}</div>
            </div>
          </div>
          <div class="grid">
            ${productsHtml}
          </div>
          <div class="footer">
            <div><strong>LightHut Decorative Solutions</strong> • All Rights Reserved</div>
            <div>Direct Inquiries: sales@lighthut.com</div>
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 400);
            };
          </script>
        </body>
      </html>
    `;

    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      window.print();
    }
  };

  return (
    <div className="pt-24 pb-20 bg-[#f8fafc] min-h-screen">
      
      {/* ── Breadcrumb & Top Navigation Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-2">
        <nav className="flex items-center gap-2 text-xs text-neutral-500 py-1" aria-label="Breadcrumb">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-neutral-900 transition-colors">
            <Home className="w-3.5 h-3.5 text-neutral-400" />
            <span>Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <button
            type="button"
            onClick={() => updateQuery({ category: 'all' })}
            className={`cursor-pointer transition-colors ${
              currentCategory === 'all' ? 'text-neutral-900 font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Catalog
          </button>
          {currentCategory !== 'all' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              <span className="text-[#DC2626] font-semibold">{activeCategoryData.name}</span>
            </>
          )}
        </nav>
      </div>

      {/* ── Dynamic Category Hero Banner ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="relative rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-200/80 shadow-md">
          {/* Background Category Image */}
          <div className="absolute inset-0">
            <img
              src={activeCategoryData.image}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/showroom-hero-hd.jpg';
              }}
              alt={activeCategoryData.name}
              className="w-full h-full object-cover object-center filter brightness-[1.0] contrast-[1.02] transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>

          <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles className="w-3 h-3 text-[#DC2626]" />
                {activeCategoryData.tag}
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white tracking-tight drop-shadow-md">
                {activeCategoryData.name}
              </h1>
              <p className="text-sm sm:text-base text-neutral-200 mt-2.5 max-w-xl font-light leading-relaxed drop-shadow">
                {activeCategoryData.description}
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-2.5">
              <span className="text-xs font-mono text-white bg-black/60 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-xl font-semibold shadow-sm">
                {activeCategoryData.total ?? totalProducts}{' '}
                {(activeCategoryData.total ?? totalProducts) === 1 ? 'Fixture Available' : 'Fixtures Available'}
              </span>

              {/* Download Official 2026 Lighting Catalog PDF */}
              <a
                href="/LH-FANCY 2608.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-neutral-900 hover:bg-[#DC2626] hover:text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all hover:scale-102 cursor-pointer border border-neutral-200 group"
                title="Download official 2026 Lighting Catalog (LH-FANCY 2608.pdf)"
              >
                <Download className="w-4 h-4 text-[#DC2626] group-hover:text-white transition-colors" />
                <span>Download 2026 Catalog (PDF)</span>
              </a>
            </div>
          </div>
        </div>

        {/* ── Horizontal Category Quick Filter Bar with Real Live Counts ── */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto py-2 scrollbar-none">
          <button
            type="button"
            onClick={() => updateQuery({ category: 'all' })}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
              currentCategory === 'all'
                ? 'bg-neutral-900 text-white shadow-md scale-102 font-bold'
                : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs'
            }`}
          >
            All Categories ({allTotal || totalProducts})
          </button>

          {categories.map((cat) => {
            const isSelected =
              currentCategory === cat.slug || cat.subcategories?.some((s) => s.slug === currentCategory);
            const count = cat.total ?? cat.productsCount ?? 0;

            return (
              <button
                key={cat.slug || cat._id}
                type="button"
                onClick={() => updateQuery({ category: cat.slug, sub: undefined })}
                className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#DC2626] text-white shadow-md scale-102 font-bold'
                    : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200/80 shadow-2xs'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] font-mono ${isSelected ? 'text-white/90' : 'text-neutral-400'}`}>
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Subcategories Quick Filter Bar with Real Lighting Images ── */}
        {currentCategory !== 'all' && (() => {
          const activeCatConfig = PRODUCT_CATEGORIES_DATA.find((c) => c.slug === currentCategory);
          if (!activeCatConfig?.sub || activeCatConfig.sub.length === 0) return null;
          return (
            <div className="mt-3 flex items-center gap-2 overflow-x-auto py-2 scrollbar-thin bg-white p-2.5 rounded-2xl border border-neutral-200/90 shadow-2xs">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-500 shrink-0 px-2 border-r border-neutral-200 mr-1">
                <Layers className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>{activeCatConfig.name} Types:</span>
              </div>

              {/* All in Category */}
              <button
                type="button"
                onClick={() => updateQuery({ sub: undefined })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  !currentSub
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                All {activeCatConfig.name}s
              </button>

              {/* Each Subcategory with Real Image Thumbnail */}
              {activeCatConfig.sub.map((subItem) => {
                const isSubSelected = currentSub === subItem.slug;
                return (
                  <button
                    key={subItem.slug}
                    type="button"
                    onClick={() => updateQuery({ sub: isSubSelected ? undefined : subItem.slug })}
                    className={`flex items-center gap-2 p-1 pr-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer border ${
                      isSubSelected
                        ? 'bg-white border-[#DC2626] text-[#DC2626] shadow-sm ring-2 ring-[#DC2626]/20 font-bold'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0 bg-neutral-100 border border-neutral-200 shadow-2xs">
                      <img
                        src={subItem.image}
                        alt={subItem.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span>{subItem.name}</span>
                  </button>
                );
              })}

              <Link
                to={`/category/${currentCategory}`}
                className="ml-auto shrink-0 text-[11px] font-bold uppercase tracking-wider text-[#DC2626] hover:underline px-2 flex items-center gap-1"
              >
                <span>Lookbook & Guide</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          );
        })()}

        {/* ── Search Bar & Filter Controls Bar ── */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by SKU, model, finish, or material..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 text-xs focus:outline-none focus:border-[#DC2626] shadow-sm transition-colors"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  updateQuery({ search: '' });
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
            {/* Quick Cascading Hierarchy Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                id="catalog-cascading-dropdown-btn"
                onClick={() => setCatalogDropdownOpen(!catalogDropdownOpen)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                  catalogDropdownOpen
                    ? 'bg-[#DC2626] text-white border border-[#DC2626]'
                    : 'bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-700 hover:text-neutral-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#DC2626]" />
                <span>Hierarchy</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    catalogDropdownOpen ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {catalogDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <CascadingCategoryDropdown onClose={() => setCatalogDropdownOpen(false)} />
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-[#DC2626]" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={currentSort}
                onChange={(e) => updateQuery({ sort: e.target.value })}
                className="bg-white border border-neutral-300 rounded-xl px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-700 focus:outline-none focus:border-[#DC2626] shadow-sm cursor-pointer"
              >
                <option value="sortOrder">Featured & Order</option>
                <option value="newest">Newest First</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
                <option value="sku_asc">SKU Order</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Active Filter Badges ── */}
        {(currentCategory !== 'all' || currentSub || currentSearch || currentFeatured) && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-neutral-500 uppercase tracking-wider font-bold mr-1">
              Active:
            </span>
            {currentCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-red-50 text-[#DC2626] border border-red-200 font-medium">
                Category: {activeCategoryData.name}
                <button
                  type="button"
                  onClick={() => updateQuery({ category: 'all', sub: undefined })}
                  className="cursor-pointer hover:text-neutral-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentSub && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-red-50 text-[#DC2626] border border-red-200 font-medium">
                Type: {currentSub.replace(/-/g, ' ').toUpperCase()}
                <button
                  type="button"
                  onClick={() => updateQuery({ sub: undefined })}
                  className="cursor-pointer hover:text-neutral-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentSearch && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-red-50 text-[#DC2626] border border-red-200 font-medium">
                Search: "{currentSearch}"
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    updateQuery({ search: '' });
                  }}
                  className="cursor-pointer hover:text-neutral-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentFeatured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-red-50 text-[#DC2626] border border-red-200 font-medium">
                Featured Only
                <button
                  type="button"
                  onClick={() => updateQuery({ featured: '' })}
                  className="cursor-pointer hover:text-neutral-900"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs text-neutral-500 hover:text-neutral-900 underline ml-2 font-medium cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* ── Main Layout: Sidebar + Product Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Desktop Left Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28">
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <span className="text-xs uppercase tracking-wider text-neutral-900 font-bold flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-[#DC2626]" />
                  Categories
                </span>
                {currentCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => updateQuery({ category: 'all' })}
                    className="text-[11px] text-[#DC2626] hover:underline font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Category List with Subcategories */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => updateQuery({ category: 'all' })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    currentCategory === 'all'
                      ? 'bg-[#DC2626] text-white shadow-sm'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <span>All Categories</span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      currentCategory === 'all' ? 'bg-white/20 text-white' : 'text-neutral-500 bg-neutral-100'
                    }`}
                  >
                    {allTotal || totalProducts}
                  </span>
                </button>

                {categories.map((cat) => {
                  const isParentActive = currentCategory === cat.slug;
                  const catConfig = PRODUCT_CATEGORIES_DATA.find((c) => c.slug === cat.slug);
                  const subList = catConfig?.sub || cat.subcategories || [];
                  const isChildActive = subList.some((s) => s.slug === currentCategory || s.slug === currentSub);
                  const isExpanded = isParentActive || isChildActive;
                  const count = cat.total ?? cat.productsCount ?? 0;

                  return (
                    <div key={cat.slug || cat._id} className="space-y-0.5">
                      <button
                        type="button"
                        onClick={() => updateQuery({ category: cat.slug, sub: undefined })}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                          isParentActive
                            ? 'bg-[#DC2626] text-white shadow-sm font-bold'
                            : isChildActive
                            ? 'bg-neutral-100 text-[#DC2626] font-bold'
                            : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                        }`}
                      >
                        <span className="truncate text-left">{cat.name}</span>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            isParentActive
                              ? 'bg-white/20 text-white'
                              : 'text-neutral-500 bg-neutral-100'
                          }`}
                        >
                          {count}
                        </span>
                      </button>

                      {/* Subcategories (Indented under parent) with Real Images */}
                      {isExpanded && subList.length > 0 && (
                        <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-red-200 ml-3 my-1">
                          {subList.map((sub) => {
                            const isSubSelected = currentSub === sub.slug || currentCategory === sub.slug;
                            return (
                              <button
                                key={sub.slug}
                                type="button"
                                onClick={() => updateQuery({ category: cat.slug, sub: sub.slug })}
                                className={`w-full flex items-center justify-between p-1.5 rounded-xl text-[11px] transition-all cursor-pointer ${
                                  isSubSelected
                                    ? 'bg-red-50 text-[#DC2626] font-bold border border-red-200/80 shadow-2xs'
                                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                                }`}
                              >
                                <div className="flex items-center gap-2 truncate">
                                  {sub.image && (
                                    <div className="w-5 h-5 rounded-md overflow-hidden shrink-0 border border-neutral-200 bg-neutral-100">
                                      <img
                                        src={sub.image}
                                        alt={sub.name}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                      />
                                    </div>
                                  )}
                                  <span className="truncate text-left font-medium">{sub.name}</span>
                                </div>
                                <ChevronRight className="w-3 h-3 opacity-50 shrink-0" />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Featured Only Filter Toggle */}
              <div className="pt-4 border-t border-neutral-100">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={currentFeatured === 'true'}
                    onChange={(e) => updateQuery({ featured: e.target.checked ? 'true' : '' })}
                    className="rounded border-neutral-300 text-[#DC2626] focus:ring-[#DC2626] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs text-neutral-700 group-hover:text-neutral-900 transition-colors flex items-center gap-1.5 font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#DC2626]" />
                    Featured Fixtures Only
                  </span>
                </label>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <div key={n} className="h-96 rounded-2xl bg-neutral-200 animate-pulse" />
                ))}
              </div>
            ) : displayedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedProducts.map((product) => (
                    <ProductCard key={product._id || product.slug} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-14 pt-8 border-t border-neutral-200 flex items-center justify-between">
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => updateQuery({ page: currentPage - 1 })}
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs uppercase tracking-wider text-neutral-700 hover:text-neutral-900 flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm font-semibold cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => updateQuery({ page: p })}
                          className={`w-9 h-9 rounded-xl text-xs font-mono font-bold transition-all shadow-sm cursor-pointer ${
                            currentPage === p
                              ? 'bg-[#DC2626] text-white shadow'
                              : 'bg-white text-neutral-600 hover:text-neutral-900 border border-neutral-300 hover:bg-neutral-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => updateQuery({ page: currentPage + 1 })}
                      className="px-4 py-2 rounded-xl bg-white border border-neutral-300 text-xs uppercase tracking-wider text-neutral-700 hover:text-neutral-900 flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-sm font-semibold cursor-pointer"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-center rounded-2xl bg-white border border-neutral-200 p-8 shadow-sm">
                <Lightbulb className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-neutral-900 font-bold">No Fixtures Found</h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto mt-2 leading-relaxed">
                  We couldn't find any luminaires matching your criteria. Try resetting your search filters or browse all categories.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 rounded-xl bg-[#DC2626] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#b91c1c] transition-colors cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xs bg-white h-full shadow-2xl z-10 p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                  <h3 className="font-serif text-lg font-bold text-neutral-900 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#DC2626]" /> Filter Fixtures
                  </h3>
                  <button
                    type="button"
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="mt-4 space-y-1">
                  <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-bold block mb-2">
                    Select Category
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      updateQuery({ category: 'all' });
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                      currentCategory === 'all'
                        ? 'bg-[#DC2626] text-white'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <span>All Categories</span>
                    <span>({allTotal || totalProducts})</span>
                  </button>

                  {categories.map((cat) => {
                    const isSelected = currentCategory === cat.slug;
                    const catCfg = PRODUCT_CATEGORIES_DATA.find((c) => c.slug === cat.slug);
                    const subList = catCfg?.sub || cat.subcategories || [];

                    return (
                      <div key={cat.slug || cat._id} className="space-y-1">
                        <button
                          type="button"
                          onClick={() => {
                            updateQuery({ category: cat.slug, sub: undefined });
                            if (isSelected) setMobileFilterOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                            isSelected
                              ? 'bg-[#DC2626] text-white font-bold shadow-xs'
                              : 'text-neutral-600 hover:bg-neutral-100'
                          }`}
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className="text-[10px] font-mono opacity-80">
                            ({cat.total ?? cat.productsCount ?? 0})
                          </span>
                        </button>

                        {/* If category is selected, show subcategories with images in mobile drawer */}
                        {isSelected && subList.length > 0 && (
                          <div className="pl-3 pr-1 py-1 space-y-1 border-l-2 border-red-300 ml-3 my-1">
                            {subList.map((sub) => {
                              const isSubSelected = currentSub === sub.slug;
                              return (
                                <button
                                  key={sub.slug}
                                  type="button"
                                  onClick={() => {
                                    updateQuery({ category: cat.slug, sub: isSubSelected ? undefined : sub.slug });
                                    setMobileFilterOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between p-1.5 rounded-xl text-[11px] transition-all cursor-pointer ${
                                    isSubSelected
                                      ? 'bg-red-50 text-[#DC2626] font-bold border border-red-200 shadow-2xs'
                                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    {sub.image && (
                                      <div className="w-5 h-5 rounded-md overflow-hidden shrink-0 border border-neutral-200 bg-neutral-100">
                                        <img
                                          src={sub.image}
                                          alt={sub.name}
                                          className="w-full h-full object-cover"
                                          loading="lazy"
                                        />
                                      </div>
                                    )}
                                    <span className="truncate text-left font-medium">{sub.name}</span>
                                  </div>
                                  <ChevronRight className="w-3 h-3 opacity-50 shrink-0" />
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 pt-4 border-t border-neutral-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentFeatured === 'true'}
                      onChange={(e) => {
                        updateQuery({ featured: e.target.checked ? 'true' : '' });
                      }}
                      className="rounded border-neutral-300 text-[#DC2626] focus:ring-[#DC2626] w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-neutral-800">
                      Featured Fixtures Only
                    </span>
                  </label>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-neutral-200 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    clearAllFilters();
                    setMobileFilterOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-50 cursor-pointer"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#DC2626] text-xs font-bold text-white hover:bg-[#b91c1c] cursor-pointer"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
