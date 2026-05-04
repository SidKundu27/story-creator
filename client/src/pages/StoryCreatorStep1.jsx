import React from 'react';
import './StoryCreatorStep1.css';

const StoryCreatorStep1 = ({ formData, setFormData, availableGenres }) => {
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
      ? formData.genres.filter(g => g !== genre)
      : [...formData.genres, genre];
    setFormData({ ...formData, genres });
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter') {
      const tag = e.target.value.trim();
      if (tag && !formData.tags.includes(tag)) {
        setFormData({ ...formData, tags: [...formData.tags, tag] });
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="story-info-form">
      <div className="form-section">
        <h2>Story Information</h2>
        
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Enter an engaging title for your story"
            maxLength={80}
          />
          <small>{formData.title.length}/80</small>
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Write a compelling summary of your story..."
            rows={4}
            maxLength={300}
          />
          <small>{formData.description.length}/300</small>
        </div>

        <div className="form-group">
          <label>Main Category</label>
          <select
            value={formData.mainCategory}
            onChange={(e) => setFormData({ ...formData, mainCategory: e.target.value })}
          >
            <option value="">Select a main category...</option>
            {availableGenres.map((genre) => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          <small>Pick one primary category for your story</small>
        </div>
      </div>

      <div className="form-section">
        <h2>Cover Image</h2>
        
        <div className="cover-upload-area">
          <div className="upload-input-group">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageUpload}
              id="cover-upload"
            />
            <label htmlFor="cover-upload" className="upload-button">
              <span>📸 Upload Cover Image</span>
              <small>Or drag and drop</small>
            </label>
          </div>

          {formData.coverImage && (
            <div className="cover-preview">
              <img src={formData.coverImage} alt="Cover preview" />
              <button
                type="button"
                onClick={() => setFormData({ ...formData, coverImage: '' })}
                className="btn btn-danger btn-small"
              >
                Remove
              </button>
              <div className="form-group">
                <input
                  type="text"
                  value={formData.coverImageCaption}
                  onChange={(e) => setFormData({ ...formData, coverImageCaption: e.target.value })}
                  placeholder="Optional: Image credit or description"
                  maxLength={100}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="form-section">
        <h2>Genres</h2>
        <p className="section-description">Select one or more genres that fit your story</p>
        
        <div className="genre-grid">
          {availableGenres.map(genre => (
            <button
              key={genre}
              type="button"
              className={`genre-button ${formData.genres.includes(genre) ? 'selected' : ''}`}
              onClick={() => toggleGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="form-section">
        <h2>Tags</h2>
        <p className="section-description">Add custom tags to help readers find your story</p>
        
        <div className="tag-input-group">
          <input
            type="text"
            onKeyPress={handleTagInput}
            placeholder="Type a tag and press Enter..."
            maxLength={20}
          />
          <small>Press Enter to add a tag</small>
        </div>

        {formData.tags.length > 0 && (
          <div className="tags-list">
            {formData.tags.map((tag, idx) => (
              <span key={idx} className="tag-chip">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="tag-remove"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryCreatorStep1;
