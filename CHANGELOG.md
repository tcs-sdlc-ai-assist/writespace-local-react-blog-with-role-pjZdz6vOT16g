# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-15

### Added

- **Public Landing Page**: Hero section with call-to-action, features overview, latest posts preview, and footer at `/`.
- **Authentication**:
  - Login page at `/login` with username and password fields, error handling, and redirect logic based on user role.
  - Registration page at `/register` with display name, username, and password fields, input validation, and username uniqueness enforcement.
  - Hard-coded admin account (`admin`/`admin`) available out of the box.
  - Session management via `localStorage` with `setSession`, `getSession`, and `clearSession` utilities.
  - `login`, `register`, `logout`, `isAdmin`, `isAuthenticated`, and `getCurrentUser` auth utilities.
- **Role-Based Access Control**:
  - `ProtectedRoute` component guarding authenticated routes; redirects unauthenticated users to `/login`.
  - Admin-only route protection; redirects non-admin users to `/blogs`.
  - Admin role grants access to Admin Dashboard (`/admin`) and User Management (`/admin/users`).
- **Blog CRUD**:
  - Blog list page at `/blogs` displaying all posts sorted newest-first in a responsive grid.
  - Blog reader page at `/blog/:id` showing full post content, author info, and formatted date.
  - Blog writer/editor page at `/write` (create) and `/write/:id` (edit) with title (max 100 chars) and content (max 2000 chars) fields.
  - Ownership enforcement: users can only edit their own posts; admins can edit all posts.
  - Delete functionality with confirmation dialog on both the read page and admin dashboard.
- **Admin Dashboard**:
  - Stat cards displaying Total Posts, Total Users, Admin Users, and Regular Users.
  - Quick-action buttons for writing a new post and managing users.
  - Recent posts section showing up to 5 latest posts with edit and delete controls.
- **User Management**:
  - Admin-only page at `/admin/users` for creating and managing platform users.
  - Create user form with display name, username, password, and role fields with validation.
  - User list with role badges, join dates, and delete buttons.
  - Delete protection for the hard-coded admin account and self-deletion prevention.
- **localStorage Persistence**:
  - `storage.js` utility module for posts, users, and session data with safe read/write/remove operations.
  - Automatic default admin user seeding on first access via `ensureAdminUser`.
  - Graceful error handling for `localStorage` access failures (e.g., `QuotaExceededError`).
- **Avatar System**:
  - Role-distinct avatars: crown emoji (👑) with violet background for admins, book emoji (📖) with indigo background for users.
  - Three size variants (`sm`, `md`, `lg`) via the `Avatar` component and `getAvatar` factory function.
- **Responsive Tailwind UI**:
  - Custom color palette with `primary`, `secondary`, and `accent` color scales.
  - Custom font families (`Inter`, `Merriweather`, `Fira Code`).
  - Mobile-first responsive design with hamburger navigation menus on both public and authenticated navbars.
  - `PublicNavbar` for unauthenticated pages and `Navbar` for authenticated pages with role-aware navigation links.
  - `BlogCard` component with truncated excerpts, author avatars, formatted dates, and conditional edit icons.
  - `StatCard` component for admin dashboard statistics.
  - `UserRow` component for user management list items.
  - Confirmation dialogs for destructive actions (post and user deletion).
- **Vercel SPA Deployment**:
  - `vercel.json` configured with SPA rewrites for client-side routing support.
- **Testing**:
  - Unit tests for `storage.js` covering posts, users, session CRUD, and `localStorage` error handling.
  - Unit tests for `auth.js` covering login, register, logout, role checks, and integration flows.
  - Component tests for `ProtectedRoute` covering unauthenticated, authenticated, and admin access scenarios.
  - Component tests for `BlogCard` covering rendering, avatars, links, edit icon visibility, and edge cases.
  - Test setup with Vitest, jsdom, and `@testing-library/react`.