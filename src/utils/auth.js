import {
  getUsers,
  addUser,
  getSession,
  setSession,
  clearSession,
} from './storage.js';

/**
 * Generate a simple unique id.
 * @returns {string} A unique id string.
 */
function generateId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

/**
 * Attempt to log in with the given credentials.
 * Checks the hard-coded admin account first, then localStorage users.
 * On success, sets the session and returns the session object.
 * @param {string} username - The username.
 * @param {string} password - The password.
 * @returns {Object|null} The session object on success, or null on failure.
 */
export function login(username, password) {
  if (!username || !password) {
    return null;
  }

  const users = getUsers();
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return null;
  }

  const session = {
    userId: user.id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  };

  setSession(session);
  return session;
}

/**
 * Register a new user.
 * Validates fields, checks username uniqueness, saves user and session.
 * @param {string} displayName - The display name (min 2 chars).
 * @param {string} username - The username (min 3 chars, unique).
 * @param {string} password - The password (min 4 chars).
 * @returns {Object|null} The session object on success, or null on failure.
 */
export function register(displayName, username, password) {
  if (!displayName || displayName.length < 2) {
    return null;
  }
  if (!username || username.length < 3) {
    return null;
  }
  if (!password || password.length < 4) {
    return null;
  }

  const users = getUsers();

  if (users.some((u) => u.username === username)) {
    return null;
  }

  const newUser = {
    id: 'u_' + generateId(),
    displayName,
    username,
    password,
    role: 'user',
    createdAt: new Date().toISOString(),
  };

  addUser(newUser);

  const session = {
    userId: newUser.id,
    username: newUser.username,
    displayName: newUser.displayName,
    role: newUser.role,
  };

  setSession(session);
  return session;
}

/**
 * Log out the current user by clearing the session.
 */
export function logout() {
  clearSession();
}

/**
 * Check if the current session user is an admin.
 * @returns {boolean} True if the current user has the admin role.
 */
export function isAdmin() {
  const session = getSession();
  if (!session) {
    return false;
  }
  return session.role === 'admin';
}

/**
 * Check if there is an active authenticated session.
 * @returns {boolean} True if a valid session exists.
 */
export function isAuthenticated() {
  const session = getSession();
  return session !== null;
}

/**
 * Get the full user object for the currently authenticated user.
 * @returns {Object|null} The user object, or null if not authenticated or user not found.
 */
export function getCurrentUser() {
  const session = getSession();
  if (!session) {
    return null;
  }

  const users = getUsers();
  const user = users.find((u) => u.id === session.userId);
  return user || null;
}