import express from 'express';
import {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import Product from '../models/productModel.js'; // ✅ Make sure this is present

const productRouter = express.Router();

// ✅ Add new product with images
productRouter.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),
  addProduct
);

// ✅ Remove product
productRouter.post('/remove', adminAuth, removeProduct);

// ✅ Get single product
productRouter.post('/single', singleProduct);

// ✅ List all products
productRouter.get('/list', listProducts);

// ✅ Update product details
productRouter.put('/update', adminAuth, async (req, res) => {
  const { id, name, price, category, description } = req.body;

  try {
    const updated = await Product.findByIdAndUpdate(
      id,
      { name, price, category, description },
      { new: true }
    );

    if (!updated) {
      return res.json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, message: 'Product updated successfully', product: updated });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Update failed', error: err.message });
  }
});

// ✅ Get all unique categories and subcategories (NEW)
productRouter.get('/categories', async (req, res) => {
  try {
    const products = await Product.find({}, 'category subCategory');
    const categories = [...new Set(products.map(p => p.category?.trim()).filter(Boolean))];
    const subCategories = [...new Set(products.map(p => p.subCategory?.trim()).filter(Boolean))];

    res.json({
      success: true,
      categories,
      subCategories
    });
  } catch (err) {
    console.error(err);
    res.json({
      success: false,
      message: 'Failed to fetch categories',
      error: err.message
    });
  }
});

export default productRouter;
