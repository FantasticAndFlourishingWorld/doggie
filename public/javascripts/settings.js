var ipc = require('electron').ipcRenderer;
var utils = require(__dirname + '/../javascripts/utils.js');

$(document).ready(function () {

  initSettings();

  $('.settingsCloseBtn').click(function () {
    ipc.send('close-settings-window');
  });
  $('.settingsSaveBtn').click(function () {

  });
  $('.settings-voice').change(function (event) {
    util.saveSettings('voice', event.target.checked);
  });
  $('.settings-notice').change(function (event) {
    util.saveSettings('notice', event.target.checked);
  });
  $('.settings-theme').change(function (event) {
    alert(event.target.selected);
  });

});

function initSettings () {
  $('.settings-voice').prop('checked', utils.readSettings('voice'));
  $('.settings-notice').prop('checked', utils.readSettings('notice'));
}
