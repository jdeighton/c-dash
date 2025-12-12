# AGENTS.md

## Build Commands
- `npm start` - Run production mode
- `npm run dev` - Development with DevTools
- `npm run build` - Build for current platform
- `npm run build:win` - Windows build
- `npm run build:mac` - macOS build  
- `npm run build:linux` - Linux build
- `npm run build:all` - All platforms

## Code Style Guidelines

### JavaScript
- Use CommonJS require() for Node.js modules (main.js, preload.js)
- Use const/let, avoid var
- Async/await preferred over callbacks
- Error handling with try/catch blocks

### Electron Security
- nodeIntegration: false, contextIsolation: true
- Use contextBridge.exposeInMainWorld() for IPC
- Never expose entire ipcRenderer to renderer

### File Structure
- main.js - Electron main process
- preload.js - Secure IPC bridge
- index.html - UI (works in browser and Electron)
- Keep core functionality in index.html for browser compatibility

### CSV Data
- Expected columns: TradeDate, Account, TotalVol, Platform, Client
- Use DuckDB WASM for data processing
- Chart.js for visualizations, Luxon for dates

### Naming
- camelCase for variables and functions
- kebab-case for file names
- Descriptive function names

### No Testing Framework
- Manual testing via npm run dev
- Use browser DevTools for debugging