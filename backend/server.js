require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;
app.use(express.json());

// Middleware
app.use(cors({                          // enable CORS
  origin: 'http://localhost:3001'       // allow React frontend
}));
app.use(express.json());  
app.use('/uploads', express.static('uploads'));

// Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const authRoutes = require("./routes/auth");
const profileRoutes = require('./routes/profileRoutes');

// Mount routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/banners',bannerRoutes);
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

const sequelize = require('./db');

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

