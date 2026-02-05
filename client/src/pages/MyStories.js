import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserStories, deleteStory } from '../services/storyService';
import StoryCard from '../components/StoryCard';
import './MyStories.css';

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const data = await getUserStories();
      setStories(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      try {
        await deleteStory(id);
        setStories(stories.filter(story => story._id !== id));
      } catch (err) {
        setError(err);
      }
    }
  };

  if (loading) {
    return <div className="container">Loading your stories...</div>;
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="my-stories-header">
        <h1>My Stories</h1>
        <Link to="/create" className="btn btn-primary">
          ➕ Create New Story
        </Link>
      </div>

      {stories.length === 0 ? (
        <div className="no-stories">
          <p>You haven't created any stories yet.</p>
          <Link to="/create" className="btn btn-primary">
            Create Your First Story
          </Link>
        </div>
      ) : (
        <div className="story-grid">
          {stories.map(story => (
            <StoryCard 
              key={story._id} 
              story={story} 
              showEdit={true}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyStories;
