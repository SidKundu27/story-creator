import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { getAllStories } from '../services/storyService';
import { AuthContext } from '../context/AuthContext';
import StoryCard from '../components/story/StoryCard';
import './StoryFeed.css';

const StoryFeed = () => {
  const { user } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    loadStories();
  }, []);

  useEffect(() => {
    filterAndSortStories();
  }, [stories, searchTerm, sortBy]);

  const loadStories = async () => {
    try {
      const data = await getAllStories();
      setStories(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortStories = () => {
    let filtered = [...stories];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.plays - a.plays);
    } else if (sortBy === 'liked') {
      filtered.sort((a, b) => b.likes - a.likes);
    }

    setFilteredStories(filtered);
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="feed-header">
        <div className="feed-header-content">
          <div className="feed-header-text">
            <h1>Story Feed</h1>
            <p>Discover and play community-created adventures</p>
          </div>
          {user && (
            <Button component={RouterLink} to="/my-stories" variant="contained" color="success" size="medium" sx={{ minWidth: 166, textTransform: 'none' }}>Create New Story</Button>
          )}
        </div>
      </div>

      <div className="feed-controls">
        <div className="search-box">
          <TextField className="search-field" size="small" fullWidth placeholder="Search stories, tags..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>

        <div className="sort-controls">
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="sort-by-label">Sort by</InputLabel>
            <Select labelId="sort-by-label" value={sortBy} label="Sort by" onChange={(e) => setSortBy(e.target.value)}>
              <MenuItem value="recent">Most Recent</MenuItem>
              <MenuItem value="popular">Most Played</MenuItem>
              <MenuItem value="liked">Most Liked</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>

      <div className="feed-stats">
        <span>{filteredStories.length} stories found</span>
      </div>

      {filteredStories.length === 0 ? (
        <div className="no-stories">
          <p>No stories match your search.</p>
          {!searchTerm && stories.length === 0 && (
            <>
              <p style={{ fontSize: '16px', marginBottom: '30px' }}>No published stories yet. Be the first to create one!</p>
              {user ? (
                <Button component={RouterLink} to="/my-stories" variant="contained" size="medium" sx={{ minWidth: 190, textTransform: 'none' }}>Create Your First Story</Button>
              ) : (
                <Button component={RouterLink} to="/register" variant="contained" size="medium" sx={{ minWidth: 198, textTransform: 'none' }}>Sign Up to Create Stories</Button>
              )}
            </>
          )}
          {searchTerm && (
            <Button onClick={() => setSearchTerm('')} variant="outlined" size="small" sx={{ textTransform: 'none' }}>Clear Search</Button>
          )}
        </div>
      ) : (
        <div className="story-grid">
          {filteredStories.map(story => (
            <StoryCard key={story._id} story={story} showBadge={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryFeed;
