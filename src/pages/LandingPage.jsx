import React from 'react';
import { Link } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { getPosts } from '../utils/storage.js';

/**
 * Public landing page component.
 * Displays hero section, features section, latest posts preview, and footer.
 * Accessible at / for unauthenticated users.
 * @returns {JSX.Element} The landing page element.
 */
function LandingPage() {
  const allPosts = getPosts();
  const latestPosts = allPosts
    .slice()
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  const features = [
    {
      icon: '✏️',
      title: 'Easy Blogging',
      description:
        'Create and publish blog posts in seconds with our simple and intuitive writing interface.',
    },
    {
      icon: '🔐',
      title: 'Role-Based Access',
      description:
        'Admin and user roles with fine-grained permissions for managing content and users.',
    },
    {
      icon: '⚡',
      title: 'Instant Setup',
      description:
        'No backend required. Everything runs in your browser with localStorage persistence.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Welcome to{' '}
            <span className="text-primary-600">✍️ WriteSpace</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            A simple, elegant blogging platform where you can share your
            thoughts, stories, and ideas with the world.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-150 shadow-sm"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 rounded-md text-base font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors duration-150"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Why WriteSpace?
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Everything you need to start blogging, right in your browser.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow duration-200"
              >
                <span
                  className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 text-2xl mb-4"
                  role="img"
                  aria-hidden="true"
                >
                  {feature.icon}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Latest Posts
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Check out what our community has been writing about.
            </p>
          </div>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} currentUser={null} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-4xl mb-4 block" role="img" aria-hidden="true">
                📝
              </span>
              <p className="text-gray-500 text-lg mb-2">No posts yet</p>
              <p className="text-gray-400 text-sm">
                Be the first to share your thoughts!{' '}
                <Link
                  to="/register"
                  className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-150"
                >
                  Get started
                </Link>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <span className="text-lg font-bold text-white">
                ✍️ WriteSpace
              </span>
              <p className="text-sm mt-1">
                A simple blogging platform for everyone.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <Link
                to="/"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
              >
                Home
              </Link>
              <Link
                to="/login"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-150"
              >
                Register
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-6 pt-6 text-center">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} WriteSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;