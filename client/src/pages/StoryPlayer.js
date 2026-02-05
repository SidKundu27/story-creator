import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { getStoryById, likeStory } from '../services/storyService';
import { parseMarkdown, stripFormattingDirectives, parseFormattingDirectives } from '../utils/markdownParser';
import './StoryPlayer.css';

const StoryPlayer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === 'true';
  const [story, setStory] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const colorThemes = {
    light: { name: 'Light', bg: '#ffffff', text: '#333333', titleBg: '#f8f9fa', accent: '#667eea' },
    dark: { name: 'Dark', bg: '#2c3e50', text: '#ecf0f1', titleBg: '#34495e', accent: '#64b5f6' },
    horror: { name: 'Horror', bg: '#1a1a1a', text: '#b8b8b8', titleBg: '#2d0a0a', accent: '#d32f2f' },
    fantasy: { name: 'Fantasy', bg: '#4a148c', text: '#e1bee7', titleBg: '#6a1b9a', accent: '#b39ddb' },
    scifi: { name: 'Sci-Fi', bg: '#01579b', text: '#b3e5fc', titleBg: '#0277bd', accent: '#4fc3f7' },
    nature: { name: 'Nature', bg: '#1b5e20', text: '#c8e6c9', titleBg: '#2e7d32', accent: '#81c784' },
    sunset: { name: 'Sunset', bg: '#ff6f00', text: '#fff3e0', titleBg: '#f57c00', accent: '#ffb74d' },
    ocean: { name: 'Ocean', bg: '#006064', text: '#b2ebf2', titleBg: '#00838f', accent: '#4dd0e1' }
  };

  useEffect(() => {
    loadStory();
  }, [id]);

  const loadStory = async () => {
    try {
      const url = isPreview ? `${id}?preview=true` : id;
      const data = await getStoryById(url);
      setStory(data);
      const startNode = data.nodes.find(node => node.nodeId === data.startNodeId);
      setCurrentNode(startNode);
      setHistory([startNode.nodeId]);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const makeChoice = (nextNodeId) => {
    const nextNode = story.nodes.find(node => node.nodeId === nextNodeId);
    if (nextNode) {
      setCurrentNode(nextNode);
      setHistory([...history, nextNode.nodeId]);
    }
  };

  const restart = () => {
    const startNode = story.nodes.find(node => node.nodeId === story.startNodeId);
    setCurrentNode(startNode);
    setHistory([startNode.nodeId]);
  };

  const handleLike = async () => {
    try {
      await likeStory(id);
      setStory({ ...story, likes: story.likes + 1 });
    } catch (err) {
      console.error('Error liking story:', err);
    }
  };

  if (loading) {
    return <div className="container">Loading story...</div>;
  }

  if (error) {
    return <div className="container error">{error}</div>;
  }

  if (!story || !currentNode) {
    return <div className="container error">Story not found</div>;
  }

  const theme = colorThemes[story.colorTheme] || colorThemes.light;
  
  // Use creator styles if available, otherwise fall back to theme
  const nodeStyle = currentNode?.backgroundColor || theme.bg;
  const nodeTextColor = currentNode?.textColor || story?.creatorStyle?.textColor || theme.text;
  const fontSize = story?.creatorStyle?.fontSize || 16;
  const lineHeight = story?.creatorStyle?.lineHeight || 2;
  const fontFamily = story?.creatorStyle?.fontFamily || 'serif';
  const accentColor = story?.creatorStyle?.accentColor || theme.accent;

  return (
    <div className="webnovel-reader" style={{
      backgroundColor: nodeStyle,
      color: nodeTextColor
    }}>
      <div className="reader-wrapper">
        {/* Preview Banner */}
        {isPreview && (
          <div className="preview-banner">
            Preview Mode - Statistics are not being tracked
          </div>
        )}

        {/* Compact Header with Metadata */}
        <header className="reader-header" style={{
          background: `linear-gradient(135deg, ${theme.titleBg}dd 0%, ${theme.titleBg}aa 100%)`
        }}>
          <div className="header-content">
            <div className="title-section">
              <h1 className="story-title">{story.title}</h1>
              <p className="story-meta">by <span className="author-name">{story.authorName}</span></p>
            </div>

            {/* Stats and Genres */}
            <div className="story-metadata">
              <div className="genre-tags">
                {story.genres && story.genres.slice(0, 4).map((genre, idx) => (
                  <span key={idx} className="genre-tag">{genre}</span>
                ))}
              </div>
              <div className="story-stats">
                <span className="stat-item">
                  <span className="stat-label">By</span>
                  <span className="stat-value">{story.authorName}</span>
                </span>
                <span className="stat-item">
                  <span className="stat-label">Plays</span>
                  <span className="stat-value">{story.plays || 0}</span>
                </span>
                <span className="stat-item">
                  <span className="stat-label">Likes</span>
                  <span className="stat-value">
                    <button 
                      onClick={handleLike} 
                      className="btn-like"
                      disabled={isPreview}
                      title={isPreview ? "Not available in preview" : "Like this story"}
                    >
                      ♥ {story.likes || 0}
                    </button>
                  </span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="reader-content">
          {/* Node Image - Integrated with text */}
          {currentNode?.imageUrl && (
            <figure className="node-image-container">
              <img 
                src={currentNode.imageUrl} 
                alt={currentNode.name || "Scene illustration"}
                className="node-image"
              />
              {currentNode.imageCaption && (
                <figcaption className="image-caption" style={{ color: nodeTextColor }}>
                  {currentNode.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Main Text Content with Markdown Support */}
          <article 
            className="story-content-area"
            style={{
              backgroundColor: nodeStyle,
              color: nodeTextColor,
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              fontFamily: fontFamily === 'serif' ? "'Georgia', 'Palatino', serif" : 
                          fontFamily === 'monospace' ? "'Courier New', monospace" :
                          "'Segoe UI', system-ui, sans-serif"
            }}
          >
            <div className="content-text">
              {currentNode?.content && (
                <section className="narrative-section">
                  {stripFormattingDirectives(currentNode.content).split('\n\n').map((paragraph, index) => (
                    <p 
                      key={index}
                      className="story-paragraph"
                      dangerouslySetInnerHTML={{ __html: parseMarkdown(paragraph) }}
                    />
                  ))}
                </section>
              )}
            </div>

            {/* Choices/Options Section */}
            {currentNode?.isEnding ? (
              <footer className="ending-footer">
                <h2 className="ending-title">The End</h2>
                <button 
                  onClick={restart} 
                  className="btn-restart"
                  style={{
                    backgroundColor: accentColor,
                    color: story.colorTheme.includes('light') ? '#333' : '#fff'
                  }}
                >
                  ← Play Again
                </button>
              </footer>
            ) : (
              <nav className="choices-navigation">
                <h3 className="choices-label">What happens next?</h3>
                <ul className="choices-list">
                  {currentNode?.choices && currentNode.choices.map((choice, index) => (
                    <li key={index} className="choice-item">
                      <button
                        onClick={() => makeChoice(choice.nextNodeId)}
                        className="choice-link"
                        style={{
                          color: accentColor,
                          borderColor: accentColor
                        }}
                      >
                        <span className="choice-arrow">→</span>
                        <span className="choice-text">{choice.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </article>
        </main>

        {/* Bottom Controls */}
        <footer className="reader-footer">
          {!currentNode?.isEnding && (
            <button 
              onClick={restart} 
              className="btn-restart-footer"
              title="Restart the story from the beginning"
            >
              ↻ Restart
            </button>
          )}
          <div className="progress-indicator">
            <span className="progress-text">{history.length} / {story?.nodes?.length || 1} scenes</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StoryPlayer;
