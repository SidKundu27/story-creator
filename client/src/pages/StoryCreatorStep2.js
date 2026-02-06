import React, { useState } from 'react';
import MarkdownToolbar from '../components/MarkdownToolbar';
import MarkdownPreview from '../components/MarkdownPreview';
import NodeGraph from '../components/NodeGraph';
import './StoryCreatorStep2.css';

const StoryCreatorStep2 = ({ nodes, setNodes }) => {
  const [selectedNodeIndex, setSelectedNodeIndex] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [sceneSearchQuery, setSceneSearchQuery] = useState('');
  const textareaRef = React.useRef(null);
  const [pasteError, setPasteError] = useState('');

  const currentNode = nodes[selectedNodeIndex];

  const handleNodeNameChange = (e) => {
    const updatedNodes = [...nodes];
    updatedNodes[selectedNodeIndex].name = e.target.value;
    setNodes(updatedNodes);
  };

  const handleNodeContentChange = (e) => {
    const updatedNodes = [...nodes];
    updatedNodes[selectedNodeIndex].content = e.target.value;
    setNodes(updatedNodes);
    setPasteError('');
  };

  const handleMarkdownInsert = (newValue) => {
    const updatedNodes = [...nodes];
    updatedNodes[selectedNodeIndex].content = newValue;
    setNodes(updatedNodes);
  };

  const handleImagePaste = (e) => {
    const items = e.clipboardData?.items || [];
    let imageFound = false;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        imageFound = true;
        const file = items[i].getAsFile();
        if (file) {
          // Check file size (limit to 5MB)
          if (file.size > 5 * 1024 * 1024) {
            setPasteError('Image is too large. Max size is 5MB.');
            return;
          }

          const reader = new FileReader();
          reader.onload = (event) => {
            const imageData = event.target.result;
            const imageName = file.name || `image_${Date.now()}`;
            
            // Insert image markdown syntax
            const textarea = textareaRef.current;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const beforeText = textarea.value.substring(0, start);
            const afterText = textarea.value.substring(end);
            
            // Create markdown image syntax with base64 data
            const imageMarkdown = `\n![${imageName}](data:${file.type};base64,${imageData.split(',')[1]})\n`;
            const newValue = beforeText + imageMarkdown + afterText;
            
            handleMarkdownInsert(newValue);
            setPasteError('');
            
            // Prevent default paste
            e.preventDefault();
          };
          reader.onerror = () => {
            setPasteError('Failed to read image file.');
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const toggleNodeEnding = () => {
    const updatedNodes = [...nodes];
    updatedNodes[selectedNodeIndex].isEnding = !updatedNodes[selectedNodeIndex].isEnding;
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

  const addNode = () => {
    const newNodeId = `node_${Date.now()}`;
    setNodes([
      ...nodes,
      {
        nodeId: newNodeId,
        name: `Scene ${nodes.length}`,
        content: '',
        isEnding: false,
        choices: []
      }
    ]);
  };

  const removeNode = (index) => {
    if (nodes.length === 1) return;
    if (!window.confirm(`Delete scene "${nodes[index].name || 'Untitled'}"? This cannot be undone.`)) {
      return;
    }
    const updatedNodes = nodes.filter((_, i) => i !== index);
    setNodes(updatedNodes);
    setSelectedNodeIndex(Math.min(selectedNodeIndex, updatedNodes.length - 1));
  };

  return (
    <div className="story-nodes-editor">
      <div className="nodes-sidebar">
        <div className="sidebar-header">
          <h3>Story Scenes</h3>
          <button
            type="button"
            onClick={addNode}
            className="btn btn-success btn-small"
          >
            + Add
          </button>
        </div>

        <div className="scene-search">
          <input
            type="text"
            placeholder="Search scenes..."
            value={sceneSearchQuery}
            onChange={(e) => setSceneSearchQuery(e.target.value)}
            className="scene-search-input"
          />
        </div>

        <div className="nodes-list">
          {nodes
            .map((node, idx) => ({ node, idx }))
            .filter(({ node }) => 
              node.name.toLowerCase().includes(sceneSearchQuery.toLowerCase())
            )
            .map(({ node, idx }) => (
            <div key={node.nodeId} className="node-item-container">
              <button
                className={`node-item ${idx === selectedNodeIndex ? 'active' : ''}`}
                onClick={() => setSelectedNodeIndex(idx)}
              >
                <span className="node-badge">{idx === 0 ? '▶' : node.isEnding ? '■' : '○'}</span>
                <span className="node-name">{node.name || node.nodeId}</span>
              </button>
              {idx > 0 && (
                <button
                  className="node-delete"
                  onClick={() => removeNode(idx)}
                  title="Delete this scene (requires confirmation)"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="nodes-editor">
        {showGraph && (
          <NodeGraph 
            nodes={nodes}
            selectedNodeIndex={selectedNodeIndex}
            onNodeSelect={setSelectedNodeIndex}
            startNodeId="start"
          />
        )}

        <div className="node-form">
          <div className="node-header">
            <div className="node-info">
              <label>Scene Name</label>
              <input
                type="text"
                value={currentNode.name || ''}
                onChange={handleNodeNameChange}
                placeholder="Give this scene a name..."
              />
            </div>
            
            <div className="node-type-selector">
              {selectedNodeIndex === 0 ? (
                <span className="node-type-badge start">Start</span>
              ) : currentNode.isEnding ? (
                <button
                  type="button"
                  onClick={toggleNodeEnding}
                  className="node-type-badge ending"
                >
                  Ending ✓
                </button>
              ) : (
                <button
                  type="button"
                  onClick={toggleNodeEnding}
                  className="node-type-badge choice"
                >
                  Mark as Ending
                </button>
              )}
            </div>
          </div>

          <div className="content-editor">
            <div className="editor-label">
              <label>Scene Content</label>
              <div className="editor-mode-buttons">
                <button
                  type="button"
                  onClick={() => setShowPreview(false)}
                  className={`mode-btn ${!showPreview ? 'active' : ''}`}
                  title="Edit markdown"
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowPreview(true)}
                  className={`mode-btn ${showPreview ? 'active' : ''}`}
                  title="Preview formatted content"
                >
                  👁️ Preview
                </button>
              </div>
            </div>

            {!showPreview && (
              <MarkdownToolbar 
                onInsert={handleMarkdownInsert}
                textareaRef={textareaRef}
              />
            )}

            <div className="editor-wrapper">
              {!showPreview ? (
                <>
                  <textarea
                    ref={textareaRef}
                    value={currentNode.content}
                    onChange={handleNodeContentChange}
                    onPaste={handleImagePaste}
                    placeholder="Write your scene content here. Use **bold**, *italic*, __underline__, ~~strike~~, [#highlight], and [link text](url). You can also paste images!"
                    className="content-textarea"
                  />
                  {pasteError && <div className="paste-error">{pasteError}</div>}
                </>
              ) : (
                <MarkdownPreview 
                  content={currentNode.content}
                  isVisible={true}
                />
              )}
            </div>
          </div>

          {!currentNode.isEnding && (
            <div className="choices-section">
              <div className="choices-header">
                <h3>Options for Reader</h3>
                <button
                  type="button"
                  onClick={addChoice}
                  className="btn btn-secondary btn-small"
                >
                  + Add Option
                </button>
              </div>

              {currentNode.choices && currentNode.choices.length > 0 ? (
                <div className="choices-list">
                  {currentNode.choices.map((choice, idx) => (
                    <div key={idx} className="choice-form">
                      <div className="choice-header">
                        <span className="choice-number">→ Option {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeChoice(idx)}
                          className="btn btn-danger btn-small"
                        >
                          Remove
                        </button>
                      </div>

                      <input
                        type="text"
                        value={choice.text}
                        onChange={(e) => updateChoice(idx, 'text', e.target.value)}
                        placeholder="What can the reader do?"
                        className="choice-text-input"
                      />

                      <select
                        value={choice.nextNodeId}
                        onChange={(e) => updateChoice(idx, 'nextNodeId', e.target.value)}
                        className="choice-target-select"
                      >
                        <option value="">Select next scene...</option>
                        {nodes.map(node => (
                          <option key={node.nodeId} value={node.nodeId}>
                            {node.name || node.nodeId}
                            {node.isEnding ? ' (Ending)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-choices">No options yet. Add one to let readers make choices.</p>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowGraph(!showGraph)}
          className="btn btn-secondary btn-hide-map"
        >
          {showGraph ? '📖' : '📊'} {showGraph ? 'Hide' : 'Show'} Map
        </button>
      </div>
    </div>
  );
};

export default StoryCreatorStep2;
