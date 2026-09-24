import Product from '../models/Product.js';
import Category from '../models/Category.js';

// Clean Parent-Child Category Hierarchy Definitions
export const CATALOG_CATEGORY_GROUPS = [
  {
    name: 'Chandeliers',
    slug: 'chandelier',
    tag: 'Grand Architectural Centerpieces',
    description: 'Bespoke statement chandeliers handcrafted with optical K9 crystals, blown art glass, and architectural brass.',
    image: '/categories/chandelier.jpg',
    subcategories: [
      { name: 'LED Chandelier', slug: 'led-chandelier' },
      { name: 'E14 Chandelier', slug: 'e14-chandelier' },
      { name: 'Profile Chandelier', slug: 'profile-chandelier' },
      { name: 'Glass Chandelier', slug: 'glass-chandelier' },
      { name: 'Italian Chandelier', slug: 'italian-chandelier' },
      { name: 'Modern Chandelier', slug: 'modern-chandelier' },
      { name: 'Antique Chandelier', slug: 'antique-chandelier' },
      { name: 'Fan Chandelier', slug: 'fan-chandelier' },
      { name: 'Ceiling Chandelier', slug: 'ceiling-chandelier' },
    ],
  },
  {
    name: 'Pendant Lamps',
    slug: 'pendant-lamp',
    tag: 'Suspended Linear & Cluster Pendants',
    description: 'Precision downward illumination and sculptural glass drops for dining pavilions, kitchen islands, and bars.',
    image: '/categories/pendant-lamp.jpg',
    subcategories: [
      { name: 'LED Hanging Lamp', slug: 'led-hanging-lamp' },
      { name: 'E27 Hanging Lamp', slug: 'e27-hanging-lamp' },
    ],
  },
  {
    name: 'Wall Lamps',
    slug: 'wall-lamp',
    tag: 'Bi-Directional Sconces & Facade Grazers',
    description: 'Architectural wall sconces delivering soft ambient halos, bedside task beams, and corridor vertical washes.',
    image: '/categories/wall-lamp.jpg',
    subcategories: [
      { name: 'LED Wall Lamp', slug: 'led-wall-lamp' },
      { name: 'E27 Wall Lamp', slug: 'e27-wall-lamp' },
    ],
  },
  {
    name: 'Double Height',
    slug: 'double-height',
    tag: 'Multi-Tier Grand Void Installations',
    description: 'Monumental chandeliers with suspension drops up to 10 meters, engineered for duplex villas and hotel atriums.',
    image: '/categories/double-height.jpg',
    subcategories: [
      { name: 'Crystal Chandelier', slug: 'crystal-chandelier' },
      { name: 'Modern Chandelier', slug: 'modern-chandelier-dh' },
    ],
  },
  {
    name: 'Dining Table Lamps',
    slug: 'dining-table-lamp',
    tag: 'Curated Banquet Illumination',
    description: 'Low-glare fixtures tailored for banquet tables, combining warm 2700K ambient glow with pristine table surface coverage.',
    image: '/categories/dining-table-lamp.jpg',
    subcategories: [],
  },
  {
    name: 'Outdoor Lights',
    slug: 'outdoor-light',
    tag: 'IP65 Weatherproof Luminaires',
    description: 'Corrosion-resistant exterior lighting engineered for residential entrance gates, garden perimeters, and building facades.',
    image: '/categories/outdoor-light.jpg',
    subcategories: [
      { name: 'Gate Lamp', slug: 'gate-lamp' },
      { name: 'Outdoor Wall Lamp', slug: 'outdoor-wall-lamp' },
    ],
  },
  {
    name: 'Table Lamps',
    slug: 'table-lamp',
    tag: 'Sculptural Marble & Metal Accents',
    description: 'Artisanal tabletop luminaires crafted with weighted Spanish marble bases, frosted glass diffusers, and tactile switches.',
    image: '/categories/table-lamp.jpg',
    subcategories: [],
  },
  {
    name: 'Floor Lamps',
    slug: 'floor-lamp',
    tag: 'Freestanding Arcs & Lounge Columns',
    description: 'Statement floor lamps designed for reading lounges, executive suites, and architectural living pavilion corners.',
    image: '/categories/floor-lamp.jpg',
    subcategories: [],
  },
  {
    name: 'LED Filament Bulbs',
    slug: 'led-filament-bulb',
    tag: 'Warm Vintage Edison Filament',
    description: 'High-efficiency retro Edison bulbs (2200K–2700K) with golden amber tints and spiral filament cores.',
    image: '/categories/led-filament-bulb.jpg',
    subcategories: [],
  },
  {
    name: 'Spare Parts & Drivers',
    slug: 'spare-part',
    tag: 'Architectural Components & Power Supplies',
    description: 'Universal multi-port ceiling canopies, flicker-free dimmable constant voltage drivers, and suspension hardware.',
    image: '/categories/spare-part.jpg',
    subcategories: [
      { name: 'Hanging Base', slug: 'hanging-base' },
      { name: 'Spare Driver', slug: 'spare-driver' },
    ],
  },
];

// Helper to resolve all category slugs for a requested category query
function resolveCategorySlugs(categoryQuery) {
  if (!categoryQuery || categoryQuery === 'all') return null;

  // Check if it matches any parent group
  const parentGroup = CATALOG_CATEGORY_GROUPS.find((g) => g.slug === categoryQuery);
  if (parentGroup) {
    const slugs = [parentGroup.slug];
    if (parentGroup.subcategories) {
      parentGroup.subcategories.forEach((sub) => slugs.push(sub.slug));
    }
    return slugs;
  }

  // It's a specific subcategory or single slug
  return [categoryQuery];
}

// @desc    Get complete catalog data with products, categories, dynamic metadata, and filters
// @route   GET /api/catalog
// @access  Public
export const getCatalog = async (req, res, next) => {
  try {
    const {
      category = 'all',
      search = '',
      featured = '',
      sort = 'sortOrder',
      page = 1,
      limit = 24,
    } = req.query;

    const query = { isPublished: true };

    // 1. Featured Filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // 2. Category Filter
    if (category && category !== 'all') {
      const allowedSlugs = resolveCategorySlugs(category);
      if (allowedSlugs && allowedSlugs.length > 0) {
        const matchingCategories = await Category.find({
          slug: { $in: allowedSlugs },
        }).select('_id');

        if (matchingCategories.length > 0) {
          query.category = { $in: matchingCategories.map((c) => c._id) };
        } else {
          // If no categories found by slug, return empty products gracefully
          query.category = null;
        }
      }
    }

    // 3. Search Filter
    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { shortDescription: searchRegex },
        { 'specifications.material': searchRegex },
        { 'specifications.finish': searchRegex },
      ];
    }

    // 4. Sorting
    let sortOption = {};
    switch (sort) {
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'name_asc':
        sortOption = { name: 1 };
        break;
      case 'name_desc':
        sortOption = { name: -1 };
        break;
      case 'sku_asc':
        sortOption = { sku: 1 };
        break;
      case 'sortOrder':
      default:
        sortOption = { isFeatured: -1, sortOrder: 1, createdAt: -1 };
        break;
    }

    // 5. Pagination
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    // 6. Execute Product Query
    const [totalMatching, rawProducts, allCategoriesInDb] = await Promise.all([
      Product.countDocuments(query),
      Product.find(query)
        .populate('category', 'name slug description image')
        .sort(sortOption)
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Category.find({ isActive: true }).select('name slug image').lean(),
    ]);

    // 7. Calculate Real-Time Product Counts Per Category
    const productCountAggregate = await Product.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    productCountAggregate.forEach((item) => {
      if (item._id) {
        countMap[item._id.toString()] = item.count;
      }
    });

    const categoryIdToSlugMap = {};
    const categorySlugToCountMap = {};
    allCategoriesInDb.forEach((cat) => {
      const idStr = cat._id.toString();
      categoryIdToSlugMap[idStr] = cat.slug;
      const count = countMap[idStr] || 0;
      categorySlugToCountMap[cat.slug] = count;
    });

    // Compute parent family totals
    const structuredCategories = CATALOG_CATEGORY_GROUPS.map((group) => {
      let groupTotal = categorySlugToCountMap[group.slug] || 0;

      const subcategoriesWithCount = (group.subcategories || []).map((sub) => {
        const subCount = categorySlugToCountMap[sub.slug] || 0;
        groupTotal += subCount;
        return {
          ...sub,
          count: subCount,
        };
      });

      return {
        name: group.name,
        slug: group.slug,
        tag: group.tag,
        description: group.description,
        image: group.image,
        total: groupTotal,
        subcategories: subcategoriesWithCount,
      };
    });

    // Total published products across all categories
    const allPublishedTotal = await Product.countDocuments({ isPublished: true });

    // 8. Active Category Metadata (for dynamic hero banner)
    let activeCategory = {
      name: 'All Architectural Lighting',
      slug: 'all',
      tag: 'Complete Lighting Portfolio',
      description: 'Explore our complete portfolio of handcrafted chandeliers, suspended pendants, bi-directional wall sconces, and modular architectural systems.',
      heroImage: '/showroom-hero-hd.jpg',
      total: allPublishedTotal,
    };

    if (category && category !== 'all') {
      const parentMatch = structuredCategories.find((g) => g.slug === category);
      if (parentMatch) {
        activeCategory = {
          name: parentMatch.name,
          slug: parentMatch.slug,
          tag: parentMatch.tag,
          description: parentMatch.description,
          heroImage: parentMatch.image,
          total: parentMatch.total,
        };
      } else {
        // Check subcategories
        for (const parent of structuredCategories) {
          const subMatch = parent.subcategories.find((s) => s.slug === category);
          if (subMatch) {
            activeCategory = {
              name: subMatch.name,
              slug: subMatch.slug,
              tag: `${parent.name} • Curated Model`,
              description: `Precision-engineered ${subMatch.name.toLowerCase()} tailored for premier residential and commercial interiors.`,
              heroImage: parent.image,
              total: subMatch.count,
            };
            break;
          }
        }
      }
    }

    // 9. Format Products cleanly for client consumption
    const products = rawProducts.map((p) => {
      const coverImg =
        p.images?.find((img) => img.isCover)?.url ||
        p.images?.[0]?.url ||
        '/categories/chandelier.jpg';

      const hoverImg =
        p.images?.[1]?.url ||
        p.images?.[0]?.url ||
        '/categories/pendant-lamp.jpg';

      return {
        _id: p._id,
        id: p._id,
        name: p.name,
        slug: p.slug,
        sku: p.sku || 'LH-ARC',
        category: p.category || null,
        categoryName: p.category?.name || 'Architectural Luminaire',
        categorySlug: p.category?.slug || 'lighting',
        shortDescription: p.shortDescription || '',
        description: p.description || '',
        images: p.images || [],
        primaryImage: coverImg,
        secondaryImage: hoverImg,
        specifications: p.specifications || {},
        isFeatured: Boolean(p.isFeatured),
        isPublished: Boolean(p.isPublished),
        createdAt: p.createdAt,
      };
    });

    const totalPages = Math.ceil(totalMatching / pageSize) || 1;

    res.status(200).json({
      success: true,
      activeCategory,
      categories: structuredCategories,
      allTotal: allPublishedTotal,
      products,
      pagination: {
        total: totalMatching,
        page: pageNumber,
        limit: pageSize,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1,
      },
    });
  } catch (error) {
    next(error);
  }
};
