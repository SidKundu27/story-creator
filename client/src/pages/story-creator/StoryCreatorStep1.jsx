import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';

const StoryCreatorStep1 = ({ formData, setFormData, availableGenres }) => {
  const [tagInput, setTagInput] = useState('');

  const handleCoverImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, coverImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleGenre = (genre) => {
    const genres = formData.genres.includes(genre)
      ? formData.genres.filter((g) => g !== genre)
      : [...formData.genres, genre];
    setFormData({ ...formData, genres });
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tag = e.target.value.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData({ ...formData, tags: [...formData.tags, tag] });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove)
    });
  };

  return (
    <Box sx={{ display: 'grid', gap: 4, maxWidth: 900, mx: 'auto' }}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6" sx={{ mb: 0.5 }}>Story Information</Typography>
            <Typography variant="body2" color="text.secondary">Set the core details readers will see first.</Typography>
          </Box>

          <TextField
            label="Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter an engaging title for your story"
            inputProps={{ maxLength: 80, 'aria-label': 'Story title' }}
            helperText={`${formData.title.length}/80`}
          />

          <TextField
            label="Description *"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Write a compelling summary of your story..."
            multiline
            minRows={4}
            inputProps={{ maxLength: 300, 'aria-label': 'Story description' }}
            helperText={`${formData.description.length}/300`}
          />

          <FormControl fullWidth size="small">
            <InputLabel id="main-category-label">Main Category</InputLabel>
            <Select
              labelId="main-category-label"
              label="Main Category"
              value={formData.mainCategory}
              onChange={(e) => setFormData({ ...formData, mainCategory: e.target.value })}
            >
              <MenuItem value="">Select a main category...</MenuItem>
              {availableGenres.map((genre) => (
                <MenuItem key={genre} value={genre}>{genre}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6" sx={{ mb: 0.5 }}>Cover Image</Typography>
            <Typography variant="body2" color="text.secondary">Upload a cover image or keep the default placeholder.</Typography>
          </Box>

          <Button component="label" variant="outlined" startIcon={<CloudUploadOutlinedIcon />} sx={{ alignSelf: 'flex-start' }}>
            Upload Cover Image
            <input type="file" accept="image/*" hidden onChange={handleCoverImageUpload} aria-label="Upload cover image" />
          </Button>

          {formData.coverImage && (
            <Stack spacing={2}>
              <Box
                component="img"
                src={formData.coverImage}
                alt="Cover preview"
                sx={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}` }}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'flex-start' }}>
                <TextField
                  label="Image credit or description"
                  value={formData.coverImageCaption}
                  onChange={(e) => setFormData({ ...formData, coverImageCaption: e.target.value })}
                  placeholder="Optional: Image credit or description"
                  inputProps={{ maxLength: 100 }}
                />
                <Button variant="outlined" color="error" onClick={() => setFormData({ ...formData, coverImage: '' })} sx={{ flexShrink: 0 }}>
                  Remove
                </Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6" sx={{ mb: 0.5 }}>Genres</Typography>
            <Typography variant="body2" color="text.secondary">Select one or more genres that fit your story.</Typography>
          </Box>

          <ToggleButtonGroup
            value={formData.genres}
            onChange={(_, newGenres) => setFormData({ ...formData, genres: newGenres || [] })}
            aria-label="Story genres"
            sx={{ flexWrap: 'wrap', gap: 1 }}
          >
            {availableGenres.map((genre) => (
              <ToggleButton key={genre} value={genre} aria-label={genre} sx={{ textTransform: 'none', borderRadius: 999, px: 2 }}>
                {genre}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6" sx={{ mb: 0.5 }}>Tags</Typography>
            <Typography variant="body2" color="text.secondary">Add custom tags to help readers find your story.</Typography>
          </Box>

          <TextField
            label="Add a tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagInput}
            placeholder="Type a tag and press Enter"
            inputProps={{ maxLength: 20, 'aria-label': 'Add a story tag' }}
            helperText="Press Enter to add a tag"
          />

          {formData.tags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {formData.tags.map((tag) => (
                <Chip key={tag} label={tag} onDelete={() => removeTag(tag)} deleteIcon={<CloseIcon fontSize="small" />} />
              ))}
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default StoryCreatorStep1;
