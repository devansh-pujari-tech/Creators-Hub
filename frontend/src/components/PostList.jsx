import { useState, useEffect } from 'react';
import api from '../services/api';
import '../styles/PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
    </div>
  );
}

export default PostList;
