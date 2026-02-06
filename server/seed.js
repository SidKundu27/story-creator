const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Story = require('./models/Story');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/story-creator';

// Prompt user for input
const askQuestion = (rl, query) => {
  return new Promise(resolve => rl.question(query, resolve));
};

const seedData = async (options = {}) => {
  const { silent = false, clearExisting = false } = options;
  let rl;
  
  try {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    if (!silent) console.log('✓ Connected to MongoDB');

    let shouldClear = clearExisting;
    
    // Ask user if they want to clear existing data (only in interactive mode)
    if (!silent) {
      rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
      const answer = await askQuestion(rl, '\nDo you want to DELETE existing data? (yes/no): ');
      shouldClear = answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y';
    }
    
    if (shouldClear) {
      if (!silent) console.log('\nClearing existing data...');
      await User.deleteMany({});
      await Story.deleteMany({});
      if (!silent) console.log('✓ Cleared existing data');
    } else {
      if (!silent) console.log('\n✓ Keeping existing data');
    }

    // Create the author
    if (!silent) console.log('Creating author...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt); // Default password for seed data

    const author = await User.create({
      username: 'DrSod',
      email: 'test@gmail.com',
      password: hashedPassword,
      stories: []
    });
    if (!silent) console.log('✓ Created author:', author.username);

    // Load stories from JSON file
    if (!silent) console.log('Loading stories from JSON file...');
    const storiesFilePath = path.join(__dirname, 'story-creator.stories.json');
    const storiesData = JSON.parse(fs.readFileSync(storiesFilePath, 'utf8'));
    if (!silent) console.log(`✓ Loaded ${storiesData.length} story/stories from JSON`);

    // Create stories from JSON data
    const createdStories = [];
    for (const storyData of storiesData) {
      // Remove MongoDB-specific fields
      delete storyData._id;
      delete storyData.__v;
      delete storyData.createdAt;
      delete storyData.updatedAt;
      
      // Clean nodes array - remove _id from nodes and choices
      if (storyData.nodes && Array.isArray(storyData.nodes)) {
        storyData.nodes.forEach(node => {
          delete node._id;
          if (node.choices && Array.isArray(node.choices)) {
            node.choices.forEach(choice => {
              delete choice._id;
            });
          }
        });
      }
      
      // Set author information
      storyData.author = author._id;
      storyData.authorName = author.username;
      
      // Create the story
      const story = await Story.create(storyData);
      createdStories.push(story);
      if (!silent) console.log(`✓ Created story: ${story.title}`);
    }

    // Link stories to author
    author.stories = createdStories.map(s => s._id);
    await author.save();
    if (!silent) console.log('✓ Linked stories to author');

    if (!silent) {
      console.log('\n✅ Seed data created successfully!');
      console.log('\nLogin credentials:');
      console.log('  Email: test@gmail.com');
      console.log('  Password: password123');
      console.log(`\nCreated ${createdStories.length} story/stories`);
      console.log(`Author ID: ${author._id}`);
    }

    return { success: true, storiesCount: createdStories.length };

  } catch (error) {
    if (!silent) console.log('❌ Error seeding data:', error);
    throw error;
  } finally {
    if (rl) rl.close();
    // Only close connection if we opened it (not when called from server)
    if (!silent && mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n✓ Database connection closed');
    }
  }
};

// Run the seed function when called directly
if (require.main === module) {
  seedData().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = seedData;
