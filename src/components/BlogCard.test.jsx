import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BlogCard from './BlogCard.jsx';

describe('BlogCard', () => {
  const basePost = {
    id: 'p_1',
    title: 'Test Blog Post Title',
    content: 'This is the content of the test blog post. It should be displayed as an excerpt in the blog card component.',
    createdAt: '2024-06-15T10:30:00.000Z',
    authorId: 'u_1',
    authorName: 'John Doe',
  };

  function renderBlogCard(post = basePost, currentUser = null) {
    return render(
      <MemoryRouter>
        <BlogCard post={post} currentUser={currentUser} />
      </MemoryRouter>
    );
  }

  describe('rendering post content', () => {
    it('renders the post title', () => {
      renderBlogCard();
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
    });

    it('renders the post content as an excerpt', () => {
      renderBlogCard();
      expect(
        screen.getByText(/This is the content of the test blog post/)
      ).toBeInTheDocument();
    });

    it('truncates long content with ellipsis', () => {
      const longContent = 'A'.repeat(200);
      const post = { ...basePost, content: longContent };
      renderBlogCard(post);
      const excerpt = screen.getByText(/A+…/);
      expect(excerpt).toBeInTheDocument();
      expect(excerpt.textContent.length).toBeLessThanOrEqual(151);
    });

    it('renders the author name', () => {
      renderBlogCard();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('renders "Unknown" when authorName is missing', () => {
      const post = { ...basePost, authorName: undefined };
      renderBlogCard(post);
      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });

    it('renders the formatted date', () => {
      renderBlogCard();
      expect(screen.getByText('Jun 15, 2024')).toBeInTheDocument();
    });

    it('renders empty string for missing date', () => {
      const post = { ...basePost, createdAt: undefined };
      renderBlogCard(post);
      expect(screen.queryByText('Jun 15, 2024')).not.toBeInTheDocument();
    });
  });

  describe('author avatar', () => {
    it('renders user avatar for non-admin author', () => {
      renderBlogCard();
      const avatar = screen.getByRole('img', { name: 'User avatar' });
      expect(avatar).toBeInTheDocument();
      expect(avatar.textContent).toBe('📖');
    });

    it('renders admin avatar when authorId is "admin"', () => {
      const post = { ...basePost, authorId: 'admin', authorName: 'Admin' };
      renderBlogCard(post);
      const avatar = screen.getByRole('img', { name: 'Admin avatar' });
      expect(avatar).toBeInTheDocument();
      expect(avatar.textContent).toBe('👑');
    });
  });

  describe('links', () => {
    it('links to the blog post read page', () => {
      renderBlogCard();
      const links = screen.getAllByRole('link');
      const readLink = links.find((link) => link.getAttribute('href') === '/blog/p_1');
      expect(readLink).toBeDefined();
    });
  });

  describe('edit icon visibility', () => {
    it('does not show edit icon when currentUser is null', () => {
      renderBlogCard(basePost, null);
      expect(screen.queryByLabelText(/Edit post/)).not.toBeInTheDocument();
    });

    it('does not show edit icon when currentUser is a different non-admin user', () => {
      const currentUser = { userId: 'u_2', role: 'user' };
      renderBlogCard(basePost, currentUser);
      expect(screen.queryByLabelText(/Edit post/)).not.toBeInTheDocument();
    });

    it('shows edit icon when currentUser is the post owner', () => {
      const currentUser = { userId: 'u_1', role: 'user' };
      renderBlogCard(basePost, currentUser);
      expect(screen.getByLabelText('Edit post: Test Blog Post Title')).toBeInTheDocument();
    });

    it('shows edit icon when currentUser is an admin', () => {
      const currentUser = { userId: 'admin', role: 'admin' };
      renderBlogCard(basePost, currentUser);
      expect(screen.getByLabelText('Edit post: Test Blog Post Title')).toBeInTheDocument();
    });

    it('shows edit icon when admin is not the author but has admin role', () => {
      const currentUser = { userId: 'u_99', role: 'admin' };
      renderBlogCard(basePost, currentUser);
      expect(screen.getByLabelText('Edit post: Test Blog Post Title')).toBeInTheDocument();
    });

    it('edit icon links to the write/edit page', () => {
      const currentUser = { userId: 'u_1', role: 'user' };
      renderBlogCard(basePost, currentUser);
      const editLink = screen.getByLabelText('Edit post: Test Blog Post Title');
      expect(editLink.closest('a')).toHaveAttribute('href', '/write/p_1');
    });
  });

  describe('edge cases', () => {
    it('renders with empty content', () => {
      const post = { ...basePost, content: '' };
      renderBlogCard(post);
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
    });

    it('renders with content exactly at truncation limit', () => {
      const post = { ...basePost, content: 'A'.repeat(150) };
      renderBlogCard(post);
      const excerpt = screen.getByText('A'.repeat(150));
      expect(excerpt).toBeInTheDocument();
    });

    it('renders with content just over truncation limit', () => {
      const post = { ...basePost, content: 'A'.repeat(151) };
      renderBlogCard(post);
      const excerpt = screen.getByText('A'.repeat(150) + '…');
      expect(excerpt).toBeInTheDocument();
    });

    it('renders with missing authorId', () => {
      const post = { ...basePost, authorId: undefined };
      renderBlogCard(post);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});