var electron = require('electron');
var Mock = require('mockjs');
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
            'srcIp|+1': '@ip',
            'dstIp|+1': '@ip',
            'protocol': '@protocol'
        }]
    });
    data.os = {};
    data.os.type = os.type();
    data.os.hostname = os.hostname();
    data.os.release = os.release();
    data.os.arch = os.arch();
    data.passwordKey = utils.readSettings('password_key');
    webContents.send('init', JSON.stringify(data));
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
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
