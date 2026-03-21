const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

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

// Mount routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/banners',bannerRoutes);

const sequelize = require('./models/db');

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

