var electron = require('electron');
var os = require('os');
var crypto = require('crypto');
var evilscan = require('evilscan');
var utils = require(__dirname + '/public/javascripts/utils.js');

var globalShortcutMap = {
  'voice': 'Shift+s',
  'notice': 'Shift+n'
};

var app = electron.app;
var BrowserWindow = electron.BrowserWindow;
var ipc = electron.ipcMain;
var globalShortcut = electron.globalShortcut;
var session = electron.session;
var mainWindow = null;
var settingsWindow = null;

function createWindow () {

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    skipTaskbar: true,
    type: 'textured',

  });
  mainWindow.loadURL(`file://${__dirname}/public/html/index.html`);

  var webContents = mainWindow.webContents;

  for (var key in globalShortcutMap) {
    (function (k) {
      globalShortcut.register(globalShortcutMap[k], function () {
        webContents.send('global-shortcut', k);
      });
    })(key);
  }

  webContents.on('did-finish-load', function () {
    var data = {};
    data.os = {};
    data.os.type = os.type();
    data.os.hostname = os.hostname();
    data.os.release = os.release();
    data.os.networkInterfaces = os.networkInterfaces();
    data.passwordKey = utils.readSettings('password_key');
    webContents.send('init', JSON.stringify(data));
    webContents.openDevTools();
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  ipc.on('encrypt-old-password', function (event, password) {
    event.sender.send('encrypt-old-password-done', crypto.createHash('md5').update(password).digest('hex'));
  });

  ipc.on('encrypt-password', function (event, password) {
    event.sender.send('encrypt-password-done', crypto.createHash('md5').update(password).digest('hex'));
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
