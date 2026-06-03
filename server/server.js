const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const seedData = require('./seed');
const Story = require('./models/Story');
const User = require('./models/User');
require('dotenv').config();

// Small helper to produce a short, non-sensitive label for DB URIs
const getMongoLabel = (uri) => {
  if (!uri) return 'unknown';
  const lower = uri.toLowerCase();
  if (lower.includes('localhost') || lower.includes('127.0.0.1')) return 'local';
  if (lower.includes('atlas.mongodb.net')) return 'MongoDB Atlas';
  let s = uri.replace(/^mongodb(\+srv)?:\/\//i, '');
  if (s.includes('@')) s = s.split('@').pop();
  s = s.split('/')[0];
  s = s.split(',')[0];
  s = s.split(':')[0];
  return `host: ${s}`;
};

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Internal reachability check endpoint
app.get('/internal-check', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// MongoDB Connection with auto-seeding
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/story-creator')
  .then(async () => {
    const label = getMongoLabel(process.env.MONGODB_URI || 'mongodb://localhost:27017/story-creator');
    console.log(`MongoDB connected successfully (${label})`);
    
    // Check if database is empty and auto-seed
    const storyCount = await Story.countDocuments();
    const userCount = await User.countDocuments();
    
    if (storyCount === 0 && userCount === 0) {
      console.log('\n📦 Database is empty. Auto-seeding with starter data...');
      try {
        await seedData({ silent: true, clearExisting: false });
        console.log('✅ Starter data loaded successfully!');
        console.log('   Login: test@gmail.com / password123\n');
      } catch (error) {
        console.error('⚠️  Auto-seed failed:', error.message);
      }
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/users', require('./routes/users'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Story Creator API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
