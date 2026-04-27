import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getSession } from '../utils/storage.js';
import { logout } from '../utils/auth.js';
import { getAvatar } from './Avatar.jsx';

/**
 * Authenticated navigation bar component.
 * Shows WriteSpace brand, navigation links based on role
 * (Blogs, Write, Admin Dashboard for admins, User Management for admins),
 * user avatar with display name, and logout button.
 * Responsive with mobile hamburger menu.
 * @returns {JSX.Element} The authenticated navbar element.
 */
function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();

  const isAdmin = session && session.role === 'admin';
  const displayName = session ? session.displayName : 'User';
  const role = session ? session.role : 'user';

  /**
   * Check if a given path matches the current location.
   * @param {string} path - The path to check.
   * @returns {boolean} True if the path matches.
   */
  function isActive(path) {
    return location.pathname === path;
  }

  /**
   * Get link classes based on active state.
   * @param {string} path - The path to check.
   * @returns {string} Tailwind class string.
   */
  function linkClasses(path) {
    const base = 'text-sm font-medium transition-colors duration-150';
    if (isActive(path)) {
      return `${base} text-primary-600`;
    }
    return `${base} text-gray-600 hover:text-primary-600`;
  }

  /**
   * Get mobile link classes based on active state.
   * @param {string} path - The path to check.
   * @returns {string} Tailwind class string.
   */
  function mobileLinkClasses(path) {
    const base = 'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150';
    if (isActive(path)) {
      return `${base} text-primary-600 bg-primary-50`;
    }
    return `${base} text-gray-600 hover:text-primary-600 hover:bg-gray-50`;
  }

  /**
   * Handle logout: clear session and redirect to login.
   */
  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link
              to="/blogs"
              className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors duration-150"
            >
              ✍️ WriteSpace
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/blogs" className={linkClasses('/blogs')}>
              Blogs
            </Link>
            <Link to="/write" className={linkClasses('/write')}>
              Write
            </Link>
            {isAdmin && (
              <>
                <Link to="/admin" className={linkClasses('/admin')}>
                  Admin Dashboard
                </Link>
                <Link to="/admin/users" className={linkClasses('/admin/users')}>
                  User Management
                </Link>
              </>
            )}

            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
              <div className="flex items-center gap-2">
                {getAvatar(role, 'sm')}
                <span className="text-sm font-medium text-gray-700">
                  {displayName}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
                aria-label="Logout"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-primary-600 hover:bg-gray-100 transition-colors duration-150"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/blogs"
              className={mobileLinkClasses('/blogs')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Blogs
            </Link>
            <Link
              to="/write"
              className={mobileLinkClasses('/write')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Write
            </Link>
            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  className={mobileLinkClasses('/admin')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
                <Link
                  to="/admin/users"
                  className={mobileLinkClasses('/admin/users')}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  User Management
                </Link>
              </>
            )}
          </div>
          <div className="border-t border-gray-100 px-4 py-3">
            <div className="flex items-center gap-3 mb-3">
              {getAvatar(role, 'sm')}
              <span className="text-sm font-medium text-gray-700">
                {displayName}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
              aria-label="Logout"
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
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;