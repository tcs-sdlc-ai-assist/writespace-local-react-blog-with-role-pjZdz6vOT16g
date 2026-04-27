import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import StatCard from '../components/StatCard.jsx';
import { getAvatar } from '../components/Avatar.jsx';
import { getSession, getPosts, getUsers, deletePost } from '../utils/storage.js';

/**
 * Format an ISO date string to a human-readable format.
 * @param {string} dateStr - ISO date string.
 * @returns {string} Formatted date string.
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Truncate a string to a maximum length, appending ellipsis if truncated.
 * @param {string} text - The text to truncate.
 * @param {number} maxLength - Maximum character length.
 * @returns {string} The truncated string.
 */
function truncate(text, maxLength) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trimEnd() + '…';
}

/**
 * Admin dashboard page at /admin.
 * Displays stat cards for Total Posts, Total Users, Admin Users, Regular Users.
 * Quick-action buttons for Write New Post and Manage Users.
 * Recent posts section showing up to 5 latest posts with edit/delete controls.
 * Non-admins redirected via ProtectedRoute (handled at router level).
 * @returns {JSX.Element} The admin dashboard page element.
 */
function AdminDashboard() {
  const navigate = useNavigate();
  const session = getSession();

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    setPosts(getPosts());
    setUsers(getUsers());
  }, []);

  const totalPosts = posts.length;
  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === 'admin').length;
  const regularUsers = users.filter((u) => u.role === 'user').length;

  const recentPosts = posts
    .slice()
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  /**
   * Prompt delete confirmation for a post.
   * @param {Object} post - The post to delete.
   */
  function handleDeleteClick(post) {
    setDeleteTarget(post);
    setShowDeleteConfirm(true);
  }

  /**
   * Confirm and execute post deletion.
   */
  function handleDeleteConfirm() {
    if (deleteTarget) {
      deletePost(deleteTarget.id);
      setPosts(getPosts());
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  }

  /**
   * Cancel delete confirmation.
   */
  function handleDeleteCancel() {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Overview of your WriteSpace platform
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Posts"
              value={totalPosts}
              icon="📝"
              color="primary"
            />
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon="👥"
              color="secondary"
            />
            <StatCard
              title="Admin Users"
              value={adminUsers}
              icon="👑"
              color="accent"
            />
            <StatCard
              title="Regular Users"
              value={regularUsers}
              icon="📖"
              color="primary"
            />
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                to="/write"
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-150 shadow-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Write New Post
              </Link>
              <Link
                to="/admin/users"
                className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-secondary-600 bg-secondary-50 hover:bg-secondary-100 transition-colors duration-150"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Manage Users
              </Link>
            </div>
          </div>

          {/* Recent Posts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Posts
              </h2>
              <Link
                to="/blogs"
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors duration-150"
              >
                View All →
              </Link>
            </div>

            {recentPosts.length > 0 ? (
              <div className="space-y-3">
                {recentPosts.map((post) => {
                  const authorRole = post.authorId === 'admin' ? 'admin' : 'user';
                  return (
                    <div
                      key={post.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex-shrink-0">
                        {getAvatar(authorRole, 'sm')}
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/blog/${post.id}`}
                          className="text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors duration-150 truncate block"
                        >
                          {truncate(post.title, 60)}
                        </Link>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500 truncate">
                            {post.authorName || 'Unknown'}
                          </span>
                          {post.createdAt && (
                            <span className="text-xs text-gray-400">
                              {formatDate(post.createdAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-2">
                        <Link
                          to={`/write/${post.id}`}
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors duration-150"
                          aria-label={`Edit post: ${post.title}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(post)}
                          className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-150"
                          aria-label={`Delete post: ${post.title}`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3.5 h-3.5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <span
                  className="text-4xl mb-4 block"
                  role="img"
                  aria-hidden="true"
                >
                  📝
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No posts yet
                </h3>
                <p className="text-gray-500 mb-4 text-sm">
                  Get started by creating your first blog post.
                </p>
                <Link
                  to="/write"
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-150 shadow-sm"
                >
                  Write Your First Post
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleDeleteCancel}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-lg shadow-lg border border-gray-100 p-6 w-full max-w-md z-10">
            <div className="text-center">
              <span
                className="text-4xl mb-3 block"
                role="img"
                aria-hidden="true"
              >
                ⚠️
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete Post
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete &ldquo;{deleteTarget.title}&rdquo;? This
                action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-150"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;