import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getStoryById, createStory, updateStory } from '../services/storyService';
import StoryCreatorStep1 from './StoryCreatorStep1';
import StoryCreatorStep2 from './StoryCreatorStep2';
import StoryCreatorStep3 from './StoryCreatorStep3';
import './StoryCreatorMultiStep.css';

const StoryCreatorMultiStep = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState(null);
  const autoSaveTimeoutRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    coverImage: '',
    coverImageCaption: '',
    tags: [],
    genres: [],
    colorTheme: 'light',
    isDraft: true
  });

  const [nodes, setNodes] = useState([
    {
      nodeId: 'start',
      name: 'Start',
      content: '',
      isEnding: false,
      choices: []
    }
  ]);

  const storyIdRef = useRef(id);
  const stepContentRef = useRef(null);

  const availableGenres = ['Adventure', 'Fantasy', 'Mystery', 'Sci-Fi', 'Horror', 'Romance', 'Comedy', 'Thriller'];

  useEffect(() => {
    if (isEditing) {
      loadStory();
    }
  }, [id]);

  // Auto-save functionality
  useEffect(() => {
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Only auto-save if editing and we have a story ID
    if (!isEditing || !storyIdRef.current) {
      return;
    }

    // Set a new timeout for auto-save (every 30 seconds)
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, 30000);

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [formData, nodes, isEditing]);

  const performAutoSave = async () => {
    if (!storyIdRef.current) return;

    setAutoSaving(true);
    try {
      const storyData = {
        title: formData.title,
        description: formData.description,
        coverImage: formData.coverImage,
        coverImageCaption: formData.coverImageCaption,
        tags: formData.tags,
        genres: formData.genres,
        colorTheme: formData.colorTheme,
        nodes: nodes,
        startNodeId: 'start',
        isPublished: false
      };

      await updateStory(storyIdRef.current, storyData);
      setLastSavedTime(new Date());
    } catch (err) {
      console.error('Auto-save failed:', err);
    } finally {
      setAutoSaving(false);
    }
  };

  const loadStory = async () => {
    try {
      const story = await getStoryById(id);
      storyIdRef.current = story._id;
      setFormData({
        title: story.title,
        description: story.description,
        coverImage: story.coverImage || '',
        coverImageCaption: story.coverImageCaption || '',
        tags: story.tags || [],
        genres: story.genres || [],
        colorTheme: story.colorTheme || 'light',
        isDraft: !story.isPublished
      });
      setNodes(story.nodes);
      setLastSavedTime(story.updatedAt ? new Date(story.updatedAt) : null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    // Validation based on step
    if (currentStep === 1) {
      if (!formData.title || !formData.description) {
        setError('Title and description are required');
        scrollToTop();
        return;
      }
    } else if (currentStep === 2) {
      if (nodes.some(node => !node.content)) {
        setError('All nodes must have content');
        scrollToTop();
        return;
      }
    }

    setError('');
    setCurrentStep(currentStep + 1);
    scrollToTop();
  };

  const scrollToTop = () => {
    if (stepContentRef.current) {
      stepContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrevious = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  if (loading) {
    return <div className="container">Loading story...</div>;
  }

  const progressPercentage = (currentStep / 3) * 100;

  return (
    <div className="story-creator-container">
      <div className="creator-header">
        <h1>{isEditing ? 'Edit Story' : 'Create New Story'}</h1>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
        </div>
        <div className="step-indicator">
          <div className={`step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Story Info</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Nodes</span>
          </div>
          <div className="step-divider"></div>
          <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Preview</span>
          </div>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="step-content" ref={stepContentRef}>
        {currentStep === 1 && (
          <StoryCreatorStep1
            formData={formData}
            setFormData={setFormData}
            availableGenres={availableGenres}
          />
        )}

        {currentStep === 2 && (
          <StoryCreatorStep2
            nodes={nodes}
            setNodes={setNodes}
          />
        )}

        {currentStep === 3 && (
          <StoryCreatorStep3
            formData={formData}
            setFormData={setFormData}
            nodes={nodes}
            isEditing={isEditing}
            storyId={id}
            onComplete={() => navigate('/my-stories')}
          />
        )}
      </div>

      <div className="step-actions">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="btn btn-secondary"
        >
          ← Back
        </button>

        <div className="step-info">
          <span>Step {currentStep} of 3</span>
          {isEditing && (
            <span className="auto-save-indicator">
              {autoSaving ? '💾 Saving...' : lastSavedTime ? `✓ Last saved ${formatTime(lastSavedTime)}` : ''}
            </span>
          )}
        </div>

        {currentStep < 3 && (
          <button
            onClick={handleNext}
            className="btn btn-primary"
          >
            Next →
          </button>
        )}

        {currentStep === 3 && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => {/* Save draft logic */}}
              className="btn btn-secondary"
            >
              Save Draft
            </button>
            <button
              onClick={() => {/* Publish logic */}}
              className="btn btn-success"
            >
              Publish Story
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function formatTime(date) {
  if (!date) return '';
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffSecs = Math.floor(diffMs / 1000);

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else {
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ago`;
  }
}

export default StoryCreatorMultiStep;
