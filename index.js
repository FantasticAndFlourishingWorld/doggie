var electron = require('electron');
var os = require('os');
var crypto = require('crypto');
var evilscan = require('evilscan');
var lbs = require('node-qqwry');
var moment = require('moment');
var utils = require(__dirname + '/public/javascripts/utils.js');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/database/packet.db');

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
    // webContents.openDevTools();
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

  ipc.on('getChartData', function (event) {
    var pktLenData = [];
    var pktNumData = [];
    var srcMapData = [];
    var dstMapData = [];
    var mapData = [];

    db.all('SELECT * FROM PACKET ORDER BY STIME ASC', function (err, rows) {
      if (err || rows.length === 0) {
        return;
      }

      var lastSec = new Date(rows[0].STIME).getUTCSeconds();
      var len = 0;
      var pacNum = 0;

      rows.forEach(function (row) {
        var curSec = new Date(row.STIME).getUTCSeconds();
        if (lastSec === curSec) {
          len += row.PLEN;
          pacNum += 1;
        } else {
          var time = moment(new Date(row.STIME)).format('GGGG.MM.D H:mm:ss');
          len = Math.round(len / 1024 * 100) / 100;
          pktLenData.push({
            time: time,
            value: len
          });
          pktNumData.push({
            time: time,
            value: pacNum
          });
          len = 0;
          pacNum = 0;
          lastSec = curSec;
        }

        var srcGeoName = lbs.getArea(row.SIP);
        var dstGeoName = lbs.getArea(row.DIP);
        var srcLastChar = srcGeoName[srcGeoName.length - 1];
        var dstLastChar = dstGeoName[dstGeoName.length - 1];
        var srcBounds = lbs.getBounds(row.SIP).map(function (bound) {
          return parseInt(bound * 100, 10) / 100;
        });
        var dstBounds = lbs.getBounds(row.DIP).map(function (bound) {
          return parseInt(bound * 100, 10) / 100;
        });
        var bounds = [
          [srcBounds[0], srcBounds[1]],
          [srcBounds[2], srcBounds[3]],
          [dstBounds[0], dstBounds[1]],
          [dstBounds[2], dstBounds[3]]
        ];

        if (srcLastChar === '市' || srcLastChar === '省') {
          srcGeoName = srcGeoName.slice(0, -1);
        }
        if (dstLastChar === '市' || dstLastChar === '省') {
          dstGeoName = dstGeoName.slice(0, -1);
        }
        var srcGeoIndex = srcMapData.findIndex(function (data) {
          return srcGeoName === data.name;
        });
        var dstGeoIndex = dstMapData.findIndex(function (data) {
          return dstGeoName === data.name;
        });
        if (srcGeoIndex < 0) {
          srcMapData.push({
            'name': srcGeoName,
            'value': 1
          });
        } else {
          srcMapData[srcGeoIndex] = {
            'name': srcMapData[srcGeoIndex].name,
            'value': srcMapData[srcGeoIndex].value + 1
          };
        }
        if (dstGeoIndex < 0) {
          dstMapData.push({
            'name': dstGeoName,
            'value': 1
          });
        } else {
          dstMapData[dstGeoIndex] = {
            'name': dstMapData[dstGeoIndex].name,
            'value': dstMapData[dstGeoIndex].value + 1
          };
        }

        mapData = mapData.concat(bounds);

      });

      if (len > 0) {
        pktLenData.push({
          time: moment(new Date(rows[rows.length - 1].STIME)).format('GGGG.MM.D H:mm:ss'),
          value: len
        });
      }

      var timeData = pktNumData.map(function (pkt) {
        return pkt.time;
      });

      event.sender.send('getChartDataDone', JSON.stringify({
        pktNumData: pktNumData,
        pktLenData: pktLenData,
        timeData: timeData,
        mapData: mapData
      }));

      db.close();

    });
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
