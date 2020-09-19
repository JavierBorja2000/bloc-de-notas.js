const { app, BrowserWindow, Menu } = require("electron");

const url = require("url");
const path = require("path");
const { Console } = require("console");

let nuevaVentana;

app.on("ready", () => {
  nuevaVentana = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
    },
  });
  nuevaVentana.loadURL(
    url.format({
      pathname: path.join(__dirname, "index.html"),
      protocol: "file",
      slashes: true,
    })
  );

  //nuevaVentana.webContents.openDevTools();
  const menuInsertado = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menuInsertado);
});

const templateMenu = [];
