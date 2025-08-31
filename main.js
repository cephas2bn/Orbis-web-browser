const { app, BrowserWindow, BrowserView, ipcMain } = require("electron");
const path = require("path");
const store = require("./storage");

let mainWindow;
const tabs = new Map();     // id -> BrowserView
let activeTabId = null;

// heights reported by the renderer (toolbar + tabbar at top, statusbar bottom)
let chromeTop = 0;
let chromeBottom = 0;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    mainWindow.loadFile("index.html");

    // keep BrowserView sized on all window changes
    ["resize", "maximize", "unmaximize", "enter-full-screen", "leave-full-screen"].forEach(ev =>
        mainWindow.on(ev, resizeActiveView)
    );
}

// ----- TAB MANAGEMENT -----
function createTab(url = "https://google.com") {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const view = new BrowserView({
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    // Optional: match app bg while page loads
    try { view.setBackgroundColor("#0b1020"); } catch { }

    tabs.set(id, view);
    setActiveTab(id);
    view.webContents.loadURL(url);

    // Save history on navigation/title changes (simple)
    view.webContents.on("did-navigate", (_e, u) => {
        store.addHistory(u, view.webContents.getTitle());
    });
    view.webContents.on("page-title-updated", (_e, t) => {
        store.addHistory(view.webContents.getURL(), t);
    });

    return id; // important: return id to the renderer
}

function setActiveTab(id) {
    if (activeTabId && tabs.has(activeTabId)) {
        const oldView = tabs.get(activeTabId);
        if (oldView) mainWindow.removeBrowserView(oldView);
    }
    const newView = tabs.get(id);
    if (!newView) return;
    activeTabId = id;
    mainWindow.addBrowserView(newView);
    resizeActiveView();
}

function closeTab(id) {
    const view = tabs.get(id);
    if (!view) return;
    mainWindow.removeBrowserView(view);
    view.destroy();
    tabs.delete(id);
    if (activeTabId === id) {
        const nextId = tabs.keys().next().value || null;
        if (nextId) setActiveTab(nextId);
        else activeTabId = null;
    }
}

function contentBounds() {
    const { width, height } = mainWindow.getContentBounds(); // ✅ use content size
    const x = 0;
    const y = Math.max(0, chromeTop);
    const w = Math.max(1, width);
    const h = Math.max(1, height - chromeTop - chromeBottom);
    return { x, y, width: w, height: h };
}

function resizeActiveView() {
    if (!activeTabId) return;
    const view = tabs.get(activeTabId);
    if (!view) return;
    const b = contentBounds();
    view.setBounds(b);
    view.setAutoResize({ width: true, height: true });
}

// ----- IPC (tabs & navigation) -----
ipcMain.handle("orbis:newTab", (_e, url) => createTab(url));
ipcMain.handle("orbis:activateTab", (_e, id) => setActiveTab(id));
ipcMain.handle("orbis:closeTab", (_e, id) => closeTab(id));

ipcMain.handle("orbis:navigate", (_e, url) => {
    const view = tabs.get(activeTabId);
    if (view && url) view.webContents.loadURL(url);
});
ipcMain.handle("orbis:back", () => {
    const view = tabs.get(activeTabId);
    if (view && view.webContents.canGoBack()) view.webContents.goBack();
});
ipcMain.handle("orbis:forward", () => {
    const view = tabs.get(activeTabId);
    if (view && view.webContents.canGoForward()) view.webContents.goForward();
});
ipcMain.handle("orbis:reload", () => {
    const view = tabs.get(activeTabId);
    if (view) view.webContents.reload();
});

// ----- IPC (bookmarks & history) -----
ipcMain.handle("orbis:addBookmark", (_e, { name, url }) => store.addBookmark(name, url));
ipcMain.handle("orbis:getBookmarks", () => store.getBookmarks());
ipcMain.handle("orbis:addHistory", (_e, { url, title }) => store.addHistory(url, title));
ipcMain.handle("orbis:getHistory", () => store.getHistory());

// ----- IPC (chrome heights from renderer) -----
ipcMain.handle("orbis:setChromeHeights", (_e, { top, bottom }) => {
    chromeTop = Math.max(0, Math.floor(top || 0));
    chromeBottom = Math.max(0, Math.floor(bottom || 0));
    resizeActiveView();
});

// APP LIFECYCLE
ipcMain.on("orbis:restart", () => {
    autoUpdater.quitAndInstall();
});


app.whenReady().then(() => {
    createWindow();
    // IMPORTANT: let the renderer create the first tab so it gets the id back
    // If you prefer to create it here, also send the id to the renderer.
});
