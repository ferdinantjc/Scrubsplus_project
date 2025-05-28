import express from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import Product from '../models/productModel.js';
import 'dotenv/config';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // temp storage for uploaded images

router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: "Missing Hugging Face API key in .env" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file received" });
    }

    console.log("📸 Received image:", req.file.originalname);

    const imagePath = req.file.path;
    const imageFile = fs.createReadStream(imagePath);

    const form = new FormData();
    form.append('file', imageFile);

    console.log("📤 Sending image to Hugging Face...");

    const huggingRes = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/resnet-50',
      form,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          ...form.getHeaders(),
        },
      }
    );

    // Always delete the uploaded file to avoid clutter
    fs.unlink(imagePath, (err) => {
      if (err) console.warn("⚠️ Failed to delete uploaded image:", err.message);
    });

    const result = huggingRes.data;
    console.log("📊 Hugging Face Response:", result);

    if (!result || typeof result !== 'object') {
      return res.status(500).json({ message: "Invalid response from Hugging Face" });
    }

    // Basic mapping to skin tone using keywords
    const labels = JSON.stringify(result).toLowerCase();
    let skinTone = 'medium';
    if (labels.includes('dark') || labels.includes('black')) skinTone = 'dark';
    else if (labels.includes('pale') || labels.includes('white')) skinTone = 'fair';

    console.log("🎯 Detected skin tone:", skinTone);

    const matchedProducts = await Product.find({ skinToneMatch: skinTone });
    console.log(`🛍️ Found ${matchedProducts.length} products for "${skinTone}"`);

    res.json({
      message: `Based on your complexion (${skinTone}), here are some suggestions:`,
      skinTone,
      products: matchedProducts,
    });
  } catch (error) {
    console.error("❌ Analysis Error:", error?.response?.data || error.message);
    res.status(500).json({ message: "Image analysis failed", error });
  }
});

export default router;
