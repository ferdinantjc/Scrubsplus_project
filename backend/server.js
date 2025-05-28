import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import userRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import newsletterRouter from './routes/newsletterRoute.js';
import csvRouter from './routes/csvRoute.js';
import chatbotRouter from './routes/chatbotRoute.js'; // ✅ Added Chatbot Route

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect to DB and Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/csv', csvRouter);
app.use('/api/chatbot', chatbotRouter); // ✅ Mount Chatbot Route

// Root Test Route
app.get('/', (req, res) => {
  res.send("API Working");
});

// Start Server
app.listen(port, () => console.log('✅ Server started on PORT:', port));
