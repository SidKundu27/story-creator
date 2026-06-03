const mongoose = require('mongoose');
const Story = require('./models/Story');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/story-creator';

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, { connectTimeoutMS: 5000 });
    console.log('Connected to:', MONGODB_URI.includes('localhost') ? 'local' : MONGODB_URI.replace(/mongodb(\+srv)?:\/\//i, '').split('/')[0]);
    const users = await User.find({}, 'username email stories').lean();
    const stories = await Story.find({}, 'title authorName createdAt nodes').lean();

    console.log(`Users count: ${users.length}`);
    users.forEach(u => console.log(`- ${u._id} · ${u.username} · ${u.email} · stories:${(u.stories||[]).length}`));

    console.log(`Stories count: ${stories.length}`);
    stories.forEach(s => console.log(`- ${s._id} · ${s.title} · author:${s.authorName} · nodes:${(s.nodes||[]).length}`));

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message || err);
    process.exit(1);
  }
})();
