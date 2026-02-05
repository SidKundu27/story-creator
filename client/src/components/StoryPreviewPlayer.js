import React, { useState } from 'react';
import { parseMarkdown, stripFormattingDirectives } from '../utils/markdownParser';
import './StoryPreviewPlayer.css';

const StoryPreviewPlayer = ({ story }) => {
  const [currentNodeId, setCurrentNodeId] = useState(story.startNodeId || 'start');
  const [history, setHistory] = useState([story.startNodeId || 'start']);

  const currentNode = story.nodes.find(n => n.nodeId === currentNodeId);

  const makeChoice = (nextNodeId) => {
    setCurrentNodeId(nextNodeId);
    setHistory([...history, nextNodeId]);
  };

  const restart = () => {
    setCurrentNodeId(story.startNodeId || 'start');
    setHistory([story.startNodeId || 'start']);
  };

  if (!currentNode) {
    return <div className="preview-error">Scene not found</div>;
  }

  return (
    <div className="preview-player">
      <header className="preview-header">
        <h2>{story.title}</h2>
        <p className="preview-by">by {story.authorName}</p>
        {story.genres && story.genres.length > 0 && (
          <div className="preview-genres">
            {story.genres.map((genre, idx) => (
              <span key={idx} className="genre">{genre}</span>
            ))}
          </div>
        )}
      </header>

      <main className="preview-main">
        <div className="preview-scene">
          <h3 className="scene-title">{currentNode.name}</h3>
          
          <article className="scene-content">
            {currentNode.content.split('\n\n').map((paragraph, idx) => (
              <p
                key={idx}
                dangerouslySetInnerHTML={{ __html: parseMarkdown(paragraph) }}
              />
            ))}
          </article>

          {currentNode.isEnding ? (
            <div className="ending-section">
              <h4>The End</h4>
              <button onClick={restart} className="btn btn-primary">
                ← Read Again
              </button>
            </div>
          ) : (
            <nav className="choices-nav">
              <p className="choices-prompt">What happens next?</p>
              <ul className="choices-buttons">
                {currentNode.choices && currentNode.choices.map((choice, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => makeChoice(choice.nextNodeId)}
                      className="choice-button"
                    >
                      → {choice.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        <aside className="preview-sidebar">
          <div className="progress">
            <h4>Progress</h4>
            <p className="progress-text">{history.length} / {story.nodes.length} scenes</p>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(history.length / story.nodes.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {!currentNode.isEnding && (
            <button onClick={restart} className="btn btn-secondary btn-small" style={{ width: '100%' }}>
              ↻ Restart
            </button>
          )}
        </aside>
      </main>
    </div>
  );
};

export default StoryPreviewPlayer;
