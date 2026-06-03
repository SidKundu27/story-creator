import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import { getUserStories, deleteStory } from '../services/storyService';
import StoryCard from '../components/story/StoryCard';
import ConfirmDialog from '../components/story-editor/ConfirmDialog';
import './MyStories.css';

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, storyId: null });

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
    setDeleteConfirm({ isOpen: true, storyId: id });
  };

  const confirmDelete = async () => {
    const id = deleteConfirm.storyId;
    setDeleteConfirm({ isOpen: false, storyId: null });
    try {
      await deleteStory(id);
      setStories(stories.filter(story => story._id !== id));
    } catch (err) {
      setError(err);
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
        <Button component={RouterLink} to="/create" variant="contained" size="medium" sx={{ minWidth: 166, textTransform: 'none' }}>Create New Story</Button>
      </div>

      {stories.length === 0 ? (
        <div className="no-stories">
          <p>You haven't created any stories yet.</p>
          <Button component={RouterLink} to="/create" variant="contained" size="medium" sx={{ minWidth: 190, textTransform: 'none' }}>Create Your First Story</Button>
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

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        message="Are you sure you want to delete this story? This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ isOpen: false, storyId: null })}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default MyStories;
