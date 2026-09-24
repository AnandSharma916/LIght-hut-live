import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { slugify } from '../utils/slugify.js';

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const isAdmin = req.query.admin === 'true';
    const filter = isAdmin ? {} : { isActive: true };

    const categories = await Category.find(filter)
      .sort({ sortOrder: 1, createdAt: 1 })
      .populate('productsCount');

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).populate('productsCount');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category with slug '${req.params.slug}' not found.`,
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin)
export const createCategory = async (req, res, next) => {
  try {
    let { name, slug, description, image, sortOrder, isActive, seoTitle, seoDescription } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Category name is required.',
      });
    }

    const generatedSlug = slug ? slugify(slug) : slugify(name);

    const existingCategory = await Category.findOne({ slug: generatedSlug });
    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: `Category slug '${generatedSlug}' already exists. Please choose a unique name or slug.`,
      });
    }

    // Determine default sortOrder if not provided
    if (sortOrder === undefined || sortOrder === null) {
      const highestOrder = await Category.findOne().sort({ sortOrder: -1 }).select('sortOrder');
      sortOrder = highestOrder ? highestOrder.sortOrder + 1 : 0;
    }

    const category = await Category.create({
      name: name.trim(),
      slug: generatedSlug,
      description: description || '',
      image: image || '',
      sortOrder: Number(sortOrder),
      isActive: isActive !== undefined ? isActive : true,
      seoTitle: seoTitle || name.trim(),
      seoDescription: seoDescription || description || '',
    });

    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin)
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    const { name, slug, description, image, sortOrder, isActive, seoTitle, seoDescription } = req.body;

    if (name) category.name = name.trim();
    if (slug) {
      const newSlug = slugify(slug);
      if (newSlug !== category.slug) {
        const slugExists = await Category.findOne({ slug: newSlug, _id: { $ne: category._id } });
        if (slugExists) {
          return res.status(400).json({
            success: false,
            message: `Slug '${newSlug}' is already in use by another category.`,
          });
        }
        category.slug = newSlug;
      }
    }
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (sortOrder !== undefined) category.sortOrder = Number(sortOrder);
    if (isActive !== undefined) category.isActive = Boolean(isActive);
    if (seoTitle !== undefined) category.seoTitle = seoTitle;
    if (seoDescription !== undefined) category.seoDescription = seoDescription;

    await category.save();

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.',
      });
    }

    // Check if products belong to this category
    const productsUsingCategory = await Product.countDocuments({ category: category._id });
    if (productsUsingCategory > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${productsUsingCategory} product(s) are currently associated with it. Please reassign or delete them first.`,
      });
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reorder categories in batch
// @route   PUT /api/categories/reorder
// @access  Private (Admin)
export const reorderCategories = async (req, res, next) => {
  try {
    const { items } = req.body; // Array of { id, sortOrder }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Expected an array of items with id and sortOrder.',
      });
    }

    const updates = items.map((item) =>
      Category.findByIdAndUpdate(item.id, { sortOrder: item.sortOrder })
    );

    await Promise.all(updates);

    const updatedCategories = await Category.find().sort({ sortOrder: 1 });

    res.status(200).json({
      success: true,
      message: 'Categories reordered successfully.',
      categories: updatedCategories,
    });
  } catch (error) {
    next(error);
  }
};
