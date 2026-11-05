require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
// app.use(express.json());

const allowedOrigins = [
  'http://localhost:3001',
  'https://fyp-craft-my-pearlcryst.vercel.app', //  live production domain 
  'https://fyp-craft-my-pearlcryst-git-main-jc-kwek.vercel.app' //  live Vercel URL 
];

// Middleware
// app.use(cors({                          // enable CORS
//   origin: 'http://localhost:3001'       // allow React frontend
// }));
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use((req, res, next) => {
  if (req.originalUrl === '/orders/webhook') {
    next(); // Skip JSON parsing for this route so express.raw handles it inside your route file
  } else {
    express.json()(req, res, next);
  }
});
// app.use(express.json());  
app.use('/uploads', express.static('uploads'));

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const authRoutes = require("./routes/auth");
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const aiCustomJewelryRoutes = require('./routes/aiCustomizationRoutes');
const aiChatRoutes = require('./routes/aiChatRoutes');
const aiCustomOrderRoutes = require('./routes/aiCustomOrderRoutes');
const path = require('path');

// Mount routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/banners',bannerRoutes);
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/aicustomjewelry', aiCustomJewelryRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/aichat', aiChatRoutes);
app.use('/aicustomorder',aiCustomOrderRoutes);

const sequelize = require('./db');
const { or } = require('sequelize');

sequelize.sync()
  .then(() => {
    console.log('Database connected');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Database connection failed:', err);
  });

