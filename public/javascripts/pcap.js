var electron = require('electron');
var PythonShell = require('python-shell');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(__dirname + '/../../database/packet.db');

var ipc = electron.ipcRenderer;

$(document).ready(function () {

  var state = {
    page: 1,
    perPage: 10,
    pcaps: []
  };

  ipc.on('init', function (event, data) {
    // data = JSON.parse(data);
    // db.all('SELECT * FROM PACKET', function (err, rows) {
    //   data.pcaps = rows;
    //   state.pcaps = data.pcaps;
    //   renderPcaps(state.page, state.perPage, data.pcaps, false);
    // });
    $('input[name=page-number]').val(1);
  });

  $('.btn-clear-filter-rule').click(function () {
    $('.filter-rule').val('');
  });

  $('.previous').click(function () {
    if (state.page > 1) {
      state.page -= 1;
      renderPcaps(state.page, state.perPage, state.pcaps, true);
    }
  });

  $('.next').click(function () {
    if (state.page < Math.ceil(state.pcaps.length / state.perPage)) {
      state.page += 1;
      renderPcaps(state.page, state.perPage, state.pcaps, true);
    }
  });

  $('.btn-page-dump').click(function () {
    var p = parseInt($('input[name=page-number]').val(), 10);
    if (p > 0) {
      state.page = p;
      renderPcaps(state.page, state.perPage, state.pcaps, true);
    }
  });

  readFile('drop-file');

  var pyshell = null;
  var $loadingBtn = null;

  $('.start_sniff').click(function () {
    var pktCount = 0;
    $loadingBtn = $(this).button('loading');
    $('.fixed-head-table-wrapper tbody').html('');
    state.pcaps = [];

    pyshell = new PythonShell('sniffer.py', {
      mode: "json",
      scriptPath: __dirname + '/../py'
    });

    pyshell.on('message', function (pktObj) {
      state.pcaps.unshift(pktObj);
      renderPcaps(state.page, state.perPage, state.pcaps, false);
    });

    pyshell.on('end', function (err) {
      if (err) {
        console.log(err);
      }
      $loadingBtn.button('reset');
    });

    pyshell.on('error', function (err) {
      alert(err);
      $loadingBtn.button('reset');
    });

  });

  $('.stop_sniff').click(function () {
    pyshell.emit('end');
    pyshell.end();
  });

});

function readFile (wrapId) {
  var holder = document.getElementById(wrapId);
  holder.ondragover = function () {
    return false;
  };
  holder.ondragleave = holder.ondragend = function () {
    return false;
  };
  holder.ondrop = function (e) {
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    if (!file.name.endsWith('.pcap')) {
      $('p', holder).html('只能解析pcap文件');
      setTimeout(function () {
        $('p', holder).html('将数据包文件拖拽到此处解析');
      }, 1800);
    } else {
      var rdpcap = cp.spawn('python', [__dirname + '/../py/read_pcap.py', file.path]);
      rdpcap.stderr.setEncoding('utf8');
      rdpcap.stderr.on('data', function (err) {
        console.log(err);
      });
      rdpcap.stdout.on('data', function (data) {
        console.log(data.toString());
      });
      rdpcap.on('exit', function (code) {
        console.log('done');
      });
    }

    return false;
  };
}

function renderPcaps (page, perPage, pcaps, reRender) {
  var protocolClasset = {
    'HTTP': 'success',
    'ARP': 'danger',
    'IPv6': 'warning'
  };
  var pageNumber = Math.ceil(pcaps.length / perPage);
  var $wrapper = $('.fixed-head-table-wrapper tbody');
  $wrapper.html('');
  $('.page-current').html('');
  $('.page-all').html('');
  for (var i = (page - 1) * perPage, len = Math.min(pcaps.length, page * perPage); i < len; ++i) {
    var node = '<tr class="' + (protocolClasset[pcaps[i].PROTOCOL] || '') + '">';
    var pcap = pcaps[i];
    var info = '详细信息';
    node += '<td>' + (i + 1) + '</td>';
    node += '<td>' + (pcap.SMAC || '-') + '</td>';
    node += '<td>' + (pcap.DMAC || '-') + '</td>';
    node += '<td>' + (pcap.SPORT !== '0' ? pcap.SPORT : '-') + '</td>';
    node += '<td>' + (pcap.DPORT !== '0' ? pcap.DPORT : '-') + '</td>';
    node += '<td>' + (pcap.SIP || '-') + '</td>';
    node += '<td>' + (pcap.DIP || '-') + '</td>';
    node += '<td>' + pcap.PROTOCOL + '</td>';
    node += '<td><a href="#" tabindex="0" class="btn btn-xs btn-default" role="button" data-toggle="popover" data-trigger="focus" title="info" data-content="' +
      // pcap.INFO +
      info +
      '">查看</a></td>';
    node += '</tr>';
    $wrapper.append(node);
  }

  if (reRender) {
    $wrapper.hide().show(200);
  }

  if (page === 1) {
    $('.previous').addClass('disabled');
  } else {
    $('.previous').removeClass('disabled');
  }
  if (page === pageNumber) {
    $('.next').addClass('disabled');
  } else {
    $('.next').removeClass('disabled');
  }
  $('input[name=page-number]').attr('max', pageNumber);
  $('input[name=page-number]').val(parseInt(page, 10));
  $('.page-current').html(page);
  $('.page-all').html(pageNumber);
}
