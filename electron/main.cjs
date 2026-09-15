const { app, BrowserWindow } = require("electron");
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const port = 3210;
let server;

function appRoot() {
  return app.isPackaged ? app.getAppPath() : path.resolve(__dirname, "..");
}

function databaseUrl() {
  const databasePath = path.join(app.getPath("userData"), "greenstreak.db");
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  return `file:${databasePath.replaceAll("\\", "/")}`;
}

function initializeDatabase(env) {
  if (!app.isPackaged) return;
  const prismaCli = path.join(appRoot(), "node_modules", "prisma", "build", "index.js");
  const result = spawnSync(process.execPath, [prismaCli, "migrate", "deploy", "--schema", path.join(appRoot(), "prisma", "schema.prisma")], {
    env: { ...env, ELECTRON_RUN_AS_NODE: "1" },
    stdio: "inherit",
  });
  if (result.status !== 0) throw new Error("GreenStreak could not initialize its local database.");
}

function startServer() {
  const env = { ...process.env, DATABASE_URL: databaseUrl(), PORT: String(port), ELECTRON_RUN_AS_NODE: "1" };
  initializeDatabase(env);
  const nextBin = path.join(appRoot(), "node_modules", "next", "dist", "bin", "next");
  server = spawn(process.execPath, [nextBin, "start", "-p", String(port)], { cwd: appRoot(), env, stdio: "inherit" });
}

function waitForServer() {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + 30000;
    const check = () => {
      const request = http.get(`http://localhost:${port}`, (response) => {
        response.resume();
        resolve();
      });
      request.on("error", () => {
        if (Date.now() >= deadline) reject(new Error("GreenStreak server did not start."));
        else setTimeout(check, 250);
      });
    };
    check();
  });
}

async function createWindow() {
  const window = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 650,
    title: "GreenStreak",
    backgroundColor: "#f7f6f0",
    webPreferences: { contextIsolation: true, sandbox: true },
  });
  await window.loadURL(app.isPackaged ? `http://localhost:${port}` : process.env.GREENSTREAK_DEV_SERVER);
}

app.whenReady().then(async () => {
  if (app.isPackaged) {
    startServer();
    await waitForServer();
  }
  else process.env.GREENSTREAK_DEV_SERVER = process.env.GREENSTREAK_DEV_SERVER || "http://localhost:3000";
  await createWindow();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
app.on("before-quit", () => { if (server) server.kill(); });