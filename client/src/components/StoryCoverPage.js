import React from 'react';
import './StoryCoverPage.css';

const StoryCoverPage = ({ story, onStart, onBack }) => {
  return (
    <div className="story-cover-page">
      <div className="cover-content">
        {story.coverImage && (
          <div className="cover-image-container">
            <img src={story.coverImage} alt={story.title} className="cover-image" />
            {story.coverImageCaption && (
              <p className="cover-caption">{story.coverImageCaption}</p>
            )}
          </div>
        )}

        <div className="story-info">
          <h1 className="cover-title">{story.title}</h1>
          
          <p className="cover-author">by <strong>{story.authorName}</strong></p>

          {story.description && (
            <p className="cover-description">{story.description}</p>
          )}

          {story.genres && story.genres.length > 0 && (
            <div className="cover-genres">
              {story.genres.map((genre, idx) => (
                <span key={idx} className="cover-genre-tag">{genre}</span>
              ))}
            </div>
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
              Start Reading →
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
