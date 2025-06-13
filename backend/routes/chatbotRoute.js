import express from 'express';
import multer from 'multer';
import axios from 'axios';
import fs from 'fs';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';
import 'dotenv/config';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// 📸 Analyze image for skin tone and recommend products (OpenAI Vision API)
router.post('/analyze', upload.single('image'), async (req, res) => {
  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) return res.status(500).json({ message: "Missing OpenAI API key" });
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const imagePath = req.file.path;
    const base64Image = fs.readFileSync(imagePath, { encoding: 'base64' });
    fs.unlink(imagePath, (err) => err && console.warn('Image cleanup failed:', err));

    const visionPrompt = "This is a customer's photo. Based on their visible skin tone, classify them as: fair, medium, or dark. Be concise. Just reply with one of those three words.";

    const visionRes = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: visionPrompt },
              {
                type: 'image_url',
                image_url: { url: `data:image/jpeg;base64,${base64Image}` }
              }
            ]
          }
        ],
        max_tokens: 10
      },
      {
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const skinTone = visionRes.data.choices[0].message.content.trim().toLowerCase();
    if (!['fair', 'medium', 'dark'].includes(skinTone)) {
      return res.json({ message: "❌ Couldn't detect a clear skin tone. Please try again." });
    }

    const products = await Product.find({ skinToneMatch: skinTone }, 'name price _id skinToneMatch category');
    if (!products.length) return res.json({ message: "😕 No products match this glow type." });

    const productList = products.slice(0, 3).map(
      (p) => `🛍️ ${p.name} – $${p.price} | ${p._id}`
    ).join('\n');

    res.json({
      message: `🤖 Based on your glow type (${skinTone}), here are our top picks:`,
      skinTone,
      reply: productList
    });

  } catch (error) {
    console.error("❌ OpenAI Vision error:", error?.response?.data || error.message);
    res.status(500).json({ message: "Image analysis failed", error });
  }
});

// 💬 Text-based chatbot
router.post('/text', async (req, res) => {
  const userMessage = req.body.message?.toLowerCase() || '';
  if (!userMessage) return res.status(400).json({ error: 'Message is required' });

  try {
    const idMatch = userMessage.match(/[a-f0-9]{24}/);
    if (userMessage.includes('track') || userMessage.includes('status')) {
      if (idMatch) {
        const order = await Order.findById(idMatch[0]);
        if (!order) return res.json({ reply: `❌ No order found with ID: ${idMatch[0]}` });

        return res.json({
          reply: `📦 Order Status: ${order.status}\n💰 Total: $${order.amount}\n📅 Date: ${new Date(order.date).toLocaleDateString()}`
        });
      }
      return res.json({ reply: `❗ Please provide a 24-character order ID like: "Track 665e190e3b1234567890abcd"` });
    }

    const products = await Product.find({}, 'name price skinToneMatch category _id');
    const productList = products.map(p =>
      `- ${p.name} ($${p.price}) [${p.skinToneMatch}, ${p.category}] | ID: ${p._id}`
    ).join('\n');

    const systemPrompt = `
You are a helpful AI assistant for ScrubsPlus.
Only suggest products from this list:
${productList}
Format your suggestions like this:
🛍️ Product Name – $29.99 | 665e190e3b1234567890abcd
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("❌ Chat Error:", error?.response?.data || error.message);
    res.status(500).json({ error: 'Chatbot request failed' });
  }
});

// 📦 Email-based order lookup
router.post('/track', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const orders = await Order.find({ email }).sort({ date: -1 });
    if (!orders.length) return res.json({ reply: `No orders found for ${email}.` });

    const summary = orders.map((order, i) =>
      `📦 Order ${i + 1} – Status: ${order.status}, Total: $${order.amount}, Placed: ${new Date(order.date).toLocaleDateString()}`
    ).join('\n\n');

    res.json({ reply: summary });
  } catch (error) {
    console.error('❌ Order lookup error:', error);
    res.status(500).json({ error: 'Tracking failed.' });
  }
});

export default router;
