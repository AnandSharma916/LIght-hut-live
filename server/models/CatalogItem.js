import mongoose from 'mongoose';

const catalogItemSchema = new mongoose.Schema(
  {
    catalogId: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    sku: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    category: {
      type: String, // 'wall-lamp', 'pendant-lamp', 'chandelier', 'double-height', 'dining-table-lamp', 'outdoor-light', 'table-lamp', 'floor-lamp', 'led-filament-bulb', 'spare-part'
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    subcategory: {
      type: String, // 'led-wall-lamp', 'e27-wall-lamp', 'led-chandelier', 'e14-chandelier', etc.
      default: '',
      lowercase: true,
      trim: true,
      index: true,
    },
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      default: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        isCover: { type: Boolean, default: false },
      },
    ],
    specifications: {
      dimensions: { type: String, default: '' },
      material: { type: String, default: '' },
      finish: { type: String, default: '' },
      wattage: { type: String, default: '' },
      voltage: { type: String, default: '' },
      colorTemperature: { type: String, default: '' },
      ipRating: { type: String, default: '' },
      installationType: { type: String, default: '' },
      beamAngle: { type: String, default: '' },
      cri: { type: String, default: '' },
      luminousFlux: { type: String, default: '' },
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Search indexing for fast catalog queries
catalogItemSchema.index({
  name: 'text',
  sku: 'text',
  categoryName: 'text',
  shortDescription: 'text',
  description: 'text',
});

const CatalogItem = mongoose.model('CatalogItem', catalogItemSchema);

export default CatalogItem;
