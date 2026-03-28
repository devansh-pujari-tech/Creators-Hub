import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { postAPI } from '../services/api';
import toastService from '../services/toastService';
import '../styles/EditPost.css';

function EditPost() {
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [postOwner, setPostOwner] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch post data for editing
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await postAPI.getPostById(postId);

        if (response.data.success) {
          const post = response.data.post;

          // Check if current user is the post owner
          if (post.author._id !== user?._id) {
            const errorMsg = 'Unauthorized: You can only edit your own posts';
            setError(errorMsg);
            setPostOwner(false);
            toastService.error(errorMsg);
            return;
          }

          setFormData({
            title: post.title,
            content: post.content,
          });
          setPostOwner(true);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        let errorMsg = 'Failed to load post. Please try again.';
        
        if (err.response?.status === 404) {
          errorMsg = 'Post not found';
        } else if (err.response?.status === 403) {
          errorMsg = 'You do not have permission to edit this post';
        } else {
          errorMsg = err.response?.data?.message || errorMsg;
        }
        
        setError(errorMsg);
        toastService.error(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (postId && user?._id) {
      fetchPost();
    }
  }, [postId, user?._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccessMessage('');

    try {
      // Validation
      if (!formData.title.trim()) {
        const msg = 'Title cannot be empty';
        setError(msg);
        toastService.warning(msg);
        setSaving(false);
        return;
      }

      if (!formData.content.trim()) {
        const msg = 'Content cannot be empty';
        setError(msg);
        toastService.warning(msg);
        setSaving(false);
        return;
      }

      if (formData.title.trim().length < 3) {
        const msg = 'Title must be at least 3 characters long';
        setError(msg);
        toastService.warning(msg);
        setSaving(false);
        return;
      }

      if (formData.content.trim().length < 10) {
        const msg = 'Content must be at least 10 characters long';
        setError(msg);
        toastService.warning(msg);
        setSaving(false);
        return;
      }

      const response = await postAPI.updatePost(
        postId,
        formData.title,
        formData.content
      );

      if (response.data.success) {
        const successMsg = 'Post updated successfully!';
        setSuccessMessage(successMsg);
        toastService.success(successMsg);
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }
    } catch (err) {
      console.error('Error updating post:', err);
      let errorMsg = 'Failed to update post. Please try again.';
      
      if (err.response?.status === 403) {
        errorMsg = 'Unauthorized: You can only edit your own posts';
      } else if (err.response?.status === 404) {
        errorMsg = 'Post not found';
      } else {
        errorMsg = err.response?.data?.message || errorMsg;
      }
      
      setError(errorMsg);
      toastService.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="edit-post-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading post...</p>
        </div>
      </div>
    );
  }

  if (postOwner === false) {
    return (
      <div className="edit-post-container">
        <div className="error-state">
          <div className="error-icon">🚫</div>
          <h2>Cannot Edit Post</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-post-container">
      <div className="edit-post-card">
        <div className="edit-post-header">
          <h1>✏️ Edit Post</h1>
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <form onSubmit={handleSubmit} className="edit-post-form">
          <div className="form-group">
            <label htmlFor="title">Post Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter your post title..."
              disabled={saving}
              maxLength={200}
              required
            />
            <span className="char-count">
              {formData.title.length}/200
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="content">Post Content *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your thoughts and ideas..."
              disabled={saving}
              rows={12}
              required
            />
            <span className="char-count">
              {formData.content.length} characters
            </span>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
