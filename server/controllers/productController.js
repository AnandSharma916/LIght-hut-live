import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { slugify } from '../utils/slugify.js';

const CATEGORY_FAMILY_MAP = {
  'pendant-lamp': ['pendant-lamp', 'led-hanging-lamp', 'e27-hanging-lamp', 'pendant'],
  'wall-lamp': ['wall-lamp', 'led-wall-lamp', 'e27-wall-lamp', 'wall'],
  'chandelier': [
    'chandelier',
    'led-chandelier',
    'e14-chandelier',
    'profile-chandelier',
    'glass-chandelier',
    'italian-chandelier',
    'modern-chandelier',
    'antique-chandelier',
    'fan-chandelier',
    'ceiling-chandelier',
  ],
  'double-height': ['double-height', 'crystal-chandelier', 'modern-double-height-chandelier'],
  'outdoor-light': ['outdoor-light', 'gate-lamp', 'outdoor-wall-lamp', 'outdoor'],
  'spare-part': ['spare-part', 'hanging-base', 'spare-driver', 'spares'],
  'dining-table-lamp': ['dining-table-lamp', 'dining'],
  'table-lamp': ['table-lamp', 'table'],
  'floor-lamp': ['floor-lamp', 'floor'],
  'led-filament-bulb': ['led-filament-bulb', 'filament'],
};

// @desc    Get all products with filtering, search, sorting, and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      featured,
      published,
      sort = 'sortOrder',
      page = 1,
      limit = 12,
      admin = 'false',
    } = req.query;

    const query = {};

    // For public website, only return published products unless admin explicitly requests all
    if (admin === 'true') {
      if (published !== undefined && published !== '') {
        query.isPublished = published === 'true';
      }
    } else {
      query.isPublished = true;
    }

    // Filter by featured
    if (featured !== undefined && featured !== '') {
      query.isFeatured = featured === 'true';
    }

    // Filter by category (can be slug or category ID)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const familySlugs = CATEGORY_FAMILY_MAP[category] || [category];
        const baseSlug = category.replace(/-lamp$/, '').replace(/-light$/, '');
        const matchingCategories = await Category.find({
          $or: [
            { slug: { $in: familySlugs } },
            { slug: category },
            { slug: new RegExp(category, 'i') },
            { slug: new RegExp(baseSlug, 'i') },
            { name: new RegExp(baseSlug, 'i') },
          ],
        });

        if (matchingCategories.length > 0) {
          query.category = { $in: matchingCategories.map((c) => c._id) };
        } else {
          return res.status(200).json({
            success: true,
            products: [],
            total: 0,
            page: Number(page),
            totalPages: 0,
          });
        }
      }
    }

    // Search query: search by name, SKU, shortDescription, or material
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

    // Sorting
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
        sortOption = { sortOrder: 1, createdAt: -1 };
        break;
    }

    // Pagination
    const pageNumber = Math.max(1, parseInt(page, 10));
    const pageSize = Math.max(1, parseInt(limit, 10));
    const skip = (pageNumber - 1) * pageSize;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with slug '${req.params.slug}' not found.`,
      });
    }

    // Find related products in the same category (safely guarded)
    const categoryId = product.category?._id || product.category;
    const relatedProducts = categoryId
      ? await Product.find({
          category: categoryId,
          _id: { $ne: product._id },
          isPublished: true,
        })
          .populate('category', 'name slug')
          .limit(12)
          .sort({ sortOrder: 1, createdAt: -1 })
      : [];

    res.status(200).json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID (Admin)
// @route   GET /api/products/id/:id
// @access  Private (Admin)
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// Helper to normalize product images into valid schema objects
const normalizeProductImages = (images = [], mainImage = '', defaultAlt = '') => {
  const result = [];
  const seenUrls = new Set();

  // If primary image provided, ensure it comes first with isCover: true
  if (mainImage && typeof mainImage === 'string' && mainImage.trim() !== '') {
    const trimmedMain = mainImage.trim();
    result.push({
      url: trimmedMain,
      alt: defaultAlt || 'Primary Luminaire',
      isCover: true,
      publicId: '',
    });
    seenUrls.add(trimmedMain);
  }

  if (Array.isArray(images)) {
    images.forEach((img, idx) => {
      if (!img) return;
      let url = '';
      let alt = defaultAlt;
      let isCover = false;
      let publicId = '';

      if (typeof img === 'string') {
        url = img.trim();
      } else if (typeof img === 'object') {
        url = img.url ? String(img.url).trim() : '';
        alt = img.alt || defaultAlt;
        isCover = Boolean(img.isCover);
        publicId = img.publicId || '';
      }

      if (url && !seenUrls.has(url)) {
        seenUrls.add(url);
        result.push({
          url,
          alt,
          isCover: result.length === 0 ? true : isCover,
          publicId,
        });
      }
    });
  }

  // Ensure at least one image has isCover: true if images exist
  if (result.length > 0 && !result.some((img) => img.isCover)) {
    result[0].isCover = true;
  }

  return result;
};

// Helper to normalize specifications
const normalizeProductSpecs = (specs = {}) => {
  return {
    dimensions: specs.dimensions || specs.size || '',
    material: specs.material || '',
    finish: specs.finish || '',
    wattage: specs.wattage || '',
    voltage: specs.voltage || '',
    colorTemperature: specs.colorTemperature || '',
    ipRating: specs.ipRating || '',
    installationType: specs.installationType || '',
    beamAngle: specs.beamAngle || '',
    cri: specs.cri || '',
    luminousFlux: specs.luminousFlux || specs.lumens || '',
  };
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin)
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      title,
      slug,
      sku,
      category,
      shortDescription,
      description,
      price,
      images,
      mainImage,
      specifications,
      pdfUrl,
      tags,
      isFeatured,
      isNewArrival,
      isPublished,
      sortOrder,
      seoTitle,
      seoDescription,
    } = req.body;

    const productName = (name || title || '').trim();
    let productSku = (sku || '').trim().toUpperCase();

    // Auto-generate SKU if omitted so normal users don't have to enter technical codes
    if (!productSku) {
      productSku = `LH-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    }

    let targetCategory = category;
    if (!targetCategory) {
      // Pick first existing category as default if omitted
      const firstCat = await Category.findOne();
      if (firstCat) {
        targetCategory = firstCat._id;
      }
    }

    if (!productName || !targetCategory) {
      return res.status(400).json({
        success: false,
        message: 'Product Heading/Name is required.',
      });
    }

    // Verify category exists or fallback to first available
    let categoryExists = await Category.findById(targetCategory);
    if (!categoryExists) {
      const fallbackCat = await Category.findOne();
      if (fallbackCat) {
        targetCategory = fallbackCat._id;
      } else {
        return res.status(400).json({
          success: false,
          message: 'No category found in database.',
        });
      }
    }

    // Check SKU uniqueness; if exists, append random suffix
    let finalSku = productSku;
    let skuCounter = 1;
    while (await Product.findOne({ sku: finalSku })) {
      finalSku = `${productSku}-${skuCounter}`;
      skuCounter++;
    }
    productSku = finalSku;

    // Generate unique slug
    let baseSlug = slug ? slugify(slug) : slugify(productName);
    let finalSlug = baseSlug;
    let counter = 1;
    while (await Product.findOne({ slug: finalSlug })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const formattedImages = normalizeProductImages(images, mainImage, productName);
    const formattedSpecs = normalizeProductSpecs(specifications);

    const parsedTags = Array.isArray(tags)
      ? tags
      : typeof tags === 'string'
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const product = await Product.create({
      name: productName,
      slug: finalSlug,
      sku: productSku,
      category: targetCategory,
      shortDescription: shortDescription || '',
      description: description || '',
      price: Math.max(0, Number(price) || 0),
      images: formattedImages,
      specifications: formattedSpecs,
      pdfUrl: pdfUrl || '',
      tags: parsedTags,
      isFeatured: Boolean(isFeatured),
      isNewArrival: Boolean(isNewArrival),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
      sortOrder: Number(sortOrder) || 0,
      seoTitle: seoTitle || productName,
      seoDescription: seoDescription || shortDescription || '',
    });

    const populatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      product: populatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin)
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    const {
      name,
      title,
      slug,
      sku,
      category,
      shortDescription,
      description,
      price,
      images,
      mainImage,
      specifications,
      pdfUrl,
      tags,
      isFeatured,
      isNewArrival,
      isPublished,
      sortOrder,
      seoTitle,
      seoDescription,
    } = req.body;

    const productName = name || title;
    if (productName && productName.trim()) {
      product.name = productName.trim();
    }

    if (sku) {
      const normalizedSku = sku.trim().toUpperCase();
      if (normalizedSku !== product.sku) {
        const skuExists = await Product.findOne({ sku: normalizedSku, _id: { $ne: product._id } });
        if (skuExists) {
          return res.status(400).json({
            success: false,
            message: `SKU '${normalizedSku}' is already assigned to another product.`,
          });
        }
        product.sku = normalizedSku;
      }
    }

    if (slug) {
      const newSlug = slugify(slug);
      if (newSlug !== product.slug) {
        const slugExists = await Product.findOne({ slug: newSlug, _id: { $ne: product._id } });
        if (slugExists) {
          return res.status(400).json({
            success: false,
            message: `Slug '${newSlug}' is already assigned to another product.`,
          });
        }
        product.slug = newSlug;
      }
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Selected category does not exist.',
        });
      }
      product.category = category;
    }

    if (shortDescription !== undefined) product.shortDescription = shortDescription;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Math.max(0, Number(price) || 0);

    if (images !== undefined || mainImage !== undefined) {
      product.images = normalizeProductImages(
        images !== undefined ? images : product.images,
        mainImage,
        product.name
      );
    }

    if (specifications !== undefined) {
      const currentSpecs = product.specifications ? product.specifications.toObject() : {};
      product.specifications = normalizeProductSpecs({ ...currentSpecs, ...specifications });
    }

    if (pdfUrl !== undefined) product.pdfUrl = pdfUrl;
    if (tags !== undefined) {
      product.tags = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
        ? tags.split(',').map((t) => t.trim()).filter(Boolean)
        : product.tags;
    }
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured);
    if (isNewArrival !== undefined) product.isNewArrival = Boolean(isNewArrival);
    if (isPublished !== undefined) product.isPublished = Boolean(isPublished);
    if (sortOrder !== undefined) product.sortOrder = Number(sortOrder);
    if (seoTitle !== undefined) product.seoTitle = seoTitle;
    if (seoDescription !== undefined) product.seoDescription = seoDescription;

    await product.save();

    const updatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Duplicate product
// @route   POST /api/products/:id/duplicate
// @access  Private (Admin)
export const duplicateProduct = async (req, res, next) => {
  try {
    const original = await Product.findById(req.params.id);

    if (!original) {
      return res.status(404).json({
        success: false,
        message: 'Original product not found.',
      });
    }

    // Generate clean unique SKU and slug
    const baseSku = original.sku ? original.sku.replace(/-COPY-\d+$/i, '') : 'SKU';
    const timestampSuffix = Date.now().toString().slice(-4);
    const newSku = `${baseSku}-COPY-${timestampSuffix}`;
    const newName = `${original.name} (Copy)`;
    const baseSlug = original.slug ? original.slug.replace(/-copy-\d+$/i, '') : 'product';
    const newSlug = slugify(`${baseSlug}-copy-${timestampSuffix}`);

    const clonedProduct = await Product.create({
      name: newName,
      slug: newSlug,
      sku: newSku,
      category: original.category,
      shortDescription: original.shortDescription,
      description: original.description,
      images: original.images,
      specifications: original.specifications,
      pdfUrl: original.pdfUrl,
      price: original.price || 0,
      tags: original.tags || [],
      isFeatured: false,
      isNewArrival: Boolean(original.isNewArrival),
      isPublished: false, // Start as draft/unpublished
      sortOrder: (original.sortOrder || 0) + 1,
      seoTitle: newName,
      seoDescription: original.seoDescription,
    });

    const populated = await Product.findById(clonedProduct._id).populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product duplicated successfully as draft.',
      product: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle published status
// @route   PATCH /api/products/:id/toggle-publish
// @access  Private (Admin)
export const togglePublish = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.',
      });
    }

    product.isPublished = !product.isPublished;
    await product.save();

    const populatedProduct = await Product.findById(product._id).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: `Product ${product.isPublished ? 'published' : 'unpublished'}.`,
      isPublished: product.isPublished,
      product: populatedProduct || product,
    });
  } catch (error) {
    next(error);
  }
};
