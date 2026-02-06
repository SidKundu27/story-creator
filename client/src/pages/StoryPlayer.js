import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getStoryById, likeStory } from '../services/storyService';
import { parseMarkdown, stripFormattingDirectives, parseFormattingDirectives } from '../utils/markdownParser';
import StoryCoverPage from '../components/StoryCoverPage';
import { AuthContext } from '../context/AuthContext';
import './StoryPlayer.css';

const StoryPlayer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loading: authLoading } = useContext(AuthContext);
  const isPreview = searchParams.get('preview') === 'true';
  const [story, setStory] = useState(null);
  const [currentNode, setCurrentNode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showCover, setShowCover] = useState(true);

  // Use a single default theme for all stories
  const theme = { name: 'Light', bg: '#ffffff', text: '#333333', titleBg: '#f8f9fa', accent: '#667eea' };

  useEffect(() => {
    // Wait for auth to load before fetching story
    if (!authLoading) {
      const fetchStory = async () => {
        try {
          setError(''); // Clear any previous errors
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
      
      fetchStory();
    }
  }, [id, authLoading, isPreview]);

  const loadStory = async () => {
    try {
      setError(''); // Clear any previous errors
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

  // Show cover page first (always, not just if there's a cover image)
  if (showCover) {
    return (
      <StoryCoverPage 
        story={story} 
        onStart={() => setShowCover(false)}
        onBack={() => navigate('/feed')}
      />
    );
  }

  // Use theme colors
  const nodeStyle = theme.bg;
  const nodeTextColor = theme.text;
  const fontSize = 16;
  const lineHeight = 2;
  const fontFamily = 'serif';
  const accentColor = theme.accent;

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
