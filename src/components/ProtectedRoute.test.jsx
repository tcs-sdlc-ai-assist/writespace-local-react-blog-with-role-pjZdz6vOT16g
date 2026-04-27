import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute.jsx';

vi.mock('../utils/storage.js', () => ({
  getSession: vi.fn(),
}));

import { getSession } from '../utils/storage.js';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('unauthenticated users', () => {
    it('redirects to /login when no session exists', () => {
      getSession.mockReturnValue(null);

      render(
        <MemoryRouter initialEntries={['/blogs']}>
          <Routes>
            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('redirects to /login when session is null for admin route', () => {
      getSession.mockReturnValue(null);

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <div>Admin Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });

  describe('authenticated regular users', () => {
    it('renders children for authenticated user on non-role-restricted route', () => {
      getSession.mockReturnValue({
        userId: 'u_1',
        username: 'user1',
        displayName: 'User One',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/blogs']}>
          <Routes>
            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('redirects non-admin user to /blogs when accessing admin route', () => {
      getSession.mockReturnValue({
        userId: 'u_1',
        username: 'user1',
        displayName: 'User One',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <div>Admin Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
    });

    it('redirects non-admin user to /blogs when accessing admin/users route', () => {
      getSession.mockReturnValue({
        userId: 'u_1',
        username: 'user1',
        displayName: 'User One',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/admin/users']}>
          <Routes>
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute role="admin">
                  <div>User Management Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByText('User Management Content')).not.toBeInTheDocument();
      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
    });
  });

  describe('authenticated admin users', () => {
    it('renders children for admin user on admin route', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <div>Admin Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Admin Content')).toBeInTheDocument();
      expect(screen.queryByText('Blogs Page')).not.toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });

    it('renders children for admin user on non-role-restricted route', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      render(
        <MemoryRouter initialEntries={['/blogs']}>
          <Routes>
            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <div>Protected Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Protected Content')).toBeInTheDocument();
    });

    it('renders children for admin user on admin/users route', () => {
      getSession.mockReturnValue({
        userId: 'admin',
        username: 'admin',
        displayName: 'Admin',
        role: 'admin',
      });

      render(
        <MemoryRouter initialEntries={['/admin/users']}>
          <Routes>
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute role="admin">
                  <div>User Management Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('User Management Content')).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('renders Outlet when no children are provided and user is authenticated', () => {
      getSession.mockReturnValue({
        userId: 'u_1',
        username: 'user1',
        displayName: 'User One',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/parent/child']}>
          <Routes>
            <Route path="/parent" element={<ProtectedRoute />}>
              <Route path="child" element={<div>Nested Child Content</div>} />
            </Route>
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.getByText('Nested Child Content')).toBeInTheDocument();
    });

    it('redirects to /login when session is undefined-like', () => {
      getSession.mockReturnValue(null);

      render(
        <MemoryRouter initialEntries={['/write']}>
          <Routes>
            <Route
              path="/write"
              element={
                <ProtectedRoute>
                  <div>Write Content</div>
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByText('Write Content')).not.toBeInTheDocument();
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('redirects user with mismatched role to /blogs', () => {
      getSession.mockReturnValue({
        userId: 'u_2',
        username: 'user2',
        displayName: 'User Two',
        role: 'user',
      });

      render(
        <MemoryRouter initialEntries={['/admin']}>
          <Routes>
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <div>Admin Only</div>
                </ProtectedRoute>
              }
            />
            <Route path="/blogs" element={<div>Blogs Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
          </Routes>
        </MemoryRouter>
      );

      expect(screen.queryByText('Admin Only')).not.toBeInTheDocument();
      expect(screen.getByText('Blogs Page')).toBeInTheDocument();
      expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
    });
  });
});