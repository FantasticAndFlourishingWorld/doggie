var electron = require('electron');
var Mock = require('mockjs');
var os = require('os');

var globalShortcutMap = {
  'voice': 'Shift+s',
  'notice': 'Shift+n'
};

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipc = electron.ipcMain;
var globalShortcut = electron.globalShortcut;
var Random = Mock.Random;

Random.ip();
Random.protocol();

var mainWindow = null;
var settingsWindow = null;

function createWindow () {

  mainWindow = new BrowserWindow({
    title: 'Snifff',
    width: 800,
    height: 600
  });
  mainWindow.loadURL(`file://${__dirname}/public/html/index.html`);

  var webContents = mainWindow.webContents;
  webContents.openDevTools();

  for (var key in globalShortcutMap) {
    (function (k) {
      globalShortcut.register(globalShortcutMap[k], function () {
        webContents.send('global-shortcut', k);
      });
    })(key);
  }

  webContents.on('did-finish-load', function () {
    var data = Mock.mock({
        'pcaps|50-100': [{
            'ip|+1': '@ip',
            'protocol': '@protocol'
        }]
    });
    data.os = {};
    data.os.type = os.type();
    data.os.hostname = os.hostname();
    data.os.release = os.release();
    data.os.arch = os.arch();
    webContents.send('init', JSON.stringify(data));
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  ipc.on('open-settings-window', function () {
    if (settingsWindow) {
      return;
    }

    settingsWindow = new BrowserWindow({
      title: '设置',
      frame: false,
      height: 400,
      resizable: false,
      width: 300
    });

    settingsWindow.loadURL(`file://${__dirname}/public/html/settings.html`);

    settingsWindow.on('closed', function () {
      settingsWindow = null;
    });
  });
  ipc.on('close-settings-window', function () {
    settingsWindow.close();
  });

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});
