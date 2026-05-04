import React, { useState, useEffect, useContext } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { getStoryById, likeStory } from '../../services/storyService';
import { parseMarkdown, stripFormattingDirectives, parseFormattingDirectives } from '../../utils/markdownParser';
import StoryCoverPage from '../../components/story/StoryCoverPage';
import { AuthContext } from '../../context/AuthContext';
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

  const theme = { name: 'Light', bg: '#ffffff', text: '#333333', titleBg: '#f8f9fa', accent: '#667eea' };

  useEffect(() => {
    if (!authLoading) {
      const fetchStory = async () => {
        try {
          setError('');
          const url = isPreview ? `${id}?preview=true` : id;
          const data = await getStoryById(url);
          setStory(data);
          const startNode = data.nodes.find((node) => node.nodeId === data.startNodeId);
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

  const makeChoice = (nextNodeId) => {
    const nextNode = story.nodes.find((node) => node.nodeId === nextNodeId);
    if (nextNode) {
      setCurrentNode(nextNode);
      setHistory([...history, nextNode.nodeId]);
    }
  };

  const restart = () => {
    const startNode = story.nodes.find((node) => node.nodeId === story.startNodeId);
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

  if (loading) return <div className="container">Loading story...</div>;
  if (error) return <div className="container error">{error}</div>;
  if (!story || !currentNode) return <div className="container error">Story not found</div>;

  if (showCover) {
    return (
      <StoryCoverPage
        story={story}
        onStart={() => setShowCover(false)}
        onBack={() => navigate('/feed')}
      />
    );
  }

  const fontSize = 16;
  const lineHeight = 2;
  const fontFamily = 'serif';

  return (
    <div className="webnovel-reader">
      <div className="reader-wrapper">
        {isPreview && <div className="preview-banner">Preview Mode - Statistics are not being tracked</div>}

        <header className="reader-header">
          <div className="header-content">
            <button onClick={() => navigate('/feed')} className="btn-exit" title="Exit to dashboard">←</button>

            <div className="header-center">
              <span className="chapter-title">{currentNode.name || 'Reading'}</span>
            </div>

            <div className="header-actions">
              <button
                onClick={handleLike}
                className="btn-header-action"
                disabled={isPreview}
                title={isPreview ? 'Not available in preview' : 'Like this story'}
              >
                ♥
              </button>
            </div>
          </div>
        </header>

        <main className="reader-content">
          <article
            className="story-content-area"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight,
              fontFamily: fontFamily === 'serif'
                ? "'Merriweather', 'Georgia', serif"
                : fontFamily === 'monospace'
                  ? "'Courier New', monospace"
                  : "'Segoe UI', system-ui, sans-serif"
            }}
          >
            <div className="content-text">
              {currentNode?.content && (
                <section className="narrative-section">
                  {stripFormattingDirectives(currentNode.content).split('\n\n').map((paragraph, index) => (
                    <p key={index} className="story-paragraph" dangerouslySetInnerHTML={{ __html: parseMarkdown(paragraph) }} />
                  ))}
                </section>
              )}
            </div>

            {currentNode?.isEnding ? (
              <footer className="ending-footer">
                <h2 className="ending-title">The End</h2>
                <button onClick={restart} className="btn-restart">← Play Again</button>
              </footer>
            ) : (
              <nav className="choices-navigation">
                <ul className="choices-list">
                  {currentNode?.choices && currentNode.choices.map((choice, index) => (
                    <li key={index} className="choice-item">
                      <button onClick={() => makeChoice(choice.nextNodeId)} className="choice-link">
                        <span className="choice-arrow">➜</span>
                        <span className="choice-text">{choice.text}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </article>
        </main>

        <footer className="reader-footer">
          {!currentNode?.isEnding && (
            <button onClick={restart} className="btn-restart-footer" title="Restart the story from the beginning">
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
