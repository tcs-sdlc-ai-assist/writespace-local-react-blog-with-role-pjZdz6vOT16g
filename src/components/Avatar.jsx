import React from 'react';
import PropTypes from 'prop-types';

/**
 * Avatar component that renders a role-distinct avatar.
 * Admin gets a crown emoji with violet background.
 * User gets a book emoji with indigo background.
 * @param {Object} props
 * @param {string} props.role - The user role ('admin' or 'user').
 * @param {string} [props.size] - Size variant: 'sm', 'md', or 'lg'. Defaults to 'md'.
 * @returns {JSX.Element} The avatar element.
 */
function Avatar({ role, size = 'md' }) {
  const isAdmin = role === 'admin';

  const sizeClasses = {
    sm: 'w-7 h-7 text-sm',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-xl',
  };

  const bgClass = isAdmin
    ? 'bg-secondary-200 text-secondary-800'
    : 'bg-primary-200 text-primary-800';

  const emoji = isAdmin ? '👑' : '📖';

  const sizeClass = sizeClasses[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full flex-shrink-0 ${bgClass} ${sizeClass}`}
      role="img"
      aria-label={isAdmin ? 'Admin avatar' : 'User avatar'}
    >
      {emoji}
    </span>
  );
}

Avatar.propTypes = {
  role: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

/**
 * Factory function that returns an Avatar JSX element for the given role.
 * @param {string} role - The user role ('admin' or 'user').
 * @param {string} [size='md'] - Size variant: 'sm', 'md', or 'lg'.
 * @returns {JSX.Element} The Avatar component.
 */
export function getAvatar(role, size = 'md') {
  return <Avatar role={role} size={size} />;
}

export default Avatar;