const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("orbisAPI", {
    onUpdateAvailable: (cb) => ipcRenderer.on("update_available", cb),
    onUpdateDownloaded: (cb) => ipcRenderer.on("update_downloaded", cb),
    restartApp: () => ipcRenderer.send("orbis:restart")
    // tabs
    newTab: (url) => ipcRenderer.invoke("orbis:newTab", url),
    activateTab: (id) => ipcRenderer.invoke("orbis:activateTab", id),
    closeTab: (id) => ipcRenderer.invoke("orbis:closeTab", id),
    // nav
    navigate: (url) => ipcRenderer.invoke("orbis:navigate", url),
    back: () => ipcRenderer.invoke("orbis:back"),
    forward: () => ipcRenderer.invoke("orbis:forward"),
    reload: () => ipcRenderer.invoke("orbis:reload"),
    // storage
    addBookmark: (name, url) => ipcRenderer.invoke("orbis:addBookmark", { name, url }),
    getBookmarks: () => ipcRenderer.invoke("orbis:getBookmarks"),
    addHistory: (url, title) => ipcRenderer.invoke("orbis:addHistory", { url, title }),
    getHistory: () => ipcRenderer.invoke("orbis:getHistory"),
    // chrome heights
    setChromeHeights: (top, bottom) => ipcRenderer.invoke("orbis:setChromeHeights", { top, bottom })
});
