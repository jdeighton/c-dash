# Building CSV Dashboard for Distribution

This guide explains how to build standalone executables that can be shared with users who don't have Node.js installed.

## Prerequisites

1. **Node.js and npm** (on your development machine)
2. **Install dependencies**:
   ```bash
   npm install
   ```

## Quick Start

Build for your current platform:
```bash
npm run build
```

The built application will be in the `dist/` folder.

## Platform-Specific Builds

### Windows

Build Windows installer and portable executable:
```bash
npm run build:win
```

**Output files** (in `dist/`):
- `CSV Dashboard Setup X.X.X.exe` - Installer (recommended for sharing)
- `CSV Dashboard X.X.X.exe` - Portable version (no installation needed)

**Requirements**: Can be built on Windows, Mac, or Linux

### macOS

Build macOS application:
```bash
npm run build:mac
```

**Output files** (in `dist/`):
- `CSV Dashboard-X.X.X.dmg` - Disk image (drag to Applications)
- `CSV Dashboard-X.X.X-mac.zip` - Zipped app bundle

**Requirements**: Must be built on macOS (due to code signing requirements)

### Linux

Build Linux packages:
```bash
npm run build:linux
```

**Output files** (in `dist/`):
- `CSV Dashboard-X.X.X.AppImage` - Universal Linux app (no installation)
- `csv-dashboard_X.X.X_amd64.deb` - Debian/Ubuntu package

**Requirements**: Can be built on Linux, Windows, or Mac

### Build for All Platforms

```bash
npm run build:all
```

**Note**: This attempts to build for Windows, Mac, and Linux. macOS builds require macOS.

## Distribution

### What to Share

**Windows users**: Share the `CSV Dashboard Setup X.X.X.exe` installer
- Users double-click to install
- Creates desktop shortcut and start menu entry
- No Node.js or other dependencies required

**Mac users**: Share the `CSV Dashboard-X.X.X.dmg` file
- Users open DMG and drag app to Applications folder
- Completely self-contained

**Linux users**: Share the `.AppImage` file
- Users make it executable: `chmod +x CSV-Dashboard-X.X.X.AppImage`
- Run directly, no installation needed
- Or share the `.deb` for Ubuntu/Debian users

### File Sizes

Expect built applications to be **~100-150 MB** because they include:
- Electron runtime
- Chromium browser engine
- Node.js runtime
- Your application code

## Adding an Icon (Optional)

To add a custom application icon:

1. Create a `build/` folder in your project
2. Add icon files:
   - **Windows**: `build/icon.ico` (256x256 or multi-size ICO)
   - **macOS**: `build/icon.icns` (1024x1024 ICNS format)
   - **Linux**: `build/icon.png` (512x512 PNG)

3. Rebuild:
   ```bash
   npm run build
   ```

**Icon tools**:
- [iConvert Icons](https://iconverticons.com/) - Convert PNG to ICO/ICNS
- [CloudConvert](https://cloudconvert.com/) - Online icon converter

## Build Configuration

The build settings are in `package.json` under the `"build"` key. Key settings:

- **`appId`**: Unique identifier (com.yourname.appname)
- **`productName`**: Display name in installer/application
- **`files`**: Which files to include in the build
- **`directories.output`**: Where to put built files (default: `dist/`)

## Troubleshooting

### Build fails with "cannot find module"

Make sure all dependencies are installed:
```bash
rm -rf node_modules
npm install
```

### macOS: "App is damaged and can't be opened"

This happens when building macOS apps on non-Mac machines. Solutions:
1. Build on a real Mac
2. Or have users run: `xattr -cr /Applications/CSV\ Dashboard.app`

### Linux: AppImage won't run

Make it executable first:
```bash
chmod +x CSV-Dashboard-*.AppImage
```

### Windows: Antivirus blocks the installer

This is common with unsigned executables. Solutions:
1. Users: Add exception to antivirus
2. Developer: Purchase code signing certificate ($200-400/year)

## Code Signing (Advanced)

For production distribution, you should sign your applications:

- **Windows**: Purchase code signing certificate, configure in `package.json`
- **macOS**: Apple Developer account ($99/year), configure signing identity
- **Linux**: Not typically required

Without signing:
- Windows: SmartScreen warning on first run
- macOS: "Unidentified developer" warning (users can bypass)
- Linux: No issues

## Publishing to GitHub Releases

After building your app, you'll want to publish it so users can download pre-built binaries.

**See [RELEASES.md](RELEASES.md)** for complete instructions on:
- Creating manual releases on GitHub
- Using GitHub CLI for quick releases
- Automated releases with GitHub Actions (already configured!)
- Release best practices and troubleshooting

**Quick start for automated releases**:
1. Update version in `package.json`
2. Commit and create a tag: `git tag v1.0.0 && git push origin v1.0.0`
3. GitHub Actions automatically builds and publishes the release

## Further Reading

- [electron-builder documentation](https://www.electron.build/)
- [Electron app distribution guide](https://www.electronjs.org/docs/latest/tutorial/application-distribution)
- [Code signing guide](https://www.electron.build/code-signing)
- [GitHub Releases documentation](https://docs.github.com/en/repositories/releasing-projects-on-github)
