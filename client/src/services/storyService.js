import axios from 'axios';

const API_URL = '/api/stories';

// Get all published stories
export const getAllStories = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || 'Error fetching stories';
  }
};

// Get story by ID
export const getStoryById = async (id) => {
  try {
    // Handle id that already includes query params
    const url = id.includes('?') ? `${API_URL}/${id}` : `${API_URL}/${id}`;
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || 'Error fetching story';
  }
};

// Create new story
export const createStory = async (storyData) => {
  try {
    const res = await axios.post(API_URL, storyData);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || 'Error creating story';
  }
};

// Update story
export const updateStory = async (id, storyData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, storyData);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || 'Error updating story';
  }
};

// Delete story
export const deleteStory = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || 'Error deleting story';
  }
};

// Like a story
export const likeStory = async (id) => {
  try {
    const res = await axios.post(`${API_URL}/${id}/like`);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || 'Error liking story';
  }
};

// Get user's stories
export const getUserStories = async () => {
  try {
    const res = await axios.get('/api/users/stories');
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || 'Error fetching user stories';
  }
};
