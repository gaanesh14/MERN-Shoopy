import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  sku: {
    type: String,
    unique: true,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
  },
  size: {
    type: [String],
    required: true,
    validate:{
      validator:(arr) => Array.isArray(arr) && arr.length > 0,
      message:"Size must have at least one option"
    },
  },
  color: {
    type: [String],
    required: true,
    validate:{
      validator:(arr) => Array.isArray(arr) && arr.length > 0,
      message:"Color must have at least one option"
    },
  },
  collections: {
    type: String,
    required: true,
  },
  material: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex'],
  },
  images: [
    {
      url: {
        type: String,
        required: true,
      },
      altText: {
        type: String,
      },
    },
  ],
  isFeatured: {
    type: Boolean,
    default: false,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  tags: [String],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  metaTitle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  metaKeywords: {
    type: String,
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  weight: Number,
}, { timestamps: true }); // ✅ adds createdAt & updatedAt

const Products = mongoose.model('Product', productSchema);
export default Products;
