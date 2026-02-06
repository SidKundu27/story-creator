import React from 'react';
import './StoryCoverPage.css';

const StoryCoverPage = ({ story, onStart, onBack }) => {
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const defaultCoverImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500'><rect width='400' height='500' fill='%23f3f4f6'/><text x='50%25' y='50%25' font-family='system-ui' font-size='26' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'>Image Preview</text></svg>";

  return (
    <div className="story-cover-page">
      <div className="cover-content">
        <div className="cover-left-column">
          <div className="cover-image-container">
            <img src={story.coverImage || defaultCoverImage} alt={story.title} className="cover-image" />
            {story.coverImageCaption && (
              <p className="cover-caption">{story.coverImageCaption}</p>
            )}
          </div>
          
          {story.genres && story.genres.length > 0 && (
            <div className="cover-genres-sidebar">
              <h3>Genres</h3>
              <div className="cover-genres">
                {story.genres.map((genre, idx) => (
                  <span key={idx} className="cover-genre-tag">{genre}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="story-info">
          <div className="cover-header">
            <h1 className="cover-title">{story.title}</h1>
            <p className="cover-author">by <strong>{story.authorName}</strong></p>
            <p className="cover-date">{formatDate()}</p>
          </div>

          {story.description && (
            <p className="cover-description">{story.description}</p>
          )}

          <div className="cover-stats">
            <div className="cover-stat">
              <span className="stat-number">{story.plays || 0}</span>
              <span className="stat-label">Plays</span>
            </div>
            <div className="cover-stat">
              <span className="stat-number">{story.likes || 0}</span>
              <span className="stat-label">Likes</span>
            </div>
          </div>

          <div className="cover-actions">
            <button onClick={onStart} className="btn btn-primary btn-large">
              ▶ Start Reading
            </button>
            {onBack && (
              <button onClick={onBack} className="btn btn-secondary">
                ← Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCoverPage;
