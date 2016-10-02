var ipc = require('electron').ipcRenderer;

$(document).ready(function () {

  ipc.on('init', function (event, data) {
    data = JSON.parse(data);
    renderPcaps(data.pcaps);
    renderOs(data.os);
  });
  ipc.on('global-shortcut', function (event, code) {
    // short-cut-biding
    console.log(code);
  });

  $('.settingsOpenBtn').click(function () {
    ipc.send('open-settings-window');
  });
  $('.settingsCloseBtn').click(function () {
    ipc.send('close-settings-window');
  });
  $('.settingsSaveBtn').click(function () {

  });
  $('.settings-voice').change(function (event) {
    alert(event.target.checked);
  });
  $('.settings-notice').change(function (event) {
    alert(event.target.checked);
  });
  $('.settings-theme').change(function (event) {
    alert(event.target.selected);
  });

});

function renderPcaps (pcaps) {
  var protocolClasset = {
    'http': 'success',
    'mailto': 'warning',
    'tcp': 'info'
  };
  var $wrapper = $('.fixed-head-table-wrapper tbody');
  for (var i = 0, len = pcaps.length; i < len; ++i) {
    var node = '<tr class="' + (protocolClasset[pcaps[i].protocol] || '') + '">';
    node += '<td>' + i + '</td>';
    node += '<td>' + pcaps[i].ip + '</td>';
    node += '<td>' + pcaps[i].protocol + '</td>';
    node += '</tr>';
    $wrapper.append(node);
  }
}

function renderOs (os) {
  for (var key in os) {
    $('.os-' + key).html(os[key]);
  }
}
