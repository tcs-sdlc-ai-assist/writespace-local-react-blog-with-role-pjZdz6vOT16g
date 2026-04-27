# Deployment Guide

This document provides detailed instructions for deploying WriteSpace to [Vercel](https://vercel.com/) and other static hosting platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Deploying to Vercel](#deploying-to-vercel)
  - [Step 1: Push to a Git Repository](#step-1-push-to-a-git-repository)
  - [Step 2: Import Project in Vercel](#step-2-import-project-in-vercel)
  - [Step 3: Configure Build Settings](#step-3-configure-build-settings)
  - [Step 4: Deploy](#step-4-deploy)
- [Vercel SPA Rewrite Configuration](#vercel-spa-rewrite-configuration)
- [Environment Variables](#environment-variables)
- [CI/CD with Vercel Auto-Deploy](#cicd-with-vercel-auto-deploy)
  - [Production Deployments](#production-deployments)
  - [Preview Deployments](#preview-deployments)
- [Deploying to Other Platforms](#deploying-to-other-platforms)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
  - [Cloudflare Pages](#cloudflare-pages)
- [Troubleshooting](#troubleshooting)
  - [SPA Routing Issues](#spa-routing-issues)
  - [Blank Page After Deployment](#blank-page-after-deployment)
  - [Build Failures](#build-failures)
  - [Assets Not Loading](#assets-not-loading)

---

## Prerequisites

Before deploying, ensure you have:

- A [Vercel account](https://vercel.com/signup) (free tier is sufficient)
- Your WriteSpace project pushed to a Git repository on **GitHub**, **GitLab**, or **Bitbucket**
- Node.js v18+ and npm v9+ installed locally (for building and testing before deployment)

Verify your project builds successfully before deploying:

```bash
npm install
npm run build
```

The production build output will be in the `dist/` directory.

---

## Deploying to Vercel

### Step 1: Push to a Git Repository

Ensure your WriteSpace project is pushed to a remote Git repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Import Project in Vercel

1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **"Add New…"** → **"Project"**.
3. Select your Git provider (GitHub, GitLab, or Bitbucket) and authorize Vercel if prompted.
4. Find and select your WriteSpace repository from the list.
5. Click **"Import"**.

### Step 3: Configure Build Settings

Vercel will auto-detect the Vite framework and pre-fill the build settings. Verify the following:

| Setting              | Value            |
| -------------------- | ---------------- |
| **Framework Preset** | Vite             |
| **Build Command**    | `npm run build`  |
| **Output Directory** | `dist`           |
| **Install Command**  | `npm install`    |
| **Node.js Version**  | 18.x or higher   |

No changes should be necessary — Vercel's auto-detection handles Vite projects correctly.

### Step 4: Deploy

1. Click **"Deploy"**.
2. Vercel will install dependencies, run the build command, and deploy the `dist/` output.
3. Once complete, you will receive a production URL (e.g., `https://your-project.vercel.app`).
4. Visit the URL to verify your deployment is working correctly.

---

## Vercel SPA Rewrite Configuration

WriteSpace is a single-page application (SPA) that uses client-side routing via React Router v6. All routes (e.g., `/blogs`, `/admin`, `/blog/:id`) must be served by `index.html` so that React Router can handle them in the browser.

The project includes a `vercel.json` file at the root that configures this rewrite rule:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**How it works:**

- Any request to the Vercel server (e.g., `/blogs`, `/admin/users`, `/blog/abc123`) is rewritten to serve `index.html`.
- Once `index.html` loads, React Router reads the browser URL and renders the correct page component.
- Static assets (JS, CSS, images in the `dist/assets/` directory) are served directly by Vercel before the rewrite rule applies.

> **Important:** Do not remove or modify `vercel.json` unless you understand the implications for client-side routing. Without this rewrite, refreshing or directly navigating to any route other than `/` will result in a 404 error.

---

## Environment Variables

WriteSpace does **not** require any environment variables. The application runs entirely in the browser using `localStorage` for data persistence. There is no backend, no API keys, and no database connection strings to configure.

- No `.env` file is needed for deployment.
- No environment variables need to be set in the Vercel dashboard.
- The `VITE_*` environment variable prefix is reserved for Vite projects, but WriteSpace does not use any.

If you extend WriteSpace in the future to include external API calls, you would add environment variables in the Vercel dashboard under **Project Settings** → **Environment Variables** and access them in your code via `import.meta.env.VITE_YOUR_VARIABLE`.

---

## CI/CD with Vercel Auto-Deploy

Once your repository is connected to Vercel, continuous deployment is enabled automatically. No additional CI/CD configuration is required.

### Production Deployments

- Every push to the **main** branch (or your configured production branch) triggers an automatic production deployment.
- Vercel runs `npm install` and `npm run build`, then deploys the `dist/` output to your production URL.
- Production deployments are assigned to your primary domain (e.g., `https://your-project.vercel.app`).

### Preview Deployments

- Every push to a **non-production branch** (e.g., feature branches) triggers a preview deployment.
- Every **pull request** automatically receives a unique preview URL (e.g., `https://your-project-abc123.vercel.app`).
- Preview deployments are useful for reviewing changes before merging to production.
- Preview URLs are shared automatically as comments on pull requests (GitHub integration).

### Deployment Workflow

```
Developer pushes code
        │
        ▼
Vercel detects push via Git webhook
        │
        ▼
Vercel runs: npm install
        │
        ▼
Vercel runs: npm run build
        │
        ▼
Vercel deploys dist/ directory
        │
        ▼
Live URL available (production or preview)
```

### Skipping Deployments

To skip a deployment for a specific commit, include `[skip ci]` or `[vercel skip]` in your commit message:

```bash
git commit -m "Update README [skip ci]"
```

---

## Deploying to Other Platforms

WriteSpace can be deployed to any static hosting platform. The key requirement is configuring a rewrite rule so that all paths serve `index.html`.

### Netlify

1. Run `npm run build` or connect your repository for auto-deploy.
2. Set the publish directory to `dist`.
3. Add a `_redirects` file in the `public/` directory:

```
/*    /index.html   200
```

Or add a `netlify.toml` at the project root:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages

1. Run `npm run build`.
2. Deploy the `dist/` directory using the `gh-pages` package or GitHub Actions.
3. Add a `404.html` file in `public/` that is a copy of `index.html` (GitHub Pages serves `404.html` for unknown routes, which allows React Router to handle them).

> **Note:** GitHub Pages requires a base path if your repo is not deployed at the root domain. Update `vite.config.js` with `base: '/<repo-name>/'`.

### Cloudflare Pages

1. Connect your repository in the Cloudflare Pages dashboard.
2. Set the build command to `npm run build` and the output directory to `dist`.
3. Cloudflare Pages handles SPA routing automatically — no additional configuration is needed.

---

## Troubleshooting

### SPA Routing Issues

**Symptom:** Navigating directly to a route like `/blogs` or `/admin` returns a 404 error, but the app works fine when navigating from the home page.

**Cause:** The hosting platform is trying to find a file at `/blogs/index.html` instead of serving the SPA's `index.html`.

**Solution:**

1. Verify that `vercel.json` exists at the project root with the correct rewrite rule:

   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

2. If deploying to a platform other than Vercel, ensure you have configured the equivalent rewrite/redirect rule (see [Deploying to Other Platforms](#deploying-to-other-platforms)).

3. Redeploy after adding or modifying the configuration file.

### Blank Page After Deployment

**Symptom:** The deployed site shows a blank white page with no content.

**Possible causes and solutions:**

1. **Build errors:** Check the Vercel deployment logs for build errors. Run `npm run build` locally to reproduce.
2. **Missing `dist/` output:** Ensure the build command produces output in the `dist/` directory.
3. **Incorrect output directory:** Verify that the Vercel output directory setting is `dist` (not `build` or `out`).
4. **JavaScript errors:** Open the browser developer console (F12) and check for runtime errors.
5. **Base path mismatch:** If deploying to a subdirectory, ensure `vite.config.js` includes the correct `base` option.

### Build Failures

**Symptom:** The Vercel deployment fails during the build step.

**Possible causes and solutions:**

1. **Node.js version mismatch:** Ensure Vercel is using Node.js v18 or higher. Set this in **Project Settings** → **General** → **Node.js Version**.
2. **Missing dependencies:** Run `npm install` locally and verify `package.json` includes all required dependencies. Commit `package-lock.json` to your repository.
3. **Syntax errors:** Run `npm run build` locally to identify and fix any syntax or compilation errors.
4. **Test failures:** The default build command does not run tests. If you have configured a custom build command that includes `npm run test`, ensure all tests pass.

### Assets Not Loading

**Symptom:** The page loads but styles are missing, or JavaScript files return 404 errors.

**Possible causes and solutions:**

1. **Incorrect base path:** If deploying to a subdirectory, add `base: '/<subdirectory>/'` to `vite.config.js`.
2. **Cache issues:** Try a hard refresh (Ctrl+Shift+R) or clear your browser cache.
3. **CDN propagation:** After a new deployment, it may take a few minutes for CDN caches to update. Wait and try again.

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router v6 Documentation](https://reactrouter.com/en/main)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)