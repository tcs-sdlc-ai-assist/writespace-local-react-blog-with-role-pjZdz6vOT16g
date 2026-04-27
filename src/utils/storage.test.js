import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getPosts,
  savePosts,
  addPost,
  updatePost,
  deletePost,
  getUsers,
  saveUsers,
  addUser,
  deleteUser,
  getSession,
  setSession,
  clearSession,
} from './storage.js';

describe('storage.js', () => {
  let store;

  beforeEach(() => {
    store = {};
    const localStorageMock = {
      getItem: vi.fn((key) => {
        return key in store ? store[key] : null;
      }),
      setItem: vi.fn((key, value) => {
        store[key] = String(value);
      }),
      removeItem: vi.fn((key) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- Posts ---

  describe('getPosts', () => {
    it('returns an empty array when no posts exist', () => {
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns stored posts', () => {
      const mockPosts = [
        { id: 'p_1', title: 'Test', content: 'Content', createdAt: '2024-01-01T00:00:00.000Z', authorId: 'u_1', authorName: 'User' },
      ];
      store['writespace_posts'] = JSON.stringify(mockPosts);
      const posts = getPosts();
      expect(posts).toEqual(mockPosts);
    });

    it('returns an empty array when localStorage has corrupted JSON for posts', () => {
      store['writespace_posts'] = '{invalid json';
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('returns an empty array when posts value is not an array', () => {
      store['writespace_posts'] = JSON.stringify('not-an-array');
      const posts = getPosts();
      expect(posts).toEqual([]);
    });
  });

  describe('savePosts', () => {
    it('saves posts array to localStorage', () => {
      const mockPosts = [
        { id: 'p_1', title: 'Test', content: 'Content' },
      ];
      savePosts(mockPosts);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'writespace_posts',
        JSON.stringify(mockPosts)
      );
    });

    it('does not save if argument is not an array', () => {
      savePosts('not-an-array');
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('addPost', () => {
    it('adds a post to the existing posts array', () => {
      const existingPost = { id: 'p_1', title: 'Existing', content: 'Content' };
      store['writespace_posts'] = JSON.stringify([existingPost]);

      const newPost = { id: 'p_2', title: 'New', content: 'New Content' };
      addPost(newPost);

      const posts = getPosts();
      expect(posts).toHaveLength(2);
      expect(posts[1]).toEqual(newPost);
    });

    it('does not add a post without an id', () => {
      addPost({ title: 'No ID' });
      const posts = getPosts();
      expect(posts).toEqual([]);
    });

    it('does not add null or undefined', () => {
      addPost(null);
      addPost(undefined);
      const posts = getPosts();
      expect(posts).toEqual([]);
    });
  });

  describe('updatePost', () => {
    it('updates an existing post by id', () => {
      const post = { id: 'p_1', title: 'Original', content: 'Original Content', createdAt: '2024-01-01T00:00:00.000Z' };
      store['writespace_posts'] = JSON.stringify([post]);

      updatePost({ id: 'p_1', title: 'Updated Title', content: 'Updated Content' });

      const posts = getPosts();
      expect(posts[0].title).toBe('Updated Title');
      expect(posts[0].content).toBe('Updated Content');
      expect(posts[0].createdAt).toBe('2024-01-01T00:00:00.000Z');
    });

    it('does nothing if post id is not found', () => {
      const post = { id: 'p_1', title: 'Original', content: 'Content' };
      store['writespace_posts'] = JSON.stringify([post]);

      updatePost({ id: 'p_nonexistent', title: 'Updated' });

      const posts = getPosts();
      expect(posts).toHaveLength(1);
      expect(posts[0].title).toBe('Original');
    });

    it('does nothing if post is null or has no id', () => {
      const post = { id: 'p_1', title: 'Original', content: 'Content' };
      store['writespace_posts'] = JSON.stringify([post]);

      updatePost(null);
      updatePost({ title: 'No ID' });

      const posts = getPosts();
      expect(posts[0].title).toBe('Original');
    });
  });

  describe('deletePost', () => {
    it('deletes a post by id', () => {
      const posts = [
        { id: 'p_1', title: 'First', content: 'Content' },
        { id: 'p_2', title: 'Second', content: 'Content' },
      ];
      store['writespace_posts'] = JSON.stringify(posts);

      deletePost('p_1');

      const remaining = getPosts();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('p_2');
    });

    it('does nothing if id is empty or null', () => {
      const posts = [{ id: 'p_1', title: 'First', content: 'Content' }];
      store['writespace_posts'] = JSON.stringify(posts);

      deletePost('');
      deletePost(null);

      const remaining = getPosts();
      expect(remaining).toHaveLength(1);
    });

    it('does nothing if id does not match any post', () => {
      const posts = [{ id: 'p_1', title: 'First', content: 'Content' }];
      store['writespace_posts'] = JSON.stringify(posts);

      deletePost('p_nonexistent');

      const remaining = getPosts();
      expect(remaining).toHaveLength(1);
    });
  });

  // --- Users ---

  describe('getUsers', () => {
    it('returns users with default admin when no users exist', () => {
      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe('admin');
      expect(users[0].username).toBe('admin');
      expect(users[0].role).toBe('admin');
    });

    it('returns stored users including admin', () => {
      const mockUsers = [
        { id: 'admin', displayName: 'Admin', username: 'admin', password: 'admin', role: 'admin', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: 'u_1', displayName: 'User One', username: 'user1', password: 'pass', role: 'user', createdAt: '2024-01-02T00:00:00.000Z' },
      ];
      store['writespace_users'] = JSON.stringify(mockUsers);

      const users = getUsers();
      expect(users).toHaveLength(2);
      expect(users[0].id).toBe('admin');
      expect(users[1].id).toBe('u_1');
    });

    it('ensures admin user is added if missing from stored users', () => {
      const mockUsers = [
        { id: 'u_1', displayName: 'User One', username: 'user1', password: 'pass', role: 'user', createdAt: '2024-01-02T00:00:00.000Z' },
      ];
      store['writespace_users'] = JSON.stringify(mockUsers);

      const users = getUsers();
      expect(users.some((u) => u.id === 'admin')).toBe(true);
      expect(users.some((u) => u.id === 'u_1')).toBe(true);
    });

    it('handles corrupted JSON for users gracefully', () => {
      store['writespace_users'] = 'not valid json{{{';
      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe('admin');
    });

    it('handles non-array users value gracefully', () => {
      store['writespace_users'] = JSON.stringify('a string');
      const users = getUsers();
      expect(users).toHaveLength(1);
      expect(users[0].id).toBe('admin');
    });
  });

  describe('saveUsers', () => {
    it('saves users array to localStorage', () => {
      const mockUsers = [
        { id: 'admin', displayName: 'Admin', username: 'admin', password: 'admin', role: 'admin' },
      ];
      saveUsers(mockUsers);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'writespace_users',
        JSON.stringify(mockUsers)
      );
    });

    it('does not save if argument is not an array', () => {
      saveUsers('not-an-array');
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('addUser', () => {
    it('adds a user to the existing users array', () => {
      const newUser = { id: 'u_2', displayName: 'User Two', username: 'user2', password: 'pass', role: 'user', createdAt: '2024-01-03T00:00:00.000Z' };
      addUser(newUser);

      const users = getUsers();
      expect(users.some((u) => u.id === 'u_2')).toBe(true);
    });

    it('does not add a user without an id', () => {
      const initialUsers = getUsers();
      addUser({ displayName: 'No ID', username: 'noid', password: 'pass', role: 'user' });
      const users = getUsers();
      expect(users).toHaveLength(initialUsers.length);
    });

    it('does not add null or undefined', () => {
      const initialUsers = getUsers();
      addUser(null);
      addUser(undefined);
      const users = getUsers();
      expect(users).toHaveLength(initialUsers.length);
    });
  });

  describe('deleteUser', () => {
    it('deletes a user by id', () => {
      const mockUsers = [
        { id: 'admin', displayName: 'Admin', username: 'admin', password: 'admin', role: 'admin', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: 'u_1', displayName: 'User One', username: 'user1', password: 'pass', role: 'user', createdAt: '2024-01-02T00:00:00.000Z' },
      ];
      store['writespace_users'] = JSON.stringify(mockUsers);

      deleteUser('u_1');

      const users = getUsers();
      expect(users.some((u) => u.id === 'u_1')).toBe(false);
    });

    it('cannot delete the admin user', () => {
      const mockUsers = [
        { id: 'admin', displayName: 'Admin', username: 'admin', password: 'admin', role: 'admin', createdAt: '2024-01-01T00:00:00.000Z' },
      ];
      store['writespace_users'] = JSON.stringify(mockUsers);

      deleteUser('admin');

      const users = getUsers();
      expect(users.some((u) => u.id === 'admin')).toBe(true);
    });

    it('does nothing if id is empty or null', () => {
      const mockUsers = [
        { id: 'admin', displayName: 'Admin', username: 'admin', password: 'admin', role: 'admin', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: 'u_1', displayName: 'User One', username: 'user1', password: 'pass', role: 'user', createdAt: '2024-01-02T00:00:00.000Z' },
      ];
      store['writespace_users'] = JSON.stringify(mockUsers);

      deleteUser('');
      deleteUser(null);

      const users = getUsers();
      expect(users).toHaveLength(2);
    });
  });

  // --- Session ---

  describe('getSession', () => {
    it('returns null when no session exists', () => {
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns the stored session object', () => {
      const mockSession = { userId: 'admin', username: 'admin', displayName: 'Admin', role: 'admin' };
      store['writespace_session'] = JSON.stringify(mockSession);

      const session = getSession();
      expect(session).toEqual(mockSession);
    });

    it('returns null for corrupted session JSON', () => {
      store['writespace_session'] = 'not valid json';
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null if session object has no userId', () => {
      store['writespace_session'] = JSON.stringify({ username: 'admin', role: 'admin' });
      const session = getSession();
      expect(session).toBeNull();
    });

    it('returns null if session is not an object', () => {
      store['writespace_session'] = JSON.stringify('just a string');
      const session = getSession();
      expect(session).toBeNull();
    });
  });

  describe('setSession', () => {
    it('stores a valid session object', () => {
      const mockSession = { userId: 'u_1', username: 'user1', displayName: 'User One', role: 'user' };
      setSession(mockSession);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'writespace_session',
        JSON.stringify(mockSession)
      );
    });

    it('does not store a session without userId', () => {
      setSession({ username: 'user1', role: 'user' });
      expect(localStorage.setItem).not.toHaveBeenCalledWith(
        'writespace_session',
        expect.anything()
      );
    });

    it('does not store null or undefined', () => {
      setSession(null);
      setSession(undefined);
      expect(localStorage.setItem).not.toHaveBeenCalled();
    });
  });

  describe('clearSession', () => {
    it('removes the session from localStorage', () => {
      store['writespace_session'] = JSON.stringify({ userId: 'u_1', username: 'user1', displayName: 'User One', role: 'user' });
      clearSession();
      expect(localStorage.removeItem).toHaveBeenCalledWith('writespace_session');
    });

    it('does not throw when no session exists', () => {
      expect(() => clearSession()).not.toThrow();
      expect(localStorage.removeItem).toHaveBeenCalledWith('writespace_session');
    });
  });

  // --- localStorage error handling ---

  describe('graceful error handling', () => {
    it('handles localStorage.getItem throwing an error', () => {
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage access denied');
      });

      expect(() => getPosts()).not.toThrow();
      expect(getPosts()).toEqual([]);

      expect(() => getSession()).not.toThrow();
      expect(getSession()).toBeNull();
    });

    it('handles localStorage.setItem throwing an error', () => {
      localStorage.setItem = vi.fn(() => {
        throw new Error('QuotaExceededError');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => savePosts([{ id: 'p_1', title: 'Test', content: 'Content' }])).not.toThrow();
      expect(() => setSession({ userId: 'u_1', username: 'user1', displayName: 'User', role: 'user' })).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('handles localStorage.removeItem throwing an error', () => {
      localStorage.removeItem = vi.fn(() => {
        throw new Error('Storage access denied');
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => clearSession()).not.toThrow();

      consoleSpy.mockRestore();
    });
  });
});