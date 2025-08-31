# Orbis Browser

Orbis Browser is a lightweight, modern multi-tab web browser built with [Electron](https://www.electronjs.org/).
It features tab management, bookmarks, browsing history, and auto-update support via GitHub Releases.

## ✨ Features

- 🔖 **Bookmarks** — save, view, and delete favorite sites
- 🕘 **History** — tracks recently visited pages
- 📑 **Multi-tab** browsing — open and manage multiple tabs
- 🎨 **Dark theme** UI with modern styling
- ⚡ **Auto-updates** — Orbis checks for updates at startup
- 📦 **Installer** — packaged as a Windows `.exe` installer with custom icon

---

## 🖥️ Installation

1. Download the latest **Orbis Browser Setup.exe** from [Releases](https://github.com/cephas2bn/orbis-browser/releases).
2. Run the installer — Orbis will appear in the **Start Menu** and as a **Desktop shortcut**.

---

## 🛠️ Development Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)
- Git

### Clone & Install

```bash
git clone https://github.com/cephas2bn/orbis-browser.git
cd orbis-browser
npm install
```

### Run in Development

```bash
npm start
```

### Build Installer

```bash
npm run dist
```

The installer will be generated in the `dist/` folder.

---

## ⚙️ Project Structure

```
orbis-browser/
├─ assets/              # App icons
├─ dist/                # Output builds (ignored in git)
├─ main.js              # Electron main process
├─ preload.js           # Secure bridge between UI and main
├─ index.html           # Browser UI
├─ storage.js           # Persistent bookmarks/history
├─ package.json         # App metadata & build config
└─ README.md            # Documentation
```

---

## 🚀 Auto-Updates

* Orbis uses [electron-updater](https://www.electron.build/auto-update) with  **GitHub Releases** .
* When a new release is published, Orbis will automatically download and prompt the user to restart.

---

## 📜 License

MIT License © 2025 Cephas Acquah Foson

