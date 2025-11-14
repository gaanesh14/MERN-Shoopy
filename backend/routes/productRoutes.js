import express from "express";
import Products from "../models/productModels.js";
import { protect, admin } from "../Middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// const normalizeArray = (val) => {
//   if(Array.isArray(val)) return val.map(v => String(v).trim()).filter(Boolean);
//   if(typeof val === "string")
//     return val.split(",").map(v => v.trim()).filter(Boolean);
//   return [];
// };

// @route POST /api/products
// @desc Create a new product
// @access private/Admin
const normalizeArray = (val) => {
  if (Array.isArray(val)) {
    return val.map(v => String(v).trim()).filter(Boolean);
  }
  if (typeof val === "string") {
    return val.split(",").map(v => v.trim()).filter(Boolean);
  }
  return [];
};

// @route POST /api/products
// @desc Create a new product
// @access private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      size, // Now correctly destructured if the key is 'size'
      color, // Now correctly destructured if the key is 'color'
      sizes, // Check for a possible 'sizes' key
      colors, // Check for a possible 'colors' key
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    // Prioritize 'size' and 'color' keys, but fall back to 'sizes' and 'colors'
    const productSize = normalizeArray(size || sizes);
    const productColor = normalizeArray(color || colors);

    const product = new Products({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      size: productSize,
      color: productColor,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    if (error.name === "ValidationError") {
      // Mongoose's built-in validation for empty arrays will now be triggered
      const errors = Object.keys(error.errors).map(key => error.errors[key].message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    res.status(500).json({ message: "Server Error!", error: error.message });
  }
});

// @route PUT /api/products/:id
// @desc Update an existing product
// @access private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      size,
      color,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;
    //console.log("data",req.body);
    
    let product = await Products.findById(req.params.id);
    //console.log("data:",product);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.discountPrice = discountPrice ?? product.discountPrice;
    product.countInStock = countInStock ?? product.countInStock;
    product.category = category ?? product.category;
    product.brand = brand ?? product.brand;

    // Correct assignment with normalization
    if (size !== undefined) {
      const normalizedSize = normalizeArray(size);
      if (normalizedSize.length === 0) {
        return res.status(400).json({ message: "Size must have at least one valid value." });
      }
      product.size = normalizedSize;
    }
    if (color !== undefined) {
      const normalizedColor = normalizeArray(color);
      if (normalizedColor.length === 0) {
        return res.status(400).json({ message: "Color must have at least one valid value." });
      }
      product.color = normalizedColor;
    }

    product.collections = collections ?? product.collections;
    product.material = material ?? product.material;
    product.gender = gender ?? product.gender;
    product.images = images ?? product.images;
    product.isFeatured = typeof isFeatured === "boolean" ? isFeatured : product.isFeatured;
    product.isPublished = typeof isPublished === "boolean" ? isPublished : product.isPublished;
    product.tags = tags ?? product.tags;
    product.dimensions = dimensions ?? product.dimensions;
    product.weight = weight ?? product.weight;
    product.sku = sku ?? product.sku;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message, errors: error.errors });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route DELETE /api/products/:id
// @desc Delete an existing product
// @access private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error!", error: error.message });
  }
});

// @route GET /api/products
// @desc Get all products with optional query filters
// @access public
router.get("/", async (req, res) => {
  try {
    const {
      collections, size, color, gender, minPrice, maxPrice,
      sortBy, search, category, material, brand, limit,
    } = req.query;

    let query = {};
    if (collections && collections.toLowerCase() !== "all") query.collections = collections;
    if (gender && gender.toLowerCase() !== "all") {
      query.gender = { $regex: `^${gender}$`, $options: "i" };
    }
    if (category && category.toLowerCase() !== "all") query.category = category;
    if (material) query.material = { $in: material.split(",").map(m => new RegExp(`^${m.trim()}$`, 'i')) };
    if (brand) query.brand = { $in: brand.split(",").map(b => new RegExp(`^${b.trim()}$`, 'i')) };
    if (size) query.size = { $in: size.split(",").map(s => s.trim()) };
    if (color) query.color = { $in: color.split(",").map(c => c.trim()) };
   // if (gender) query.gender = gender;
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
        { category: searchRegex },
        { tags: searchRegex },
        { gender : searchRegex},
      ];
    }
    
    let sort = { createdAt: -1 };
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc": sort = { price: 1 }; break;
        case "priceDesc": sort = { price: -1 }; break;
        case "popularity": sort = { rating: -1, numReviews: -1 }; break;
        case "newest": sort = { createdAt: -1 }; break;
      }
    }
    
    const products = await Products.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


// @route GET /api/products/best-seller
// @desc Get the best-selling product
// @access Public
router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Products.findOne().sort({ rating: -1, numReviews: -1 });
    if (!bestSeller) return res.status(404).json({ message: "No best seller found." });
    res.json(bestSeller);
  } catch (error) {
    console.error("Error fetching best seller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route GET /api/products/new-arrivals
// @desc Get new arrival products
// @access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Products.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route GET /api/products/:id
// @desc Get a single product by ID
// @access public
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID format." });
    }
    const product = await Products.findById(req.params.id.trim());
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json(product);
  } catch (error) {
    console.error("Error fetching single product:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route GET /api/products/similar/:id
// @desc Get similar products based on gender and category
// @access Public
router.get("/similar/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }
  try {
    const product = await Products.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const similarProducts = await Products.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    console.error("Error in similar products route:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;