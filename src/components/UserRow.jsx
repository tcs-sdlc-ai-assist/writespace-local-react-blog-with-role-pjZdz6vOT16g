import React from 'react';
import PropTypes from 'prop-types';
import { getAvatar } from './Avatar.jsx';

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
 * User row/card component for admin user management.
 * Displays user info (displayName, username, role badge, createdAt).
 * Delete button is disabled for the hard-coded admin user and for the current user (self).
 * @param {Object} props
 * @param {Object} props.user - The user object to display.
 * @param {string} props.user.id - The user's id.
 * @param {string} props.user.displayName - The user's display name.
 * @param {string} props.user.username - The user's username.
 * @param {string} props.user.role - The user's role ('admin' or 'user').
 * @param {string} [props.user.createdAt] - The user's creation date (ISO string).
 * @param {Object} props.currentUser - The currently logged-in user.
 * @param {string} props.currentUser.userId - The current user's id.
 * @param {string} props.currentUser.role - The current user's role.
 * @param {Function} props.onDelete - Callback invoked with the user's id when delete is clicked.
 * @returns {JSX.Element} The user row element.
 */
function UserRow({ user, currentUser, onDelete }) {
  const { id, displayName, username, role, createdAt } = user;

  const formattedDate = formatDate(createdAt);

  const isHardCodedAdmin = id === 'admin';
  const isSelf = currentUser && currentUser.userId === id;
  const deleteDisabled = isHardCodedAdmin || isSelf;

  const isAdmin = role === 'admin';

  const roleBadgeClasses = isAdmin
    ? 'bg-secondary-100 text-secondary-800'
    : 'bg-primary-100 text-primary-800';

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex-shrink-0">
        {getAvatar(role, 'md')}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-gray-900 truncate">
            {displayName || 'Unknown'}
          </span>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${roleBadgeClasses}`}
          >
            {isAdmin ? 'Admin' : 'User'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 truncate">@{username}</span>
          {formattedDate && (
            <span className="text-xs text-gray-400">Joined {formattedDate}</span>
          )}
        </div>
      </div>

      <div className="flex-shrink-0">
        <button
          type="button"
          onClick={() => onDelete(id)}
          disabled={deleteDisabled}
          className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-150 ${
            deleteDisabled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
          }`}
          aria-label={`Delete user ${displayName || username}`}
          title={
            isHardCodedAdmin
              ? 'Cannot delete the default admin'
              : isSelf
              ? 'Cannot delete yourself'
              : `Delete ${displayName || username}`
          }
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
    </div>
  );
}

UserRow.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    createdAt: PropTypes.string,
  }).isRequired,
  currentUser: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default UserRow;