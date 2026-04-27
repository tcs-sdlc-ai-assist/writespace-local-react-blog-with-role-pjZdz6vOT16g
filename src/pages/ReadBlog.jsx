import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getAvatar } from '../components/Avatar.jsx';
import { getSession, getPosts, deletePost } from '../utils/storage.js';

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
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Blog post reader page at /blog/:id.
 * Displays full post: title, author name with avatar, creation date, and full content.
 * Edit button links to /write/:id (shown if admin or post owner).
 * Delete button with confirmation dialog (shown if admin or post owner).
 * On delete, removes post from localStorage and redirects to /blogs.
 * Handles invalid/missing IDs with 'Post not found' message and link back to /blogs.
 * @returns {JSX.Element} The read blog page element.
 */
function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const posts = getPosts();
    const found = posts.find((p) => p.id === id);

    if (!found) {
      setNotFound(true);
      return;
    }

    setPost(found);
  }, [id]);

  /**
   * Handle post deletion after confirmation.
   */
  function handleDelete() {
    deletePost(id);
    navigate('/blogs', { replace: true });
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center py-16">
            <span
              className="text-5xl mb-4 block"
              role="img"
              aria-hidden="true"
            >
              🔍
            </span>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Post Not Found
            </h2>
            <p className="text-gray-500 mb-6">
              The post you are looking for does not exist or has been removed.
            </p>
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-3 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-150 shadow-sm"
            >
              Back to Blogs
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <p className="text-gray-500">Loading…</p>
        </main>
      </div>
    );
  }

  const { title, content, createdAt, authorId, authorName } = post;
  const formattedDate = formatDate(createdAt);
  const authorRole = authorId === 'admin' ? 'admin' : 'user';

  const canEditOrDelete =
    session &&
    (session.role === 'admin' || session.userId === authorId);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-6">
            <Link
              to="/blogs"
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors duration-150"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Blogs
            </Link>
          </div>

          <article className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8">
            <header className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                {title}
              </h1>

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  {getAvatar(authorRole, 'md')}
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700">
                      {authorName || 'Unknown'}
                    </span>
                    {formattedDate && (
                      <span className="text-xs text-gray-400">
                        {formattedDate}
                      </span>
                    )}
                  </div>
                </div>

                {canEditOrDelete && (
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/write/${id}`}
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors duration-150"
                      aria-label={`Edit post: ${title}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-1"
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
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-150"
                      aria-label={`Delete post: ${title}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 mr-1"
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
                )}
              </div>
            </header>

            <div className="border-t border-gray-100 pt-6">
              <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                {content}
              </div>
            </div>
          </article>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setShowDeleteConfirm(false)}
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
                Are you sure you want to delete &ldquo;{title}&rdquo;? This
                action cannot be undone.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
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

export default ReadBlog;