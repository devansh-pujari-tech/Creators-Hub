import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { postAPI } from '../services/api';
import '../styles/PostList.css';

function PostList() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalPosts: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const fetchPosts = async (page) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await api.get('/posts', {
        params: {
          page,
          limit: 10,
        },
      });

      if (response.data.success) {
        setPosts(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError(
        err.response?.data?.message ||
        'Failed to load posts. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleEditClick = (postId) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDeleteClick = (postId) => {
    setDeletingPostId(postId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await postAPI.deletePost(deletingPostId);
      
      if (response.data.success) {
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== deletingPostId)
        );
        setShowDeleteConfirm(false);
        setDeletingPostId(null);
        
        // Update pagination info
        setPagination((prev) => ({
          ...prev,
          totalPosts: prev.totalPosts - 1,
        }));
      }
    } catch (err) {
      console.error('Error deleting post:', err);
      setError(
        err.response?.data?.message || 'Failed to delete post. Please try again.'
      );
      setShowDeleteConfirm(false);
      setDeletingPostId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletingPostId(null);
  };

  const isPostOwner = (postAuthorId) => {
    return user?._id === postAuthorId;
  };

  if (loading && posts.length === 0) {
    return (
      <div className="post-list-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-list-container">
      {error && <div className="error-message">{error}</div>}

      {posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No posts yet</h3>
          <p>Be the first to create a post and share your thoughts!</p>
        </div>
      ) : (
        <>
          <div className="posts-header">
            <h2>All Posts</h2>
            <span className="post-count">
              Total: {pagination.totalPosts} posts
            </span>
          </div>

          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post._id} className="post-card">
                <div className="post-header">
                  <h3 className="post-title">{post.title}</h3>
                  {isPostOwner(post.author?._id) && (
                    <div className="owner-badge">Your Post</div>
                  )}
                </div>
                <div className="post-content">
                  <p>{post.content}</p>
                </div>
                <div className="post-footer">
                  <div className="post-author">
                    <span className="author-avatar">
                      {post.author?.name?.charAt(0).toUpperCase()}
                    </span>
                    <div className="author-info">
                      <p className="author-name">{post.author?.name}</p>
                      <p className="post-date">
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  {isPostOwner(post.author?._id) && (
                    <div className="post-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditClick(post._id)}
                        title="Edit this post"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteClick(post._id)}
                        title="Delete this post"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-container">
            <div className="pagination-info">
              <p>
                Page {pagination.currentPage} of {pagination.totalPages}
              </p>
            </div>

            <div className="pagination-controls">
              <button
                onClick={handlePreviousPage}
                disabled={!pagination.hasPreviousPage || loading}
                className="btn-pagination prev"
              >
                ← Previous
              </button>

              <div className="page-numbers">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      disabled={loading}
                      className={`page-number ${
                        page === pagination.currentPage ? 'active' : ''
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={handleNextPage}
                disabled={!pagination.hasNextPage || loading}
                className="btn-pagination next"
              >
                Next →
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="delete-confirm-modal">
            <div className="modal-header">
              <h2>Delete Post?</h2>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete this post?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-actions">
              <button
                className="btn-cancel"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="btn-confirm-delete"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostList;
