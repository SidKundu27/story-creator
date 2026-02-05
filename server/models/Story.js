const mongoose = require('mongoose');

const ChoiceSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  nextNodeId: {
    type: String,
    required: true
  }
});

const CreatorStyleSchema = new mongoose.Schema({
  backgroundColor: {
    type: String,
    default: '#ffffff'
  },
  textColor: {
    type: String,
    default: '#333333'
  },
  accentColor: {
    type: String,
    default: '#667eea'
  },
  fontFamily: {
    type: String,
    default: 'serif'
  },
  fontSize: {
    type: Number,
    default: 16
  },
  lineHeight: {
    type: Number,
    default: 2
  }
}, { _id: false });

const StoryNodeSchema = new mongoose.Schema({
  nodeId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    required: true
  },
  isEnding: {
    type: Boolean,
    default: false
  },
  choices: [ChoiceSchema]
});

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    default: null
  },
  coverImageCaption: {
    type: String,
    default: ''
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  nodes: [StoryNodeSchema],
  startNodeId: {
    type: String,
    default: 'start'
  },
  tags: [String],
  genres: [String],
  colorTheme: {
    type: String,
    default: 'light'
  },
  creatorStyle: CreatorStyleSchema,
  isPublished: {
    type: Boolean,
    default: false
  },
  plays: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
StorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Story', StorySchema);
