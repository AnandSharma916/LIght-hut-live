import mongoose from 'mongoose';

const homepageSectionSchema = new mongoose.Schema(
  {
    sectionKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    badge: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
    images: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    buttonText: {
      type: String,
      default: '',
    },
    buttonLink: {
      type: String,
      default: '',
    },
    secondaryButtonText: {
      type: String,
      default: '',
    },
    secondaryButtonLink: {
      type: String,
      default: '',
    },
    cta: {
      text: { type: String, default: '' },
      link: { type: String, default: '' },
    },
    secondaryCta: {
      text: { type: String, default: '' },
      link: { type: String, default: '' },
    },
    isEnabled: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const HomepageSection = mongoose.model('HomepageSection', homepageSectionSchema);
export default HomepageSection;
