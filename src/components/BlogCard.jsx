import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getAvatar } from './Avatar.jsx';

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
 * Blog post card component for the blog list grid.
 * Displays title, excerpt (truncated content), date, author name with avatar.
 * Shows edit icon if current user is admin or post owner.
 * Links to /blog/:id for reading.
 * @param {Object} props
 * @param {Object} props.post - The post object.
 * @param {string} props.post.id - The post id.
 * @param {string} props.post.title - The post title.
 * @param {string} props.post.content - The post content.
 * @param {string} props.post.createdAt - The post creation date (ISO string).
 * @param {string} props.post.authorId - The post author's user id.
 * @param {string} props.post.authorName - The post author's display name.
 * @param {Object|null} [props.currentUser] - The currently logged-in user, or null.
 * @param {string} [props.currentUser.userId] - The current user's id.
 * @param {string} [props.currentUser.role] - The current user's role.
 * @returns {JSX.Element} The blog card element.
 */
function BlogCard({ post, currentUser }) {
  const { id, title, content, createdAt, authorId, authorName } = post;

  const excerpt = truncate(content, 150);
  const formattedDate = formatDate(createdAt);

  const authorRole = authorId === 'admin' ? 'admin' : 'user';

  const canEdit =
    currentUser &&
    (currentUser.role === 'admin' || currentUser.userId === authorId);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getAvatar(authorRole, 'sm')}
            <span className="text-sm font-medium text-gray-700">
              {authorName || 'Unknown'}
            </span>
          </div>
          {canEdit && (
            <Link
              to={`/write/${id}`}
              className="text-gray-400 hover:text-primary-600 transition-colors duration-150"
              aria-label={`Edit post: ${title}`}
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4"
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
            </Link>
          )}
        </div>

        <Link to={`/blog/${id}`} className="flex flex-col flex-1 group">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-150 mb-2 line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-gray-600 mb-4 flex-1">
            {excerpt}
          </p>
        </Link>

        <div className="mt-auto pt-3 border-t border-gray-50">
          <span className="text-xs text-gray-400">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

BlogCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
    authorId: PropTypes.string,
    authorName: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string,
    role: PropTypes.string,
  }),
};

export default BlogCard;