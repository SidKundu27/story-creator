import React from 'react';
import { Link } from 'react-router-dom';
import './StoryCard.css';

const StoryCard = ({ story, showEdit = false, onDelete }) => {
  return (
    <div className="story-card">
      <div className="story-header">
        <div className="story-title-section">
          <h3>{story.title}</h3>
          {!story.isPublished && <span className="draft-badge">Draft</span>}
        </div>
      </div>
      
      <p className="story-description">{story.description}</p>
      
      {story.genres && story.genres.length > 0 && (
        <div className="story-genres">
          {story.genres.map((genre, index) => (
            <span key={index} className="genre-tag">{genre}</span>
          ))}
        </div>
      )}
      
      <div className="story-stats">
        <span className="stat-item"><span className="stat-label">By</span> {story.authorName}</span>
        <span className="stat-item"><span className="stat-label">Plays:</span> {story.plays}</span>
        <span className="stat-item"><span className="stat-label">Likes:</span> {story.likes}</span>
      </div>

      <div className="story-actions">
        {story.isPublished ? (
          <Link to={`/play/${story._id}`} className="btn btn-primary">
            Play Story
          </Link>
        ) : showEdit ? (
          <Link to={`/play/${story._id}?preview=true`} className="btn btn-secondary">
            Preview
          </Link>
        ) : null}
        {showEdit && (
          <>
            <Link to={`/edit/${story._id}`} className="btn btn-secondary">
              Edit
            </Link>
            {onDelete && (
              <button onClick={() => onDelete(story._id)} className="btn btn-danger">
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StoryCard;
