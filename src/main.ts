import { BrowserWindow, app, App } from "electron";
import * as isDev from "electron-is-dev";
import * as path from "path";

class ElectronTest {
  mainWindow: BrowserWindow | null = null;
  app: App;
  mainURL: string = `file://${__dirname}/index.html`;

  constructor(app: App) {
    this.app = app;
    this.app.on("window-all-closed", this.onWindowAllClosed.bind(this));
    this.app.on("ready", this.create.bind(this));
    this.app.on("activate", this.onActivated.bind(this));
  }

  onWindowAllClosed(): void {
    this.app.quit();
    return;
  }

  create(): void {
    this.mainWindow = new BrowserWindow({
      width: 800,
      height: 800,
      minWidth: 500,
      minHeight: 200,
      acceptFirstMouse: true,
      titleBarStyle: "hidden"
    });

    this.mainWindow.loadURL(
      isDev
        ? "http://localhost:3000"
        : `file://${path.join(__dirname, "dist/index.html")}`
    );

    this.mainWindow.on("closed", () => {
      this.mainWindow = null;
    });
    return;
  }

  onReady(): void {
    this.create();
    return;
  }

  onActivated(): void {
    if (this.mainWindow === null) {
      this.create();
    }
    return;
  }
}

const MyApp: ElectronTest = new ElectronTest(app);
