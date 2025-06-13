import express from 'express';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 🔧 Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ POST /api/fashn/tryon
router.post('/tryon', upload.single('model'), async (req, res) => {
  const { garment_image_url, category, mode = 'performance' } = req.body;
  const modelFile = req.file;

  if (!modelFile || !garment_image_url || !category) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // ✅ Upload model image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(modelFile.path, {
      folder: 'fashn-models',
    });
    const modelImageUrl = uploadResult.secure_url;

    // ✅ Log request payload
    console.log('📤 Sending request to FASHN API with:', {
      model_image: modelImageUrl,
      garment_image: garment_image_url,
      category,
      mode,
    });

    // ✅ Call FASHN API
    const response = await axios.post(
      'https://api.fashn.ai/v1/run',
      {
        model_image: modelImageUrl,
        garment_image: garment_image_url,
        category,
        mode,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FASHN_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // ✅ Log success response
    console.log('✅ FASHN API response:', {
      status: response.status,
      data: response.data,
    });

    fs.unlinkSync(modelFile.path); // Cleanup
    res.json({ id: response.data.id });
  } catch (error) {
    // ✅ Log error response
    console.error('❌ FASHN API /run Error:', {
      status: error?.response?.status,
      data: error?.response?.data || error.message,
    });

    if (fs.existsSync(modelFile.path)) fs.unlinkSync(modelFile.path);
    res.status(500).json({ error: 'Failed to initiate try-on' });
  }
});

// ✅ GET /api/fashn/status/:id
router.get('/status/:id', async (req, res) => {
  const predictionId = req.params.id;
  try {
    const response = await axios.get(`https://api.fashn.ai/v1/status/${predictionId}`, {
      headers: { Authorization: `Bearer ${process.env.FASHN_API_KEY}` },
    });
    res.json(response.data);
  } catch (error) {
    console.error('❌ FASHN API /status Error:', {
      status: error?.response?.status,
      data: error?.response?.data || error.message,
    });
    res.status(500).json({ error: 'Failed to fetch try-on result' });
  }
});

// ✅ GET /api/fashn/inspect/:id
router.get('/inspect/:id', async (req, res) => {
  const predictionId = req.params.id;
  try {
    const response = await axios.get(`https://api.fashn.ai/v1/status/${predictionId}`, {
      headers: { Authorization: `Bearer ${process.env.FASHN_API_KEY}` },
    });

    console.log('🔍 Inspect Result for', predictionId, ':', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('❌ Inspect Error:', {
      status: error?.response?.status,
      data: error?.response?.data || error.message,
    });
    res.status(500).json({ error: 'Failed to inspect prediction' });
  }
});

export default router;
