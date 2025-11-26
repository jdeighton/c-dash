# CSV Dashboard - Electron App

A desktop application for visualizing CSV data with interactive charts and tables, built with Electron and DuckDB.

## Features

- **Desktop Application**: Standalone app for Windows, Mac, and Linux
- **File Menu Integration**: Open CSV files via File menu (Ctrl/Cmd+O)
- **Interactive Charts**: Daily/monthly volume charts and client count visualizations
- **Client Analytics**: Search and filter clients, view individual client volume
- **In-Memory Database**: Fast queries using DuckDB WASM
- **Dual Mode**: Works both as Electron app and browser-based HTML

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

### Setup

1. Clone or download this repository

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the Application

### Development Mode (with DevTools)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Using the Application

### Opening CSV Files

There are multiple ways to load a CSV file:

1. **File Menu**: Click `File > Open CSV File...` (or press `Ctrl/Cmd+O`)
2. **Click to Browse**: Click on the drop zone to open a file picker
3. **Drag & Drop**: Drag a CSV file into the drop zone (Electron and browser)
4. **Load New File Button**: After loading a file, use the button in the header

### Views

- **Overview**: Dashboard with key statistics and total daily volume chart
- **Client List**: Searchable table of all clients (click to see client details)
- **Daily Volume**: Bar chart of total volume by day
- **Daily Client Count**: Bar chart of unique clients per day
- **Monthly Volume**: Bar chart and table of volume by month

## File Structure

```
c-dash/
├── .github/
│   └── workflows/
│       └── release.yml     # GitHub Actions workflow for automated releases
├── index.html              # Main UI (works in browser and Electron)
├── main.js                 # Electron main process
├── preload.js              # Electron preload script (secure IPC bridge)
├── package.json            # Dependencies and build configuration
├── .gitignore              # Ignores node_modules and build artifacts
├── README.md               # This file
├── BUILD.md                # Detailed build and distribution guide
├── RELEASES.md             # GitHub release creation guide
└── CODE_SIGNING.md         # Code signing setup for production releases
```

## CSV Format

The application expects CSV files with at least these columns:
- `TradeDate`: Date of the trade
- `Account`: Client account identifier
- `TotalVol`: Total volume (numeric)
- `Platform`: Trading platform
- `Client`: Client name

## Browser Mode

The application also works in browsers without Electron:

1. Open `index.html` directly in a modern browser (Chrome, Edge, Firefox)
2. Use drag-and-drop or file input to load CSV files
3. File menu features are disabled in browser mode

## Building for Distribution

To share this app with users who don't have Node.js installed, build it into a standalone executable:

```bash
# Install dependencies first
npm install

# Build for your current platform
npm run build

# Or build for specific platforms
npm run build:win    # Windows installer + portable .exe
npm run build:mac    # macOS .dmg and .zip
npm run build:linux  # Linux AppImage and .deb
npm run build:all    # All platforms (macOS builds require a Mac)
```

**Output**: Built applications will be in the `dist/` folder (~100-150 MB each)

**To share**:
- **Option 1**: Send installers directly to users
- **Option 2**: Publish to GitHub Releases (recommended - see [RELEASES.md](RELEASES.md))

**Distribution files**:
- **Windows**: `CSV Dashboard Setup X.X.X.exe` - double-click to install
- **macOS**: `CSV Dashboard-X.X.X.dmg` - drag to Applications
- **Linux**: `CSV Dashboard-X.X.X.AppImage` - make executable and run

**Documentation**:
- [BUILD.md](BUILD.md) - Detailed build instructions, code signing, icons, and troubleshooting
- [RELEASES.md](RELEASES.md) - Publishing releases on GitHub (manual and automated)

## Keyboard Shortcuts

- `Ctrl/Cmd+O`: Open file
- `Ctrl/Cmd+Q`: Quit application
- `Ctrl/Cmd+R`: Reload
- `F12`: Toggle Developer Tools

## Technology Stack

- **Electron**: Desktop application framework
- **DuckDB WASM**: In-memory analytical database
- **Chart.js**: Interactive charts
- **Luxon**: Date/time handling
- **Vanilla JavaScript**: No heavy frameworks

## Troubleshooting

### DuckDB initialization fails
- Ensure you have internet connection (CDN dependencies)
- Check browser/Electron console for specific errors

### CSV file won't load
- Verify CSV format matches expected columns
- Check for null/missing TradeDate values (automatically filtered)
- Look for parsing errors in console

### Charts not displaying
- Ensure Chart.js and Luxon CDN scripts are loading
- Check for JavaScript errors in DevTools console

## License

MIT
