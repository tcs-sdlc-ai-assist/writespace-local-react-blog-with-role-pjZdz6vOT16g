import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/**
 * Public navigation bar for unauthenticated users.
 * Displays WriteSpace brand logo and navigation links: Home, Login, Register.
 * Responsive with mobile hamburger menu.
 * @returns {JSX.Element} The public navbar element.
 */
function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors duration-150"
            >
              ✍️ WriteSpace
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClasses('/')}>
              Home
            </Link>
            <Link to="/login" className={linkClasses('/login')}>
              Login
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-150"
            >
              Register
            </Link>
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
              to="/"
              className={mobileLinkClasses('/')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/login"
              className={mobileLinkClasses('/login')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={mobileLinkClasses('/register')}
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default PublicNavbar;