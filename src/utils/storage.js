const POSTS_KEY = 'writespace_posts';
const USERS_KEY = 'writespace_users';
const SESSION_KEY = 'writespace_session';

const DEFAULT_ADMIN = {
  id: 'admin',
  displayName: 'Admin',
  username: 'admin',
  password: 'admin',
  role: 'admin',
  createdAt: new Date().toISOString(),
};

/**
 * Safely read and parse JSON from localStorage.
 * @param {string} key - The localStorage key.
 * @param {*} fallback - The fallback value if read/parse fails.
 * @returns {*} Parsed value or fallback.
 */
function safeGetItem(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

/**
 * Safely stringify and write JSON to localStorage.
 * @param {string} key - The localStorage key.
 * @param {*} value - The value to store.
 */
function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to write to localStorage key "${key}":`, e);
  }
}

/**
 * Safely remove a key from localStorage.
 * @param {string} key - The localStorage key.
 */
function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Failed to remove localStorage key "${key}":`, e);
  }
}

/**
 * Ensures the default admin user exists in the users list.
 * Called internally when reading users.
 * @param {Array} users - Current users array.
 * @returns {Array} Users array guaranteed to contain admin.
 */
function ensureAdminUser(users) {
  if (!Array.isArray(users)) {
    const initialized = [DEFAULT_ADMIN];
    safeSetItem(USERS_KEY, initialized);
    return initialized;
  }
  const hasAdmin = users.some((u) => u.id === 'admin');
  if (!hasAdmin) {
    const updated = [DEFAULT_ADMIN, ...users];
    safeSetItem(USERS_KEY, updated);
    return updated;
  }
  return users;
}

// --- Posts ---

/**
 * Get all posts from localStorage.
 * @returns {Array<Object>} Array of post objects.
 */
export function getPosts() {
  const posts = safeGetItem(POSTS_KEY, []);
  if (!Array.isArray(posts)) {
    return [];
  }
  return posts;
}

/**
 * Save the entire posts array to localStorage.
 * @param {Array<Object>} posts - Array of post objects.
 */
export function savePosts(posts) {
  if (!Array.isArray(posts)) {
    return;
  }
  safeSetItem(POSTS_KEY, posts);
}

/**
 * Add a single post to localStorage.
 * @param {Object} post - The post object to add.
 */
export function addPost(post) {
  if (!post || !post.id) {
    return;
  }
  const posts = getPosts();
  posts.push(post);
  savePosts(posts);
}

/**
 * Update an existing post by id.
 * @param {Object} post - The post object with updated fields. Must include id.
 */
export function updatePost(post) {
  if (!post || !post.id) {
    return;
  }
  const posts = getPosts();
  const index = posts.findIndex((p) => p.id === post.id);
  if (index === -1) {
    return;
  }
  posts[index] = { ...posts[index], ...post };
  savePosts(posts);
}

/**
 * Delete a post by id.
 * @param {string} id - The post id to delete.
 */
export function deletePost(id) {
  if (!id) {
    return;
  }
  const posts = getPosts();
  const filtered = posts.filter((p) => p.id !== id);
  savePosts(filtered);
}

// --- Users ---

/**
 * Get all users from localStorage. Ensures admin user exists.
 * @returns {Array<Object>} Array of user objects.
 */
export function getUsers() {
  const users = safeGetItem(USERS_KEY, []);
  return ensureAdminUser(users);
}

/**
 * Save the entire users array to localStorage.
 * @param {Array<Object>} users - Array of user objects.
 */
export function saveUsers(users) {
  if (!Array.isArray(users)) {
    return;
  }
  safeSetItem(USERS_KEY, users);
}

/**
 * Add a single user to localStorage.
 * @param {Object} user - The user object to add.
 */
export function addUser(user) {
  if (!user || !user.id) {
    return;
  }
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

/**
 * Delete a user by id. Cannot delete the admin user.
 * @param {string} id - The user id to delete.
 */
export function deleteUser(id) {
  if (!id || id === 'admin') {
    return;
  }
  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  saveUsers(filtered);
}

// --- Session ---

/**
 * Get the current session from localStorage.
 * @returns {Object|null} The session object or null.
 */
export function getSession() {
  const session = safeGetItem(SESSION_KEY, null);
  if (!session || typeof session !== 'object' || !session.userId) {
    return null;
  }
  return session;
}

/**
 * Set the current session in localStorage.
 * @param {Object} session - The session object to store.
 */
export function setSession(session) {
  if (!session || !session.userId) {
    return;
  }
  safeSetItem(SESSION_KEY, session);
}

/**
 * Clear the current session from localStorage.
 */
export function clearSession() {
  safeRemoveItem(SESSION_KEY);
}