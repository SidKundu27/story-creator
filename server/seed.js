const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Story = require('./models/Story');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/story-creator';

// Determine a short, non-sensitive label for the connection (local / atlas / host)
const getMongoLabel = (uri) => {
  if (!uri) return 'unknown';
  const lower = uri.toLowerCase();
  if (lower.includes('localhost') || lower.includes('127.0.0.1')) return 'local';
  if (lower.includes('atlas.mongodb.net')) return 'MongoDB Atlas';
  // strip protocol
  let s = uri.replace(/^mongodb(\+srv)?:\/\//i, '');
  // remove creds before @
  if (s.includes('@')) s = s.split('@').pop();
  // host list comes before '/'
  s = s.split('/')[0];
  // take first host (in case of replicaSet)
  s = s.split(',')[0];
  // remove port
  s = s.split(':')[0];
  return `host: ${s}`;
};
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
    if (!silent) {
      const label = getMongoLabel(MONGODB_URI);
      console.log(`✓ Connected to MongoDB (${label})`);
    }

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
    const supplementalStories = [
      {
        title: 'Glass Harbor',
        description: 'A tidebound mystery about a dockworker who finds a map etched into a broken lens.',
        coverImage: null,
        coverImageCaption: '',
        nodes: [
          { nodeId: 'start', name: 'Arrival', content: 'You reach the harbor at low tide. The glassworks are quiet, but one window still glows.', isEnding: false, choices: [{ text: 'Walk toward the light', nextNodeId: 'node_1' }, { text: 'Search the pier', nextNodeId: 'node_2' }] },
          { nodeId: 'node_1', name: 'The Glassworks', content: 'Inside, the furnaces are cold. A single lens rests on the table, warm to the touch.', isEnding: false, choices: [{ text: 'Look through the lens', nextNodeId: 'node_3' }, { text: 'Pocket it and leave', nextNodeId: 'node_4' }] },
          { nodeId: 'node_2', name: 'The Pier', content: 'Under the boards, you find a tin box wrapped in rope and salt-crusted paper.', isEnding: false, choices: [{ text: 'Open the box', nextNodeId: 'node_3' }, { text: 'Take the box to the lens maker', nextNodeId: 'node_4' }] },
          { nodeId: 'node_3', name: 'Ending: The Map', content: 'The lens reveals a hidden channel under the harbor. The city has been waiting for someone to read it.', isEnding: true, choices: [] },
          { nodeId: 'node_4', name: 'Ending: The Seal', content: 'You close the door behind you. Some maps stay hidden for another tide.', isEnding: true, choices: [] },
        ],
        startNodeId: 'start',
        tags: ['Mystery', 'Adventure'],
        genres: ['Mystery', 'Adventure'],
        mainCategory: 'Mystery',
        isPublished: true,
        plays: 22,
        likes: 5,
      },
      {
        title: 'Ashes of the Sun Choir',
        description: 'A short fantasy about a city where songs are used to keep the sky from cracking open.',
        coverImage: null,
        coverImageCaption: '',
        nodes: [
          { nodeId: 'start', name: 'The Bell Tower', content: 'At dawn, the bell tower rings without a rope. The choir has gone silent.', isEnding: false, choices: [{ text: 'Climb the tower', nextNodeId: 'node_1' }, { text: 'Follow the choir road', nextNodeId: 'node_2' }] },
          { nodeId: 'node_1', name: 'Upper Spire', content: 'At the top, you find a cracked harp and a window looking into bright nothing.', isEnding: false, choices: [{ text: 'Play the harp', nextNodeId: 'node_3' }, { text: 'Shatter the window', nextNodeId: 'node_4' }] },
          { nodeId: 'node_2', name: 'Choir Road', content: 'The road is lined with ash and prayer ribbons. Each ribbon hums when the wind passes.', isEnding: false, choices: [{ text: 'Collect the ribbons', nextNodeId: 'node_3' }, { text: 'Keep walking', nextNodeId: 'node_4' }] },
          { nodeId: 'node_3', name: 'Ending: Refrain', content: 'The song returns to the city. The sky steadies, and the bells remember their purpose.', isEnding: true, choices: [] },
          { nodeId: 'node_4', name: 'Ending: Fallout', content: 'The silence breaks. Something vast notices the gap and begins to lean in.', isEnding: true, choices: [] },
        ],
        startNodeId: 'start',
        tags: ['Fantasy', 'Drama'],
        genres: ['Fantasy', 'Drama'],
        mainCategory: 'Fantasy',
        isPublished: true,
        plays: 31,
        likes: 8,
      },
      {
        title: 'Night Train to Helix Nine',
        description: 'A sci-fi chase through an orbital rail line where every carriage is running a different time.',
        coverImage: null,
        coverImageCaption: '',
        nodes: [
          { nodeId: 'start', name: 'Platform Zero', content: 'The train arrives with no doors open and no announcement. Your ticket is still warm.', isEnding: false, choices: [{ text: 'Jump aboard', nextNodeId: 'node_1' }, { text: 'Wait for the next train', nextNodeId: 'node_2' }] },
          { nodeId: 'node_1', name: 'First Car', content: 'The first car contains luggage, static, and a woman who insists this stop has already happened.', isEnding: false, choices: [{ text: 'Ask about the station', nextNodeId: 'node_3' }, { text: 'Check the luggage', nextNodeId: 'node_4' }] },
          { nodeId: 'node_2', name: 'The Delay', content: 'The platform lights dim. Far out in the dark, another train passes with your face in every window.', isEnding: false, choices: [{ text: 'Run after it', nextNodeId: 'node_3' }, { text: 'Hide under the bench', nextNodeId: 'node_4' }] },
          { nodeId: 'node_3', name: 'Ending: Arrival', content: 'You step off at Helix Nine. The station clerk stamps your ticket and smiles like they know the ending.', isEnding: true, choices: [] },
          { nodeId: 'node_4', name: 'Ending: Loop', content: 'The train keeps going. The same announcement returns, each time a little closer to your name.', isEnding: true, choices: [] },
        ],
        startNodeId: 'start',
        tags: ['Sci-Fi', 'Thriller'],
        genres: ['Sci-Fi', 'Thriller'],
        mainCategory: 'Sci-Fi',
        isPublished: true,
        plays: 45,
        likes: 11,
      },
    ];
    const allStoriesData = [...storiesData, ...supplementalStories];
    if (!silent) console.log(`✓ Loaded ${allStoriesData.length} story/stories including supplemental seed data`);

    // Create stories from JSON data
    const createdStories = [];
    for (const storyData of allStoriesData) {
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
