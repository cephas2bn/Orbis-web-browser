const fs = require("fs");
const path = require("path");
const { app } = require("electron");

const dataPath = path.join(app.getPath("userData"), "orbis-data.json");

function loadData() {
    try {
        return JSON.parse(fs.readFileSync(dataPath, "utf8"));
    } catch {
        return { bookmarks: [], history: [] };
    }
}

function saveData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function addBookmark(name, url) {
    const data = loadData();
    data.bookmarks.push({ name, url });
    saveData(data);
    return data.bookmarks;
}

function getBookmarks() {
    return loadData().bookmarks;
}

function addHistory(url, title) {
    const data = loadData();
    data.history.unshift({ url, title, ts: Date.now() });
    data.history = data.history.slice(0, 500);
    saveData(data);
    return data.history;
}

function getHistory() {
    return loadData().history;
}

module.exports = { addBookmark, getBookmarks, addHistory, getHistory };
