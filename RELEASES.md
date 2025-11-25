# Creating GitHub Releases

This guide shows you how to create GitHub releases with downloadable pre-built binaries for your Electron app.

## Method 1: Manual Release (Recommended for First Release)

### Step 1: Build the Applications

Build for all platforms you want to distribute:

```bash
# Install dependencies if you haven't
npm install

# Build for Windows
npm run build:win

# Build for macOS (requires Mac)
npm run build:mac

# Build for Linux
npm run build:linux

# Or build all at once (if on appropriate platform)
npm run build:all
```

Your built files will be in the `dist/` folder.

### Step 2: Create a Git Tag

```bash
# Create and push a version tag
git tag v1.0.0
git push origin v1.0.0
```

### Step 3: Create Release on GitHub (Web Interface)

1. Go to your repository on GitHub
2. Click on **"Releases"** in the right sidebar
3. Click **"Create a new release"** or **"Draft a new release"**
4. Select your tag (v1.0.0) or create it
5. Fill in release details:
   - **Release title**: `CSV Dashboard v1.0.0`
   - **Description**: Add release notes (what's new, bug fixes, etc.)
6. **Attach binaries**: Drag and drop these files from `dist/`:
   - `CSV Dashboard Setup 1.0.0.exe` (Windows installer)
   - `CSV Dashboard 1.0.0.exe` (Windows portable)
   - `CSV Dashboard-1.0.0.dmg` (macOS)
   - `CSV Dashboard-1.0.0.AppImage` (Linux)
   - `csv-dashboard_1.0.0_amd64.deb` (Linux Debian/Ubuntu)
7. Click **"Publish release"**

### Step 4: Users Download

Users can now go to your GitHub releases page and download the appropriate installer for their platform.

---

## Method 2: Using GitHub CLI (gh)

Faster method using the command line:

```bash
# Make sure you have GitHub CLI installed
# https://cli.github.com/

# Build your apps first
npm run build

# Create a release and upload all files from dist/
gh release create v1.0.0 \
  --title "CSV Dashboard v1.0.0" \
  --notes "First release of CSV Dashboard

Features:
- Interactive CSV data visualization
- Daily and monthly volume charts
- Client search and filtering
- Built with Electron and DuckDB

Download the installer for your platform below." \
  dist/*.exe \
  dist/*.dmg \
  dist/*.AppImage \
  dist/*.deb
```

**Note**: This uploads ALL matching files from dist/. Be selective if needed.

---

## Method 3: Automated Releases (GitHub Actions)

The best approach for ongoing releases - automatically builds and publishes when you push a tag.

### Setup (One-time)

A GitHub Actions workflow file has been created at `.github/workflows/release.yml`.

### How to Use

1. **Update version** in `package.json`:
   ```json
   {
     "version": "1.0.1"
   }
   ```

2. **Commit and create tag**:
   ```bash
   git add package.json
   git commit -m "Bump version to 1.0.1"
   git push

   git tag v1.0.1
   git push origin v1.0.1
   ```

3. **GitHub Actions automatically**:
   - Builds for Windows, Mac, and Linux
   - Creates a GitHub release
   - Uploads all installers/packages
   - Users can download immediately

4. **Monitor progress**:
   - Go to **Actions** tab on GitHub
   - Watch the build progress
   - Release appears when complete

### Workflow Features

- ✅ Builds on Windows, macOS, and Linux runners
- ✅ Automatically triggered by version tags (v*.*.*)
- ✅ Creates draft release (you can review before publishing)
- ✅ Uploads all build artifacts
- ✅ Generates release notes from commits

---

## Release Checklist

Before creating a release:

- [ ] Test the app thoroughly on all platforms
- [ ] Update version number in `package.json`
- [ ] Update CHANGELOG or release notes
- [ ] Commit all changes
- [ ] Create and push git tag
- [ ] Build or let GitHub Actions build
- [ ] Upload binaries (manual) or verify GH Actions succeeded
- [ ] Publish the release
- [ ] Test downloads work correctly
- [ ] Announce the release

---

## Version Numbering

Use semantic versioning (semver):
- **v1.0.0** - Major release (breaking changes)
- **v1.1.0** - Minor release (new features)
- **v1.0.1** - Patch release (bug fixes)

---

## Release Notes Template

```markdown
## What's New

- ✨ Feature: Added support for larger CSV files
- 🐛 Fix: Resolved chart rendering issue on Windows
- 📈 Improvement: Faster data loading

## Download

Choose the installer for your platform:

- **Windows**: `CSV Dashboard Setup 1.0.0.exe`
- **macOS**: `CSV Dashboard-1.0.0.dmg`
- **Linux**: `CSV Dashboard-1.0.0.AppImage`

## Requirements

- Windows 10/11, macOS 10.13+, or Linux
- No additional software needed

## Installation

**Windows**: Run the installer and follow prompts
**macOS**: Open DMG and drag to Applications
**Linux**: Make executable (`chmod +x`) and run

## Full Changelog

See all changes: [v1.0.0...v1.1.0](https://github.com/USER/REPO/compare/v1.0.0...v1.1.0)
```

---

## Troubleshooting

### "Release already exists"
Delete the existing release or tag, or use a new version number.

### Build artifacts missing
Check the build logs in GitHub Actions. Ensure builds succeeded on all platforms.

### macOS build fails in GitHub Actions
macOS builds require specific runners. The workflow uses `macos-latest`.

### File too large for GitHub releases
GitHub has a 2GB limit per file. Electron apps are typically 100-150MB, well under the limit.

### Users can't download / 404 error
Make sure the release is published (not in draft mode).

---

## Best Practices

1. **Always test locally** before releasing
2. **Use draft releases** to review before publishing
3. **Write clear release notes** explaining what changed
4. **Tag releases** with version numbers (v1.0.0, v1.1.0, etc.)
5. **Keep old releases** available for users who need them
6. **Sign your apps** for production (reduces security warnings)
7. **Automate with GitHub Actions** once you're comfortable with the process

---

## Next Steps

After your first release:
- Add auto-update functionality to the app
- Set up code signing for fewer security warnings
- Create a landing page linking to latest release
- Set up analytics to see download counts
