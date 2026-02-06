const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const seedData = require('./seed');
const Story = require('./models/Story');
const User = require('./models/User');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection with auto-seeding
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/story-creator')
  .then(async () => {
    console.log('MongoDB connected successfully');
    
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
