import React from 'react';
import { Link } from 'react-router-dom';
import './StoryCard.css';

const StoryCard = ({ story, showEdit = false, onDelete, showBadge = true }) => {
  const isDraft = !story.isPublished;
  const primaryLabel = isDraft ? 'Continue Writing' : 'Play Story';
  const primaryTo = isDraft ? `/edit/${story._id}` : `/play/${story._id}`;

  const getSpineColor = () => {
    const genreColors = {
      Fantasy: '#10b981',
      'Sci-Fi': '#3b82f6',
      'Science Fiction': '#3b82f6',
      Horror: '#ef4444',
      Mystery: '#8b5cf6',
      Romance: '#ec4899',
      Adventure: '#f59e0b',
      Thriller: '#dc2626',
      Drama: '#6366f1',
    };

    const primaryGenre = story.mainCategory || (story.genres && story.genres[0]);
    return genreColors[primaryGenre] || '#6366f1';
  };

  const getInitials = (title) => title
    .split(' ')
    .filter((word) => word.length > 0)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join('');

  const getLastUpdated = () => {
    if (!story.updatedAt) return null;
    const date = new Date(story.updatedAt);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 1) return 'Updated just now';
    if (diffHours < 24) return `Updated ${diffHours}h ago`;
    if (diffDays === 1) return 'Updated yesterday';
    if (diffDays < 7) return `Updated ${diffDays}d ago`;
    if (diffDays < 30) return `Updated ${Math.floor(diffDays / 7)}w ago`;

    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const day = date.getDate();
    const year = date.getFullYear();
    const currentYear = now.getFullYear();

    if (year === currentYear) {
      return `Updated ${month} ${day}`;
    }
    return `Updated ${month} ${day}, ${year}`;
  };

  return (
    <div className={`story-card ${isDraft ? 'is-draft' : 'is-published'}`}>
      <div className="story-card-top">
        <div className="story-card-cover" style={{ borderLeftColor: getSpineColor() }}>
          {story.coverImage ? (
            <img src={story.coverImage} alt={story.title} />
          ) : (
            <div className="story-cover-placeholder">{getInitials(story.title)}</div>
          )}
        </div>

        <div className="story-card-content">
          <div className="story-title-row">
            <h3 className="story-title">{story.title}</h3>
            <div className="story-badges">
              {showBadge && <span className={isDraft ? 'draft-badge' : 'published-badge'}>{isDraft ? 'Draft' : 'Published'}</span>}
              {(!showEdit || story.plays > 0 || story.likes > 0) && !isDraft && (
                <div className="stats-chip">
                  {typeof story.likes === 'number' && <span>♥ {story.likes}</span>}
                  {typeof story.plays === 'number' && <span>▶ {story.plays}</span>}
                </div>
              )}
            </div>
          </div>

          <div className="story-byline">
            {story.authorName && <span>By {story.authorName}</span>}
            {story.authorName && getLastUpdated() && <span className="byline-separator">•</span>}
            {getLastUpdated() && <span>{getLastUpdated()}</span>}
          </div>

          {story.genres && story.genres.length > 0 && (
            <div className="story-genres">
              {story.genres.slice(0, 3).map((genre, index) => (
                <span key={index} className="genre-tag">{genre}</span>
              ))}
            </div>
          )}

          <div className="story-actions">
            <Link to={primaryTo} className="btn btn-primary">
              {primaryLabel}
            </Link>

            {showEdit && (
              <div className="story-actions-secondary">
                {isDraft ? (
                  <button onClick={() => window.location.href = `/play/${story._id}?preview=true`} className="action-link">
                    Preview
                  </button>
                ) : (
                  <button onClick={() => window.location.href = `/edit/${story._id}`} className="action-link">
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button onClick={() => onDelete(story._id)} className="action-link action-delete">
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCard;
