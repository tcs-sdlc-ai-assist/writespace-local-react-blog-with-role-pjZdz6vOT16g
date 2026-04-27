import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import BlogCard from '../components/BlogCard.jsx';
import { getSession } from '../utils/storage.js';
import { getPosts } from '../utils/storage.js';

/**
 * Authenticated blog list page at /blogs.
 * Displays a responsive grid of all posts sorted newest first using BlogCard components.
 * Shows edit icon per role/ownership. Empty state with CTA to /write if no posts.
 * @returns {JSX.Element} The home page element.
 */
function Home() {
  const session = getSession();

  const currentUser = session
    ? { userId: session.userId, role: session.role }
    : null;

  const allPosts = getPosts();
  const sortedPosts = allPosts
    .slice()
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                All Posts
              </h1>
              <p className="text-gray-600 mt-1 text-sm">
                Browse the latest stories from our community
              </p>
            </div>
            <Link
              to="/write"
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-150 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Post
            </Link>
          </div>

          {sortedPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPosts.map((post) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <span
                className="text-5xl mb-4 block"
                role="img"
                aria-hidden="true"
              >
                📝
              </span>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                No posts yet
              </h2>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Be the first to share your thoughts with the community. Start
                writing your first blog post now!
              </p>
              <Link
                to="/write"
                className="inline-flex items-center px-6 py-3 rounded-md text-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors duration-150 shadow-sm"
              >
                Write Your First Post
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;