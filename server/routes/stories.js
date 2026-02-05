const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Story = require('../models/Story');
const User = require('../models/User');

// @route   GET /api/stories
// @desc    Get all published stories (feed)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const stories = await Story.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .select('-nodes') // Don't include full story nodes in feed
      .limit(50);
    
    res.json(stories);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/stories/:id
// @desc    Get story by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Increment play count only if story is published AND not in preview mode
    const isPreview = req.query.preview === 'true';
    if (story.isPublished && !isPreview) {
      story.plays += 1;
      await story.save();
    }

    res.json(story);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/stories
// @desc    Create a new story
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, nodes, startNodeId, tags, isPublished } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const newStory = new Story({
      title,
      description,
      author: req.user.id,
      authorName: user.username,
      nodes: nodes || [{
        nodeId: 'start',
        content: 'Your story begins here...',
        isEnding: false,
        choices: []
      }],
      startNodeId: startNodeId || 'start',
      tags: tags || [],
      genres: req.body.genres || [],
      colorTheme: req.body.colorTheme || 'light',
      isPublished: isPublished || false
    });

    const story = await newStory.save();

    // Add story to user's stories
    user.stories.push(story._id);
    await user.save();

    res.json(story);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/stories/:id
// @desc    Update a story
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user owns the story
    if (story.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, nodes, startNodeId, tags, isPublished } = req.body;

    // Update fields
    if (title) story.title = title;
    if (description) story.description = description;
    if (nodes) story.nodes = nodes;
    if (startNodeId) story.startNodeId = startNodeId;
    if (tags) story.tags = tags;
    if (req.body.genres) story.genres = req.body.genres;
    if (req.body.colorTheme) story.colorTheme = req.body.colorTheme;
    if (typeof isPublished !== 'undefined') story.isPublished = isPublished;

    await story.save();

    res.json(story);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/stories/:id
// @desc    Delete a story
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user owns the story
    if (story.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await story.deleteOne();

    // Remove story from user's stories
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { stories: req.params.id }
    });

    res.json({ message: 'Story deleted' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/stories/:id/like
// @desc    Like a story
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    story.likes += 1;
    await story.save();

    res.json({ likes: story.likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
