import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toastService from '../services/toastService';
import '../styles/CreatePost.css';

function CreatePost({ onPostCreated }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!formData.title.trim()) {
        setError('Title is required');
        setLoading(false);
        return;
      }

      if (!formData.content.trim()) {
        setError('Content is required');
        setLoading(false);
        return;
      }

      if (formData.title.trim().length < 3) {
        setError('Title must be at least 3 characters long');
        setLoading(false);
        return;
      }

      if (formData.content.trim().length < 10) {
        setError('Content must be at least 10 characters long');
        setLoading(false);
        return;
      }

      // Create post
      const response = await api.post('/posts', {
        title: formData.title.trim(),
        content: formData.content.trim(),
      });

      if (response.data.success) {
        // Show success notification
        toastService.success('Post created successfully!');
        
        // Reset form
        setFormData({ title: '', content: '' });
        
        // Call callback if provided
        if (onPostCreated) {
          onPostCreated();
        }
        
        // Navigate back to dashboard
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      console.error('Error creating post:', err);
      const errorMessage =
        err.response?.data?.message ||
        'Failed to create post. Please try again.';
      setError(errorMessage);
      toastService.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <div className="create-post-header">
          <h1>Create a New Post</h1>
          <p className="subtitle">Share your thoughts and ideas with the community</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title for your post"
              maxLength="200"
              disabled={loading}
            />
            <small className="char-count">
              {formData.title.length}/200
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="content">Post Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content here... (minimum 10 characters)"
              rows="8"
              disabled={loading}
            />
            <small className="char-count">
              {formData.content.length} characters
            </small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating...
                </>
              ) : (
                'Create Post'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
