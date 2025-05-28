import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import { Parser } from 'json2csv';
import Product from '../models/productModel.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // temp storage for uploaded files

// =========================
// ✅ UPLOAD PRODUCTS VIA CSV
// =========================
router.post('/upload', upload.single('file'), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      results.push({
        image: data.image,
        name: data.productName,
        description: data.productDescription,
        category: data.productCategory,
        subCategory: data.subCategory,
        price: parseFloat(data.productPrice),
        sizes: data.productSize?.split(','),
        bestSeller: data.isBestSeller?.toLowerCase() === 'true',
        date: new Date() // required field
      });
    })
    .on('end', async () => {
      try {
        const inserted = await Product.insertMany(results);
        res.json({ message: 'Products uploaded!', count: inserted.length });
      } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ message: 'Upload failed', error: err });
      }
    });
});

// =========================
// ✅ EXPORT PRODUCTS TO CSV
// =========================
router.get('/export', async (req, res) => {
  try {
    const products = await Product.find();

    const fields = [
      { label: 'image', value: 'image' },
      { label: 'productName', value: 'name' },
      { label: 'productDescription', value: 'description' },
      { label: 'productCategory', value: 'category' },
      { label: 'subCategory', value: 'subCategory' },
      { label: 'productPrice', value: 'price' },
      { label: 'productSize', value: (row) => row.sizes?.join(',') },
      { label: 'isBestSeller', value: 'bestSeller' }
    ];

    const json2csv = new Parser({ fields });
    const csv = json2csv.parse(products);

    res.header('Content-Type', 'text/csv');
    res.attachment('products_export.csv');
    return res.send(csv);
  } catch (err) {
    console.error('Export Error:', err);
    res.status(500).json({ message: 'Export failed', error: err });
  }
});

export default router;
