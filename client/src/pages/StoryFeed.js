import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { getAllStories } from '../services/storyService';
import { AuthContext } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';
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
    return <div className="container error">{error}</div>;
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
            <Link to="/my-stories" className="btn btn-success">
              Create New Story
            </Link>
          )}
        </div>
      </div>

      <div className="feed-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search stories, tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="popular">Most Played</option>
            <option value="liked">Most Liked</option>
          </select>
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
                <Link to="/my-stories" className="btn btn-primary">
                  Create Your First Story
                </Link>
              ) : (
                <Link to="/register" className="btn btn-primary">
                  Sign Up to Create Stories
                </Link>
              )}
            </>
          )}
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="btn btn-secondary">
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="story-grid">
          {filteredStories.map(story => (
            <StoryCard key={story._id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryFeed;
