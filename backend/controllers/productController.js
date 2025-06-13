import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// ✅ Function to add a product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
      skinToneMatch, // ✅ NEW: Extract skin tone match
    } = req.body;

    // ✅ Validate skinToneMatch input
    const validSkinTones = ['fair', 'medium', 'dark'];
    if (!validSkinTones.includes(skinToneMatch)) {
      return res.status(400).json({
        success: false,
        message: "Invalid skin tone match. Must be 'fair', 'medium', or 'dark'.",
      });
    }

    // ✅ Handle uploaded images
    const image1 = req.files.image1?.[0];
    const image2 = req.files.image2?.[0];
    const image3 = req.files.image3?.[0];
    const image4 = req.files.image4?.[0];

    const images = [image1, image2, image3, image4].filter(Boolean);

    const imagesUrl = await Promise.all(
      images.map(async (file) => {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        return uploaded.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      subCategory,
      price: Number(price),
      bestseller: bestseller === "true" || bestseller === true,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
      skinToneMatch, // ✅ Add to DB
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "✅ Product Added", product });

  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Function to list all products
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.error("❌ Error listing products:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Function to remove a product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "🗑️ Product Removed" });
  } catch (error) {
    console.error("❌ Error removing product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Function to get a single product
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.error("❌ Error fetching single product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };
