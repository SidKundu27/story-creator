import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createStory, updateStory, getStoryById } from '../services/storyService';
import MarkdownToolbar from '../components/MarkdownToolbar';
import MarkdownPreview from '../components/MarkdownPreview';
import NodeGraph from '../components/NodeGraph';
import './StoryCreator.css';

const StoryCreator = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const textareaRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    genres: [],
    colorTheme: 'light',
    isPublished: false,
    coverImage: '',
    coverImageCaption: ''
  });

  const [showPreview, setShowPreview] = useState(false);
  const [showNodeGraph, setShowNodeGraph] = useState(false);

  const availableGenres = ['Adventure', 'Fantasy', 'Mystery', 'Sci-Fi', 'Horror', 'Romance', 'Comedy', 'Thriller'];
  
  const colorThemes = {
    light: { name: 'Light', bg: '#ffffff', text: '#333333', titleBg: '#f8f9fa' },
    dark: { name: 'Dark', bg: '#2c3e50', text: '#ecf0f1', titleBg: '#34495e' },
    horror: { name: 'Horror', bg: '#1a1a1a', text: '#b8b8b8', titleBg: '#2d0a0a' },
    fantasy: { name: 'Fantasy', bg: '#4a148c', text: '#e1bee7', titleBg: '#6a1b9a' },
    scifi: { name: 'Sci-Fi', bg: '#01579b', text: '#b3e5fc', titleBg: '#0277bd' },
    nature: { name: 'Nature', bg: '#1b5e20', text: '#c8e6c9', titleBg: '#2e7d32' },
    sunset: { name: 'Sunset', bg: '#ff6f00', text: '#fff3e0', titleBg: '#f57c00' },
    ocean: { name: 'Ocean', bg: '#006064', text: '#b2ebf2', titleBg: '#00838f' }
  };

  const [nodes, setNodes] = useState([
    {
      nodeId: 'start',
      name: 'Start',
      content: '',
      isEnding: false,
      choices: []
    }
  ]);

  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadStory();
    }
  }, [id]);

  const loadStory = async () => {
    try {
      const story = await getStoryById(id);
      setFormData({
        title: story.title,
        description: story.description,
        tags: story.tags.join(', '),
        genres: story.genres || [],
        colorTheme: story.colorTheme || 'light',
        isPublished: story.isPublished,
        coverImage: story.coverImage || '',
        coverImageCaption: story.coverImageCaption || ''
      });
      setNodes(story.nodes);
    } catch (err) {
      setError(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleGenre = (genre) => {
    const genres = formData.genres.includes(genre)
      ? formData.genres.filter(g => g !== genre)
      : [...formData.genres, genre];
    setFormData({ ...formData, genres });
  };

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNodeContentChange = (e) => {
    const updatedNodes = [...nodes];
    updatedNodes[selectedNodeIndex].content = e.target.value;
    setNodes(updatedNodes);
  };

  const handleMarkdownInsert = (newValue) => {
    const updatedNodes = [...nodes];
    updatedNodes[selectedNodeIndex].content = newValue;
    setNodes(updatedNodes);
  };

  const handleNodeNameChange = (e) => {
    const updatedNodes = [...nodes];
    updatedNodes[selectedNodeIndex].name = e.target.value;
    setNodes(updatedNodes);
  };

  const handleNodeEndingChange = (e) => {
    const updatedNodes = [...nodes];
    updatedNodes[selectedNodeIndex].isEnding = e.target.checked;
    setNodes(updatedNodes);
  };

  const addChoice = () => {
    const updatedNodes = [...nodes];
    updatedNodes[selectedNodeIndex].choices.push({
      text: '',
      nextNodeId: ''
    });
    setNodes(updatedNodes);
  };

  const updateChoice = (choiceIndex, field, value) => {
    const updatedNodes = [...nodes];
    updatedNodes[selectedNodeIndex].choices[choiceIndex][field] = value;
    setNodes(updatedNodes);
  };

  const removeChoice = (choiceIndex) => {
    const updatedNodes = [...nodes];
    updatedNodes[selectedNodeIndex].choices.splice(choiceIndex, 1);
    setNodes(updatedNodes);
  };

  const generateNodeName = (index) => {
    if (index === 0) return 'Start';
    return `Choice Point ${index}`;
  };

  const addNode = () => {
    const newNodeId = `node_${Date.now()}`;
    setNodes([
      ...nodes,
      {
        nodeId: newNodeId,
        name: generateNodeName(nodes.length),
        content: '',
        isEnding: false,
        choices: []
      }
    ]);
    setSelectedNodeIndex(nodes.length);
  };

  const removeNode = (index) => {
    if (nodes.length === 1) {
      setError('Cannot delete the only node');
      return;
    }
    const updatedNodes = nodes.filter((_, i) => i !== index);
    setNodes(updatedNodes);
    setSelectedNodeIndex(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.title || !formData.description) {
      setError('Title and description are required');
      setLoading(false);
      return;
    }

    if (nodes.some(node => !node.content)) {
      setError('All nodes must have content');
      setLoading(false);
      return;
    }

    const storyData = {
      title: formData.title,
      description: formData.description,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      genres: formData.genres,
      colorTheme: formData.colorTheme,
      coverImage: formData.coverImage,
      coverImageCaption: formData.coverImageCaption,
      nodes: nodes,
      startNodeId: 'start',
      isPublished: formData.isPublished
    };

    try {
      if (isEditing) {
        await updateStory(id, storyData);
        setSuccess('Story updated successfully!');
      } else {
        await createStory(storyData);
        setSuccess('Story created successfully!');
      }
      setTimeout(() => navigate('/my-stories'), 1500);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const currentNode = nodes[selectedNodeIndex];

  return (
    <div className="container">
      <div className="creator-container">
        <h1>{isEditing ? 'Edit Story' : 'Create New Story'}</h1>

        <form onSubmit={handleSubmit}>
          {/* Story Info */}
          <div className="card">
            <h2>Story Information</h2>
            <div className="form-group">
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Cover Image (shown on story cards)</label>
              <div className="image-upload-group">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageUpload}
                  id="cover-upload"
                />
                <label htmlFor="cover-upload" className="image-upload-label">
                  Upload Cover Image
                </label>
              </div>
              {formData.coverImage && (
                <div className="image-preview">
                  <img src={formData.coverImage} alt="Cover preview" />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, coverImage: '' })}
                    className="btn btn-danger btn-small"
                  >
                    Remove Cover
                  </button>
                </div>
              )}
              {formData.coverImage && (
                <div className="form-group">
                  <label>Cover Image Caption (optional)</label>
                  <input
                    type="text"
                    value={formData.coverImageCaption}
                    onChange={(e) => setFormData({ ...formData, coverImageCaption: e.target.value })}
                    placeholder="Brief description of the cover image"
                  />
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Genres</label>
              <div className="genre-selector">
                {availableGenres.map(genre => (
                  <button
                    key={genre}
                    type="button"
                    className={`genre-tag ${formData.genres.includes(genre) ? 'selected' : ''}`}
                    onClick={() => toggleGenre(genre)}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>

              <div className="form-group">
                <label>Color Theme</label>
                <div className="theme-selector">
                  {Object.entries(colorThemes).map(([key, theme]) => (
                    <button
                      key={key}
                      type="button"
                      className={`theme-option ${formData.colorTheme === key ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, colorTheme: key })}
                      style={{
                        background: theme.bg,
                        color: theme.text,
                        borderColor: formData.colorTheme === key ? '#667eea' : '#dee2e6'
                      }}
                    >
                      <div className="theme-name">{theme.name}</div>
                      <div className="theme-colors">
                        <span className="color-dot" style={{ background: theme.bg }} title="Background"></span>
                        <span className="color-dot" style={{ background: theme.text }} title="Text"></span>
                        <span className="color-dot" style={{ background: theme.titleBg }} title="Title Card"></span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Theme Preview */}
                <div className="theme-preview" style={{
                  background: colorThemes[formData.colorTheme].bg,
                  color: colorThemes[formData.colorTheme].text
                }}>
                  <div className="preview-title" style={{
                    background: `linear-gradient(135deg, ${colorThemes[formData.colorTheme].titleBg}dd 0%, ${colorThemes[formData.colorTheme].titleBg}aa 100%)`
                  }}>
                    <h4>Story Title</h4>
                    <small>by Author</small>
                  </div>
                  <div className="preview-content">
                    <p>This is how your story will look with this theme. The text will be readable against the background, and the title card will have a complementary color.</p>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Tags (comma-separated, optional)</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="additional keywords"
              />
            </div>

            <div className="form-group publish-group">
              <label className="publish-checkbox">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                />
                <span className="checkbox-label">Publish story (make visible to others)</span>
              </label>
            </div>
          </div>

          {/* Node Management */}
          <div className="card">
            <div className="node-header">
              <h2>Story Nodes</h2>
              <div className="node-header-actions">
                <button 
                  type="button" 
                  onClick={() => setShowNodeGraph(!showNodeGraph)} 
                  className="btn btn-secondary btn-small"
                  title="Toggle node graph visualization"
                >
                  {showNodeGraph ? '📖' : '📊'} {showNodeGraph ? 'Hide' : 'Show'} Graph
                </button>
                <button type="button" onClick={addNode} className="btn btn-success">
                  + Add Node
                </button>
              </div>
            </div>

            {showNodeGraph && (
              <NodeGraph 
                nodes={nodes} 
                selectedNodeIndex={selectedNodeIndex}
                onNodeSelect={setSelectedNodeIndex}
                startNodeId="start"
              />
            )}

            <div className="node-selector">
              {nodes.map((node, index) => (
                <button
                  key={node.nodeId}
                  type="button"
                  className={`node-tab ${index === selectedNodeIndex ? 'active' : ''}`}
                  onClick={() => setSelectedNodeIndex(index)}
                >
                  {node.name || node.nodeId}
                </button>
              ))}
            </div>

            {selectedNodeIndex > 0 && (
              <div className="node-actions">
                <button
                  type="button"
                  onClick={() => removeNode(selectedNodeIndex)}
                  className="btn btn-danger btn-small"
                >
                  Delete Current Node
                </button>
              </div>
            )}

            {/* Current Node Editor */}
            <div className="node-editor">
              <div className="node-editor-header">
                <h3>Edit Node</h3>
                <span className="node-id-badge">{currentNode.nodeId}</span>
              </div>

              <div className="form-group">
                <label>Node Name</label>
                <input
                  type="text"
                  value={currentNode.name || currentNode.nodeId}
                  onChange={handleNodeNameChange}
                  placeholder="Name for this node"
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <MarkdownToolbar 
                  onInsert={handleMarkdownInsert}
                  textareaRef={textareaRef}
                />
                <textarea
                  ref={textareaRef}
                  value={currentNode.content}
                  onChange={handleNodeContentChange}
                  placeholder="Write the story content for this node using markdown-style formatting..."
                  rows="8"
                  className="markdown-textarea"
                />
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn btn-secondary btn-small"
                  style={{ marginTop: '8px' }}
                >
                  {showPreview ? '✕' : '👁'} {showPreview ? 'Hide' : 'Show'} Preview
                </button>
                {showPreview && (
                  <MarkdownPreview 
                    content={currentNode.content}
                    isVisible={showPreview}
                  />
                )}
              </div>

              <div className="form-group">
                <label className="checkbox-label-group">
                  <input
                    type="checkbox"
                    checked={currentNode.isEnding}
                    onChange={handleNodeEndingChange}
                  />
                  <span>This is an ending node</span>
                </label>
              </div>

              {!currentNode.isEnding && (
                <div className="choices-editor">
                  <div className="choices-header">
                    <h3>
                      Choices
                      <span className="choices-count">{currentNode.choices.length}</span>
                    </h3>
                    <button type="button" onClick={addChoice} className="btn btn-secondary">
                      Add Choice
                    </button>
                  </div>

                  {currentNode.choices.map((choice, choiceIndex) => (
                    <div key={choiceIndex} className="choice-item">
                      <div className="choice-item-header">
                        <span className="choice-number">Choice #{choiceIndex + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeChoice(choiceIndex)}
                          className="btn btn-danger btn-small"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="form-group">
                        <label>Choice Text</label>
                        <input
                          type="text"
                          value={choice.text}
                          onChange={(e) => updateChoice(choiceIndex, 'text', e.target.value)}
                          placeholder="What action can the player take?"
                        />
                      </div>

                      <div className="form-group">
                        <label>Next Node</label>
                        <select
                          value={choice.nextNodeId}
                          onChange={(e) => updateChoice(choiceIndex, 'nextNodeId', e.target.value)}
                        >
                          <option value="">Select destination node...</option>
                          {nodes.map(node => (
                            <option key={node.nodeId} value={node.nodeId}>
                              {node.name || node.nodeId} {node.isEnding ? '(Ending)' : ''}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : isEditing ? 'Update Story' : 'Create Story'}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/my-stories')} 
              className="btn btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StoryCreator;
