import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { getSession } from '../utils/storage.js';
import { getPosts, addPost, updatePost } from '../utils/storage.js';

/**
 * Generate a simple unique id.
 * @returns {string} A unique id string.
 */
function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

/**
 * Blog post create/edit page.
 * Create mode at /write, edit mode at /write/:id.
 * Form with title (max 100 chars) and content (max 2000 chars) fields.
 * Validates required fields. Ownership enforcement: users can only edit own posts, admin can edit all.
 * On save, creates/updates post in localStorage and redirects.
 * Cancel button returns to previous page.
 * @returns {JSX.Element} The write/edit blog page element.
 */
function WriteBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getSession();

  const isEditMode = Boolean(id);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const posts = getPosts();
    const existingPost = posts.find((p) => p.id === id);

    if (!existingPost) {
      setNotFound(true);
      return;
    }

    if (!session) {
      setUnauthorized(true);
      return;
    }

    const canEdit =
      session.role === 'admin' || session.userId === existingPost.authorId;

    if (!canEdit) {
      setUnauthorized(true);
      return;
    }

    setTitle(existingPost.title || '');
    setContent(existingPost.content || '');
  }, [id, isEditMode, session]);

  /**
   * Handle form submission for creating or updating a post.
   * @param {React.FormEvent} e - The form event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle) {
      setError('Title is required.');
      return;
    }

    if (trimmedTitle.length > 100) {
      setError('Title must be 100 characters or less.');
      return;
    }

    if (!trimmedContent) {
      setError('Content is required.');
      return;
    }

    if (trimmedContent.length > 2000) {
      setError('Content must be 2000 characters or less.');
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        const posts = getPosts();
        const existingPost = posts.find((p) => p.id === id);

        if (!existingPost) {
          setError('Post not found.');
          setLoading(false);
          return;
        }

        updatePost({
          id,
          title: trimmedTitle,
          content: trimmedContent,
        });

        navigate(`/blog/${id}`, { replace: true });
      } else {
        const newPost = {
          id: 'p_' + generateId(),
          title: trimmedTitle,
          content: trimmedContent,
          createdAt: new Date().toISOString(),
          authorId: session ? session.userId : '',
          authorName: session ? session.displayName : 'Unknown',
        };

        addPost(newPost);

        navigate('/blogs', { replace: true });
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  /**
   * Handle cancel button click. Navigate back to previous page.
   */
  function handleCancel() {
    navigate(-1);
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
              The post you are trying to edit does not exist.
            </p>
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="inline-flex items-center px-6 py-3 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-150 shadow-sm"
            >
              Back to Blogs
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (unauthorized) {
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
              🚫
            </span>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unauthorized
            </h2>
            <p className="text-gray-500 mb-6">
              You do not have permission to edit this post.
            </p>
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="inline-flex items-center px-6 py-3 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-150 shadow-sm"
            >
              Back to Blogs
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {isEditMode ? 'Edit Post' : 'Create New Post'}
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {isEditMode
                ? 'Update your blog post below'
                : 'Share your thoughts with the community'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8">
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your post title"
                  maxLength={100}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                />
                <div className="mt-1 flex justify-end">
                  <span className="text-xs text-gray-400">
                    {title.length}/100
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="content"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your blog post content here..."
                  maxLength={2000}
                  rows={12}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150 resize-y"
                />
                <div className="mt-1 flex justify-end">
                  <span
                    className={`text-xs ${
                      content.length > 1900 ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    {content.length}/2000
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center px-4 py-2.5 rounded-md text-sm font-medium text-white transition-colors duration-150 shadow-sm ${
                    loading
                      ? 'bg-primary-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
                >
                  {loading
                    ? isEditMode
                      ? 'Saving…'
                      : 'Publishing…'
                    : isEditMode
                    ? 'Save Changes'
                    : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default WriteBlog;