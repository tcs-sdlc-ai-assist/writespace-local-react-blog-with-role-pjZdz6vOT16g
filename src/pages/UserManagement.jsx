import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import UserRow from '../components/UserRow.jsx';
import { getSession, getUsers, addUser, deleteUser } from '../utils/storage.js';

/**
 * Generate a simple unique id.
 * @returns {string} A unique id string.
 */
function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

/**
 * Admin-only user management page at /admin/users.
 * Create user form with displayName, username, password, and role fields.
 * Validates all fields and enforces username uniqueness.
 * User list displaying all users with displayName, username, role badge, createdAt, and delete button.
 * Delete disabled for hard-coded admin and self. Delete confirms before removal.
 * @returns {JSX.Element} The user management page element.
 */
function UserManagement() {
  const navigate = useNavigate();
  const session = getSession();

  const [users, setUsers] = useState([]);
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const currentUser = session
    ? { userId: session.userId, role: session.role }
    : null;

  useEffect(() => {
    setUsers(getUsers());
  }, []);

  /**
   * Handle create user form submission.
   * @param {React.FormEvent} e - The form event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const trimmedDisplayName = displayName.trim();
    const trimmedUsername = username.trim();

    if (!trimmedDisplayName) {
      setError('Display name is required.');
      return;
    }

    if (trimmedDisplayName.length < 2) {
      setError('Display name must be at least 2 characters.');
      return;
    }

    if (!trimmedUsername) {
      setError('Username is required.');
      return;
    }

    if (trimmedUsername.length < 3) {
      setError('Username must be at least 3 characters.');
      return;
    }

    if (!password) {
      setError('Password is required.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    const currentUsers = getUsers();
    if (currentUsers.some((u) => u.username === trimmedUsername)) {
      setError('Username already exists. Please choose a different one.');
      return;
    }

    setLoading(true);

    try {
      const newUser = {
        id: 'u_' + generateId(),
        displayName: trimmedDisplayName,
        username: trimmedUsername,
        password: password,
        role: role,
        createdAt: new Date().toISOString(),
      };

      addUser(newUser);
      setUsers(getUsers());

      setDisplayName('');
      setUsername('');
      setPassword('');
      setRole('user');
      setSuccess(`User "${trimmedDisplayName}" created successfully.`);
      setLoading(false);
    } catch {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  }

  /**
   * Prompt delete confirmation for a user.
   * @param {string} userId - The user id to delete.
   */
  function handleDeleteClick(userId) {
    const user = users.find((u) => u.id === userId);
    if (!user) {
      return;
    }
    setDeleteTarget(user);
    setShowDeleteConfirm(true);
  }

  /**
   * Confirm and execute user deletion.
   */
  function handleDeleteConfirm() {
    if (deleteTarget) {
      deleteUser(deleteTarget.id);
      setUsers(getUsers());
      setSuccess(`User "${deleteTarget.displayName}" has been deleted.`);
    }
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  }

  /**
   * Cancel delete confirmation.
   */
  function handleDeleteCancel() {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              Create and manage users on your WriteSpace platform
            </p>
          </div>

          {/* Create User Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sm:p-8 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Create New User
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200">
                <p className="text-sm text-green-600">{success}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="displayName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    autoComplete="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter display name"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                  />
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                  />
                </div>

                <div>
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors duration-150"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center px-4 py-2.5 rounded-md text-sm font-medium text-white transition-colors duration-150 shadow-sm ${
                    loading
                      ? 'bg-primary-400 cursor-not-allowed'
                      : 'bg-primary-600 hover:bg-primary-700'
                  }`}
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
                  {loading ? 'Creating…' : 'Create User'}
                </button>
              </div>
            </form>
          </div>

          {/* Users List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                All Users ({users.length})
              </h2>
            </div>

            {users.length > 0 ? (
              <div className="space-y-3">
                {users.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    currentUser={currentUser}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
                <span
                  className="text-4xl mb-4 block"
                  role="img"
                  aria-hidden="true"
                >
                  👥
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No users found
                </h3>
                <p className="text-gray-500 text-sm">
                  Create your first user using the form above.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleDeleteCancel}
            aria-hidden="true"
          />
          <div className="relative bg-white rounded-lg shadow-lg border border-gray-100 p-6 w-full max-w-md z-10">
            <div className="text-center">
              <span
                className="text-4xl mb-3 block"
                role="img"
                aria-hidden="true"
              >
                ⚠️
              </span>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Delete User
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete &ldquo;{deleteTarget.displayName}&rdquo;?
                This action cannot be undone. All posts by this user will remain.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleDeleteCancel}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-150"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;