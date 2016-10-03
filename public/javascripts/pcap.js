var electron = require('electron');

var ipc = electron.ipcRenderer;

$(document).ready(function () {

  var state = {
    page: 1,
    perPage: 10,
    pcaps: []
  };

  ipc.on('init', function (event, data) {
    data = JSON.parse(data);
    state.pcaps = data.pcaps;
    renderPcaps(state.page, state.perPage, data.pcaps);
  });

  $('.previous').click(function () {
    if (state.page > 1) {
      state.page -= 1;
      renderPcaps(state.page, state.perPage, state.pcaps);
    }
  });
  $('.next').click(function () {
    if (state.page < state.pcaps.length / state.perPage) {
      state.page += 1;
      renderPcaps(state.page, state.perPage, state.pcaps);
    }
  });

  readFile('drop-file');

});

function readFile (wrapId) {
  var $el = $('#' + wrapId);
  $el.on('dragover', function () {
    return false;
  });
  $el.on('dragleave', function () {
    return false;
  });
  $el.on('dragend', function () {
    return false;
  });
  $el.on('drop', function (e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    alert(file);
    return false;
  });
}

function renderPcaps (page, perPage, pcaps) {
  var protocolClasset = {
    'http': 'success',
    'mailto': 'warning',
    'tcp': 'info'
  };
  var $wrapper = $('.fixed-head-table-wrapper tbody');
  $wrapper.html('');
  for (var i = (page - 1) * perPage, len = Math.min(pcaps.length, page * perPage); i < len; ++i) {
    var node = '<tr class="' + (protocolClasset[pcaps[i].protocol] || '') + '">';
    node += '<td>' + (i + 1) + '</td>';
    node += '<td>' + pcaps[i].ip + '</td>';
    node += '<td>' + pcaps[i].protocol + '</td>';
    node += '</tr>';
    $wrapper.append(node);
  }
  $wrapper.hide().show(200);
  if (page === 1) {
    $('.previous').addClass('disabled');
  } else {
    $('.previous').removeClass('disabled');
  }
  if (page === pcaps.length / perPage) {
    $('.next').addClass('disabled');
  } else {
    $('.next').removeClass('disabled');
  }
}
