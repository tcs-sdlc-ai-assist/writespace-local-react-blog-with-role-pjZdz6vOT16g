# WriteSpace

A simple, elegant blogging platform built with React 18+, Vite, and Tailwind CSS. WriteSpace runs entirely in the browser using localStorage for persistence — no backend required.

## Tech Stack

- **React 18+** — UI library
- **Vite 5** — Build tool and dev server
- **Tailwind CSS 3** — Utility-first CSS framework
- **React Router v6** — Client-side routing
- **localStorage** — Browser-based data persistence
- **Vitest** — Unit and component testing
- **PropTypes** — Runtime prop validation

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Build

Create a production build:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Folder Structure

```
writespace-blog/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment configuration
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component with route definitions
│   ├── index.css               # Tailwind CSS imports
│   ├── setupTests.js           # Test setup file
│   ├── components/
│   │   ├── Avatar.jsx          # Role-distinct avatar component
│   │   ├── BlogCard.jsx        # Blog post card for grid display
│   │   ├── BlogCard.test.jsx   # BlogCard component tests
│   │   ├── Navbar.jsx          # Authenticated navigation bar
│   │   ├── ProtectedRoute.jsx  # Route guard for auth and role checks
│   │   ├── ProtectedRoute.test.jsx # ProtectedRoute component tests
│   │   ├── PublicNavbar.jsx     # Public navigation bar
│   │   ├── StatCard.jsx        # Admin dashboard stat card
│   │   └── UserRow.jsx         # User management list item
│   ├── pages/
│   │   ├── AdminDashboard.jsx  # Admin dashboard with stats and recent posts
│   │   ├── Home.jsx            # Blog list page (all posts)
│   │   ├── LandingPage.jsx     # Public landing page with hero and features
│   │   ├── LoginPage.jsx       # Login form
│   │   ├── ReadBlog.jsx        # Full blog post reader
│   │   ├── RegisterPage.jsx    # Registration form
│   │   ├── UserManagement.jsx  # Admin user management page
│   │   └── WriteBlog.jsx       # Blog post create/edit form
│   └── utils/
│       ├── auth.js             # Authentication utilities
│       ├── auth.test.js        # Auth utility tests
│       ├── storage.js          # localStorage CRUD utilities
│       └── storage.test.js     # Storage utility tests
```

## Route Map

| Path            | Component        | Access          | Description                        |
| --------------- | ---------------- | --------------- | ---------------------------------- |
| `/`             | LandingPage      | Public          | Hero section, features, latest posts |
| `/login`        | LoginPage        | Public          | Login form                         |
| `/register`     | RegisterPage     | Public          | Registration form                  |
| `/blogs`        | Home             | Authenticated   | All posts grid, sorted newest first |
| `/write`        | WriteBlog        | Authenticated   | Create a new blog post             |
| `/write/:id`    | WriteBlog        | Authenticated   | Edit an existing blog post         |
| `/blog/:id`     | ReadBlog         | Authenticated   | Read a full blog post              |
| `/admin`        | AdminDashboard   | Admin only      | Platform stats and recent posts    |
| `/admin/users`  | UserManagement   | Admin only      | Create and manage users            |

## Usage Guide

### Default Admin Account

WriteSpace ships with a hard-coded admin account available out of the box:

- **Username:** `admin`
- **Password:** `admin`

The default admin account cannot be deleted.

### Admin Role

Admins have full access to the platform:

- View the **Admin Dashboard** (`/admin`) with platform statistics (total posts, total users, admin users, regular users).
- Access **User Management** (`/admin/users`) to create new users with custom roles and delete existing users.
- Edit and delete **any** blog post on the platform.
- Write new blog posts.

### User Role

Regular users can:

- Browse all blog posts on the **Blogs** page (`/blogs`).
- Read full blog posts on the **Read** page (`/blog/:id`).
- Write new blog posts via the **Write** page (`/write`).
- Edit and delete **their own** blog posts only.

### Registration

New users can register at `/register` with:

- **Display Name** — minimum 2 characters
- **Username** — minimum 3 characters, must be unique
- **Password** — minimum 4 characters

Registered users are assigned the `user` role by default.

## Data Persistence

All data is stored in the browser's `localStorage` under the following keys:

| Key                    | Description                  |
| ---------------------- | ---------------------------- |
| `writespace_posts`     | Array of blog post objects   |
| `writespace_users`     | Array of user objects        |
| `writespace_session`   | Current session object       |

The default admin user is automatically seeded on first access if not already present.

> **Note:** Clearing your browser's localStorage will reset all data. Data is local to each browser and device.

## Deployment

### Vercel

WriteSpace is configured for deployment on [Vercel](https://vercel.com/) as a single-page application.

1. Push your repository to GitHub, GitLab, or Bitbucket.
2. Import the project in the [Vercel Dashboard](https://vercel.com/dashboard).
3. Vercel will auto-detect the Vite framework. Use the default settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy.

The included `vercel.json` handles SPA rewrites so that all routes are served by `index.html`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Other Platforms

For any static hosting platform (Netlify, GitHub Pages, Cloudflare Pages, etc.):

1. Run `npm run build` to generate the `dist/` directory.
2. Deploy the contents of `dist/`.
3. Configure a rewrite/redirect rule so that all paths serve `index.html` (required for client-side routing).

## License

This project is private and proprietary.