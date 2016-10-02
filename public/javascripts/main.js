var ipc = require('electron').ipcRenderer;

$(document).ready(function () {

  ipc.on('init', function (event, data) {
    renderPcaps(JSON.parse(data).pcaps);
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

});

function renderPcaps (data) {
  var $wrapper = $('.fixedHeadTableWrapper tbody');
  for (var i = 0, len = data.length; i < len; ++i) {
    var node = '<tr>';
    node += '<td>' + i + '</td>';
    node += '<td>' + data[i].ip + '</td>';
    node += '<td>' + data[i].protocol + '</td>';
    node += '</tr>';
    $wrapper.append(node);
  }
}
