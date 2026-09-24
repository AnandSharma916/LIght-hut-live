import mongoose from 'mongoose';

const productImageDocSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: '',
    },
    filename: {
      type: String,
      default: '',
    },
    originalName: {
      type: String,
      default: '',
    },
    mimetype: {
      type: String,
      default: '',
    },
    size: {
      type: Number,
      default: 0,
    },
    alt: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const ProductImage = mongoose.model('ProductImage', productImageDocSchema);
export default ProductImage;
