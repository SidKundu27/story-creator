import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import './StoryCoverPage.css';

const StoryCoverPage = ({ story, onStart, onBack }) => {
  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const defaultCoverImage = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='500'><rect width='400' height='500' fill='%23f3f4f6'/><text x='50%25' y='50%25' font-family='system-ui' font-size='26' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'>Image Preview</text></svg>";

  return (
    <div className="story-cover-page">
      <div
        className="cover-background-blur"
        style={{ backgroundImage: story.coverImage ? `url(${story.coverImage})` : 'none' }}
      />

      {onBack && (
        <div className="cover-breadcrumb-bar">
          <div className="cover-breadcrumb-content">
            <Button onClick={onBack} variant="text" color="inherit" sx={{ px: 0 }}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      )}

      <div className="cover-content">
        <div className="cover-left-column">
          <div className="cover-image-container">
            <img src={story.coverImage || defaultCoverImage} alt={story.title} className="cover-image" />
            {story.coverImageCaption && <p className="cover-caption">{story.coverImageCaption}</p>}
          </div>
        </div>

        <div className="story-info">
          <div className="cover-header">
            <Typography variant="h2" component="h1" className="cover-title">{story.title}</Typography>
            <Typography variant="body1" className="cover-author">by {story.authorName}</Typography>
            <Typography variant="body2" className="cover-date">{formatDate()}</Typography>

            {story.genres && story.genres.length > 0 && (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" className="cover-genres">
                {story.genres.map((genre, idx) => (
                  <Chip key={idx} label={genre} size="small" variant="outlined" className="cover-genre-tag" />
                ))}
              </Stack>
            )}
          </div>

          {story.description && <Typography variant="body1" className="cover-description">{story.description}</Typography>}

          <div className="cover-stats">
            <div className="cover-stat">
              <Typography variant="h5" component="span" className="stat-number">{story.plays || 0}</Typography>
              <Typography variant="caption" component="span" className="stat-label">PLAYS</Typography>
            </div>
            <div className="cover-stat">
              <Typography variant="h5" component="span" className="stat-number">{story.likes || 0}</Typography>
              <Typography variant="caption" component="span" className="stat-label">LIKES</Typography>
            </div>
          </div>

          <div className="cover-actions">
            <Button onClick={onStart} variant="contained" size="large">
              Start Reading
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryCoverPage;
