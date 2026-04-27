import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  login,
  register,
  logout,
  isAdmin,
  isAuthenticated,
  getCurrentUser,
} from './auth.js';

describe('auth.js', () => {
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

  // --- login ---

  describe('login', () => {
    it('logs in the hard-coded admin user with admin/admin', () => {
      const session = login('admin', 'admin');
      expect(session).not.toBeNull();
      expect(session.userId).toBe('admin');
      expect(session.username).toBe('admin');
      expect(session.displayName).toBe('Admin');
      expect(session.role).toBe('admin');
    });

    it('sets session in localStorage on successful admin login', () => {
      login('admin', 'admin');
      const stored = JSON.parse(store['writespace_session']);
      expect(stored.userId).toBe('admin');
      expect(stored.role).toBe('admin');
    });

    it('logs in a regular user from localStorage', () => {
      const mockUsers = [
        { id: 'admin', displayName: 'Admin', username: 'admin', password: 'admin', role: 'admin', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: 'u_1', displayName: 'User One', username: 'user1', password: 'pass1234', role: 'user', createdAt: '2024-01-02T00:00:00.000Z' },
      ];
      store['writespace_users'] = JSON.stringify(mockUsers);

      const session = login('user1', 'pass1234');
      expect(session).not.toBeNull();
      expect(session.userId).toBe('u_1');
      expect(session.username).toBe('user1');
      expect(session.displayName).toBe('User One');
      expect(session.role).toBe('user');
    });

    it('returns null for invalid username', () => {
      const session = login('nonexistent', 'password');
      expect(session).toBeNull();
    });

    it('returns null for invalid password', () => {
      const session = login('admin', 'wrongpassword');
      expect(session).toBeNull();
    });

    it('returns null for empty username', () => {
      const session = login('', 'admin');
      expect(session).toBeNull();
    });

    it('returns null for empty password', () => {
      const session = login('admin', '');
      expect(session).toBeNull();
    });

    it('returns null for null username and password', () => {
      const session = login(null, null);
      expect(session).toBeNull();
    });

    it('returns null for undefined username and password', () => {
      const session = login(undefined, undefined);
      expect(session).toBeNull();
    });
  });

  // --- register ---

  describe('register', () => {
    it('registers a new user successfully', () => {
      const session = register('Jane Doe', 'janedoe', 'password123');
      expect(session).not.toBeNull();
      expect(session.username).toBe('janedoe');
      expect(session.displayName).toBe('Jane Doe');
      expect(session.role).toBe('user');
      expect(session.userId).toMatch(/^u_/);
    });

    it('sets session in localStorage on successful registration', () => {
      register('Jane Doe', 'janedoe', 'password123');
      const stored = JSON.parse(store['writespace_session']);
      expect(stored.username).toBe('janedoe');
      expect(stored.displayName).toBe('Jane Doe');
      expect(stored.role).toBe('user');
    });

    it('adds the new user to localStorage users array', () => {
      register('Jane Doe', 'janedoe', 'password123');
      const users = JSON.parse(store['writespace_users']);
      const jane = users.find((u) => u.username === 'janedoe');
      expect(jane).toBeDefined();
      expect(jane.displayName).toBe('Jane Doe');
      expect(jane.role).toBe('user');
      expect(jane.password).toBe('password123');
      expect(jane.createdAt).toBeDefined();
    });

    it('returns null when username already exists', () => {
      const mockUsers = [
        { id: 'admin', displayName: 'Admin', username: 'admin', password: 'admin', role: 'admin', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: 'u_1', displayName: 'User One', username: 'user1', password: 'pass1234', role: 'user', createdAt: '2024-01-02T00:00:00.000Z' },
      ];
      store['writespace_users'] = JSON.stringify(mockUsers);

      const session = register('Another User', 'user1', 'newpass');
      expect(session).toBeNull();
    });

    it('returns null when trying to register with admin username', () => {
      const session = register('Fake Admin', 'admin', 'admin');
      expect(session).toBeNull();
    });

    it('returns null when displayName is too short', () => {
      const session = register('J', 'janedoe', 'password123');
      expect(session).toBeNull();
    });

    it('returns null when displayName is empty', () => {
      const session = register('', 'janedoe', 'password123');
      expect(session).toBeNull();
    });

    it('returns null when username is too short', () => {
      const session = register('Jane Doe', 'jd', 'password123');
      expect(session).toBeNull();
    });

    it('returns null when username is empty', () => {
      const session = register('Jane Doe', '', 'password123');
      expect(session).toBeNull();
    });

    it('returns null when password is too short', () => {
      const session = register('Jane Doe', 'janedoe', 'abc');
      expect(session).toBeNull();
    });

    it('returns null when password is empty', () => {
      const session = register('Jane Doe', 'janedoe', '');
      expect(session).toBeNull();
    });

    it('returns null for null arguments', () => {
      expect(register(null, 'janedoe', 'password123')).toBeNull();
      expect(register('Jane', null, 'password123')).toBeNull();
      expect(register('Jane', 'janedoe', null)).toBeNull();
    });
  });

  // --- logout ---

  describe('logout', () => {
    it('clears the session from localStorage', () => {
      const mockSession = { userId: 'u_1', username: 'user1', displayName: 'User One', role: 'user' };
      store['writespace_session'] = JSON.stringify(mockSession);

      logout();

      expect(localStorage.removeItem).toHaveBeenCalledWith('writespace_session');
      expect(store['writespace_session']).toBeUndefined();
    });

    it('does not throw when no session exists', () => {
      expect(() => logout()).not.toThrow();
    });
  });

  // --- isAdmin ---

  describe('isAdmin', () => {
    it('returns true when the current session is an admin', () => {
      const mockSession = { userId: 'admin', username: 'admin', displayName: 'Admin', role: 'admin' };
      store['writespace_session'] = JSON.stringify(mockSession);

      expect(isAdmin()).toBe(true);
    });

    it('returns false when the current session is a regular user', () => {
      const mockSession = { userId: 'u_1', username: 'user1', displayName: 'User One', role: 'user' };
      store['writespace_session'] = JSON.stringify(mockSession);

      expect(isAdmin()).toBe(false);
    });

    it('returns false when no session exists', () => {
      expect(isAdmin()).toBe(false);
    });
  });

  // --- isAuthenticated ---

  describe('isAuthenticated', () => {
    it('returns true when a valid session exists', () => {
      const mockSession = { userId: 'u_1', username: 'user1', displayName: 'User One', role: 'user' };
      store['writespace_session'] = JSON.stringify(mockSession);

      expect(isAuthenticated()).toBe(true);
    });

    it('returns true when admin session exists', () => {
      const mockSession = { userId: 'admin', username: 'admin', displayName: 'Admin', role: 'admin' };
      store['writespace_session'] = JSON.stringify(mockSession);

      expect(isAuthenticated()).toBe(true);
    });

    it('returns false when no session exists', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('returns false when session is invalid', () => {
      store['writespace_session'] = JSON.stringify({ username: 'admin' });
      expect(isAuthenticated()).toBe(false);
    });
  });

  // --- getCurrentUser ---

  describe('getCurrentUser', () => {
    it('returns the full user object for the authenticated user', () => {
      const mockUsers = [
        { id: 'admin', displayName: 'Admin', username: 'admin', password: 'admin', role: 'admin', createdAt: '2024-01-01T00:00:00.000Z' },
        { id: 'u_1', displayName: 'User One', username: 'user1', password: 'pass1234', role: 'user', createdAt: '2024-01-02T00:00:00.000Z' },
      ];
      store['writespace_users'] = JSON.stringify(mockUsers);

      const mockSession = { userId: 'u_1', username: 'user1', displayName: 'User One', role: 'user' };
      store['writespace_session'] = JSON.stringify(mockSession);

      const user = getCurrentUser();
      expect(user).not.toBeNull();
      expect(user.id).toBe('u_1');
      expect(user.displayName).toBe('User One');
      expect(user.username).toBe('user1');
      expect(user.role).toBe('user');
    });

    it('returns the admin user object when admin is logged in', () => {
      const mockSession = { userId: 'admin', username: 'admin', displayName: 'Admin', role: 'admin' };
      store['writespace_session'] = JSON.stringify(mockSession);

      const user = getCurrentUser();
      expect(user).not.toBeNull();
      expect(user.id).toBe('admin');
      expect(user.role).toBe('admin');
    });

    it('returns null when no session exists', () => {
      const user = getCurrentUser();
      expect(user).toBeNull();
    });

    it('returns null when session user is not found in users list', () => {
      const mockUsers = [
        { id: 'admin', displayName: 'Admin', username: 'admin', password: 'admin', role: 'admin', createdAt: '2024-01-01T00:00:00.000Z' },
      ];
      store['writespace_users'] = JSON.stringify(mockUsers);

      const mockSession = { userId: 'u_deleted', username: 'deleted', displayName: 'Deleted', role: 'user' };
      store['writespace_session'] = JSON.stringify(mockSession);

      const user = getCurrentUser();
      expect(user).toBeNull();
    });
  });

  // --- Integration-like flows ---

  describe('login then logout flow', () => {
    it('login sets session and logout clears it', () => {
      const session = login('admin', 'admin');
      expect(session).not.toBeNull();
      expect(isAuthenticated()).toBe(true);
      expect(isAdmin()).toBe(true);

      logout();
      expect(isAuthenticated()).toBe(false);
      expect(isAdmin()).toBe(false);
    });
  });

  describe('register then login flow', () => {
    it('registers a user then logs in with the same credentials', () => {
      const regSession = register('New User', 'newuser', 'mypassword');
      expect(regSession).not.toBeNull();
      expect(regSession.role).toBe('user');

      logout();

      const loginSession = login('newuser', 'mypassword');
      expect(loginSession).not.toBeNull();
      expect(loginSession.username).toBe('newuser');
      expect(loginSession.displayName).toBe('New User');
      expect(loginSession.role).toBe('user');
    });
  });
});