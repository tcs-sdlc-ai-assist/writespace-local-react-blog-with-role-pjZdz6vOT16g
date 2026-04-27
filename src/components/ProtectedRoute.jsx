import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, Outlet } from 'react-router-dom';
import { getSession } from '../utils/storage.js';

/**
 * Route guard component for protected routes.
 * Checks session via storage.js: redirects unauthenticated users to /login,
 * and non-admins from admin-only routes to /blogs.
 * @param {Object} props
 * @param {string} [props.role] - Optional role requirement (e.g. 'admin').
 * @param {React.ReactNode} [props.children] - Child elements to render if authorized.
 * @returns {JSX.Element} The children/Outlet if authorized, or a Navigate redirect.
 */
function ProtectedRoute({ role, children }) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (role && session.role !== role) {
    return <Navigate to="/blogs" replace />;
  }

  return children ? children : <Outlet />;
}

ProtectedRoute.propTypes = {
  role: PropTypes.string,
  children: PropTypes.node,
};

export default ProtectedRoute;