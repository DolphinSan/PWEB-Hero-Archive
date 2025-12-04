const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const heroRoutes = require('./routes/heroRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const draftRoutes = require('./routes/draftRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/heroes', heroRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/drafts', draftRoutes);
app.use('/api/reviews', reviewRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: '🎮 Hero Archive API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      heroes: '/api/heroes',
      favorites: '/api/favorites',
      drafts: '/api/drafts',
      reviews: '/api/reviews'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});

module.exports = app;