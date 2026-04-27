import React from 'react';
import PropTypes from 'prop-types';

/**
 * Reusable stat card component for the admin dashboard.
 * Displays a title, value, and icon with Tailwind styling.
 * @param {Object} props
 * @param {string} props.title - The stat label/title.
 * @param {string|number} props.value - The stat value to display.
 * @param {string} props.icon - The emoji or icon string to render.
 * @param {string} [props.color] - Color variant: 'primary', 'secondary', or 'accent'. Defaults to 'primary'.
 * @returns {JSX.Element} The stat card element.
 */
function StatCard({ title, value, icon, color = 'primary' }) {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      iconBg: 'bg-primary-200 text-primary-800',
      value: 'text-primary-900',
    },
    secondary: {
      bg: 'bg-secondary-50',
      iconBg: 'bg-secondary-200 text-secondary-800',
      value: 'text-secondary-900',
    },
    accent: {
      bg: 'bg-accent-50',
      iconBg: 'bg-accent-200 text-accent-800',
      value: 'text-accent-900',
    },
  };

  const colors = colorClasses[color] || colorClasses.primary;

  return (
    <div
      className={`${colors.bg} rounded-lg p-6 shadow-sm flex items-center gap-4`}
    >
      <span
        className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-xl flex-shrink-0 ${colors.iconBg}`}
        role="img"
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-600">{title}</span>
        <span className={`text-2xl font-bold ${colors.value}`}>{value}</span>
      </div>
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['primary', 'secondary', 'accent']),
};

export default StatCard;