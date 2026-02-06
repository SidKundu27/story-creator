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
  mainCategory: {
    type: String,
    default: null
  },
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
