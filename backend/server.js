import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

// Routes
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import newsletterRouter from './routes/newsletterRoute.js';
import csvRouter from './routes/csvRoute.js';
import chatbotRouter from './routes/chatbotRoute.js';
import fashnRouter from './routes/fashnRoute.js'; // ✅ FASHN API route

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB and Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/csv', csvRouter);
app.use('/api/chatbot', chatbotRouter);
app.use('/api/fashn', fashnRouter); // ✅ Mount FASHN API route

// Health check route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server started on http://localhost:${port}`);
});
