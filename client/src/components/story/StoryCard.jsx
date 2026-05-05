import React from 'react';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
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

  const stats = [
    typeof story.likes === 'number' ? { label: 'likes', value: story.likes } : null,
    typeof story.plays === 'number' ? { label: 'plays', value: story.plays } : null
  ].filter(Boolean);

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
    <Card className={`story-card ${isDraft ? 'is-draft' : 'is-published'}`} elevation={0}>
      <Box className="story-card-top">
        <Box className="story-card-cover" sx={{ borderLeftColor: getSpineColor() }}>
          {story.coverImage ? (
            <img src={story.coverImage} alt={story.title} />
          ) : (
            <div className="story-cover-placeholder">{getInitials(story.title)}</div>
          )}
        </Box>

        <CardContent className="story-card-content">
          <Box className="story-title-row">
            <Typography component="h3" className="story-title">
              {story.title}
            </Typography>
            <Box className="story-badges">
              {showBadge && (
                <Chip
                  label={isDraft ? 'Draft' : 'Published'}
                  size="small"
                  color={isDraft ? 'warning' : 'primary'}
                  variant={isDraft ? 'filled' : 'outlined'}
                  className={isDraft ? 'draft-badge' : 'published-badge'}
                />
              )}
              {(!showEdit || story.plays > 0 || story.likes > 0) && !isDraft && stats.length > 0 && (
                <Stack direction="row" spacing={0.75} className="stats-chip">
                  {stats.map((stat) => (
                    <Chip key={stat.label} label={`${stat.value} ${stat.label}`} size="small" variant="outlined" />
                  ))}
                </Stack>
              )}
            </Box>
          </Box>

          <Typography variant="body2" className="story-byline">
            {story.authorName && <span>By {story.authorName}</span>}
            {story.authorName && getLastUpdated() && <span className="byline-separator">•</span>}
            {getLastUpdated() && <span>{getLastUpdated()}</span>}
          </Typography>

          {story.genres && story.genres.length > 0 && (
            <Box className="story-genres">
              {story.genres.slice(0, 3).map((genre, index) => (
                <Chip key={index} label={genre} size="small" className="genre-tag" />
              ))}
            </Box>
          )}

          <Box className="story-actions">
            <Button component={Link} to={primaryTo} variant="contained" className="story-primary-action">
              {primaryLabel}
            </Button>

            {showEdit && (
              <Stack direction="row" spacing={1.5} className="story-actions-secondary">
                {isDraft ? (
                  <Button onClick={() => { window.location.hash = `/play/${story._id}?preview=true`; }} variant="text" color="inherit" size="small" className="action-link">
                    Preview
                  </Button>
                ) : (
                  <Button onClick={() => { window.location.hash = `/edit/${story._id}`; }} variant="text" color="inherit" size="small" className="action-link">
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button onClick={() => onDelete(story._id)} variant="text" color="error" size="small" className="action-link action-delete">
                    Delete
                  </Button>
                )}
              </Stack>
            )}
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

export default StoryCard;
