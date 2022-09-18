import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  dialog,
  Menu,
  MenuItemConstructorOptions,
} from "electron";
import { release } from "os";
import { join } from "path";
import fs from "fs";

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

const isMac = process.platform === "darwin";

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, "../.."),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? "../.." : "../../../public"),
};

let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(__dirname, "../preload/index.js");
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = `http://${process.env["VITE_DEV_SERVER_HOST"]}:${process.env["VITE_DEV_SERVER_PORT"]}`;
const indexHtml = join(ROOT_PATH.dist, "index.html");

const template: MenuItemConstructorOptions[] = [];

const macMenu: Electron.MenuItemConstructorOptions[] = [
  {
    label: app.name,
    submenu: [
      { type: "separator" },
      { role: "hide" },
      { role: "hideOthers" },
      { type: "separator" },
      { role: "quit" },
    ],
  },
];

if (isMac) {
  // { role: 'appMenu' }
  template.push(...macMenu);
}

template.push({
  label: "File",
  submenu: [
    { label: "Open", click: () => openFile() },
    isMac ? { role: "close" } : { role: "quit" },
  ],
});
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: join(ROOT_PATH.public, "favicon.svg"),
    webPreferences: {
      preload,
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    win.loadFile(indexHtml);
  } else {
    win.loadURL(url);
    // win.webContents.openDevTools()
  }

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
}
// webContentsテスト
async function test() {
  console.log("test");
  win?.webContents.send("menu", "hoge");
}
async function openFile() {
  if (win) {
    const result = await dialog.showOpenDialog(
      win,
      // どんなダイアログを出すかを指定するプロパティ
      {
        properties: ["openFile"],
        filters: [
          {
            name: "Documents",
            // 読み込み可能な拡張子を指定
            extensions: ["md"],
          },
        ],
      }
    );

    // [ファイル選択]ダイアログが閉じられた後の処理
    if (result.filePaths.length > 0) {
      const path = result.filePaths[0];

      // テキストファイルを読み込む
      const textData = fs.readFileSync(path, "utf8");
      // ファイルパスとテキストデータを返却

      const fileData = { path, textData };

      win?.webContents.send("openFile", fileData);
    }
  }
}

async function saveFile(_, content: string, filePath: string) {
  if (win) {
    const path = filePath
      ? filePath
      : dialog.showSaveDialogSync(win, {
          buttonLabel: "保存",
          filters: [{ name: "Text", extensions: ["md"] }],
          properties: [
            "createDirectory", // ディレクトリの作成を許可 (macOS)
          ],
        });

    // キャンセルで閉じた場合
    if (path === undefined) {
      return { status: undefined };
    }

    // ファイルの内容を返却
    try {
      fs.writeFileSync(path, content);

      return {
        status: true,
        path: path,
      };
    } catch (error) {
      return { status: false, message: error.message };
    }
  }
}

app.whenReady().then(() => {
  ipcMain.handle("save", saveFile);
  createWindow();
});

app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});

// new window example arg: new windows url
ipcMain.handle("open-win", (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  });

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg });
  } else {
    childWindow.loadURL(`${url}/#${arg}`);
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
  }
});
