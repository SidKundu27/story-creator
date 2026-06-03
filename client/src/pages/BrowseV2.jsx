import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { getAllStories } from '../services/storyService';
import { AuthContext } from '../context/AuthContext';
import CircularProgress from '@mui/material/CircularProgress';
import './BrowseV2.css';
import { useServerStatus } from '../context/ServerStatusContext';
import { getStoryCoverImage } from '../utils/storyArt';

const getStoryImage = (story) => getStoryCoverImage(story, { width: 900, height: 640 });

const getInitials = (title) => title
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((word) => word[0].toUpperCase())
  .join('');

const getLastUpdated = (updatedAt) => {
  if (!updatedAt) return null;
  const date = new Date(updatedAt);
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
  if (year === now.getFullYear()) {
    return `Updated ${month} ${day}`;
  }
  return `Updated ${month} ${day}, ${year}`;
};

const BrowseV2 = () => {
  const { user } = useContext(AuthContext);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [waitSeconds, setWaitSeconds] = useState(60);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const { isLoadingServer } = useServerStatus();

  useEffect(() => {
    let mounted = true;
    const loadStories = async () => {
      try {
        const data = await getAllStories();
        if (!mounted) return;
        setStories(data);
      } catch (err) {
        if (!mounted) return;
        setError(err?.message || String(err));
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    // If server is still loading, don't attempt to fetch yet
    if (isLoadingServer) {
      setLoading(true);
      return () => { mounted = false; };
    }

    loadStories();

    return () => { mounted = false; };
  }, [isLoadingServer]);

  // Countdown while waiting for server
  useEffect(() => {
    let timer;
    if (isLoadingServer) {
      setWaitSeconds(60);
      timer = setInterval(() => setWaitSeconds((s) => Math.max(0, s - 1)), 1000);
    } else {
      setWaitSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isLoadingServer]);

  const { visibleStories, genres } = useMemo(() => {
    let filtered = [...stories];

    if (searchTerm) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter((story) => {
        const tags = Array.isArray(story.tags) ? story.tags : [];
        const description = story.description || '';
        return (
          story.title?.toLowerCase().includes(query)
          || description.toLowerCase().includes(query)
          || tags.some((tag) => tag.toLowerCase().includes(query))
          || story.authorName?.toLowerCase().includes(query)
        );
      });
    }

    if (sortBy === 'recent') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => (b.plays || 0) - (a.plays || 0));
    } else if (sortBy === 'liked') {
      filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    }

    const genreMap = new Map();
    stories.forEach((story) => {
      const tags = Array.isArray(story.tags) ? story.tags : [];
      tags.forEach((tag) => {
        genreMap.set(tag, (genreMap.get(tag) || 0) + 1);
      });
      const mainGenre = story.mainCategory || (story.genres && story.genres[0]);
      if (mainGenre) {
        genreMap.set(mainGenre, (genreMap.get(mainGenre) || 0) + 1);
      }
      if (Array.isArray(story.genres)) {
        story.genres.forEach((g) => {
          if (g) genreMap.set(g, (genreMap.get(g) || 0) + 1);
        });
      }
    });

    return {
      visibleStories: filtered,
      genres: [...genreMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 12),
    };
  }, [stories, searchTerm, sortBy]);

  const featuredStories = visibleStories.slice(0, 6);

  if (isLoadingServer) {
    return (
      <div className="container browse-v2-page">
        <Box
          className="browse-v2-loading"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          py={8}
        >
          <CircularProgress size={48} />
          <Typography variant="body1" color="text.secondary">
            Waiting for server to respond (up to 60 seconds)... {waitSeconds > 0 ? `(${waitSeconds}s)` : ''}
          </Typography>
        </Box>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container browse-v2-page">
        <Box
          className="browse-v2-loading"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          gap={2}
          py={8}
        >
          <CircularProgress size={48} />
          <Typography variant="body1" color="text.secondary">
            Loading stories...
          </Typography>
        </Box>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container browse-v2-page">
      <Box className="browse-v2-hero">
        <Box className="browse-v2-hero-copy">
          <Typography variant="overline" className="browse-v2-eyebrow">
            Browse V2
          </Typography>
          <Typography variant="h3" component="h1" className="browse-v2-title">
            Browse stories the way readers scan a shelf
          </Typography>
          {/* should be spaced-between */}
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" >
            <Typography className="browse-v2-copy">
              Use this view to compare titles, authors, updated times, tags, stats, and summaries at a glance. It is designed for quick scanning on a large monitor without hidden details.
            </Typography>
            {user ? (
              <Button component={RouterLink} to="/create" variant="contained" size="medium" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', minHeight: 38, px: 2.25 }}>
                Create Story
              </Button>
            ) : (
              <Button component={RouterLink} to="/login" variant="contained" size="medium" sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px', minHeight: 38, px: 2.25 }}>
                Log in to create
              </Button>
            )}
          </Stack>
        </Box>
      </Box>

      <Box className="browse-v2-controls">
        <TextField
          fullWidth
          size="small"
          placeholder="Search titles, authors, tags, descriptions..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <FormControl size="small" className="browse-v2-sort">
          <InputLabel id="browse-v2-sort-label">Sort by</InputLabel>
          <Select
            labelId="browse-v2-sort-label"
            label="Sort by"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <MenuItem value="recent">Most Recent</MenuItem>
            <MenuItem value="popular">Most Played</MenuItem>
            <MenuItem value="liked">Most Liked</MenuItem>
          </Select>
        </FormControl>
        <div className="browse-v2-count">{visibleStories.length} {visibleStories.length === 1 ? 'story' : 'stories'}</div>
      </Box>

      <Grid container spacing={3} className="browse-v2-layout">
        <Grid item xs={12} lg={9}>
          {featuredStories.length === 0 ? (
            <Box className="browse-v2-empty">
              <Typography variant="h6">No stories found</Typography>
              <Typography variant="body2">
                Try a different search or switch back to the original browse view.
              </Typography>
              <Button component={RouterLink} to="/feed" variant="contained" sx={{ textTransform: 'none' }}>
                Back to Browse
              </Button>
            </Box>
          ) : (
            <Stack spacing={2.25} className="browse-v2-feed">
              {featuredStories.map((story, index) => {
                const tags = (Array.isArray(story.tags) && story.tags.length) ? story.tags.slice(0, 4) : (Array.isArray(story.genres) ? story.genres.slice(0, 4) : []);
                const stats = [
                  typeof story.likes === 'number' ? { label: 'likes', value: story.likes } : null,
                  typeof story.plays === 'number' ? { label: 'plays', value: story.plays } : null,
                ].filter(Boolean);
                const description = story.description || 'No description provided.';
                const lastUpdated = getLastUpdated(story.updatedAt);
                return (
                  <Card key={story._id} className="browse-v2-card" elevation={0}>
                    <CardActionArea disableRipple component={RouterLink} to={`/play/${story._id}`} className="browse-v2-card-action">
                      <Box className="browse-v2-row">
                        <Box className="browse-v2-image-column">
                          <CardMedia
                            component="img"
                            image={getStoryImage(story)}
                            alt={story.title}
                            className={`browse-v2-image ${!story.coverImage ? 'browse-v2-image-fallback' : ''}`}
                          />
                          {!story.coverImage && (
                            <Box className="browse-v2-initials-overlay">
                              {getInitials(story.title)}
                            </Box>
                          )}
                        </Box>

                        <CardContent className="browse-v2-content">
                          <Box className="browse-v2-heading-row">
                            <Box className="browse-v2-heading-main">
                              <Typography variant="h6" component="h2" className="browse-v2-title-text">
                                {story.title}
                              </Typography>
                              <Typography variant="body2" className="browse-v2-byline">
                                {story.authorName ? `By ${story.authorName}` : 'Unknown author'}
                                {lastUpdated ? ` • ${lastUpdated}` : ''}
                              </Typography>
                            </Box>
                            <Stack direction="row" spacing={1} className="browse-v2-mini-stats">
                              {stats.map((stat) => (
                                <Chip key={stat.label} label={`${stat.value} ${stat.label}`} size="small" variant="outlined" />
                              ))}
                            </Stack>
                          </Box>

                          <Typography variant="body2" className="browse-v2-description">
                            {description}
                          </Typography>

                          <Box className="browse-v2-tag-row">
                            {tags.length > 0 ? tags.map((tag) => (
                              <Chip key={tag} label={tag} size="small" className="browse-v2-chip" />
                            )) : (
                              <Chip label="No tags" size="small" className="browse-v2-chip browse-v2-chip-empty" />
                            )}
                          </Box>

                        </CardContent>
                      </Box>
                    </CardActionArea>
                  </Card>
                );
              })}
            </Stack>
          )}
        </Grid>

        <Grid item xs={12} lg={3}>
          <Box className="browse-v2-sidebar">
            <Typography variant="overline" className="browse-v2-sidebar-label">Genres</Typography>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1} className="browse-v2-genre-list">
              {genres.length > 0 ? genres.map(([genre, count]) => (
                <Box key={genre} className="browse-v2-genre-item">
                  <Typography variant="body2">{genre}</Typography>
                  <Chip label={count} size="small" variant="outlined" />
                </Box>
              )) : (
                <Typography variant="body2" color="text.secondary">No genres yet.</Typography>
              )}
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default BrowseV2;