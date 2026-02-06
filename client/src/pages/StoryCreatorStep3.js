import React, { useState } from 'react';
import { createStory, updateStory } from '../services/storyService';
import StoryCoverPage from '../components/StoryCoverPage';
import NodeGraph from '../components/NodeGraph';
import StoryPreviewPlayer from '../components/StoryPreviewPlayer';
import ConfirmDialog from '../components/ConfirmDialog';
import './StoryCreatorStep3.css';

const StoryCreatorStep3 = ({ formData, setFormData, nodes, isEditing, storyId, onComplete }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('cover');
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);
  const [showPublishConfirm, setShowPublishConfirm] = useState(false);

  const handleSaveDraft = async () => {
    setSaving(true);
    setError('');
    
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

      if (isEditing) {
        await updateStory(storyId, storyData);
      } else {
        await createStory(storyData);
      }

      // Show success message
      alert('Draft saved successfully!');
    } catch (err) {
      setError(err.message || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setShowPublishConfirm(true);
  };

  const confirmPublish = async () => {
    setShowPublishConfirm(false);
    setSaving(true);
    setError('');
    
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
        isPublished: true
      };

      if (isEditing) {
        await updateStory(storyId, storyData);
      } else {
        await createStory(storyData);
      }

      alert('Story published successfully!');
      onComplete();
    } catch (err) {
      setError(err.message || 'Failed to publish story');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="story-preview-container">
      <div className="preview-tabs">
        <button
          className={`preview-tab ${activeTab === 'cover' ? 'active' : ''}`}
          onClick={() => setActiveTab('cover')}
        >
          📖 Cover Page
        </button>
        <button
          className={`preview-tab ${activeTab === 'map' ? 'active' : ''}`}
          onClick={() => setActiveTab('map')}
        >
          📊 Story Map
        </button>
        <button
          className={`preview-tab ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
        >
          👁️ Preview
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="preview-content">
        {activeTab === 'cover' && (
          <div className="preview-section">
            <StoryCoverPage 
              story={{
                title: formData.title,
                description: formData.description,
                coverImage: formData.coverImage,
                coverImageCaption: formData.coverImageCaption,
                authorName: 'You',
                genres: formData.genres,
                plays: 0,
                likes: 0
              }}
              onStart={() => setActiveTab('preview')}
              onBack={null}
            />
          </div>
        )}

        {activeTab === 'map' && (
          <div className="preview-section">
            <div className="map-header">
              <h2>Story Structure Map</h2>
              <p>This shows how your story branches and connects</p>
            </div>
            <NodeGraph 
              nodes={nodes}
              selectedNodeIndex={selectedNodeIndex}
              onNodeSelect={setSelectedNodeIndex}
              startNodeId="start"
            />
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="preview-section">
            <StoryPreviewPlayer
              story={{
                title: formData.title,
                description: formData.description,
                coverImage: formData.coverImage,
                authorName: 'You',
                genres: formData.genres,
                colorTheme: formData.colorTheme,
                nodes: nodes,
                startNodeId: 'start'
              }}
            />
          </div>
        )}
      </div>

      <div className="preview-footer">
        <div className="story-stats">
          <div className="stat">
            <span className="stat-label">Scenes</span>
            <span className="stat-value">{nodes.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Endings</span>
            <span className="stat-value">{nodes.filter(n => n.isEnding).length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Choices</span>
            <span className="stat-value">
              {nodes.reduce((sum, n) => sum + (n.choices ? n.choices.length : 0), 0)}
            </span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showPublishConfirm}
        message="Ready to publish this story? It will be visible to all users."
        onConfirm={confirmPublish}
        onCancel={() => setShowPublishConfirm(false)}
        confirmText="Publish"
        cancelText="Cancel"
      />
    </div>
  );
};

export default StoryCreatorStep3;
