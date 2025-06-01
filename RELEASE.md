# 🚀 Release & Deployment Guide

This guide explains how to release new versions of React Rooks and deploy the demo to GitHub Pages.

## 📦 Publishing a New Release

### Prerequisites

1. **NPM Token**: Add your NPM token as a repository secret named `NPM_TOKEN`

   - Go to GitHub repo → Settings → Secrets and variables → Actions
   - Add secret: `NPM_TOKEN` = your npm token

2. **GitHub Pages**: Enable GitHub Pages in repository settings
   - Go to Settings → Pages → Source: GitHub Actions

### Release Process

1. **Update version in package.json**:

   ```bash
   # Update the version field in package.json
   vim package.json
   ```

2. **Test the build locally**:

   ```bash
   bun run release:check
   ```

3. **Commit your changes**:

   ```bash
   git add .
   git commit -m "feat: release v2.1.0"
   git push origin main
   ```

4. **Create and push release tag**:

   ```bash
   bun run release:tag
   # This will prompt for version (e.g., 2.1.0) and create tag v2.1.0
   ```

5. **Monitor the release**:
   - Check the [Actions tab](https://github.com/NastuzziSamy/react-rooks/actions) for workflow progress
   - The workflow will:
     - ✅ Run tests and build the library
     - 📦 Publish to npm
     - 🎉 Create GitHub release with auto-generated notes

### Manual Release (Alternative)

If you prefer manual control:

```bash
# 1. Update version
npm version patch  # or minor, major

# 2. Build and test
bun run build

# 3. Push tag
git push origin main --tags

# The GitHub Action will automatically trigger on the new tag
```

## 🎮 Demo Deployment

The demo is automatically deployed to GitHub Pages when:

- **Automatic**: Any push to `main` branch that modifies:

  - `demo/**` files
  - `src/**` files (library source)
  - The deployment workflow itself

- **Manual**: You can trigger deployment anytime:
  1. Go to [Actions tab](https://github.com/NastuzziSamy/react-rooks/actions)
  2. Select "Deploy Demo to GitHub Pages"
  3. Click "Run workflow"

### Demo URL

Once deployed, the demo will be available at:
**https://nastuzzisamy.github.io/react-rooks/**

## 🔧 Workflow Details

### Release Workflow (`.github/workflows/release.yml`)

Triggered by: Version tags (`v*.*.*`)

**Jobs:**

1. **Test**: Builds library and validates artifacts
2. **Publish NPM**: Publishes to npm registry with provenance
3. **GitHub Release**: Creates release with auto-generated notes

### Demo Deployment (`.github/workflows/deploy-demo.yml`)

Triggered by:

- Push to `main` (when demo/src files change)
- Manual workflow dispatch

**Jobs:**

1. **Build Demo**:
   - Builds the library
   - Links local build to demo
   - Builds demo with GitHub Pages base path
   - Uploads artifacts
2. **Deploy**: Deploys to GitHub Pages

## 🛠️ Troubleshooting

### Release Issues

**NPM Publish Fails:**

- Check `NPM_TOKEN` secret is set correctly
- Ensure version in `package.json` is bumped
- Verify npm registry access

**GitHub Release Fails:**

- Check repository permissions
- Ensure tag format matches `v*.*.*`

### Demo Deployment Issues

**Build Fails:**

- Check demo dependencies in `demo/package.json`
- Verify Vite configuration
- Check for TypeScript errors

**Deployment Fails:**

- Ensure GitHub Pages is enabled
- Check workflow permissions
- Verify artifact upload

**Demo Not Loading:**

- Check base path configuration (`/react-rooks/`)
- Verify asset paths in built demo
- Check browser console for errors

## 📋 Release Checklist

Before releasing:

- [ ] Update version in `package.json`
- [ ] Test build locally: `bun run build`
- [ ] Test demo locally: `cd demo && bun run build`
- [ ] Update CHANGELOG.md (if you have one)
- [ ] Commit all changes
- [ ] Create and push version tag
- [ ] Monitor GitHub Actions
- [ ] Verify npm package published
- [ ] Test demo deployment
- [ ] Update documentation if needed

## 🎯 Quick Commands

```bash
# Check if ready for release
bun run release:check

# Create and push release tag (interactive)
bun run release:tag

# Run demo locally
bun run demo

# Build demo
bun run demo:build

# Manual tag creation
git tag v1.2.3 && git push origin v1.2.3
```

---

**🎉 Happy releasing! The automation will handle the heavy lifting.** 🚀
