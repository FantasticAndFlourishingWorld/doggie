var electron = require('electron');
// var cp = require('child_process');
var utils = require(__dirname + '/../javascripts/utils.js');

var ipc = electron.ipcRenderer;

$(document).ready(function () {

  if (utils.readSettings('notice')) {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status;
      }
    });
    var n = new Notification('Hi');
  }

  ipc.on('init', function (event, data) {
    data = JSON.parse(data);
    renderOs(data.os);
    initSettings();
  });
  ipc.on('global-shortcut', function (event, key) {
    // short-cut-biding
    $('.settings-' + key).click();
  });

  // $('.settingsOpenBtn').click(function () {
  //   ipc.send('open-settings-window');
  // });
  // $('.settingsCloseBtn').click(function () {
  //   ipc.send('close-settings-window');
  //   initSettings();
  // });
  // $('.settingsSaveBtn').click(function () {
  //
  // });
  $('.settings-voice').change(function (event) {
    utils.saveSettings('voice', event.target.checked);
  });
  $('.settings-notice').change(function (event) {
    utils.saveSettings('notice', event.target.checked);
    if (utils.readSettings('notice')) {
      Notification.requestPermission(function (status) {
        if (Notification.permission !== status) {
          Notification.permission = status;
        }
      });
      var n = new Notification('Hi');
    }
  });
  $('.settings-theme').change(function (event) {
    alert(event.target.selected);
  });

});

function renderOs (os) {
  for (var key in os) {
    $('.os-' + key).html(os[key]);
  }
}

function initSettings () {
  $('.settings-voice').prop('checked', utils.readSettings('voice'));
  $('.settings-notice').prop('checked', utils.readSettings('notice'));
}
